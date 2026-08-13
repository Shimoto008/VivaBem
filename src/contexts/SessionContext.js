import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { supabase } from '../services/supabaseClient';

/**
 * Logo após o cadastro a sessão nasce antes da linha de perfil existir no
 * banco, então uma única leitura pode não encontrar nada. Algumas tentativas
 * espaçadas evitam concluir que o usuário está órfão cedo demais.
 */
const TENTATIVAS_BUSCA_PERFIL = 3;
const INTERVALO_ENTRE_TENTATIVAS_MS = 600;

const SessionContext = createContext(null);

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buscarPerfilDoUsuario(userId) {
  const { data: cuidador, error: erroCuidador } = await supabase
    .from('cuidadores')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (erroCuidador) throw erroCuidador;
  if (cuidador) return { perfil: cuidador, tipo: 'cuidador' };

  const { data: familiar, error: erroFamiliar } = await supabase
    .from('familiares')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (erroFamiliar) throw erroFamiliar;
  if (familiar) return { perfil: familiar, tipo: 'familiar' };

  const { data: idoso, error: erroIdoso } = await supabase
    .from('idosos')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (erroIdoso) throw erroIdoso;
  if (idoso) return { perfil: idoso, tipo: 'idoso' };

  return null;
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [perfilAusente, setPerfilAusente] = useState(false);
  const montadoRef = useRef(true);
  /**
   * A recuperação de senha precisa de uma sessão autenticada (o `verifyOtp`
   * loga o usuário para autorizar o `updateUser`). Sem esta trava, essa sessão
   * momentânea trocaria a stack de navegação e desmontaria a tela no meio do
   * fluxo. É um `ref` porque o listener do Supabase precisa ler o valor atual
   * de forma síncrona, sem esperar o próximo render.
   */
  const recuperandoSenhaRef = useRef(false);

  const carregarPerfil = useCallback(async (userId, { tentativas = 1 } = {}) => {
    if (!userId) {
      setPerfil(null);
      setTipoUsuario(null);
      setPerfilAusente(false);
      return null;
    }

    for (let tentativa = 0; tentativa < tentativas; tentativa += 1) {
      try {
        const encontrado = await buscarPerfilDoUsuario(userId);
        if (!montadoRef.current) return null;

        if (encontrado) {
          setPerfil(encontrado.perfil);
          setTipoUsuario(encontrado.tipo);
          setPerfilAusente(false);
          return encontrado.perfil;
        }
      } catch (erro) {
        console.error('Erro ao carregar perfil:', erro.message);
        break;
      }

      if (tentativa < tentativas - 1) await esperar(INTERVALO_ENTRE_TENTATIVAS_MS);
    }

    if (!montadoRef.current) return null;
    setPerfil(null);
    setTipoUsuario(null);
    setPerfilAusente(true);
    return null;
  }, []);

  useEffect(() => {
    montadoRef.current = true;

    supabase.auth.getSession().then(({ data }) => {
      const sessaoAtual = data?.session ?? null;
      setSession(sessaoAtual);
      if (sessaoAtual?.user) {
        carregarPerfil(sessaoAtual.user.id, { tentativas: TENTATIVAS_BUSCA_PERFIL }).finally(() => {
          if (montadoRef.current) setCarregando(false);
        });
      } else {
        setCarregando(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_evento, novaSessao) => {
      if (recuperandoSenhaRef.current) return;

      setSession(novaSessao);
      if (novaSessao?.user) {
        await carregarPerfil(novaSessao.user.id, { tentativas: TENTATIVAS_BUSCA_PERFIL });
      } else {
        setPerfil(null);
        setTipoUsuario(null);
        setPerfilAusente(false);
      }
      if (montadoRef.current) setCarregando(false);
    });

    return () => {
      montadoRef.current = false;
      listener.subscription.unsubscribe();
    };
  }, [carregarPerfil]);

  const recarregarPerfil = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    return carregarPerfil(data?.user?.id, { tentativas: TENTATIVAS_BUSCA_PERFIL });
  }, [carregarPerfil]);

  const iniciarRecuperacaoSenha = useCallback(() => {
    recuperandoSenhaRef.current = true;
  }, []);

  /**
   * Libera o listener e volta a espelhar o estado real do Auth — depois de
   * redefinir a senha o `authService` já encerrou a sessão, então o esperado
   * aqui é continuar deslogado, na tela de Login. Se sobrar sessão (o signOut
   * falhou), o perfil é carregado para o app entrar autenticado em vez de
   * travar na splash esperando um perfil que ninguém pediu.
   */
  const finalizarRecuperacaoSenha = useCallback(async () => {
    recuperandoSenhaRef.current = false;
    const { data } = await supabase.auth.getSession();
    const sessaoAtual = data?.session ?? null;
    if (!montadoRef.current) return;

    setSession(sessaoAtual);
    if (sessaoAtual?.user) {
      await carregarPerfil(sessaoAtual.user.id, { tentativas: TENTATIVAS_BUSCA_PERFIL });
    }
  }, [carregarPerfil]);

  /** Atualiza o perfil em memória depois de uma edição já persistida. */
  const atualizarPerfilLocal = useCallback((novosDados) => {
    setPerfil((atual) => (atual ? { ...atual, ...novosDados } : atual));
  }, []);

  const deslogar = useCallback(async () => {
    setCarregando(true);
    try {
      await supabase.auth.signOut();
    } finally {
      if (montadoRef.current) {
        setSession(null);
        setPerfil(null);
        setTipoUsuario(null);
        setPerfilAusente(false);
        setCarregando(false);
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      perfil,
      tipoUsuario,
      carregando,
      perfilAusente,
      recarregarPerfil,
      atualizarPerfilLocal,
      deslogar,
      iniciarRecuperacaoSenha,
      finalizarRecuperacaoSenha,
    }),
    [
      session,
      perfil,
      tipoUsuario,
      carregando,
      perfilAusente,
      recarregarPerfil,
      atualizarPerfilLocal,
      deslogar,
      iniciarRecuperacaoSenha,
      finalizarRecuperacaoSenha,
    ]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession deve ser usado dentro de um <SessionProvider>.');
  }
  return context;
}

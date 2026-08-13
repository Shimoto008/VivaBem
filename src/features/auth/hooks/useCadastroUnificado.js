import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import {
  cadastrarEConectarCuidador,
  cadastrarEConectarFamiliar,
  cadastrarEConectarIdoso,
} from '../../../services/authService';
import { useSession } from '../../../contexts/SessionContext';
import { aplicarMascaraCPF, aplicarMascaraTelefone } from '../../../utils/masks';
import {
  validarCPFObrigatorio,
  validarEmailObrigatorio,
  validarNomeCompleto,
  validarTelefoneObrigatorio,
} from '../../../utils/validators';

export const TIPOS_CADASTRO = {
  CUIDADOR: 'cuidador',
  FAMILIAR: 'familiar',
  IDOSO: 'idoso',
};

export const ACCENTS_POR_TIPO = {
  cuidador: '#4169E1',
  familiar: '#20B2AA',
  idoso: '#9370DB',
};

const TAMANHO_MINIMO_SENHA = 6;
export const OPCAO_OUTRA_ESPECIALIDADE = 'Outros';

const TITULOS_BOTAO = {
  cuidador: 'Cadastrar como Cuidador',
  familiar: 'Cadastrar como Familiar',
  idoso: 'Cadastrar como Idoso',
};

export function useCadastroUnificado(tipoInicial = TIPOS_CADASTRO.FAMILIAR) {
  const { recarregarPerfil } = useSession();
  const [tipo, setTipo] = useState(
    Object.values(TIPOS_CADASTRO).includes(tipoInicial) ? tipoInicial : TIPOS_CADASTRO.FAMILIAR
  );
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [outraEspecialidade, setOutraEspecialidade] = useState('');
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [modalEspecialidadeVisivel, setModalEspecialidadeVisivel] = useState(false);

  useEffect(() => {
    if (Object.values(TIPOS_CADASTRO).includes(tipoInicial)) {
      setTipo(tipoInicial);
    }
  }, [tipoInicial]);

  const alterarCpf = (texto) => setCpf(aplicarMascaraCPF(texto));
  const alterarTelefone = (texto) => setTelefone(aplicarMascaraTelefone(texto));

  const especialidadeFinal = () =>
    (especialidade === OPCAO_OUTRA_ESPECIALIDADE ? outraEspecialidade : especialidade).trim();

  const selecionarTipo = (novoTipo) => {
    setTipo(novoTipo);
    setErros({});
  };

  const validar = () => {
    const novosErros = {};
    const erroNome = validarNomeCompleto(nome);
    if (erroNome) novosErros.nome = erroNome;

    const erroCpf = validarCPFObrigatorio(cpf);
    if (erroCpf) novosErros.cpf = erroCpf;

    const erroEmail = validarEmailObrigatorio(email);
    if (erroEmail) novosErros.email = erroEmail;

    const erroTelefone = validarTelefoneObrigatorio(telefone);
    if (erroTelefone) novosErros.telefone = erroTelefone;

    if (
      tipo === TIPOS_CADASTRO.CUIDADOR ||
      tipo === TIPOS_CADASTRO.FAMILIAR ||
      tipo === TIPOS_CADASTRO.IDOSO
    ) {
      if (!senha || senha.length < TAMANHO_MINIMO_SENHA) {
        novosErros.senha = `A senha deve ter no mínimo ${TAMANHO_MINIMO_SENHA} caracteres.`;
      }
    }

    if (tipo === TIPOS_CADASTRO.CUIDADOR && !especialidadeFinal()) {
      novosErros.especialidade = 'Selecione ou digite sua especialidade.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;

    setEnviando(true);
    try {
      if (tipo === TIPOS_CADASTRO.CUIDADOR) {
        let latitude = null;
        let longitude = null;
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const loc = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            latitude = loc.coords.latitude;
            longitude = loc.coords.longitude;
          }
        } catch (e) {
          console.warn('Não foi possível obter o GPS durante o cadastro:', e);
        }

        await cadastrarEConectarCuidador({
          nome,
          cpf,
          email,
          telefone,
          senha,
          especialidade: especialidadeFinal(),
          latitude,
          longitude,
        });
        await recarregarPerfil();
        return;
      }

      if (tipo === TIPOS_CADASTRO.FAMILIAR) {
        await cadastrarEConectarFamiliar({ nome, cpf, email, telefone, senha });
        await recarregarPerfil();
        return;
      }

      await cadastrarEConectarIdoso({ nome, cpf, email, telefone, senha });
      await recarregarPerfil();
    } catch (erro) {
      Alert.alert('Erro ao cadastrar', erro.message || 'Não foi possível concluir o cadastro.');
    } finally {
      setEnviando(false);
    }
  };

  return {
    tipo,
    accentColor: ACCENTS_POR_TIPO[tipo],
    tituloBotao: TITULOS_BOTAO[tipo],
    nome,
    cpf,
    email,
    telefone,
    senha,
    especialidade,
    outraEspecialidade,
    erros,
    enviando,
    modalEspecialidadeVisivel,
    setModalEspecialidadeVisivel,
    selecionarTipo,
    alterarNome: setNome,
    alterarCpf,
    alterarEmail: setEmail,
    alterarTelefone,
    alterarSenha: setSenha,
    alterarOutraEspecialidade: setOutraEspecialidade,
    selecionarEspecialidade: (esp) => {
      setEspecialidade(esp);
      setModalEspecialidadeVisivel(false);
    },
    salvar,
  };
}

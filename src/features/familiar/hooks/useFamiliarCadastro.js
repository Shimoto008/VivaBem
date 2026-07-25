import { useState } from 'react';
import { Alert } from 'react-native';
import { cadastrarEConectarFamiliar } from '../../../services/authService';
import { useSession } from '../../../contexts/SessionContext';
import { aplicarMascaraCPF, aplicarMascaraTelefone } from '../../../utils/masks';
import {
  validarCPFObrigatorio,
  validarNomeCompleto,
  validarTelefoneObrigatorio,
} from '../../../utils/validators';

const TAMANHO_MINIMO_SENHA = 6;

export function useFamiliarCadastro() {
  const { recarregarPerfil } = useSession();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  const alterarCpf = (texto) => setCpf(aplicarMascaraCPF(texto));
  const alterarTelefone = (texto) => setTelefone(aplicarMascaraTelefone(texto));

  const validar = () => {
    const novosErros = {};

    const erroNome = validarNomeCompleto(nome);
    if (erroNome) novosErros.nome = erroNome;

    const erroCpf = validarCPFObrigatorio(cpf);
    if (erroCpf) novosErros.cpf = erroCpf;

    const erroTelefone = validarTelefoneObrigatorio(telefone);
    if (erroTelefone) novosErros.telefone = erroTelefone;

    if (!senha || senha.length < TAMANHO_MINIMO_SENHA) {
      novosErros.senha = `A senha deve ter no mínimo ${TAMANHO_MINIMO_SENHA} caracteres.`;
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;

    setEnviando(true);
    try {
      await cadastrarEConectarFamiliar({ nome, cpf, telefone, senha });

      // A sessão nasce no signUp, mas o perfil só existe após o insert acima:
      // recarregar aqui garante que a navegação já saiba que é um familiar.
      await recarregarPerfil();
    } catch (erro) {
      Alert.alert('Erro no cadastro', erro.message || 'Não foi possível realizar o cadastro.');
    } finally {
      setEnviando(false);
    }
  };

  return {
    nome,
    cpf,
    telefone,
    senha,
    erros,
    enviando,
    alterarNome: setNome,
    alterarCpf,
    alterarTelefone,
    alterarSenha: setSenha,
    salvar,
  };
}

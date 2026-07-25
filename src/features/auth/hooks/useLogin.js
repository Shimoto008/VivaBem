import { useState } from 'react';
import { Alert } from 'react-native';
import { entrarComCpf } from '../../../services/authService';
import { useSession } from '../../../contexts/SessionContext';
import { aplicarMascaraCPF } from '../../../utils/masks';
import { validarCPFObrigatorio } from '../../../utils/validators';

const TAMANHO_MINIMO_SENHA = 6;

export function useLogin() {
  const { recarregarPerfil } = useSession();
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});
  const [entrando, setEntrando] = useState(false);

  const alterarCpf = (texto) => setCpf(aplicarMascaraCPF(texto));

  const validar = () => {
    const novosErros = {};

    const erroCpf = validarCPFObrigatorio(cpf);
    if (erroCpf) novosErros.cpf = erroCpf;

    if (!senha || senha.length < TAMANHO_MINIMO_SENHA) {
      novosErros.senha = `A senha deve ter no mínimo ${TAMANHO_MINIMO_SENHA} caracteres.`;
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const entrar = async () => {
    if (!validar()) return;

    setEntrando(true);
    try {
      await entrarComCpf({ cpf, senha });
      await recarregarPerfil();
    } catch (erro) {
      Alert.alert('Não foi possível entrar', erro.message || 'Tente novamente em alguns instantes.');
    } finally {
      setEntrando(false);
    }
  };

  return {
    cpf,
    senha,
    erros,
    entrando,
    alterarCpf,
    alterarSenha: setSenha,
    entrar,
  };
}

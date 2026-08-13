import { useState } from 'react';
import { Alert } from 'react-native';
import { entrarComEmail } from '../../../services/authService';
import { useSession } from '../../../contexts/SessionContext';
import { validarEmailObrigatorio } from '../../../utils/validators';

const TAMANHO_MINIMO_SENHA = 6;

export function useLogin() {
  const { recarregarPerfil } = useSession();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});
  const [entrando, setEntrando] = useState(false);

  const validar = () => {
    const novosErros = {};

    const erroEmail = validarEmailObrigatorio(email);
    if (erroEmail) novosErros.email = erroEmail;

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
      await entrarComEmail({ email, senha });
      await recarregarPerfil();
    } catch (erro) {
      Alert.alert('Não foi possível entrar', erro.message || 'Tente novamente em alguns instantes.');
    } finally {
      setEntrando(false);
    }
  };

  return {
    email,
    senha,
    erros,
    entrando,
    alterarEmail: setEmail,
    alterarSenha: setSenha,
    entrar,
  };
}

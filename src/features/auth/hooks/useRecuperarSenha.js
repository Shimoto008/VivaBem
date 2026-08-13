import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import {
  redefinirSenhaComCodigo,
  solicitarRecuperacaoSenha,
} from '../../../services/authService';
import { useSession } from '../../../contexts/SessionContext';
import { validarEmailObrigatorio } from '../../../utils/validators';

const TAMANHO_MINIMO_CODIGO = 6;
const TAMANHO_MINIMO_SENHA = 6;

export function useRecuperarSenha() {
  const { iniciarRecuperacaoSenha, finalizarRecuperacaoSenha } = useSession();
  const [passo, setPasso] = useState(1); // 1 = Digitar e-mail, 2 = Digitar código + Nova senha
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({});

  // Passo 1: dispara o e-mail com o código de recuperação
  const solicitarCodigo = useCallback(async () => {
    const erroEmail = validarEmailObrigatorio(email);
    if (erroEmail) {
      setErros({ email: erroEmail });
      return;
    }

    setErros({});
    setCarregando(true);

    try {
      await solicitarRecuperacaoSenha(email);
      Alert.alert(
        'Código enviado',
        `Se este e-mail estiver cadastrado, enviamos um código de recuperação para ${email.trim()}. ` +
          'Confira também a caixa de spam.'
      );
      setPasso(2);
    } catch (erro) {
      Alert.alert('Erro', erro.message || 'Não foi possível enviar o código. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, [email]);

  // Passo 2: valida o código e grava a nova senha
  const redefinirSenha = useCallback(
    async (onSucesso) => {
      const novosErros = {};
      const codigoFormatado = codigo.trim();
      if (codigoFormatado.length < TAMANHO_MINIMO_CODIGO) {
        novosErros.codigo = `O código deve ter no mínimo ${TAMANHO_MINIMO_CODIGO} caracteres`;
      }
      if (!novaSenha || novaSenha.length < TAMANHO_MINIMO_SENHA) {
        novosErros.novaSenha = `A senha deve ter no mínimo ${TAMANHO_MINIMO_SENHA} caracteres`;
      }
      if (novaSenha !== confirmarNovaSenha) {
        novosErros.confirmarNovaSenha = 'As senhas não coincidem';
      }

      if (Object.keys(novosErros).length > 0) {
        setErros(novosErros);
        return;
      }

      setErros({});
      setCarregando(true);
      iniciarRecuperacaoSenha();

      let alterada = false;
      try {
        await redefinirSenhaComCodigo({ email, codigo: codigoFormatado, novaSenha });
        alterada = true;
      } catch (erro) {
        Alert.alert('Erro', erro.message || 'Código inválido ou expirado.');
      } finally {
        await finalizarRecuperacaoSenha();
        setCarregando(false);
      }

      // Só depois de liberar o listener do Auth, para a navegação não competir
      // com a troca de stack do SessionContext.
      if (alterada) {
        Alert.alert('Sucesso', 'Sua senha foi alterada com sucesso!');
        if (onSucesso) onSucesso();
      }
    },
    [email, codigo, novaSenha, confirmarNovaSenha, iniciarRecuperacaoSenha, finalizarRecuperacaoSenha]
  );

  return {
    passo,
    setPasso,
    email,
    setEmail,
    codigo,
    setCodigo,
    novaSenha,
    setNovaSenha,
    confirmarNovaSenha,
    setConfirmarNovaSenha,
    carregando,
    erros,
    solicitarCodigo,
    redefinirSenha,
  };
}

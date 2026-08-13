import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

export function useRecuperarSenha() {
  const [passo, setPasso] = useState(1); // 1 = Digitar telefone, 2 = Digitar código + Nova senha
  const [telefone, setTelefone] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({});

  // Passo 1: Enviar o código SMS/WhatsApp
  const solicitarCodigo = useCallback(async () => {
    if (!telefone || telefone.length < 14) {
      setErros({ telefone: 'Informe um número de telefone válido' });
      return;
    }
    setErros({});
    setCarregando(true);

    try {
      // TODO: Chamada para sua API (ex: await api.post('/auth/recuperar-senha', { telefone }))
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulação
      
      setPasso(2); // Avança para o passo do código
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar o código. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, [telefone]);

  // Passo 2: Validar o código e redefinir a senha
  const redefinirSenha = useCallback(async (onSucesso) => {
    const novosErros = {};
    if (!codigo || codigo.length < 6) novosErros.codigo = 'Código deve ter 6 dígitos';
    if (!novaSenha || novaSenha.length < 6) novosErros.novaSenha = 'A senha deve ter no mínimo 6 caracteres';

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setErros({});
    setCarregando(true);

    try {
      // TODO: Chamada para sua API (ex: await api.post('/auth/redefinir-senha', { telefone, codigo, novaSenha }))
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulação

      Alert.alert('Sucesso!', 'Sua senha foi redefinida com sucesso.');
      if (onSucesso) onSucesso();
    } catch (error) {
      Alert.alert('Erro', 'Código inválido ou expirado.');
    } finally {
      setCarregando(false);
    }
  }, [codigo, novaSenha]);

  return {
    passo,
    setPasso,
    telefone,
    setTelefone,
    codigo,
    setCodigo,
    novaSenha,
    setNovaSenha,
    carregando,
    erros,
    solicitarCodigo,
    redefinirSenha,
  };
}
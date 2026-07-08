import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { criarFamiliar } from '../services/familiarService';
import { aplicarMascaraCPF, aplicarMascaraTelefone } from '../utils/masks';
import { validarNomeCompleto, validarCPFObrigatorio, validarTelefoneObrigatorio } from '../utils/validators';
import { ROUTES } from '../constants/routeNames';
import { useSession } from '../contexts/SessionContext';

/**
 * Antes esta tela (Familiar.js) não tinha NENHUMA lógica de envio — o botão
 * "CADASTRAR" não tinha onPress. Este hook implementa o fluxo real
 * (validação + persistência + navegação), no mesmo padrão do Cuidador.
 */
export function useFamiliarCadastro() {
  const navigation = useNavigation();
  const { setFamiliar } = useSession();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  const alterarNome = (texto) => {
    setNome(texto);
    setErros((atual) => ({ ...atual, nome: null }));
  };

  const alterarCpf = (texto) => {
    setCpf(aplicarMascaraCPF(texto));
    setErros((atual) => ({ ...atual, cpf: null }));
  };

  const alterarTelefone = (texto) => {
    setTelefone(aplicarMascaraTelefone(texto));
    setErros((atual) => ({ ...atual, telefone: null }));
  };

  function validar() {
    const novosErros = {
      nome: validarNomeCompleto(nome),
      cpf: validarCPFObrigatorio(cpf),
      telefone: validarTelefoneObrigatorio(telefone),
    };
    setErros(novosErros);
    return Object.values(novosErros).every((mensagem) => !mensagem);
  }

  async function salvar() {
    if (!validar()) {
      Alert.alert('Erro no formulário', 'Por favor, corrija os erros indicados na tela.');
      return;
    }

    setEnviando(true);
    try {
      const familiarCriado = await criarFamiliar({ nome, cpf, telefone });
      setFamiliar(familiarCriado);
      Alert.alert('Sucesso', 'Cadastro de familiar concluído!');
      navigation.navigate(ROUTES.HOME_FAMILIAR);
    } catch (erro) {
      Alert.alert('Erro', erro.message ?? 'Não foi possível concluir o cadastro. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return { nome, cpf, telefone, erros, enviando, alterarNome, alterarCpf, alterarTelefone, salvar };
}

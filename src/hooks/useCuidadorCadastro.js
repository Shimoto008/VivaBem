import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { criarCuidador } from '../services/cuidadorService';
import { aplicarMascaraCPF, aplicarMascaraTelefone } from '../utils/masks';
import { validarNomeCompleto, validarCPFObrigatorio, validarTelefoneObrigatorio } from '../utils/validators';
import { ROUTES } from '../constants/routeNames';
import { useSession } from '../contexts/SessionContext';

/**
 * Toda a regra de negócio do cadastro de Cuidador (validação + chamada de
 * API + navegação) — a tela CadastroCuidadorScreen só lê o que este hook
 * devolve e desenha a UI.
 */
export function useCuidadorCadastro() {
  const navigation = useNavigation();
  const { setCuidador } = useSession();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [outraEspecialidade, setOutraEspecialidade] = useState('');
  const [modalEspecialidadeVisivel, setModalEspecialidadeVisivel] = useState(false);
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

  const alterarOutraEspecialidade = (texto) => {
    setOutraEspecialidade(texto);
    setErros((atual) => ({ ...atual, especialidade: null }));
  };

  const selecionarEspecialidade = (opcao) => {
    setEspecialidade(opcao);
    setModalEspecialidadeVisivel(false);
    setErros((atual) => ({ ...atual, especialidade: null }));
  };

  function validar() {
    const novosErros = {
      nome: validarNomeCompleto(nome),
      cpf: validarCPFObrigatorio(cpf),
      telefone: validarTelefoneObrigatorio(telefone),
      especialidade: !especialidade
        ? 'Campo obrigatório'
        : especialidade === 'Outros' && !outraEspecialidade.trim()
          ? 'Por favor, digite sua especialidade'
          : null,
    };
    setErros(novosErros);
    return Object.values(novosErros).every((mensagem) => !mensagem);
  }

  async function salvar() {
    if (!validar()) {
      Alert.alert('Erro no formulário', 'Por favor, corrija os erros indicados na tela.');
      return;
    }

    const especialidadeFinal = especialidade === 'Outros' ? outraEspecialidade.trim() : especialidade;

    setEnviando(true);
    try {
      const cuidadorCriado = await criarCuidador({ nome, cpf, telefone, especialidade: especialidadeFinal });
      setCuidador(cuidadorCriado);
      Alert.alert('Sucesso', 'Cuidador cadastrado!');
      navigation.navigate(ROUTES.HOME_CUIDADOR);
    } catch (erro) {
      Alert.alert('Erro', erro.message ?? 'Não foi possível concluir o cadastro. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return {
    nome, telefone, cpf, especialidade, outraEspecialidade, erros, enviando,
    modalEspecialidadeVisivel, setModalEspecialidadeVisivel,
    alterarNome, alterarCpf, alterarTelefone, alterarOutraEspecialidade, selecionarEspecialidade,
    salvar,
  };
}

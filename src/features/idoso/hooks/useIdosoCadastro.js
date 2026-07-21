import { useState } from 'react';
import { Alert } from 'react-native';
import { criarIdoso } from '../services/idosoService';
import { aplicarMascaraCPF, aplicarMascaraTelefone } from '../utils/masks';
import { validarNomeCompleto, validarCPFObrigatorio, validarTelefoneObrigatorio } from '../utils/validators';

/**
 * Extrai a lógica que antes não existia (o botão "CADASTRAR" do Idoso.js
 * original não tinha onPress — bug identificado na Fase 1). A tela em si
 * permanece visualmente idêntica, por instrução explícita.
 */
export function useIdosoCadastro() {
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
      await criarIdoso({ nome, cpf, telefone });
      Alert.alert('Sucesso', 'Cadastro concluído!');
      setNome(''); setCpf(''); setTelefone('');
    } catch (erro) {
      Alert.alert('Erro', erro.message ?? 'Não foi possível concluir o cadastro. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return { nome, cpf, telefone, erros, enviando, alterarNome, alterarCpf, alterarTelefone, salvar };
}

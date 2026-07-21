import { useState } from 'react';
import { Alert } from 'react-native';
import { aplicarMascaraCPF } from '../utils/masks';
import { validarNomeCompleto, validarIdadeObrigatoria, validarCPFObrigatorio } from '../utils/validators';

/**
 * Antes o cadastro de idoso (RenderPaciente.js) não tinha NENHUMA
 * validação — nome vazio e CPF incompleto eram aceitos (bug identificado
 * na Fase 1). Este hook aplica as mesmas regras já usadas no cadastro do
 * Cuidador, mantendo consistência entre os formulários do app.
 */
export function useCadastroPacienteForm(aoSalvar) {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [cpf, setCpf] = useState('');
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  const alterarCpf = (texto) => setCpf(aplicarMascaraCPF(texto));

  function validar() {
    const novosErros = {
      nome: validarNomeCompleto(nome),
      idade: validarIdadeObrigatoria(idade),
      cpf: validarCPFObrigatorio(cpf),
    };
    setErros(novosErros);
    return Object.values(novosErros).every((mensagem) => !mensagem);
  }

  async function salvar() {
    if (!validar()) {
      Alert.alert('Erro no formulário', 'Por favor, corrija os erros indicados.');
      return;
    }
    setEnviando(true);
    try {
      await aoSalvar({ nome, idade, cpf });
      setNome(''); setIdade(''); setCpf(''); setErros({});
      Alert.alert('Sucesso', `${nome} foi cadastrado(a) com sucesso!`);
    } catch (erro) {
      Alert.alert('Erro', erro.message ?? 'Não foi possível cadastrar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return { nome, setNome, idade, setIdade, cpf, alterarCpf, erros, enviando, salvar };
}

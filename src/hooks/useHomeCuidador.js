import { useState } from 'react';
import { usePacientes } from './usePacientes';

/**
 * Orquestra apenas estado de NAVEGAÇÃO DE INTERFACE da tela HomeCuidador
 * (aba ativa, paciente expandido, formulário de cadastro visível).
 * Os dados em si (lista de pacientes) vêm de usePacientes — este hook
 * não conhece Supabase, só compõe.
 */
export function useHomeCuidador(cuidadorId) {
  const [abaAtiva, setAbaAtiva] = useState('home');
  const [pacienteSelecionadoId, setPacienteSelecionadoId] = useState(null);
  const [exibirFormCadastro, setExibirFormCadastro] = useState(false);

  const { pacientes, carregando, erro, criarPaciente, recarregar } = usePacientes(cuidadorId);

  const pacienteSelecionado = pacientes.find((p) => p.id === pacienteSelecionadoId) ?? null;

  const selecionarPaciente = (idoso) => {
    setPacienteSelecionadoId((atualId) => (atualId === idoso.id ? null : idoso.id));
  };

  const cadastrarPaciente = async (dados) => {
    await criarPaciente(dados);
    setExibirFormCadastro(false);
  };

  return {
    cuidadorId,
    abaAtiva, setAbaAtiva,
    pacientes, carregandoPacientes: carregando, erroPacientes: erro, recarregarPacientes: recarregar,
    pacienteSelecionado, selecionarPaciente, limparPacienteSelecionado: () => setPacienteSelecionadoId(null),
    exibirFormCadastro, setExibirFormCadastro,
    cadastrarPaciente,
  };
}

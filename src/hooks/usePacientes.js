import { useCallback, useEffect, useState } from 'react';
import { listarPacientesPorCuidador, criarPaciente as criarPacienteService } from '../services/pacienteService';

/** Busca/cria os pacientes (idosos) de um cuidador — persistido no Supabase. */
export function usePacientes(cuidadorId) {
  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const recarregar = useCallback(async () => {
    if (!cuidadorId) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const lista = await listarPacientesPorCuidador(cuidadorId);
      setPacientes(lista);
    } catch (err) {
      setErro(err);
    } finally {
      setCarregando(false);
    }
  }, [cuidadorId]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  const criarPaciente = useCallback(async ({ nome, idade, cpf }) => {
    const novoPaciente = await criarPacienteService({ cuidadorId, nome, idade, cpf });
    setPacientes((listaAtual) => [...listaAtual, novoPaciente]);
    return novoPaciente;
  }, [cuidadorId]);

  return { pacientes, carregando, erro, criarPaciente, recarregar };
}

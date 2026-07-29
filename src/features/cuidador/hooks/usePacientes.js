import { useCallback, useEffect, useState } from 'react';
import { listarPacientesPorCuidador } from '../../../services/pacienteService';

/**
 * Busca os pacientes vinculados ao cuidador através das conexões.
 * O cuidador não cadastra pacientes, apenas acompanha.
 */
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

  return { pacientes, carregando, erro, recarregar };
}
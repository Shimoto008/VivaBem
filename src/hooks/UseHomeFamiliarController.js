import { useEffect, useState } from 'react';

import {
  listarPacientesPorFamiliar,
  cadastrarPaciente,
  atualizarPaciente,
  excluirPaciente,
} from '../services/pacienteService';

export function useHomeFamiliarController(familiarId) {
  const [pacientes, setPacientes] = useState([]);

  const [carregando, setCarregando] = useState(true);

  async function carregarPacientes() {
    try {
      setCarregando(true);

      const lista = await listarPacientes(familiarId);

      setPacientes(lista);
    } catch (error) {
      console.log(error);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPacientes();
  }, []);

  return {
    pacientes,
    carregando,
    carregarPacientes,
  };
}
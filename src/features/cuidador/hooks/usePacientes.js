// @ts-check
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  escutarPacientesDoCuidador,
  listarPacientesPorCuidador,
} from '../../../services/pacienteService';

/**
 * Busca os pacientes vinculados ao cuidador através das conexões.
 * Recarrega ao focar a tela, por pull-to-refresh e via Realtime quando
 * uma conexão fica ativa (ou um paciente é cadastrado/alterado).
 */
export function usePacientes(cuidadorId) {
  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(null);
  const montadoRef = useRef(true);

  useEffect(() => {
    montadoRef.current = true;
    return () => {
      montadoRef.current = false;
    };
  }, []);

  const carregar = useCallback(
    async (silencioso = false) => {
      if (!cuidadorId) {
        if (montadoRef.current) {
          setPacientes([]);
          setCarregando(false);
          setAtualizando(false);
        }
        return;
      }
      if (!silencioso && montadoRef.current) setCarregando(true);
      if (montadoRef.current) setErro(null);
      try {
        const lista = await listarPacientesPorCuidador(cuidadorId);
        if (!montadoRef.current) return;
        setPacientes(lista);
      } catch (err) {
        if (!montadoRef.current) return;
        setErro(err);
      } finally {
        if (!montadoRef.current) return;
        setCarregando(false);
        setAtualizando(false);
      }
    },
    [cuidadorId]
  );

  useFocusEffect(
    useCallback(() => {
      carregar(true);
    }, [carregar])
  );

  useEffect(() => {
    if (!cuidadorId) return undefined;

    const cancelarEscuta = escutarPacientesDoCuidador(cuidadorId, () => {
      carregar(true);
    });

    return cancelarEscuta;
  }, [cuidadorId, carregar]);

  const recarregar = useCallback(() => {
    setAtualizando(true);
    return carregar(true);
  }, [carregar]);

  return { pacientes, carregando, atualizando, erro, recarregar };
}

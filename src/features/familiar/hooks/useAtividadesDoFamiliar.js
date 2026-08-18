import { useCallback, useEffect, useRef, useState } from 'react';
import { listarAtividadesPorCuidador } from '../../../services/atividadeService';

/**
 * Atividades publicadas pelo cuidador ao qual o familiar está conectado.
 * Só deve ser chamado quando existe uma conexão ativa (cuidadorId != null).
 */
export function useAtividadesDoFamiliar(cuidadorId) {
  const [atividades, setAtividades] = useState([]);
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
          setAtividades([]);
          setCarregando(false);
          setAtualizando(false);
        }
        return;
      }
      if (!silencioso && montadoRef.current) setCarregando(true);
      if (montadoRef.current) setErro(null);
      try {
        const lista = await listarAtividadesPorCuidador(cuidadorId);
        if (!montadoRef.current) return;
        setAtividades(lista);
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

  useEffect(() => {
    carregar();
  }, [carregar]);

  const recarregar = useCallback(() => {
    setAtualizando(true);
    return carregar(true);
  }, [carregar]);

  return { atividades, carregando, atualizando, erro, recarregar };
}

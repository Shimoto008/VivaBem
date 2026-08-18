import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { listarAtividadesPorIdoso } from '../../../services/atividadeService';

/**
 * Rotina que o próprio idoso autônomo cadastra (`atividades.idoso_id`).
 * Não usa `pacientes` — essa tabela é só o idoso vinculado pelo familiar.
 */
export function useAtividadesDoIdoso(idosoId) {
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
      if (!idosoId) {
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
        const lista = await listarAtividadesPorIdoso(idosoId);
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
    [idosoId]
  );

  useEffect(() => {
    carregar();
  }, [carregar]);

  useFocusEffect(
    useCallback(() => {
      carregar(true);
    }, [carregar])
  );

  const recarregar = useCallback(() => {
    setAtualizando(true);
    return carregar(true);
  }, [carregar]);

  return { atividades, carregando, atualizando, erro, recarregar };
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { escutarConversas, listarConversas } from '../../../services/ChatServices';

/**
 * Lista de conversas do usuário. Recarrega ao focar a tela (para refletir o que
 * mudou enquanto ela estava fechada) e escuta o Realtime enquanto está aberta,
 * para uma mensagem nova reordenar a lista sem precisar de pull-to-refresh.
 */
export function useConversas(euId) {
  const [conversas, setConversas] = useState([]);
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
      if (!euId) {
        if (montadoRef.current) setCarregando(false);
        return;
      }
      if (!silencioso && montadoRef.current) setCarregando(true);
      if (montadoRef.current) setErro(null);
      try {
        const lista = await listarConversas(euId);
        if (!montadoRef.current) return;
        setConversas(lista);
      } catch (err) {
        if (!montadoRef.current) return;
        setErro(err.message || 'Erro ao carregar conversas.');
      } finally {
        if (!montadoRef.current) return;
        setCarregando(false);
        setAtualizando(false);
      }
    },
    [euId]
  );

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  useEffect(() => {
    if (!euId) return undefined;

    const cancelarEscuta = escutarConversas(euId, () => {
      carregar(true);
    });

    return cancelarEscuta;
  }, [euId, carregar]);

  const atualizarManualmente = useCallback(() => {
    setAtualizando(true);
    carregar(true);
  }, [carregar]);

  return { conversas, carregando, atualizando, erro, atualizarManualmente };
}

import { useCallback, useEffect, useState } from 'react';
import { listarAtividadesPorCuidador } from '../../../services/atividadeService';

/**
 * Atividades publicadas pelo cuidador ao qual o familiar está conectado.
 * Só deve ser chamado quando existe uma conexão ativa (cuidadorId != null);
 * a tela não faz a chamada de API diretamente — ver regra de negócio em
 * useConexaoFamiliar/ConexaoFamiliarContext.
 */
export function useAtividadesDoFamiliar(cuidadorId) {
  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const recarregar = useCallback(async () => {
    if (!cuidadorId) {
      setAtividades([]);
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const lista = await listarAtividadesPorCuidador(cuidadorId);
      setAtividades(lista);
    } catch (err) {
      setErro(err);
    } finally {
      setCarregando(false);
    }
  }, [cuidadorId]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { atividades, carregando, erro, recarregar };
}

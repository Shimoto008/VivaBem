import { useEffect, useState, useCallback, useRef } from 'react';
import { ATIVIDADE_TIPOS } from '../../../constants/atividadeTipos';
import {
  listarAtividadesPorPaciente,
  criarAtividade,
  atualizarAtividade,
  removerAtividade,
} from '../../../services/atividadeService';

/**
 * Dados + regras de "agenda / relatórios / medicação / observação" de um
 * paciente — antes vivia inteiramente em memória dentro de UseHomeCuidador.
 * Agora é persistido (Supabase) e fica isolado num hook próprio.
 */
export function useAtividadesPaciente(pacienteId, cuidadorId) {
  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState(null);
  const [itemEmEdicao, setItemEmEdicao] = useState(null);
  /**
   * `processando` desabilita os botões, mas só no próximo render — um toque
   * duplo rápido ainda passaria. O ref barra a segunda chamada na hora.
   */
  const emAndamentoRef = useRef(false);

  const recarregar = useCallback(async () => {
    if (!pacienteId) {
      setAtividades([]);
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const lista = await listarAtividadesPorPaciente(pacienteId);
      setAtividades(lista);
    } catch (err) {
      setErro(err);
    } finally {
      setCarregando(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  /** Para o tipo "agenda": retorna a atividade já salva para uma data, se existir. */
  const buscarAgendaPorData = useCallback(
    (dataReferencia) =>
      atividades.find(
        (a) => a.tipo === ATIVIDADE_TIPOS.AGENDA && a.data_referencia === dataReferencia
      ) ?? null,
    [atividades]
  );

  const iniciarEdicao = useCallback((atividade) => setItemEmEdicao(atividade), []);
  const cancelarEdicao = useCallback(() => setItemEmEdicao(null), []);

  const salvar = useCallback(
    async (tipo, conteudo, dataReferencia = null) => {
      if (emAndamentoRef.current) return;
      emAndamentoRef.current = true;
      setProcessando(true);
      setErro(null);
      try {
        if (itemEmEdicao) {
          await atualizarAtividade(itemEmEdicao.id, conteudo);
        } else {
          await criarAtividade({ pacienteId, cuidadorId, tipo, conteudo, dataReferencia });
        }
        setItemEmEdicao(null);
        await recarregar();
      } catch (err) {
        setErro(err);
        throw err;
      } finally {
        emAndamentoRef.current = false;
        setProcessando(false);
      }
    },
    [itemEmEdicao, pacienteId, cuidadorId, recarregar]
  );

  const excluir = useCallback(
    async (atividadeId) => {
      if (emAndamentoRef.current) return;
      emAndamentoRef.current = true;
      setProcessando(true);
      setErro(null);

      try {
        await removerAtividade(atividadeId);
        await recarregar();
      } catch (err) {
        setErro(err);
        throw err;
      } finally {
        emAndamentoRef.current = false;
        setProcessando(false);
      }
    },
    [recarregar]
  );

  return {
    atividades,
    carregando,
    processando,
    erro,
    itemEmEdicao,
    iniciarEdicao,
    cancelarEdicao,
    buscarAgendaPorData,
    salvar,
    recarregar,
    excluir,
  };
}

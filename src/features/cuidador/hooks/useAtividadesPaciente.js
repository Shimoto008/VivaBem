import { useEffect, useState, useCallback, useRef } from 'react';
import { ATIVIDADE_TIPOS } from '../../../constants/atividadeTipos';
import {
  listarAtividadesPorPaciente,
  listarAtividadesPorIdoso,
  criarAtividade,
  atualizarAtividade,
  removerAtividade,
} from '../../../services/atividadeService';

/**
 * Dados + regras de "agenda / relatórios / medicação / observação".
 * Com `cuidadorId`, grava no paciente do familiar. Sem cuidador, grava na
 * rotina do idoso autônomo (`idoso_id` = o primeiro argumento).
 */
export function useAtividadesPaciente(alvoId, cuidadorId) {
  const ehIdosoAutonomo = !cuidadorId;
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
    if (!alvoId) {
      setAtividades([]);
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const lista = ehIdosoAutonomo
        ? await listarAtividadesPorIdoso(alvoId)
        : await listarAtividadesPorPaciente(alvoId);
      setAtividades(lista);
    } catch (err) {
      setErro(err);
    } finally {
      setCarregando(false);
    }
  }, [alvoId, ehIdosoAutonomo]);

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
          await criarAtividade(
            ehIdosoAutonomo
              ? { idosoId: alvoId, tipo, conteudo, dataReferencia }
              : { pacienteId: alvoId, cuidadorId, tipo, conteudo, dataReferencia }
          );
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
    [itemEmEdicao, alvoId, cuidadorId, ehIdosoAutonomo, recarregar]
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

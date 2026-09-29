// @ts-check
import { supabase } from './supabaseClient';
import { ATIVIDADE_TIPOS } from '../constants/atividadeTipos';
import { lancarErroSupabase } from './errors';

/** @typedef {import('../types/models').Atividade} Atividade */

const TABELA = 'atividades';

/**
 * @param {string} pacienteId
 * @returns {Promise<Atividade[]>}
 */
export async function listarAtividadesPorPaciente(pacienteId) {
  if (!pacienteId) return [];
  return listarAtividadesPorPacientes([pacienteId]);
}

/**
 * @param {string[]} pacienteIds
 * @param {{ limite?: number }} [opcoes]
 * @returns {Promise<Atividade[]>}
 */
async function listarAtividadesPorPacientes(pacienteIds, { limite = 50 } = {}) {
  if (!pacienteIds?.length) return [];

  const { data, error } = await supabase
    .from(TABELA)
    .select('*, pacientes ( nome )')
    .in('paciente_id', pacienteIds)
    .order('created_at', { ascending: false })
    .limit(limite);
  lancarErroSupabase(error, 'Não foi possível carregar as atividades.');
  return data ?? [];
}

/**
 * Rotina do idoso autônomo (conta em `idosos`, não o paciente do familiar).
 * @param {string} idosoId
 * @param {{ limite?: number }} [opcoes]
 * @returns {Promise<Atividade[]>}
 */
export async function listarAtividadesPorIdoso(idosoId, { limite = 50 } = {}) {
  if (!idosoId) return [];

  const { data, error } = await supabase
    .from(TABELA)
    .select('*')
    .eq('idoso_id', idosoId)
    .order('created_at', { ascending: false })
    .limit(limite);
  lancarErroSupabase(error, 'Não foi possível carregar suas atividades.');
  return data ?? [];
}

/**
 * @param {{ pacienteId?: string | null, cuidadorId?: string | null, idosoId?: string | null, tipo: string, conteudo: any, dataReferencia?: string | null }} dados
 * @returns {Promise<Atividade>}
 */
export async function criarAtividade({
  pacienteId = null,
  cuidadorId = null,
  idosoId = null,
  tipo,
  conteudo,
  dataReferencia = null,
}) {
  const { data, error } = await supabase
    .from(TABELA)
    .insert([{
      paciente_id: idosoId ? null : pacienteId,
      cuidador_id: idosoId ? null : cuidadorId,
      idoso_id: idosoId || null,
      tipo,
      conteudo,
      data_referencia: dataReferencia,
    }])
    .select()
    .single();
  lancarErroSupabase(error, 'Não foi possível salvar a atividade.');
  return data;
}

/**
 * @param {string} atividadeId
 * @param {any} conteudo
 * @returns {Promise<Atividade>}
 */
export async function atualizarAtividade(atividadeId, conteudo) {
  const { data, error } = await supabase
    .from(TABELA)
    .update({ conteudo })
    .eq('id', atividadeId)
    .select()
    .single();
  lancarErroSupabase(error, 'Não foi possível atualizar a atividade.');
  return data;
}

/**
 * @param {string} atividadeId
 * @returns {Promise<void>}
 */
export async function removerAtividade(atividadeId) {
  const { error } = await supabase.from(TABELA).delete().eq('id', atividadeId);
  lancarErroSupabase(error, 'Não foi possível excluir a atividade.');
}

/**
 * Usado pela área do Familiar: lista as atividades publicadas pelo cuidador
 * ao qual o familiar está conectado (todas as do cuidador, de todos os
 * pacientes dele). Os parâmetros opcionais já preparam a função para os
 * filtros/ordenação/paginação futuros pedidos no briefing, sem precisar
 * mudar a assinatura depois.
 *
 * @param {string} cuidadorId
 * @param {{ tipo?: string, limite?: number }} [opcoes]
 * @returns {Promise<Atividade[]>}
 */
export async function listarAtividadesPorCuidador(cuidadorId, { tipo, limite = 50 } = {}) {
  let query = supabase
    .from(TABELA)
    .select('*, pacientes ( nome )')
    .eq('cuidador_id', cuidadorId)
    .order('created_at', { ascending: false })
    .limit(limite);

  if (tipo && Object.values(ATIVIDADE_TIPOS).includes(tipo)) {
    query = query.eq('tipo', tipo);
  }

  const { data, error } = await query;
  lancarErroSupabase(error, 'Não foi possível carregar as atividades do cuidador.');
  return data ?? [];
}

import { supabase } from './supabaseClient';
import { ATIVIDADE_TIPOS } from '../constants/atividadeTipos';

const TABELA = 'atividades';

export async function listarAtividadesPorPaciente(pacienteId) {
  const { data, error } = await supabase
    .from(TABELA)
    .select('*')
    .eq('paciente_id', pacienteId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function criarAtividade({ pacienteId, cuidadorId, tipo, conteudo, dataReferencia = null }) {
  const { data, error } = await supabase
    .from(TABELA)
    .insert([{
      paciente_id: pacienteId,
      cuidador_id: cuidadorId,
      tipo,
      conteudo,
      data_referencia: dataReferencia,
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function atualizarAtividade(atividadeId, conteudo) {
  const { data, error } = await supabase
    .from(TABELA)
    .update({ conteudo })
    .eq('id', atividadeId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removerAtividade(atividadeId) {
  const { error } = await supabase.from(TABELA).delete().eq('id', atividadeId);
  if (error) throw error;
}

/**
 * Usado pela área do Familiar: lista as atividades publicadas pelo cuidador
 * ao qual o familiar está conectado (todas as do cuidador, de todos os
 * pacientes dele). Os parâmetros opcionais já preparam a função para os
 * filtros/ordenação/paginação futuros pedidos no briefing, sem precisar
 * mudar a assinatura depois.
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
  if (error) throw error;
  return data;
}

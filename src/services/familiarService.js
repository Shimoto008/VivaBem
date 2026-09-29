// @ts-check
import { supabase } from './supabaseClient';
import { lancarErroSupabase } from './errors';

/** @typedef {import('../types/models').Familiar} Familiar */

const TABELA = 'familiares';

/**
 * @param {string} familiarId
 * @param {Partial<Familiar>} dadosPerfil
 * @returns {Promise<Familiar>}
 */
export async function atualizarPerfilFamiliar(familiarId, dadosPerfil) {
  const { data, error } = await supabase
    .from(TABELA)
    .update(dadosPerfil)
    .eq('id', familiarId)
    .select()
    .single();
  lancarErroSupabase(error, 'Não foi possível salvar o perfil.');
  return data;
}

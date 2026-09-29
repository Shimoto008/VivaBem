// @ts-check
import { supabase } from './supabaseClient';
import { somenteDigitos } from '../utils/masks';
import { lancarErroSupabase } from './errors';

/** @typedef {import('../types/models').Idoso} Idoso */

const TABELA = 'idosos';

/**
 * Atualiza o perfil do idoso usuário do app (perfil "Idoso"). O cadastro é
 * feito por `cadastrarEConectarIdoso` em authService.
 *
 * @param {string} id
 * @param {{ telefone?: string, contato_emergencia?: string | null, preferencias?: string | null, nome?: string, foto_url?: string | null }} campos
 * @returns {Promise<Idoso>}
 */
export async function atualizarPerfilIdoso(id, campos) {
  /** @type {Record<string, any>} */
  const payload = {};
  if (campos.telefone !== undefined) payload.telefone = somenteDigitos(campos.telefone);
  if (campos.contato_emergencia !== undefined) {
    payload.contato_emergencia = campos.contato_emergencia
      ? somenteDigitos(campos.contato_emergencia)
      : null;
  }
  if (campos.preferencias !== undefined) {
    payload.preferencias = campos.preferencias?.trim?.() || campos.preferencias || null;
  }
  if (campos.nome !== undefined) payload.nome = campos.nome.trim();
  if (campos.foto_url !== undefined) payload.foto_url = campos.foto_url || null;

  const { data, error } = await supabase
    .from(TABELA)
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  lancarErroSupabase(error, 'Não foi possível salvar o perfil.');
  return data;
}

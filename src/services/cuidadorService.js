// @ts-check
import { supabase } from './supabaseClient';
import { lancarErroSupabase } from './errors';

/** @typedef {import('../types/models').Cuidador} Cuidador */

const TABELA = 'cuidadores';
const TAMANHO_CODIGO = 6;
/** Sem caracteres ambíguos (0/O, 1/I) para o código ser ditado em voz alta. */
const ALFABETO_CODIGO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * Gera o código curto usado pelo Familiar para localizar e vincular o Cuidador.
 * @returns {string}
 */
export function gerarCodigoCuidador() {
  let codigo = '';
  for (let i = 0; i < TAMANHO_CODIGO; i += 1) {
    codigo += ALFABETO_CODIGO[Math.floor(Math.random() * ALFABETO_CODIGO.length)];
  }
  return codigo;
}

/**
 * @param {string} codigo
 * @returns {Promise<Cuidador | null>}
 */
export async function buscarCuidadorPorCodigo(codigo) {
  const { data, error } = await supabase
    .from(TABELA)
    .select('*')
    .eq('codigo', codigo.trim().toUpperCase())
    .maybeSingle();
  lancarErroSupabase(error, 'Não foi possível buscar o cuidador pelo código.');
  return data;
}

/**
 * @param {string} cuidadorId
 * @param {Partial<Cuidador>} dadosPerfil
 * @returns {Promise<Cuidador>}
 */
export async function atualizarPerfilCuidador(cuidadorId, dadosPerfil) {
  const { data, error } = await supabase
    .from(TABELA)
    .update(dadosPerfil)
    .eq('id', cuidadorId)
    .select()
    .single();
  lancarErroSupabase(error, 'Não foi possível salvar o perfil.');
  return data;
}

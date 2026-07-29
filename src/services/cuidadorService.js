import { supabase } from './supabaseClient';
import { somenteDigitos } from '../utils/masks';

const TABELA = 'cuidadores';
const TAMANHO_CODIGO = 6;
/** Sem caracteres ambíguos (0/O, 1/I) para o código ser ditado em voz alta. */
const ALFABETO_CODIGO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * Gera o código curto usado pelo Familiar para localizar e vincular o Cuidador.
 */
export function gerarCodigoCuidador() {
  let codigo = '';
  for (let i = 0; i < TAMANHO_CODIGO; i += 1) {
    codigo += ALFABETO_CODIGO[Math.floor(Math.random() * ALFABETO_CODIGO.length)];
  }
  return codigo;
}

export async function buscarCuidadorPorId(cuidadorId) {
  const { data, error } = await supabase.from(TABELA).select('*').eq('id', cuidadorId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function buscarCuidadorPorCpf(cpf) {
  const { data, error } = await supabase
    .from(TABELA)
    .select('*')
    .eq('cpf', somenteDigitos(cpf))
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function buscarCuidadorPorCodigo(codigo) {
  const { data, error } = await supabase
    .from(TABELA)
    .select('*')
    .eq('codigo', codigo.trim().toUpperCase())
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function atualizarPerfilCuidador(cuidadorId, dadosPerfil) {
  const { data, error } = await supabase
    .from(TABELA)
    .update(dadosPerfil)
    .eq('id', cuidadorId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

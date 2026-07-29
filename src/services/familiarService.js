import { supabase } from './supabaseClient';
import { somenteDigitos } from '../utils/masks';

const TABELA = 'familiares';

export async function buscarFamiliarPorId(familiarId) {
  const { data, error } = await supabase.from(TABELA).select('*').eq('id', familiarId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function buscarFamiliarPorCpf(cpf) {
  const { data, error } = await supabase
    .from(TABELA)
    .select('*')
    .eq('cpf', somenteDigitos(cpf))
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function atualizarPerfilFamiliar(familiarId, dadosPerfil) {
  const { data, error } = await supabase
    .from(TABELA)
    .update(dadosPerfil)
    .eq('id', familiarId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

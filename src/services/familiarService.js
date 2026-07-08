import { supabase } from './supabaseClient';
import { somenteDigitos } from '../utils/masks';

const TABELA = 'familiares';

export async function criarFamiliar({ nome, cpf, telefone }) {
  const { data, error } = await supabase
    .from(TABELA)
    .insert([{
      nome: nome.trim(),
      cpf: somenteDigitos(cpf),
      telefone: somenteDigitos(telefone),
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

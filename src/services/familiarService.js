import { supabase } from './supabaseClient';
import { somenteDigitos } from '../utils/masks';

const TABELA = 'familiares';


/**
 * Cria um novo familiar
 */
export async function criarFamiliar({
  nome,
  cpf,
  telefone
}) {

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


/**
 * Busca familiar pelo ID
 */
export async function buscarFamiliarPorId(familiarId) {

  const { data, error } = await supabase
    .from(TABELA)
    .select('*')
    .eq('id', familiarId)
    .single();


  if (error) throw error;

  return data;
}


/**
 * Atualiza dados do familiar
 */
export async function atualizarFamiliar(
  familiarId,
  {
    nome,
    cpf,
    telefone
  }
) {

  const { data, error } = await supabase
    .from(TABELA)
    .update({
      nome: nome.trim(),
      cpf: somenteDigitos(cpf),
      telefone: somenteDigitos(telefone),
    })
    .eq('id', familiarId)
    .select()
    .single();


  if (error) throw error;

  return data;
}
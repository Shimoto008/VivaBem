import { supabase } from './supabaseClient';
import { somenteDigitos } from '../utils/masks';

const TABELA = 'pacientes';

export async function listarPacientesPorCuidador(cuidadorId) {
  const { data, error } = await supabase
    .from(TABELA)
    .select('*')
    .eq('cuidador_id', cuidadorId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function criarPaciente({ cuidadorId, nome, idade, cpf }) {
  const { data, error } = await supabase
    .from(TABELA)
    .insert([{
      cuidador_id: cuidadorId,
      nome: nome.trim(),
      idade: Number(idade),
      cpf: somenteDigitos(cpf),
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

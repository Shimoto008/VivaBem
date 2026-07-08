import { supabase } from './supabaseClient';
import { somenteDigitos } from '../utils/masks';

const TABELA = 'idosos';

/**
 * Cadastro do próprio idoso como usuário do app (perfil "Idoso" selecionado
 * na Home) — diferente de "pacientes", que são os idosos cadastrados PELO
 * cuidador dentro da área HomeCuidador. São conceitos distintos no domínio
 * atual do app; ver docs/DATABASE.md.
 */
export async function criarIdoso({ nome, cpf, telefone }) {
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

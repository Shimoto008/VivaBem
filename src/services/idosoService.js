import { supabase } from './supabaseClient';
import { somenteDigitos } from '../utils/masks';

const TABELA = 'idosos';

/**
 * Cadastro do próprio idoso como usuário do app (perfil "Idoso").
 * Diferente de "pacientes" (idosos cadastrados pelo cuidador/familiar).
 * O `id` deve ser o mesmo de `auth.users` — use preferencialmente
 * `cadastrarEConectarIdoso` em authService.
 */
export async function criarIdoso({ id, nome, cpf, telefone }) {
  const { data, error } = await supabase
    .from(TABELA)
    .insert([{
      id,
      nome: nome.trim(),
      cpf: somenteDigitos(cpf),
      telefone: somenteDigitos(telefone),
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function atualizarPerfilIdoso(id, campos) {
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

  const { data, error } = await supabase
    .from(TABELA)
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

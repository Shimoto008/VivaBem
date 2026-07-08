import { supabase } from './supabaseClient';
import { somenteDigitos } from '../utils/masks';

const TABELA = 'cuidadores';

/** Gera um código curto (6 caracteres) usado pelo Familiar para localizar o Cuidador. */
function gerarCodigo() {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem caracteres ambíguos (0,O,1,I)
  let codigo = '';
  for (let i = 0; i < 6; i += 1) {
    codigo += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  }
  return codigo;
}

/**
 * Cria o cadastro do cuidador e gera um código único de vínculo.
 * Faz algumas tentativas em caso de colisão de código (raro, 6 chars em base 33).
 *
 * Observação: a geração/garantia de unicidade ideal seria via função/trigger
 * no banco; aqui é uma solução de cliente com novas tentativas, documentada
 * em docs/DATABASE.md.
 */
export async function criarCuidador({ nome, cpf, telefone, especialidade }) {
  const payload = {
    nome: nome.trim(),
    cpf: somenteDigitos(cpf),
    telefone: somenteDigitos(telefone),
    especialidade,
  };

  const MAX_TENTATIVAS = 5;
  let ultimoErro = null;

  for (let tentativa = 0; tentativa < MAX_TENTATIVAS; tentativa += 1) {
    const { data, error } = await supabase
      .from(TABELA)
      .insert([{ ...payload, codigo: gerarCodigo() }])
      .select()
      .single();

    if (!error) return data;

    // 23505 = unique_violation no Postgres; tenta novo código.
    if (error.code !== '23505') {
      ultimoErro = error;
      break;
    }
    ultimoErro = error;
  }

  throw ultimoErro;
}

export async function buscarCuidadorPorId(cuidadorId) {
  const { data, error } = await supabase.from(TABELA).select('*').eq('id', cuidadorId).single();
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
  return data; // null se não encontrado
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

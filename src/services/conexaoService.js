import { supabase } from './supabaseClient';
import { DomainError } from './errors';

const TABELA = 'conexoes';
const STATUS_ATIVA = 'ativa';
const STATUS_DESFEITA = 'desfeita';

/**
 * Busca a conexão ATIVA do familiar (no máximo uma, garantida também por
 * índice único parcial no banco — ver docs/DATABASE.md). Já traz os dados
 * do cuidador via join para a UI não precisar de uma segunda chamada.
 */
export async function buscarConexaoAtivaDoFamiliar(familiarId) {
  const { data, error } = await supabase
    .from(TABELA)
    .select('*, cuidadores ( id, nome, especialidade, codigo )')
    .eq('familiar_id', familiarId)
    .eq('status', STATUS_ATIVA)
    .maybeSingle();
  if (error) throw error;
  return data; // null se não houver conexão ativa
}

/**
 * Regra de negócio: um Familiar só pode estar conectado a UM cuidador por
 * vez. Antes de criar a nova conexão, valida no servidor se já existe uma
 * ativa — e lança DomainError (não um erro genérico de API) se sim, para a
 * tela poder mostrar uma mensagem clara sem conhecer detalhes do banco.
 *
 * Esta verificação é "defesa em profundidade": o banco também garante a
 * regra via índice único parcial, então mesmo em caso de concorrência
 * (duas chamadas simultâneas) a regra não pode ser violada.
 */
export async function conectarComCuidador(familiarId, cuidadorId) {
  const conexaoAtiva = await buscarConexaoAtivaDoFamiliar(familiarId);

  if (conexaoAtiva) {
    throw new DomainError(
      `Você já está conectado a ${conexaoAtiva.cuidadores?.nome ?? 'um cuidador'}. ` +
      'Desconecte-se primeiro para poder se conectar a outro cuidador.'
    );
  }

  const { data, error } = await supabase
    .from(TABELA)
    .insert([{ familiar_id: familiarId, cuidador_id: cuidadorId, status: STATUS_ATIVA }])
    .select('*, cuidadores ( id, nome, especialidade, codigo )')
    .single();

  if (error) {
    // 23505 = unique_violation: o índice único do banco pegou uma corrida
    // que a verificação acima não pegou (ex.: duplo toque rápido).
    if (error.code === '23505') {
      throw new DomainError('Você já possui uma conexão ativa com um cuidador.');
    }
    throw error;
  }

  return data;
}

export async function desconectarDoCuidador(conexaoId) {
  const { data, error } = await supabase
    .from(TABELA)
    .update({ status: STATUS_DESFEITA, desfeita_em: new Date().toISOString() })
    .eq('id', conexaoId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

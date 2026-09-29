// @ts-check
import { supabase } from './supabaseClient';
import { somenteDigitos } from '../utils/masks';
import { lancarErroSupabase } from './errors';

/** @typedef {import('../types/models').Paciente} Paciente */

const TABELA = 'pacientes';
const TABELA_CONEXOES = 'conexoes';
const STATUS_CONEXAO_ATIVA = 'ativa';

/**
 * Cria um novo paciente vinculado ao familiar.
 * @param {{ familiarId: string, nome: string, idade?: string | number | null, cpf?: string }} dados
 * @returns {Promise<Paciente>}
 */
export async function criarPaciente({ familiarId, nome, idade, cpf }) {
  const { data, error } = await supabase
    .from(TABELA)
    .insert([
      {
        familiar_id: familiarId,
        nome: nome.trim(),
        idade: idade ? Number(idade) : null,
        cpf: somenteDigitos(cpf),
      },
    ])
    .select()
    .single();

  lancarErroSupabase(error, 'Não foi possível cadastrar o idoso.');
  return data;
}

/**
 * Lista pacientes cadastrados por um familiar.
 * @param {string} familiarId
 * @returns {Promise<Paciente[]>}
 */
export async function listarPacientesPorFamiliar(familiarId) {
  const { data, error } = await supabase
    .from(TABELA)
    .select('*')
    .eq('familiar_id', familiarId)
    .order('created_at', { ascending: true });

  lancarErroSupabase(error, 'Não foi possível carregar os idosos cadastrados.');
  return data ?? [];
}

/**
 * Lista pacientes que um cuidador acompanha, seguindo o caminho
 * cuidador → conexoes → familiares → pacientes.
 * @param {string} cuidadorId
 * @returns {Promise<Paciente[]>}
 */
export async function listarPacientesPorCuidador(cuidadorId) {
  const { data: conexoes, error: erroConexao } = await supabase
    .from(TABELA_CONEXOES)
    .select('familiar_id')
    .eq('cuidador_id', cuidadorId)
    .eq('status', STATUS_CONEXAO_ATIVA);

  lancarErroSupabase(erroConexao, 'Não foi possível carregar suas conexões.');
  if (!conexoes || conexoes.length === 0) return [];

  const familiaresIds = conexoes.map((conexao) => conexao.familiar_id);

  const { data, error } = await supabase
    .from(TABELA)
    .select('*')
    .in('familiar_id', familiaresIds)
    .order('created_at', { ascending: true });

  lancarErroSupabase(error, 'Não foi possível carregar os pacientes.');
  return data ?? [];
}

/**
 * Atualiza a ficha de saúde de um paciente (alergias, tipo sanguíneo,
 * contato de emergência, observações médicas), preenchida pelo familiar em
 * um momento diferente do cadastro básico (nome/idade/cpf).
 * @param {string} pacienteId
 * @param {{ alergias?: string, tipoSanguineo?: string, contatoEmergencia?: string, observacoesMedicas?: string }} dados
 * @returns {Promise<Paciente>}
 */
export async function atualizarSaudePaciente(
  pacienteId,
  { alergias, tipoSanguineo, contatoEmergencia, observacoesMedicas }
) {
  const { data, error } = await supabase
    .from(TABELA)
    .update({
      alergias,
      tipo_sanguineo: tipoSanguineo,
      contato_emergencia: contatoEmergencia,
      observacoes_medicas: observacoesMedicas,
    })
    .eq('id', pacienteId)
    .select()
    .single();

  lancarErroSupabase(error, 'Não foi possível salvar a ficha de saúde.');
  return data;
}

function avisarSeCanalFalhou(status, rotulo) {
  if (!__DEV__ || (status !== 'CHANNEL_ERROR' && status !== 'TIMED_OUT')) return;
  console.warn(
    `[Realtime] Canal "${rotulo}" não conectou (${status}). Confirme que as tabelas ` +
      '"conexoes" e "pacientes" estão publicadas no Realtime do Supabase (veja docs/DATABASE.md).'
  );
}

/**
 * Escuta mudanças em `conexoes` e `pacientes` para atualizar a lista do
 * cuidador no instante em que um familiar se vincula ou cadastra um idoso.
 *
 * Sem `filter` no servidor: no React Native o filtro combinado com RLS
 * costuma engolir o evento (mesmo padrão documentado em ChatServices).
 *
 * @param {string} cuidadorId
 * @param {(payload?: any) => void} onMudanca
 * @returns {() => void} função para cancelar a escuta
 */
export function escutarPacientesDoCuidador(cuidadorId, onMudanca) {
  if (!cuidadorId) return () => {};

  const canal = supabase
    .channel(`pacientes_cuidador_${cuidadorId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABELA_CONEXOES },
      (payload) => {
        const novo = /** @type {{ cuidador_id?: string }} */ (payload.new);
        const antigo = /** @type {{ cuidador_id?: string }} */ (payload.old);
        const linha = novo?.cuidador_id ? novo : antigo;
        if (linha?.cuidador_id === cuidadorId) onMudanca(payload);
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABELA },
      () => {
        onMudanca();
      }
    )
    .subscribe((status) => avisarSeCanalFalhou(status, 'pacientes_cuidador'));

  return () => {
    supabase.removeChannel(canal);
  };
}

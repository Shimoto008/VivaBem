import { supabase } from './supabaseClient';
import { somenteDigitos } from '../utils/masks';

const TABELA = 'pacientes';
const TABELA_CONEXOES = 'conexoes';
const STATUS_CONEXAO_ATIVA = 'ativa';

/** Cria um novo paciente vinculado ao familiar. */
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

  if (error) throw error;
  return data;
}

/** Lista pacientes cadastrados por um familiar. */
export async function listarPacientesPorFamiliar(familiarId) {
  const { data, error } = await supabase
    .from(TABELA)
    .select('*')
    .eq('familiar_id', familiarId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Lista pacientes que um cuidador acompanha, seguindo o caminho
 * cuidador → conexoes → familiares → pacientes.
 */
export async function listarPacientesPorCuidador(cuidadorId) {
  const { data: conexoes, error: erroConexao } = await supabase
    .from(TABELA_CONEXOES)
    .select('familiar_id')
    .eq('cuidador_id', cuidadorId)
    .eq('status', STATUS_CONEXAO_ATIVA);

  if (erroConexao) throw erroConexao;
  if (!conexoes || conexoes.length === 0) return [];

  const familiaresIds = conexoes.map((conexao) => conexao.familiar_id);

  const { data, error } = await supabase
    .from(TABELA)
    .select('*')
    .in('familiar_id', familiaresIds)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

/** Busca um paciente específico pelo ID. */
export async function buscarPacientePorId(pacienteId) {
  const { data, error } = await supabase.from(TABELA).select('*').eq('id', pacienteId).single();

  if (error) throw error;
  return data;
}

/** Atualiza os dados básicos de um paciente. */
export async function atualizarPaciente(pacienteId, { nome, idade, cpf }) {
  const { data, error } = await supabase
    .from(TABELA)
    .update({
      nome: nome.trim(),
      idade: idade ? Number(idade) : null,
      cpf: somenteDigitos(cpf),
    })
    .eq('id', pacienteId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Atualiza a ficha de saúde de um paciente (alergias, tipo sanguíneo,
 * contato de emergência, observações médicas). Separado de
 * `atualizarPaciente` porque é preenchido pelo familiar em um momento
 * diferente do cadastro básico (nome/idade/cpf).
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

  if (error) throw error;
  return data;
}

/** Remove um paciente. */
export async function excluirPaciente(pacienteId) {
  const { error } = await supabase.from(TABELA).delete().eq('id', pacienteId);

  if (error) throw error;
  return true;
}

function avisarSeCanalFalhou(status, rotulo) {
  if (status !== 'CHANNEL_ERROR' && status !== 'TIMED_OUT') return;
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
 */
export function escutarPacientesDoCuidador(cuidadorId, onMudanca) {
  if (!cuidadorId) return () => {};

  const canal = supabase
    .channel(`pacientes_cuidador_${cuidadorId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABELA_CONEXOES },
      (payload) => {
        const linha = payload.new?.cuidador_id ? payload.new : payload.old;
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

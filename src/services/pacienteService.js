import { supabase } from './supabaseClient';
import { somenteDigitos } from '../utils/masks';

const TABELA = 'pacientes';


/**
 * Cria um novo paciente vinculado ao familiar
 */
export async function criarPaciente({
  familiarId,
  nome,
  idade,
  cpf
}) {

  const { data, error } = await supabase
    .from(TABELA)
    .insert([{
      familiar_id: familiarId,
      nome: nome.trim(),
      idade: idade ? Number(idade) : null,
      cpf: somenteDigitos(cpf),
    }])
    .select()
    .single();


  if (error) throw error;

  return data;
}



/**
 * Lista pacientes cadastrados por um familiar
 */
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
 * Lista pacientes que um cuidador acompanha.
 *
 * Fluxo:
 * cuidador
 *    ↓
 * conexoes
 *    ↓
 * familiares
 *    ↓
 * pacientes
 */
export async function listarPacientesPorCuidador(cuidadorId) {


  const { data: conexoes, error: erroConexao } = await supabase
    .from('conexoes')
    .select('familiar_id')
    .eq('cuidador_id', cuidadorId)
    .eq('status', 'ativa');


  if (erroConexao) throw erroConexao;


  if (!conexoes || conexoes.length === 0) {
    return [];
  }


  const familiaresIds = conexoes.map(
    (conexao) => conexao.familiar_id
  );


  const { data, error } = await supabase
    .from(TABELA)
    .select('*')
    .in('familiar_id', familiaresIds)
    .order('created_at', { ascending: true });


  if (error) throw error;


  return data;
}



/**
 * Busca um paciente específico pelo ID
 */
export async function buscarPacientePorId(pacienteId) {

  const { data, error } = await supabase
    .from(TABELA)
    .select('*')
    .eq('id', pacienteId)
    .single();


  if (error) throw error;

  return data;
}



/**
 * Atualiza dados de um paciente
 */
export async function atualizarPaciente(
  pacienteId,
  {
    nome,
    idade,
    cpf
  }
) {

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
 * Remove um paciente
 */
export async function excluirPaciente(pacienteId) {

  const { error } = await supabase
    .from(TABELA)
    .delete()
    .eq('id', pacienteId);


  if (error) throw error;

  return true;
}
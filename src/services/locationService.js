import { supabase } from './supabaseClient'; // Ajuste o caminho do seu cliente Supabase

// Função para o Familiar buscar cuidadores em um raio X
export async function buscarCuidadoresProximos(latitude, longitude, raioMetros = 10000) {
  const { data, error } = await supabase.rpc('buscar_cuidadores_proximos', {
    p_lat: latitude,
    p_lng: longitude,
    p_raio_metros: raioMetros,
  });

  if (error) {
    console.error('Erro ao buscar cuidadores:', error.message);
    throw error;
  }

  return data;
}

// Função para o Cuidador salvar sua localização no banco
export async function atualizarLocalizacaoCuidador(cuidadorId, latitude, longitude) {
  const { error } = await supabase.rpc('atualizar_localizacao_cuidador', {
    p_cuidador_id: cuidadorId,
    p_lat: latitude,
    p_lng: longitude,
  });

  if (error) {
    console.error('Erro ao atualizar posição do cuidador:', error.message);
    throw error;
  }
}
import { supabase } from './supabaseClient'; // Importe seu cliente configurado do Supabase

// Busca o histórico de mensagens
export async function buscarMensagens(cuidadorId) {
  const { data, error } = await supabase
    .from('mensagens')
    .select('*')
    .eq('cuidador_id', cuidadorId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

// Envia uma nova mensagem
export async function enviarMensagemBanco({ cuidadorId, remetenteId, texto }) {
  const { data, error } = await supabase
    .from('mensagens')
    .insert([
      {
        cuidador_id: cuidadorId,
        remetente_id: remetenteId,
        texto: texto,
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
}

// Escuta novas mensagens em tempo real (WebSocket)
export function escutarNovasMensagens(cuidadorId, onNovaMensagem) {
  const canal = supabase
    .channel(`chat_${cuidadorId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'mensagens',
        filter: `cuidador_id=eq.${cuidadorId}`,
      },
      (payload) => {
        onNovaMensagem(payload.new);
      }
    )
    .subscribe();

  // Retorna a função para cancelar a inscrição quando o componente desmontar
  return () => {
    supabase.removeChannel(canal);
  };
}
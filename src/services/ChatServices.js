import { supabase } from './supabaseClient';
import { DomainError } from './errors';

function mensagemErroAmigavel(erro, fallback) {
  if (erro instanceof DomainError) return erro.message;
  const codigo = erro?.code ?? '';
  const mensagem = (erro?.message ?? '').toLowerCase();
  if (codigo === '42501' || mensagem.includes('row-level security') || mensagem.includes('rls')) {
    return 'Não foi possível enviar a mensagem. Verifique sua conexão e tente novamente.';
  }
  return fallback;
}

/**
 * Histórico do par (eu ↔ outro). Schema: remetente_id, destinatario_id, conteudo.
 */
export async function buscarMensagens({ euId, outroId }) {
  const { data, error } = await supabase
    .from('mensagens')
    .select('*')
    .or(
      `and(remetente_id.eq.${euId},destinatario_id.eq.${outroId}),` +
        `and(remetente_id.eq.${outroId},destinatario_id.eq.${euId})`
    )
    .order('created_at', { ascending: true });

  if (error) throw new DomainError(mensagemErroAmigavel(error, 'Erro ao carregar mensagens.'));
  return data ?? [];
}

/**
 * Envia mensagem: remetente_id sempre via auth.getUser().
 */
export async function enviarMensagem({ destinatarioId, conteudo }) {
  const texto = (conteudo || '').trim();
  if (!texto) throw new DomainError('Digite uma mensagem antes de enviar.');
  if (!destinatarioId) throw new DomainError('Destinatário inválido.');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    throw new DomainError('Sessão expirada. Faça login novamente.');
  }

  const { data, error } = await supabase
    .from('mensagens')
    .insert([
      {
        remetente_id: user.id,
        destinatario_id: destinatarioId,
        conteudo: texto,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new DomainError(
      mensagemErroAmigavel(error, 'Não foi possível enviar a mensagem. Tente novamente.')
    );
  }

  return data;
}

/**
 * O `postgres_changes` só entrega eventos se a tabela estiver na publicação
 * `supabase_realtime`. Quando falta essa configuração o canal falha calado e o
 * chat parece "só atualizar ao reabrir a tela" — daí o aviso explícito.
 */
function avisarSeCanalFalhou(status, rotulo) {
  if (status !== 'CHANNEL_ERROR' && status !== 'TIMED_OUT') return;
  console.warn(
    `[Realtime] Canal "${rotulo}" não conectou (${status}). Confirme que a tabela ` +
      '"mensagens" está publicada no Realtime do Supabase (veja docs/DATABASE.md).'
  );
}

function mensagemPertenceAConversa(msg, euId, outroId) {
  if (!msg) return false;
  return (
    (msg.remetente_id === euId && msg.destinatario_id === outroId) ||
    (msg.remetente_id === outroId && msg.destinatario_id === euId)
  );
}

function mensagemEnvolveUsuario(msg, euId) {
  if (!msg) return false;
  return msg.remetente_id === euId || msg.destinatario_id === euId;
}

/**
 * Escuta INSERTs em `mensagens` da conversa aberta (nos dois sentidos).
 *
 * Sem `filter` no servidor: no React Native o filtro `destinatario_id=eq.…`
 * combinado com RLS costuma engolir o evento, e o chat só atualiza ao reabrir
 * a tela. O RLS já limita o que o canal entrega; a conversa é filtrada aqui.
 * Duplicatas (envio otimista + eco do Realtime) são ignoradas pelo hook.
 */
export function escutarNovasMensagens({ euId, outroId }, onNovaMensagem) {
  const canal = supabase
    .channel(`chat_${euId}_${outroId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'mensagens',
      },
      (payload) => {
        if (mensagemPertenceAConversa(payload.new, euId, outroId)) {
          onNovaMensagem(payload.new);
        }
      }
    )
    .subscribe((status) => avisarSeCanalFalhou(status, 'chat'));

  return () => {
    supabase.removeChannel(canal);
  };
}

/**
 * Escuta qualquer mensagem nova em que o usuário participa, para reordenar a
 * lista de conversas enquanto a tela está aberta.
 */
export function escutarConversas(euId, onNovaMensagem) {
  const canal = supabase
    .channel(`conversas_${euId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'mensagens',
      },
      (payload) => {
        if (mensagemEnvolveUsuario(payload.new, euId)) {
          onNovaMensagem(payload.new);
        }
      }
    )
    .subscribe((status) => avisarSeCanalFalhou(status, 'conversas'));

  return () => {
    supabase.removeChannel(canal);
  };
}

/**
 * Lista conversas do usuário (agrupadas pelo outro participante).
 */
export async function listarConversas(euId) {
  const { data: mensagens, error } = await supabase
    .from('mensagens')
    .select('id, conteudo, created_at, remetente_id, destinatario_id')
    .or(`remetente_id.eq.${euId},destinatario_id.eq.${euId}`)
    .order('created_at', { ascending: false });

  if (error) throw new DomainError(mensagemErroAmigavel(error, 'Erro ao carregar conversas.'));
  if (!mensagens?.length) return [];

  const porOutro = new Map();
  for (const msg of mensagens) {
    const outroId = msg.remetente_id === euId ? msg.destinatario_id : msg.remetente_id;
    if (!porOutro.has(outroId)) porOutro.set(outroId, msg);
  }

  const outrosIds = [...porOutro.keys()];
  const [{ data: familiares }, { data: cuidadores }] = await Promise.all([
    supabase.from('familiares').select('id, nome, telefone').in('id', outrosIds),
    supabase.from('cuidadores').select('id, nome, telefone').in('id', outrosIds),
  ]);

  const mapaNomes = new Map();
  for (const f of familiares ?? []) mapaNomes.set(f.id, f);
  for (const c of cuidadores ?? []) mapaNomes.set(c.id, c);

  return outrosIds.map((destinatarioId) => {
    const ultima = porOutro.get(destinatarioId);
    const perfil = mapaNomes.get(destinatarioId);
    return {
      destinatarioId,
      nomeDestinatario: perfil?.nome ?? 'Contato',
      ultimaMensagem: ultima?.conteudo ?? '',
      ultimaMensagemEm: ultima?.created_at ?? null,
    };
  });
}

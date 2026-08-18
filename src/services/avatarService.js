import { supabase } from './supabaseClient';
import { DomainError } from './errors';

const BUCKET = 'avatars';

function extensaoDoArquivo(uri) {
  const limpa = (uri ?? '').split('?')[0];
  const ext = limpa.split('.').pop()?.toLowerCase();
  if (ext === 'png' || ext === 'webp' || ext === 'heic' || ext === 'jpeg') return ext;
  return 'jpg';
}

function contentTypeDaExtensao(ext) {
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'heic') return 'image/heic';
  return 'image/jpeg';
}

/**
 * Envia a foto local para o bucket `avatars` em `{userId}/avatar.{ext}`
 * e devolve a URL pública (com cache-buster para o Image atualizar).
 */
export async function uploadAvatar(userId, uriLocal) {
  if (!userId) throw new DomainError('Sessão expirada. Faça login novamente.');
  if (!uriLocal) throw new DomainError('Nenhuma imagem selecionada.');

  const resposta = await fetch(uriLocal);
  if (!resposta.ok) {
    throw new DomainError('Não foi possível ler a imagem selecionada.');
  }

  const arrayBuffer = await resposta.arrayBuffer();
  const ext = extensaoDoArquivo(uriLocal);
  const caminho = `${userId}/avatar.${ext === 'jpeg' ? 'jpg' : ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(caminho, arrayBuffer, {
    contentType: contentTypeDaExtensao(ext),
    upsert: true,
  });

  if (error) {
    const mensagem = (error.message ?? '').toLowerCase();
    if (mensagem.includes('bucket') || mensagem.includes('not found')) {
      throw new DomainError(
        'O armazenamento de fotos ainda não está configurado. Rode o SQL da seção 6.2 em docs/DATABASE.md.'
      );
    }
    throw new DomainError('Não foi possível enviar a foto. Tente novamente.');
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(caminho);
  if (!data?.publicUrl) {
    throw new DomainError('Foto enviada, mas a URL pública não ficou disponível.');
  }

  return `${data.publicUrl}?t=${Date.now()}`;
}

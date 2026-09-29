// @ts-check

/**
 * Erro de regra de negócio (distinto de erro de rede/infra), para que a UI
 * possa exibir mensagens amigáveis sem precisar conhecer detalhes do Supabase.
 */
export class DomainError extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = 'DomainError';
  }
}

/**
 * Converte qualquer erro (Supabase, rede, DomainError) em uma mensagem em
 * português segura para exibir ao usuário.
 *
 * @param {any} erro
 * @param {string} fallback
 * @returns {string}
 */
export function mensagemErroAmigavel(erro, fallback) {
  if (erro instanceof DomainError) return erro.message;

  const codigo = String(erro?.code ?? '');
  const mensagem = String(erro?.message ?? '').toLowerCase();

  if (codigo === '42501' || mensagem.includes('row-level security') || mensagem.includes('rls')) {
    return 'Você não tem permissão para realizar esta ação.';
  }
  if (codigo === '23505' || mensagem.includes('duplicate key')) {
    return 'Este registro já existe.';
  }
  if (codigo === 'PGRST301' || mensagem.includes('jwt expired') || mensagem.includes('invalid jwt')) {
    return 'Sua sessão expirou. Faça login novamente.';
  }
  if (
    mensagem.includes('network request failed') ||
    mensagem.includes('failed to fetch') ||
    mensagem.includes('network error') ||
    mensagem.includes('timeout')
  ) {
    return 'Sem conexão com o servidor. Verifique sua internet e tente novamente.';
  }
  return fallback;
}

/**
 * Lança um DomainError com mensagem amigável quando o Supabase retornar erro.
 *
 * @param {any} error
 * @param {string} fallback
 * @returns {void}
 */
export function lancarErroSupabase(error, fallback) {
  if (error) throw new DomainError(mensagemErroAmigavel(error, fallback));
}

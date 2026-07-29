/**
 * Erro de regra de negócio (distinto de erro de rede/infra), para que a UI
 * possa exibir mensagens amigáveis sem precisar conhecer detalhes do Supabase.
 */
export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DomainError';
  }
}

/**
 * Tipos (JSDoc) das entidades do Supabase usadas pelo app. Os campos
 * espelham as colunas das tabelas descritas em docs/DATABASE.md.
 */

/**
 * @typedef {Object} Posicao
 * @property {number} latitude
 * @property {number} longitude
 */

/**
 * @typedef {Object} Cuidador
 * @property {string} id
 * @property {string} nome
 * @property {string} [cpf]
 * @property {string} [email]
 * @property {string} [telefone]
 * @property {string | null} [especialidade]
 * @property {string} [codigo]
 * @property {number | null} [latitude]
 * @property {number | null} [longitude]
 * @property {string | null} [foto_url]
 */

/**
 * Linha retornada pela RPC `buscar_cuidadores_proximos`.
 * @typedef {Object} CuidadorProximo
 * @property {string} id
 * @property {string} nome
 * @property {string | null} [especialidade]
 * @property {number} lat
 * @property {number} lng
 * @property {number} [distancia_metros]
 */

/**
 * @typedef {Object} Familiar
 * @property {string} id
 * @property {string} nome
 * @property {string} [cpf]
 * @property {string} [email]
 * @property {string} [telefone]
 * @property {string | null} [foto_url]
 */

/**
 * Idoso com conta própria no app (tabela `idosos`).
 * @typedef {Object} Idoso
 * @property {string} id
 * @property {string} nome
 * @property {string} [cpf]
 * @property {string} [email]
 * @property {string} [telefone]
 * @property {string | null} [contato_emergencia]
 * @property {string | null} [preferencias]
 * @property {string | null} [foto_url]
 */

/**
 * Idoso cadastrado por um familiar (tabela `pacientes`).
 * @typedef {Object} Paciente
 * @property {string} id
 * @property {string} familiar_id
 * @property {string} nome
 * @property {number | null} [idade]
 * @property {string} [cpf]
 * @property {string | null} [alergias]
 * @property {string | null} [tipo_sanguineo]
 * @property {string | null} [contato_emergencia]
 * @property {string | null} [observacoes_medicas]
 * @property {string} [created_at]
 */

/**
 * @typedef {Object} Atividade
 * @property {string} id
 * @property {string} tipo
 * @property {any} conteudo
 * @property {string | null} [paciente_id]
 * @property {string | null} [cuidador_id]
 * @property {string | null} [idoso_id]
 * @property {string | null} [data_referencia]
 * @property {string} [created_at]
 * @property {{ nome: string } | null} [pacientes]
 */

/**
 * @typedef {Object} Conexao
 * @property {string} id
 * @property {string} familiar_id
 * @property {string} cuidador_id
 * @property {'ativa' | 'desfeita'} status
 * @property {string | null} [desfeita_em]
 * @property {Pick<Cuidador, 'id' | 'nome' | 'especialidade' | 'codigo'> | null} [cuidadores]
 */

/**
 * @typedef {Object} Mensagem
 * @property {string} id
 * @property {string} remetente_id
 * @property {string} destinatario_id
 * @property {string} conteudo
 * @property {string} created_at
 */

export {};

/**
 * Tipos de atividade registrados pelo cuidador para um paciente.
 * Centralizado aqui para eliminar o erro de digitação que existia
 * espalhado pelo código antigo ("medicaçao" / "observaçao" sem o "ã").
 */
export const ATIVIDADE_TIPOS = {
  AGENDA: 'agenda',
  RELATORIO: 'relatorio',
  MEDICACAO: 'medicacao',
  OBSERVACAO: 'observacao',
};

export const ATIVIDADE_CONFIG = {
  [ATIVIDADE_TIPOS.AGENDA]: { titulo: 'Calendário de Atividades', icone: 'event', cor: '#4169E1' },
  [ATIVIDADE_TIPOS.RELATORIO]: { titulo: 'Relatório Diário', placeholder: 'Evolução...', icone: 'assessment', cor: '#20B2AA' },
  [ATIVIDADE_TIPOS.MEDICACAO]: { titulo: 'Nova Medicação', placeholder: 'Nome do remédio, dosagem e instruções...', icone: 'healing', cor: '#9370DB' },
  [ATIVIDADE_TIPOS.OBSERVACAO]: { titulo: 'Observação', placeholder: 'Avisos...', icone: 'notification-important', cor: '#FF6347' },
};

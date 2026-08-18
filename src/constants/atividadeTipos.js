/**
 * Tipos de atividade da tabela `atividades`.
 * Usados pelo cuidador (paciente do familiar) e pelo idoso autônomo (própria rotina).
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

/** Categorias da home do Familiar (chips + seções). Ícones/rótulos curtos, sem mudar os forms do cuidador. */
export const FILTRO_TODAS = 'todas';

export const FAMILIAR_CATEGORIAS = [
  { tipo: ATIVIDADE_TIPOS.MEDICACAO, rotulo: 'Medicações', icone: 'medication', cor: '#9370DB' },
  { tipo: ATIVIDADE_TIPOS.AGENDA, rotulo: 'Agenda', icone: 'event', cor: '#4169E1' },
  { tipo: ATIVIDADE_TIPOS.RELATORIO, rotulo: 'Relatórios', icone: 'assignment', cor: '#20B2AA' },
  { tipo: ATIVIDADE_TIPOS.OBSERVACAO, rotulo: 'Observações', icone: 'notes', cor: '#FF6347' },
];

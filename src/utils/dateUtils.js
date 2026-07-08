export const NOMES_DOS_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

/** Quantidade de dias de um mês (mesAtual é 0-indexado, como em Date). */
export function diasNoMes(ano, mesAtual) {
  return new Date(ano, mesAtual + 1, 0).getDate();
}

/** Chave estável para indexar a agenda de um dia específico. */
export function chaveData(ano, mes, dia) {
  return `${ano}-${mes}-${dia}`;
}

export function formatarDataPtBR(date = new Date()) {
  return date.toLocaleDateString('pt-BR');
}

/** Converte ano + mês (0-indexado, como Date) + dia para 'YYYY-MM-DD' (coluna `date` do Postgres). */
export function paraISODate(ano, mesZeroIndexado, dia) {
  const mes = String(mesZeroIndexado + 1).padStart(2, '0');
  const diaFormatado = String(dia).padStart(2, '0');
  return `${ano}-${mes}-${diaFormatado}`;
}

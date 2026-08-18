export const NOMES_DOS_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

/** Quantidade de dias de um mês (mesAtual é 0-indexado, como em Date). */
export function diasNoMes(ano, mesAtual) {
  return new Date(ano, mesAtual + 1, 0).getDate();
}

export function formatarDataPtBR(date = new Date()) {
  return date.toLocaleDateString('pt-BR');
}

/**
 * Formata 'YYYY-MM-DD' como 'DD/MM/AAAA' sem passar por `Date`: interpretar a
 * string como Date a trata como UTC e mostraria o dia anterior no Brasil.
 */
export function formatarISODatePtBR(isoDate) {
  const [ano, mes, dia] = (isoDate ?? '').split('-');
  if (!ano || !mes || !dia) return '';
  return `${dia}/${mes}/${ano}`;
}

/** Hora e minuto de um timestamp ISO (ex.: '14:32'). Usado nos balões do chat. */
export function formatarHoraPtBR(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

/** Data e hora no padrão brasileiro: 'DD/MM/AAAA às HH:mm'. */
export function formatarDataHoraPtBR(iso) {
  if (!iso) return '';
  try {
    const data = new Date(iso);
    const dataFmt = data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const horaFmt = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${dataFmt} às ${horaFmt}`;
  } catch {
    return '';
  }
}

/** Data curta com hora (ex.: '12 de ago. 14:32'). Usado na lista de conversas. */
export function formatarDataHoraCurtaPtBR(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

/** Converte ano + mês (0-indexado, como Date) + dia para 'YYYY-MM-DD' (coluna `date` do Postgres). */
export function paraISODate(ano, mesZeroIndexado, dia) {
  const mes = String(mesZeroIndexado + 1).padStart(2, '0');
  const diaFormatado = String(dia).padStart(2, '0');
  return `${ano}-${mes}-${diaFormatado}`;
}

import { ATIVIDADE_TIPOS, FAMILIAR_CATEGORIAS } from '../constants/atividadeTipos';
import { interpretarMedicacao } from './MedicacaoUtils';
import { formatarDataHoraPtBR, formatarHoraPtBR, formatarISODatePtBR } from './dateUtils';

function parseJsonSeguro(conteudo) {
  if (conteudo && typeof conteudo === 'object') return conteudo;
  if (typeof conteudo !== 'string') return null;
  try {
    return JSON.parse(conteudo);
  } catch {
    return null;
  }
}

function textoDeConteudo(conteudo) {
  if (conteudo == null) return '';
  if (typeof conteudo === 'object') {
    if (conteudo.texto) return String(conteudo.texto);
    if (conteudo.nome) return String(conteudo.nome);
    return Object.values(conteudo)
      .filter((valor) => valor != null && typeof valor !== 'object')
      .join(' • ');
  }
  return String(conteudo);
}

export function categoriaFamiliarDoTipo(tipo) {
  return FAMILIAR_CATEGORIAS.find((categoria) => categoria.tipo === tipo) ?? null;
}

function juntarDataHoraPtBR(dataIsoDate, horaIso) {
  const dataFmt = formatarISODatePtBR(dataIsoDate);
  const horaFmt = formatarHoraPtBR(horaIso);
  if (dataFmt && horaFmt) return `${dataFmt} às ${horaFmt}`;
  return dataFmt || formatarDataHoraPtBR(horaIso);
}

/**
 * Normaliza uma linha da tabela `atividades` para exibição (familiar).
 * Medicação e observação podem vir como JSON string ou objeto; registros
 * antigos de medicação são só o nome do remédio.
 */
export function interpretarAtividade(atividade) {
  const tipo = atividade?.tipo;
  const categoria = categoriaFamiliarDoTipo(tipo);

  const base = {
    id: atividade.id,
    tipo,
    rotulo: categoria?.rotulo ?? 'Atividade',
    icone: categoria?.icone ?? 'notes',
    cor: categoria?.cor ?? '#888',
    nomePaciente: atividade.pacientes?.nome ?? 'Paciente',
    original: atividade,
  };

  if (tipo === ATIVIDADE_TIPOS.MEDICACAO) {
    const med = interpretarMedicacao(atividade);
    return {
      ...base,
      nomeMedicacao: med.nome || '',
      quantidade: med.quantidade || '',
      horario: med.horario || '',
      descricao: [med.nome, med.quantidade, med.horario].filter(Boolean).join(' • '),
      dataExibicao: formatarDataHoraPtBR(atividade.created_at),
    };
  }

  if (tipo === ATIVIDADE_TIPOS.OBSERVACAO) {
    const dados = parseJsonSeguro(atividade.conteudo);
    const categoriaObs = dados?.categoria || '';
    const texto =
      dados?.texto ?? (dados ? textoDeConteudo(dados) : textoDeConteudo(atividade.conteudo));
    return {
      ...base,
      categoriaObservacao: categoriaObs,
      textoObservacao: texto,
      descricao: categoriaObs ? `${categoriaObs}: ${texto}` : texto,
      dataExibicao: formatarDataHoraPtBR(atividade.created_at),
    };
  }

  if (tipo === ATIVIDADE_TIPOS.AGENDA) {
    return {
      ...base,
      descricao: textoDeConteudo(atividade.conteudo),
      dataExibicao: juntarDataHoraPtBR(atividade.data_referencia, atividade.created_at),
    };
  }

  return {
    ...base,
    descricao: textoDeConteudo(atividade.conteudo),
    dataExibicao: formatarDataHoraPtBR(atividade.created_at),
  };
}

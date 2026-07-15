export function interpretarMedicacao(atividade) {
  try {
    const dados = JSON.parse(atividade.conteudo);

    return {
      id: atividade.id,
      nome: dados.nome || 'Medicamento não informado',
      quantidade: dados.quantidade || 'Não informado',
      horario: dados.horario || 'Não informado',
      created_at: atividade.created_at,
    };

  } catch (erro) {

    console.log(
      'Erro ao interpretar medicação:',
      atividade.conteudo
    );

    return {
      id: atividade.id,
      nome: atividade.conteudo,
      quantidade: '',
      horario: '',
      created_at: atividade.created_at,
    };
  }
}
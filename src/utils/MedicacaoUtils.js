export function interpretarMedicacao(atividade) {
  try {
    const dados = JSON.parse(atividade.conteudo);

    return {
      id: atividade.id,
      nome: dados.nome,
      quantidade: dados.quantidade,
      horario: dados.horario,
      titulo: dados.nome,
      subtitulo: `${dados.quantidade} • ${dados.horario}`,
      conteudo: dados.nome,
      original: atividade,
    };
  } catch {
    // Registros antigos gravavam só o nome do remédio, sem JSON.
    return {
      id: atividade.id,
      nome: atividade.conteudo,
      quantidade: '',
      horario: '',
      titulo: atividade.conteudo,
      subtitulo: '',
      conteudo: atividade.conteudo,
      created_at: atividade.created_at,
      original: atividade,
    };
  }
}

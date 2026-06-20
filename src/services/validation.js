export function validarCPF(rawCpf) {
  const cpf = rawCpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  let cpfs = cpf.split('').map(el => +el);
  const rest = (count) => (cpfs.slice(0, count-12).reduce((soma, el, i) => soma + el * (count - i), 0) * 10) % 11 % 10;
  return rest(10) === cpfs[9] && rest(11) === cpfs[10];
}

export const LISTA_ESPECIALIDADES = [
  "Cuidador de Idosos Particular",
  "Técnico em Enfermagem",
  "Enfermeiro(a)",
  "Fisioterapeuta",
  "Nutricionista",
  "Terapeuta Ocupacional",
  "Médico(a) Geriatra",
  "Acompanhante Hospitalar",
  "Outros"
];
import { somenteDigitos } from './masks';

/** Validação de CPF com dígitos verificadores (lógica original preservada). */
export function validarCPF(rawCpf) {
  const cpf = somenteDigitos(rawCpf);
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

  const cpfs = cpf.split('').map((el) => +el);
  const rest = (count) =>
    (cpfs.slice(0, count - 12).reduce((soma, el, i) => soma + el * (count - i), 0) * 10) % 11 % 10;

  return rest(10) === cpfs[9] && rest(11) === cpfs[10];
}

export function validarNomeCompleto(nome) {
  const limpo = (nome || '').trim();
  if (!limpo) return 'Campo obrigatório';
  if (limpo.length < 3) return 'O nome está muito curto';
  return null;
}

export function validarTelefoneObrigatorio(fone) {
  const limpo = somenteDigitos(fone);
  if (!limpo) return 'Campo obrigatório';
  if (limpo.length < 10 || limpo.length > 11) return 'Telefone inválido (deve conter DDD + número)';
  return null;
}

export function validarCPFObrigatorio(cpf) {
  const limpo = somenteDigitos(cpf);
  if (!limpo) return 'Campo obrigatório';
  if (limpo.length !== 11) return 'O CPF deve ter 11 dígitos';
  if (!validarCPF(limpo)) return 'CPF inválido. Digite um CPF verdadeiro';
  return null;
}

export function validarIdadeObrigatoria(idade) {
  const limpo = (idade || '').trim();
  if (!limpo) return 'Campo obrigatório';
  const numero = Number(limpo);
  if (!Number.isInteger(numero) || numero <= 0 || numero > 130) return 'Idade inválida';
  return null;
}

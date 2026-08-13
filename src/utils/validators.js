import { somenteDigitos } from './masks';

/**
 * Com `false`, o formulário aceita qualquer sequência de 11 dígitos (ex.:
 * 111.111.111-11), o que facilita criar contas de teste na demonstração.
 *
 * Os 11 dígitos continuam obrigatórios em qualquer cenário: o login monta o
 * e-mail interno a partir deles e a coluna `cpf` é única no banco.
 */
const EXIGIR_DIGITOS_VERIFICADORES = false;

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

/**
 * Formato mínimo (algo@algo.dominio) sem espaços. A validação de verdade é a
 * entrega do e-mail: é por ele que passa a recuperação de senha.
 */
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validarEmailObrigatorio(email) {
  const limpo = (email || '').trim();
  if (!limpo) return 'Campo obrigatório';
  if (!FORMATO_EMAIL.test(limpo)) return 'E-mail inválido. Ex.: exemplo@email.com';
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
  if (EXIGIR_DIGITOS_VERIFICADORES && !validarCPF(limpo)) {
    return 'CPF inválido. Digite um CPF verdadeiro';
  }
  return null;
}

export function validarIdadeObrigatoria(idade) {
  const limpo = (idade || '').trim();
  if (!limpo) return 'Campo obrigatório';
  const numero = Number(limpo);
  if (!Number.isInteger(numero) || numero <= 0 || numero > 130) return 'Idade inválida';
  return null;
}

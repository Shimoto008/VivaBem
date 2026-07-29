/**
 * Funções puras de formatação de texto (máscaras).
 * Extraídas dos hooks de formulário (antes duplicadas em cada cadastro).
 */
export function aplicarMascaraCPF(texto) {
  let num = texto.replace(/\D/g, '');
  if (num.length > 11) num = num.slice(0, 11);

  if (num.length > 9) num = num.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
  else if (num.length > 6) num = num.replace(/^(\d{3})(\d{3})(\d{1,3})$/, '$1.$2.$3');
  else if (num.length > 3) num = num.replace(/^(\d{3})(\d{1,3})$/, '$1.$2');

  return num;
}

export function aplicarMascaraTelefone(texto) {
  let num = texto.replace(/\D/g, '');
  if (num.length > 11) num = num.slice(0, 11);

  if (num.length > 6) num = num.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  else if (num.length > 2) num = num.replace(/^(\d{2})(\d{1,5})$/, '($1) $2');
  else if (num.length > 0) num = num.replace(/^(\d{1,2})$/, '($1');

  return num;
}

export function somenteDigitos(texto = '') {
  return texto.replace(/\D/g, '');
}

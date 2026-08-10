/**
 * Logos da marca conforme o tema (modo claro / escuro).
 * Requires estáticos evitam flicker e são compatíveis com o Metro bundler.
 */
export const LOGO_CLARO = require('../../assets/VivaBem.png');
export const LOGO_ESCURO = require('../../assets/logo2.png');

export function getLogoSource(isDarkMode) {
  return isDarkMode ? LOGO_ESCURO : LOGO_CLARO;
}

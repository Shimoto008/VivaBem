/**
 * Paleta de cores única do app.
 * Qualquer ajuste de cor deve ser feito SOMENTE aqui — nenhum componente
 * deve ter cores "mágicas" hardcoded (ver regra no README de arquitetura).
 */
export const colors = {
  // Azul Royal — cor principal da marca
  primary: '#4169E1',
  primarySoft: '#4169E115', // fundo suave (ícones, badges)
  primaryBorder: '#4169E133',
  primaryPressed: '#3257C4',

  // Base neutra
  white: '#FFFFFF',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  border: '#E1E8ED',
  divider: '#F1F3F5',

  // Texto
  textPrimary: '#1C1C1E',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textOnPrimary: '#FFFFFF',
  placeholder: '#A1A1A1',

  // Estados semânticos (uso pontual, nunca como cor de base)
  success: '#228B22',
  danger: '#FF3B30',
  warning: '#FF6347',

  disabled: '#C7C7CC',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

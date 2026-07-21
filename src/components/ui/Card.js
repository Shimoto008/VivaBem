import React from 'react';
import { View, StyleSheet } from 'react-native';
import { radius, spacing, shadows } from '../../theme';
import { useTheme } from '../../contexts/ThemeContext';

/** Card padrão: cantos arredondados, sombra suave, espaçamento consistente. */
export function Card({ children, style, padded = true }) {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  return <View style={[styles.base, padded && styles.padding, style]}>{children}</View>;
}

const getStyles = (colors) =>
  StyleSheet.create({
    base: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      ...shadows.card,
    },
    padding: { padding: spacing.lg },
  });

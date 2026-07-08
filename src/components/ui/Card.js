import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadows } from '../../theme';

/** Card padrão: cantos arredondados, sombra suave, espaçamento consistente. */
export function Card({ children, style, padded = true }) {
  return <View style={[styles.base, padded && styles.padding, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadows.card,
  },
  padding: { padding: spacing.lg },
});

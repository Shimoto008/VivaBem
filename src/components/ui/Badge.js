import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { radius, spacing, typography } from '../../theme';
import { useTheme } from '../../contexts/ThemeContext';

export function Badge({ label, tone = 'primary' }) {
  const { themeColors: colors } = useTheme();
  const styles = getStyles(colors);
  const cores = {
    primary: { bg: colors.primarySoft, fg: colors.primary },
    success: { bg: `${colors.success}18`, fg: colors.success },
    warning: { bg: `${colors.warning}18`, fg: colors.warning },
  }[tone] ?? { bg: colors.primarySoft, fg: colors.primary };

  return (
    <View style={[styles.base, { backgroundColor: cores.bg }]}>
      <Text style={[styles.texto, { color: cores.fg }]}>{label}</Text>
    </View>
  );
}

const getStyles = () =>
  StyleSheet.create({
    base: {
      alignSelf: 'flex-start',
      borderRadius: radius.full,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
    },
    texto: { ...typography.caption2 },
  });

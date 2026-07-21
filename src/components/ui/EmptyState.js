import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { spacing, typography } from '../../theme';
import { useTheme } from '../../contexts/ThemeContext';

export function EmptyState({ icon = 'inbox', title, description }) {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  return (
    <View style={styles.container}>
      <MaterialIcons name={icon} size={40} color={themeColors.textTertiary} />
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { alignItems: 'center', paddingVertical: spacing.xxxl, paddingHorizontal: spacing.lg },
    title: { ...typography.bodyBold, color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' },
    description: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.xs, textAlign: 'center' },
  });

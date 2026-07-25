import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../../../../contexts/ThemeContext';
import { spacing, typography } from '../../../../theme';

export function EmptyPacienteMessage() {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  return (
    <View style={styles.container}>
      <MaterialIcons name="person-off" size={40} color={themeColors.textTertiary} />
      <Text style={styles.mensagem}>Nenhum paciente selecionado.</Text>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
      backgroundColor: colors.background,
    },
    mensagem: {
      ...typography.body,
      color: colors.textSecondary,
      marginTop: spacing.md,
      textAlign: 'center',
    },
  });

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { spacing, typography } from '../../theme';
import { useTheme } from '../../contexts/ThemeContext';

/** Cabeçalho padrão de tela, com botão de voltar opcional. */
export function ScreenHeader({ title, subtitle, onBack }) {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  return (
    <View style={styles.container}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} accessibilityRole="button" accessibilityLabel="Voltar" style={styles.botaoVoltar}>
          <MaterialIcons name="arrow-back-ios" size={20} color={themeColors.primary} />
        </TouchableOpacity>
      ) : null}
      <View>
        <Text style={styles.titulo}>{title}</Text>
        {subtitle ? <Text style={styles.subtitulo}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
    botaoVoltar: { marginBottom: spacing.sm, alignSelf: 'flex-start' },
    titulo: { ...typography.title1, color: colors.textPrimary },
    subtitulo: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  });

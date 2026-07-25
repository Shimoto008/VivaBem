import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

import { useTheme } from '../../../../../../contexts/ThemeContext';
import { radius, spacing, typography } from '../../../../../../theme';

export function RelatorioForm({ conteudo, setConteudo, onSalvar, onCancelar, processando }) {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>Descrição do relatório</Text>

      <TextInput
        placeholder="Digite as observações do paciente..."
        placeholderTextColor={themeColors.placeholder}
        value={conteudo}
        onChangeText={setConteudo}
        multiline
        style={styles.campoTexto}
      />

      <TouchableOpacity
        onPress={onSalvar}
        disabled={processando}
        accessibilityRole="button"
        accessibilityLabel="Salvar relatório"
        style={styles.botaoSalvar}
      >
        {processando ? (
          <ActivityIndicator color={themeColors.textOnPrimary} />
        ) : (
          <Text style={styles.textoBotaoSalvar}>Salvar Relatório</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onCancelar}
        accessibilityRole="button"
        accessibilityLabel="Cancelar edição do relatório"
        style={styles.botaoCancelar}
      >
        <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      marginTop: spacing.xl,
      padding: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
    },
    rotulo: { ...typography.bodyBold, color: colors.textPrimary, marginBottom: spacing.sm },
    campoTexto: {
      height: 120,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.sm,
      padding: spacing.md,
      textAlignVertical: 'top',
      color: colors.textPrimary,
    },
    botaoSalvar: {
      backgroundColor: colors.success,
      padding: spacing.lg,
      borderRadius: radius.sm,
      marginTop: spacing.lg,
    },
    textoBotaoSalvar: { ...typography.bodyBold, color: colors.textOnPrimary, textAlign: 'center' },
    botaoCancelar: { marginTop: spacing.md, paddingVertical: spacing.xs },
    textoBotaoCancelar: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  });

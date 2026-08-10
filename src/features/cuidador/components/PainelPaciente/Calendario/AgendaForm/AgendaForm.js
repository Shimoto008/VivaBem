import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import { useTheme } from '../../../../../../contexts/ThemeContext';
import { radius, shadows, spacing, typography } from '../../../../../../theme';

export function AgendaForm({
  titulo,
  textoBotao,
  conteudo,
  setConteudo,
  data,
  onSalvar,
  onCancelar,
  processando,
}) {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>

      <Text style={styles.rotuloData}>Data selecionada:</Text>
      <Text style={styles.data}>{data}</Text>

      <TextInput
        placeholder="Descrição da atividade"
        placeholderTextColor={themeColors.placeholder}
        value={conteudo}
        onChangeText={setConteudo}
        multiline
        style={styles.campoDescricao}
      />

      <View style={styles.acoes}>
        <TouchableOpacity
          onPress={onCancelar}
          accessibilityRole="button"
          accessibilityLabel="Cancelar edição da atividade"
          style={styles.botaoCancelar}
        >
          <Text style={styles.textoCancelar}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSalvar}
          disabled={processando}
          accessibilityRole="button"
          accessibilityLabel={textoBotao}
          accessibilityState={{ disabled: processando }}
          style={[styles.botaoSalvar, processando && styles.botaoSalvarDesabilitado]}
        >
          <Text style={styles.textoSalvar}>{processando ? 'Salvando...' : textoBotao}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.lg,
      marginBottom: spacing.xl,
      ...shadows.card,
    },
    titulo: { ...typography.title1, color: colors.textPrimary, marginBottom: spacing.lg },
    rotuloData: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.sm },
    data: { ...typography.bodyBold, color: colors.textPrimary, marginBottom: spacing.lg },
    campoDescricao: {
      ...typography.body,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.sm,
      padding: spacing.md,
      minHeight: 100,
      textAlignVertical: 'top',
      color: colors.textPrimary,
    },
    acoes: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.lg,
    },
    botaoCancelar: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
    textoCancelar: { ...typography.body, color: colors.textPrimary },
    botaoSalvar: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xxl,
      paddingVertical: spacing.lg,
      borderRadius: radius.sm,
    },
    botaoSalvarDesabilitado: { opacity: 0.6 },
    textoSalvar: { ...typography.bodyBold, color: colors.textOnPrimary },
  });

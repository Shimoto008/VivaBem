import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

import { useTheme } from '../../../../../../contexts/ThemeContext';
import { radius, shadows, spacing, typography } from '../../../../../../theme';

const CATEGORIAS = ['Saúde', 'Humor', 'Alimentação', 'Sono', 'Outros'];

export function ObservacaoForm({
  categoria,
  texto,
  setCategoria,
  setTexto,
  onSalvar,
  onCancelar,
  processando,
}) {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nova Observação</Text>

      <Text style={styles.rotulo}>Categoria</Text>

      <View style={styles.listaCategorias}>
        {CATEGORIAS.map((item) => {
          const selecionada = categoria === item;

          return (
            <TouchableOpacity
              key={item}
              onPress={() => setCategoria(item)}
              accessibilityRole="button"
              accessibilityLabel={`Selecionar categoria ${item}`}
              style={[
                styles.chip,
                { backgroundColor: selecionada ? themeColors.primary : themeColors.divider },
              ]}
            >
              <Text
                style={[
                  styles.textoChip,
                  { color: selecionada ? themeColors.textOnPrimary : themeColors.textPrimary },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TextInput
        placeholder="Digite a observação..."
        placeholderTextColor={themeColors.placeholder}
        value={texto}
        onChangeText={setTexto}
        multiline
        style={styles.campoTexto}
      />

      <View style={styles.rodape}>
        <TouchableOpacity
          onPress={onCancelar}
          accessibilityRole="button"
          accessibilityLabel="Cancelar observação"
          style={styles.botaoCancelar}
        >
          <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSalvar}
          disabled={processando}
          accessibilityRole="button"
          accessibilityLabel="Salvar observação"
          style={styles.botaoSalvar}
        >
          {processando ? (
            <ActivityIndicator color={themeColors.textOnPrimary} />
          ) : (
            <Text style={styles.textoBotaoSalvar}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: radius.md,
      ...shadows.card,
      marginBottom: spacing.xl,
    },
    titulo: { ...typography.title2, color: colors.textPrimary, marginBottom: spacing.lg },
    rotulo: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.sm },
    listaCategorias: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    chip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.xl,
    },
    textoChip: { ...typography.body },
    campoTexto: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.sm,
      padding: spacing.md,
      minHeight: 120,
      textAlignVertical: 'top',
      color: colors.textPrimary,
    },
    rodape: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.lg,
    },
    botaoCancelar: { paddingVertical: spacing.md, paddingHorizontal: spacing.xs },
    textoBotaoCancelar: { ...typography.body, color: colors.textPrimary },
    botaoSalvar: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xxl,
      paddingVertical: spacing.md,
      borderRadius: radius.sm,
    },
    textoBotaoSalvar: { ...typography.bodyBold, color: colors.textOnPrimary },
  });

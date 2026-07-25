import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../../../../../../contexts/ThemeContext';
import { radius, shadows, spacing, typography } from '../../../../../../theme';

export function RelatorioCard({ relatorio, onEditar, onExcluir }) {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  return (
    <View style={styles.container}>
      <View style={styles.linha}>
        <View style={styles.info}>
          <View style={styles.tituloLinha}>
            <MaterialIcons name="description" size={20} color={themeColors.primary} />
            <Text style={styles.titulo}>Relatório</Text>
          </View>
          <Text style={styles.conteudo}>{relatorio.conteudo}</Text>
        </View>

        <View style={styles.acoes}>
          <TouchableOpacity
            onPress={onEditar}
            accessibilityRole="button"
            accessibilityLabel="Editar relatório"
          >
            <MaterialIcons name="edit" size={24} color={themeColors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onExcluir}
            accessibilityRole="button"
            accessibilityLabel="Excluir relatório"
          >
            <MaterialIcons name="delete-outline" size={24} color={themeColors.danger} />
          </TouchableOpacity>
        </View>
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
      marginTop: spacing.md,
      ...shadows.card,
    },
    linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    info: { flex: 1 },
    tituloLinha: { flexDirection: 'row', alignItems: 'center' },
    titulo: { ...typography.title2, color: colors.textPrimary, marginLeft: spacing.sm },
    conteudo: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm },
    acoes: { flexDirection: 'row', gap: spacing.md, marginLeft: spacing.sm },
  });

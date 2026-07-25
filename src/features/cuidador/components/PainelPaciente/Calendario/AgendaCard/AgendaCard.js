import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../../../../../../contexts/ThemeContext';
import { radius, shadows, spacing, typography } from '../../../../../../theme';
import { formatarISODatePtBR } from '../../../../../../utils/dateUtils';

export function AgendaCard({ atividade, onEditar, onExcluir }) {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <View style={styles.info}>
          <View style={styles.tituloLinha}>
            <MaterialIcons name="event" size={20} color={themeColors.primary} />
            <Text style={styles.titulo}>Atividade</Text>
          </View>

          <Text style={styles.conteudo}>{atividade.conteudo}</Text>
          <Text style={styles.data}>{formatarISODatePtBR(atividade.data_referencia)}</Text>
        </View>

        <View style={styles.acoesIcones}>
          <TouchableOpacity
            onPress={onEditar}
            accessibilityRole="button"
            accessibilityLabel="Editar atividade"
          >
            <MaterialIcons name="edit" size={24} color={themeColors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onExcluir}
            accessibilityRole="button"
            accessibilityLabel="Excluir atividade"
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
      borderRadius: radius.md,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...shadows.card,
    },
    topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    info: { flex: 1 },
    tituloLinha: { flexDirection: 'row', alignItems: 'center' },
    titulo: { ...typography.title2, color: colors.textPrimary, marginLeft: spacing.sm },
    conteudo: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm },
    data: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.xs },
    acoesIcones: { flexDirection: 'row', gap: spacing.md },
  });

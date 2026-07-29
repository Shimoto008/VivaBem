import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../../../../../../contexts/ThemeContext';
import { radius, shadows, spacing, typography } from '../../../../../../theme';

export function MedicacaoCard({ medicacao, lembreteAtivo, onLembrete, onEditar, onExcluir }) {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  const textoLembrete = lembreteAtivo
    ? `Lembrete diário às ${medicacao.horario}`
    : 'Configurar lembrete';

  return (
    <View style={styles.card}>
      <View style={styles.cabecalho}>
        <View style={styles.info}>
          <View style={styles.nomeLinha}>
            <MaterialIcons name="medication" size={20} color={themeColors.primary} />
            <Text style={styles.nome}>{medicacao.nome}</Text>
          </View>

          <Text style={styles.detalhe}>Quantidade: {medicacao.quantidade}</Text>

          <Text style={styles.detalheSecundario}>Horário: {medicacao.horario}</Text>
        </View>

        <View style={styles.acoes}>
          <TouchableOpacity
            onPress={onEditar}
            accessibilityRole="button"
            accessibilityLabel={`Editar medicação ${medicacao.nome}`}
          >
            <MaterialIcons name="edit" size={24} color={themeColors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onExcluir}
            accessibilityRole="button"
            accessibilityLabel={`Excluir medicação ${medicacao.nome}`}
          >
            <MaterialIcons name="delete-outline" size={24} color={themeColors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.rodape}>
        <TouchableOpacity
          onPress={onLembrete}
          accessibilityRole="switch"
          accessibilityLabel={
            lembreteAtivo
              ? `Desativar lembrete de ${medicacao.nome}`
              : `Configurar lembrete para ${medicacao.nome}`
          }
          accessibilityState={{ checked: !!lembreteAtivo }}
          style={[styles.botaoLembrete, lembreteAtivo && styles.botaoLembreteAtivo]}
        >
          <View style={styles.conteudoLembrete}>
            <MaterialIcons
              name={lembreteAtivo ? 'notifications-active' : 'notifications-none'}
              size={20}
              color={lembreteAtivo ? themeColors.primary : themeColors.textOnPrimary}
            />

            <Text style={[styles.textoLembrete, lembreteAtivo && styles.textoLembreteAtivo]}>
              {textoLembrete}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...shadows.card,
    },
    cabecalho: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    info: { flex: 1 },
    nomeLinha: { flexDirection: 'row', alignItems: 'center' },
    nome: { ...typography.title2, color: colors.textPrimary, marginLeft: spacing.sm },
    detalhe: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm },
    detalheSecundario: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
    acoes: { flexDirection: 'row', gap: spacing.md },
    rodape: { flexDirection: 'row', marginTop: spacing.lg },
    botaoLembrete: {
      flex: 1,
      padding: spacing.md,
      borderRadius: radius.sm,
      backgroundColor: colors.primary,
      alignItems: 'center',
    },
    botaoLembreteAtivo: {
      backgroundColor: colors.primarySoft,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    conteudoLembrete: { flexDirection: 'row', alignItems: 'center' },
    textoLembrete: { ...typography.bodyBold, color: colors.textOnPrimary, marginLeft: spacing.sm },
    textoLembreteAtivo: { color: colors.primary },
  });

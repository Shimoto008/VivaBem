import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../../../../../contexts/ThemeContext';
import { radius, spacing, typography } from '../../../../../theme';

export function CalendarioAgenda({
  mesAtual,
  anoAtual,
  diaSelecionado,
  nomesDosMeses,
  quantidadeDiasNoMes,
  irParaMesAnterior,
  irParaMesSeguinte,
  onSelecionarDia,
  diasComAtividade,
}) {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  const dias = Array.from({ length: quantidadeDiasNoMes }, (_, indice) => indice + 1);

  return (
    <View style={styles.container}>
      <View style={styles.headerNavegacao}>
        <TouchableOpacity
          onPress={irParaMesAnterior}
          accessibilityRole="button"
          accessibilityLabel="Ir para o mês anterior"
          style={styles.botaoSeta}
        >
          <MaterialIcons name="chevron-left" size={28} color={themeColors.primary} />
        </TouchableOpacity>

        <Text style={styles.mesTitulo}>
          {nomesDosMeses[mesAtual]} {anoAtual}
        </Text>

        <TouchableOpacity
          onPress={irParaMesSeguinte}
          accessibilityRole="button"
          accessibilityLabel="Ir para o próximo mês"
          style={styles.botaoSeta}
        >
          <MaterialIcons name="chevron-right" size={28} color={themeColors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.diasGrid}>
        {dias.map((dia) => {
          const temCompromisso = diasComAtividade.has(dia);
          const selecionado = dia === diaSelecionado;

          return (
            <TouchableOpacity
              key={dia}
              style={[
                styles.dia,
                selecionado && styles.diaSelecionado,
                temCompromisso && !selecionado && styles.diaComInfo,
              ]}
              onPress={() => onSelecionarDia(dia)}
              accessibilityRole="button"
              accessibilityLabel={`Dia ${dia}${temCompromisso ? ', com compromisso' : ''}`}
              accessibilityState={{ selected: selecionado }}
            >
              <Text style={[styles.diaTexto, selecionado && styles.diaTextoSelecionado]}>{dia}</Text>
              {temCompromisso && <View style={styles.pontoIndicador} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    headerNavegacao: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
      paddingHorizontal: spacing.sm,
    },
    botaoSeta: { padding: spacing.xs, justifyContent: 'center', alignItems: 'center' },
    mesTitulo: { ...typography.title3, color: colors.textPrimary },
    diasGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
    dia: {
      width: '13.5%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0.7%',
      borderRadius: radius.sm,
      backgroundColor: colors.divider,
    },
    diaSelecionado: { backgroundColor: colors.primary },
    diaComInfo: {
      backgroundColor: colors.primarySoft,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
    },
    diaTexto: { ...typography.caption, fontWeight: '500', color: colors.textPrimary },
    diaTextoSelecionado: { color: colors.white, fontWeight: '700' },
    pontoIndicador: {
      width: 4,
      height: 4,
      borderRadius: radius.full,
      backgroundColor: colors.warning,
      position: 'absolute',
      bottom: spacing.xs,
    },
  });

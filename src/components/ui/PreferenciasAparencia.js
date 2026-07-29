import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { radius, shadows, spacing, typography } from '../../theme';
import { useTheme } from '../../contexts/ThemeContext';
import { OPCOES_CORES_APP } from '../../constants/coresApp';

const COR_TRILHA_DESLIGADA = '#767577';

/**
 * Bloco "Aparência e Preferências" compartilhado pelas telas de perfil do
 * cuidador e do familiar: alterna o modo escuro e troca a cor de destaque.
 */
export function PreferenciasAparencia() {
  const { isDarkMode, toggleDarkMode, primaryColor, setPrimaryColor, themeColors } = useTheme();
  const styles = getStyles(themeColors);

  return (
    <View style={styles.card}>
      <View style={styles.linhaOpcao}>
        <View style={styles.linhaEsquerda}>
          <Ionicons name="moon-outline" size={22} color={themeColors.textPrimary} />
          <Text style={styles.opcaoTexto}>Modo Escuro</Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: COR_TRILHA_DESLIGADA, true: primaryColor }}
          accessibilityLabel="Alternar modo escuro"
        />
      </View>

      <View style={styles.divisor} />

      <Text style={styles.subtemaTexto}>Cor do Aplicativo</Text>
      <View style={styles.listaCores}>
        {OPCOES_CORES_APP.map((cor) => {
          const selecionada = primaryColor === cor.hex;
          return (
            <TouchableOpacity
              key={cor.id}
              onPress={() => setPrimaryColor(cor.hex)}
              accessibilityRole="button"
              accessibilityLabel={`Usar a cor ${cor.nome}`}
              accessibilityState={{ selected: selecionada }}
              style={[styles.bolaCor, { backgroundColor: cor.hex }, selecionada && styles.bolaCorSelecionada]}
            >
              {selecionada ? <MaterialIcons name="check" size={16} color={themeColors.white} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: radius.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    linhaOpcao: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.xs,
    },
    linhaEsquerda: { flexDirection: 'row', alignItems: 'center' },
    opcaoTexto: { ...typography.bodyBold, color: colors.textPrimary, marginLeft: spacing.md },
    subtemaTexto: { ...typography.caption, fontWeight: '600', color: colors.textSecondary },
    divisor: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.md },
    listaCores: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: spacing.md,
    },
    bolaCor: {
      width: 36,
      height: 36,
      borderRadius: radius.full,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bolaCorSelecionada: {
      borderWidth: 3,
      borderColor: colors.surface,
      ...shadows.card,
    },
  });

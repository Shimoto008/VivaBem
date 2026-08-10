import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../../theme';
import { useTheme } from '../../contexts/ThemeContext';

const FAMILIAS_DE_ICONE = { MaterialIcons, FontAwesome5 };

/**
 * Barra de abas inferior reutilizável — usada em HomeCuidador e HomeFamiliar
 * (antes era markup duplicado dentro de cada tela).
 * tabs: [{ key, label, icon, iconFamily, size? }]
 *
 * Usa `useSafeAreaInsets` para somar um respiro extra igual à área ocupada
 * pelos botões/gestos do sistema (Android/iOS), evitando que a barra fique
 * colada ou escondida atrás da navegação do aparelho.
 */
export function BottomTabBar({ tabs, abaAtiva, onSelect }) {
  const insets = useSafeAreaInsets();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  return (
    <View style={[styles.container, { paddingBottom: spacing.sm + insets.bottom }]}>
      {tabs.map((tab) => {
        const IconeComponente = FAMILIAS_DE_ICONE[tab.iconFamily] ?? MaterialIcons;
        const ativa = abaAtiva === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.item}
            onPress={() => onSelect(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativa }}
            accessibilityLabel={tab.label}
          >
            <IconeComponente name={tab.icon} size={tab.size ?? 26} color={ativa ? themeColors.primary : themeColors.textSecondary} />
            <Text style={[styles.label, ativa && styles.labelAtivo]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      paddingVertical: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      justifyContent: 'space-around',
    },
    item: { alignItems: 'center', flex: 1 },
    label: { fontSize: 11, color: colors.textSecondary, marginTop: 4 },
    labelAtivo: { color: colors.primary, fontWeight: '600' },
  });

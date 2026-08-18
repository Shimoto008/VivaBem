import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { spacing, typography, touchMin } from '../../theme';
import { useTheme } from '../../contexts/ThemeContext';
import { AvatarPerfil } from './AvatarPerfil';

/** Cabeçalho padrão de tela, com botão de voltar e avatar opcionais. */
export function ScreenHeader({ title, subtitle, onBack, avatarUri, mostrarAvatar = false }) {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  return (
    <View style={styles.container}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} accessibilityRole="button" accessibilityLabel="Voltar" style={styles.botaoVoltar}>
          <MaterialIcons name="arrow-back-ios" size={20} color={themeColors.primary} />
        </TouchableOpacity>
      ) : null}
      <View style={styles.linha}>
        {mostrarAvatar ? (
          <View style={styles.avatarWrap}>
            <AvatarPerfil uri={avatarUri} size={44} iconName="person" iconSize={20} />
          </View>
        ) : null}
        <View style={styles.textos}>
          <Text style={styles.titulo}>{title}</Text>
          {subtitle ? <Text style={styles.subtitulo}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
    botaoVoltar: {
      marginBottom: spacing.sm,
      alignSelf: 'flex-start',
      minWidth: touchMin,
      minHeight: touchMin,
      justifyContent: 'center',
    },
    linha: { flexDirection: 'row', alignItems: 'center' },
    avatarWrap: { marginRight: spacing.md },
    textos: { flex: 1 },
    titulo: { ...typography.title1, color: colors.textPrimary },
    subtitulo: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  });

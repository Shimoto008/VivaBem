import React, { useState } from 'react';
import { Text, Alert, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { radius, spacing, typography } from '../../theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useSession } from '../../contexts/SessionContext';

/**
 * Encerramento de sessão com confirmação, compartilhado pelas telas de perfil.
 * Chama `deslogar` do SessionContext — a navegação reage sozinha à sessão nula.
 */
export function BotaoLogout() {
  const { deslogar } = useSession();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  const [saindo, setSaindo] = useState(false);

  function confirmarSaida() {
    Alert.alert('Sair da Conta', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          setSaindo(true);
          try {
            await deslogar();
          } catch {
            Alert.alert('Erro ao sair', 'Não foi possível encerrar a sessão. Tente novamente.');
          } finally {
            setSaindo(false);
          }
        },
      },
    ]);
  }

  return (
    <TouchableOpacity
      onPress={confirmarSaida}
      activeOpacity={0.8}
      disabled={saindo}
      accessibilityRole="button"
      accessibilityLabel="Sair da conta"
      accessibilityState={{ busy: saindo }}
      style={styles.botao}
    >
      {saindo ? (
        <ActivityIndicator color={themeColors.danger} />
      ) : (
        <>
          <MaterialIcons name="logout" size={20} color={themeColors.danger} />
          <Text style={styles.texto}>Sair da Conta</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    botao: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
      borderRadius: radius.md,
      marginTop: spacing.md,
      marginBottom: spacing.xxxl,
      backgroundColor: `${colors.danger}18`,
    },
    texto: {
      ...typography.title3,
      color: colors.danger,
      marginLeft: spacing.sm,
    },
  });

import React, { useState } from 'react';
import { Text, Alert, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { radius, spacing, typography } from '../../theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useSession } from '../../contexts/SessionContext';

/**
 * Exclusão permanente da conta (exigência da Google Play para apps com cadastro).
 * Pede confirmação em dois passos e chama `excluirConta` do SessionContext.
 */
export function BotaoExcluirConta() {
  const { excluirConta } = useSession();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  const [excluindo, setExcluindo] = useState(false);

  function pedirSegundaConfirmacao() {
    Alert.alert(
      'Confirmar exclusão',
      'Esta ação não pode ser desfeita. Seu cadastro, vínculos e dados de acompanhamento serão apagados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir definitivamente',
          style: 'destructive',
          onPress: executarExclusao,
        },
      ]
    );
  }

  function confirmarExclusao() {
    Alert.alert(
      'Excluir minha conta',
      'Quer apagar sua conta e todos os dados associados? Você será desconectado em seguida.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          style: 'destructive',
          onPress: () => setTimeout(pedirSegundaConfirmacao, 300),
        },
      ]
    );
  }

  async function executarExclusao() {
    setExcluindo(true);
    try {
      await excluirConta();
    } catch (erro) {
      Alert.alert(
        'Não foi possível excluir a conta',
        erro?.message ||
          'Tente novamente. Se o erro persistir, rode no Supabase o SQL da função excluir_minha_conta (docs/DATABASE.md).'
      );
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <TouchableOpacity
      onPress={confirmarExclusao}
      activeOpacity={0.8}
      disabled={excluindo}
      accessibilityRole="button"
      accessibilityLabel="Excluir minha conta"
      accessibilityState={{ busy: excluindo }}
      style={styles.botao}
    >
      {excluindo ? (
        <ActivityIndicator color={themeColors.danger} />
      ) : (
        <>
          <MaterialIcons name="delete-forever" size={22} color={themeColors.danger} />
          <Text style={styles.texto}>Excluir minha conta</Text>
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
      minHeight: 52,
      padding: spacing.lg,
      borderRadius: radius.md,
      marginTop: spacing.sm,
      marginBottom: spacing.xxxl,
      borderWidth: 1.5,
      borderColor: `${colors.danger}55`,
    },
    texto: {
      ...typography.title3,
      color: colors.danger,
      marginLeft: spacing.sm,
    },
  });

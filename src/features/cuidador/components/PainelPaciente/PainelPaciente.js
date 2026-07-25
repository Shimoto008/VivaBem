import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { getStyles } from '../../screens/HomeCuidador.styles';
import { useAtividadesPaciente } from '../../hooks/useAtividadesPaciente';
import { ATIVIDADE_TIPOS } from '../../../../constants/atividadeTipos';
import { useTheme } from '../../../../contexts/ThemeContext';
import { radius, spacing, typography } from '../../../../theme';

export function PainelPaciente({ idoso, cuidadorId, onFechar }) {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  const stylesLocais = getStylesLocais(themeColors);
  const { atividades, carregando } = useAtividadesPaciente(idoso.id, cuidadorId);

  const resumo = useMemo(() => {
    return {
      medicacoes: atividades.filter((item) => item.tipo === ATIVIDADE_TIPOS.MEDICACAO).length,
      relatorios: atividades.filter((item) => item.tipo === ATIVIDADE_TIPOS.RELATORIO).length,
      totalAtividades: atividades.length,
    };
  }, [atividades]);

  return (
    <View style={styles.containerAcoes}>
      <View style={styles.topoAcoes}>
        <Text style={styles.tituloAcoes}>Resumo do paciente</Text>

        <TouchableOpacity
          onPress={onFechar}
          accessibilityRole="button"
          accessibilityLabel="Fechar resumo do paciente"
        >
          <MaterialIcons name="close" size={22} color={themeColors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={stylesLocais.cartao}>
        <Text style={stylesLocais.nome}>{idoso.nome}</Text>

        <Text style={stylesLocais.idade}>
          {idoso.idade ? `Idade: ${idoso.idade} anos` : 'Idade não informada'}
        </Text>

        {carregando ? (
          <ActivityIndicator
            size="large"
            color={themeColors.primary}
            style={stylesLocais.carregando}
          />
        ) : (
          <>
            <View style={stylesLocais.linhaResumo}>
              <MaterialIcons name="medication" size={18} color={themeColors.textSecondary} />
              <Text style={stylesLocais.textoResumo}>Medicações: {resumo.medicacoes}</Text>
            </View>

            <View style={stylesLocais.linhaResumo}>
              <MaterialIcons name="description" size={18} color={themeColors.textSecondary} />
              <Text style={stylesLocais.textoResumo}>Relatórios: {resumo.relatorios}</Text>
            </View>

            <View style={stylesLocais.linhaResumo}>
              <MaterialIcons name="event" size={18} color={themeColors.textSecondary} />
              <Text style={stylesLocais.textoResumo}>
                Atividades registradas: {resumo.totalAtividades}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const getStylesLocais = (colors) =>
  StyleSheet.create({
    cartao: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: radius.md,
    },
    nome: { ...typography.title1, color: colors.textPrimary },
    idade: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm },
    linhaResumo: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
    textoResumo: { ...typography.body, color: colors.textSecondary, marginLeft: spacing.sm },
    carregando: { marginTop: spacing.lg, alignSelf: 'flex-start' },
  });

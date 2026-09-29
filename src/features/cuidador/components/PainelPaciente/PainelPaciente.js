import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { getStyles } from '../../screens/HomeCuidador.styles';
import { useAtividadesPaciente } from '../../hooks/useAtividadesPaciente';
import { AtividadesFamiliarList } from '../../../familiar/components/AtividadesFamiliarList';
import { ATIVIDADE_TIPOS } from '../../../../constants/atividadeTipos';
import { useTheme } from '../../../../contexts/ThemeContext';
import { radius, spacing, typography } from '../../../../theme';

export function PainelPaciente({ idoso, cuidadorId, onFechar, modo = 'completo' }) {
  const { themeColors } = useTheme();
  const styles = useMemo(() => getStyles(themeColors), [themeColors]);
  const stylesLocais = getStylesLocais(themeColors);
  const { atividades, carregando, erro } = useAtividadesPaciente(idoso.id, cuidadorId);
  const mostrarResumo = modo !== 'atividades';
  const mostrarAtividades = modo !== 'resumo';

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
        <Text style={styles.tituloAcoes}>
          {mostrarResumo ? 'Resumo do paciente' : 'Atividades do paciente'}
        </Text>

        <TouchableOpacity
          onPress={onFechar}
          accessibilityRole="button"
          accessibilityLabel={mostrarResumo ? 'Fechar resumo do paciente' : 'Fechar atividades do paciente'}
        >
          <MaterialIcons name="close" size={22} color={themeColors.textSecondary} />
        </TouchableOpacity>
      </View>

      {mostrarResumo ? (
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
      ) : null}

      {mostrarAtividades ? (
        <View style={mostrarResumo ? stylesLocais.atividades : null}>
          <AtividadesFamiliarList
            vinculado
            atividades={atividades}
            carregando={carregando}
            erro={erro}
            tituloSecao="O que o paciente tem para fazer"
            esconderNomePaciente
            sempreMostrarCategorias
            emptyCategoriaVazia="Nenhuma atividade cadastrada nesta categoria."
            emptyFiltroSemAtividades={{
              title: 'Nenhuma atividade nesta categoria',
              description: 'Quando algo for cadastrado para este paciente, aparecerá aqui.',
            }}
          />
        </View>
      ) : null}
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
    atividades: { marginTop: spacing.lg },
  });

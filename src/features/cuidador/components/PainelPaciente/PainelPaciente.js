import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { getStyles } from '../../screens/HomeCuidador.styles';
import { useAtividadesPaciente } from '../../hooks/useAtividadesPaciente';
import { ATIVIDADE_TIPOS } from '../../../../constants/atividadeTipos';
import { useTheme } from '../../../../contexts/ThemeContext';

export function PainelPaciente({ idoso, cuidadorId, onFechar }) {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  const { atividades } = useAtividadesPaciente(idoso.id, cuidadorId);

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

        <TouchableOpacity onPress={onFechar}>
          <MaterialIcons name="close" size={22} color={themeColors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: themeColors.surface,
          padding: 15,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: themeColors.textPrimary }}>{idoso.nome}</Text>

        <Text style={{ marginTop: 8, color: themeColors.textSecondary }}>Idade: {idoso.idade} anos</Text>
        <Text style={{ marginTop: 8, color: themeColors.textSecondary }}>💊 Medicações: {resumo.medicacoes}</Text>
        <Text style={{ marginTop: 8, color: themeColors.textSecondary }}>📄 Relatórios: {resumo.relatorios}</Text>
        <Text style={{ marginTop: 8, color: themeColors.textSecondary }}>📅 Atividades registradas: {resumo.totalAtividades}</Text>
      </View>
    </View>
  );
}

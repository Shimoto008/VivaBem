import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { styles } from '../../screens/HomeCuidador.styles';
import { useAtividadesPaciente } from '../../hooks/useAtividadesPaciente';
import { ATIVIDADE_TIPOS } from '../../../../constants/atividadeTipos';

export function PainelPaciente({ idoso, cuidadorId, onFechar }) {
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
          <MaterialIcons name="close" size={22} color="#666" />
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: '#fff',
          padding: 15,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{idoso.nome}</Text>

        <Text style={{ marginTop: 8 }}>Idade: {idoso.idade} anos</Text>
        <Text style={{ marginTop: 8 }}>💊 Medicações: {resumo.medicacoes}</Text>
        <Text style={{ marginTop: 8 }}>📄 Relatórios: {resumo.relatorios}</Text>
        <Text style={{ marginTop: 8 }}>📅 Atividades registradas: {resumo.totalAtividades}</Text>
      </View>
    </View>
  );
}

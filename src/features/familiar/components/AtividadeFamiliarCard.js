import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '../../../components/ui';
import { ATIVIDADE_TIPOS } from '../../../constants/atividadeTipos';
import { interpretarAtividade } from '../../../utils/atividadeUtils';

function LinhaDado({ rotulo, valor, styles }) {
  if (!valor) return null;
  return (
    <View style={styles.atividadeDadoLinha}>
      <Text style={styles.atividadeDadoRotulo}>{rotulo}</Text>
      <Text style={styles.atividadeDadoValor}>{valor}</Text>
    </View>
  );
}

export function AtividadeFamiliarCard({ atividade, styles, esconderNomePaciente = false }) {
  const item = interpretarAtividade(atividade);

  return (
    <Card style={[styles.atividadeCard, styles.atividadeBorda, { borderLeftColor: item.cor }]}>
      <View style={styles.atividadeHeader}>
        <View style={styles.atividadeTipoLinha}>
          <MaterialIcons name={item.icone} size={18} color={item.cor} />
          <Text style={[styles.atividadeTipo, { color: item.cor }]}>{item.rotulo}</Text>
        </View>
        <Text style={styles.atividadeData}>{item.dataExibicao}</Text>
      </View>
      {esconderNomePaciente ? null : (
        <Text style={styles.atividadePaciente}>{item.nomePaciente}</Text>
      )}

      {item.tipo === ATIVIDADE_TIPOS.MEDICACAO ? (
        <View style={styles.atividadeDetalhes}>
          <LinhaDado rotulo="Remédio" valor={item.nomeMedicacao} styles={styles} />
          <LinhaDado rotulo="Dosagem" valor={item.quantidade} styles={styles} />
          <LinhaDado rotulo="Horário" valor={item.horario} styles={styles} />
        </View>
      ) : item.tipo === ATIVIDADE_TIPOS.OBSERVACAO ? (
        <View style={styles.atividadeDetalhes}>
          {item.categoriaObservacao ? (
            <Text style={[styles.atividadeCategoriaObs, { color: item.cor }]}>
              {item.categoriaObservacao}
            </Text>
          ) : null}
          <Text style={styles.atividadeConteudo}>{item.textoObservacao || item.descricao}</Text>
        </View>
      ) : (
        <Text style={styles.atividadeConteudo}>{item.descricao}</Text>
      )}
    </Card>
  );
}

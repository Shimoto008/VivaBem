import React from 'react';
import { View, Text } from 'react-native';

import { styles } from '../../HomeCuidador.styles';
import CardAtividade from './CardAtividade';

export function HistoricoAtividades({
  atividades,
  onEditar,
}) {
  if (atividades.length === 0) {
    return null;
  }

  return (
    <View style={styles.containerHistoricoLabels}>
      <Text style={styles.tituloLinhaTempo}>
        Atividades Cadastradas
      </Text>

      {atividades.map((atividade) => (
        <CardAtividade
          key={atividade.id}
          atividade={atividade}
          onEditar={onEditar}
        />
      ))}
    </View>
  );
}
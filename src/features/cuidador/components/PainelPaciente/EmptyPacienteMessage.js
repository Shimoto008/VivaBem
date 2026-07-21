import React from 'react';
import { View, Text } from 'react-native';

const emptyStateStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

export function EmptyPacienteMessage() {
  return (
    <View style={emptyStateStyle}>
      <Text>Nenhum paciente selecionado.</Text>
    </View>
  );
}

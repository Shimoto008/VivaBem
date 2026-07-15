import React from 'react';
import { View, Text } from 'react-native';

export function ListaAtividades({ itens }) {
  if (itens.length === 0) {
    return <Text>Nenhuma medicação cadastrada.</Text>;
  }

  return (
    <View>
      {itens.map((item) => (
        <View
          key={item.id}
          style={{
            padding: 15,
            backgroundColor: '#f5f5f5',
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <Text>💊 {item.conteudo}</Text>
        </View>
      ))}
    </View>
  );
}

import React from 'react';
import { View, Text } from 'react-native';
import { IdosoCard } from '../IdosoCard/IdosoCard';

export function ListaIdosos({
  idosos,
  onEditar,
  onExcluir,
  onConectar,
}) {
  if (idosos.length === 0) {
    return (
      <View
        style={{
          marginTop: 20,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#777',
            fontSize: 16,
          }}
        >
          Nenhum idoso cadastrado.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 20 }}>
      {idosos.map((idoso) => (
        <IdosoCard
          key={idoso.id}
          idoso={idoso}
          onEditar={() => onEditar(idoso)}
          onExcluir={() => onExcluir(idoso)}
          onConectar={() => onConectar(idoso)}
        />
      ))}
    </View>
  );
}
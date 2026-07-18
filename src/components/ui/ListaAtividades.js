import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function ListaAtividades({
  itens,
  onEditar,
}) {
  if (itens.length === 0) {
    return (
      <Text>Nenhuma medicação cadastrada.</Text>
    );
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
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 8,
            }}
          >
            💊 {item.nome}
          </Text>

          <Text>
            Quantidade: {item.quantidade}
          </Text>

          <Text>
            Horário: {item.horario}
          </Text>

          <TouchableOpacity
            onPress={() => onEditar(item)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-end',
              marginTop: 12,
            }}
          >
            <MaterialIcons
              name="edit"
              size={20}
              color="#2E7D32"
            />

            <Text
              style={{
                marginLeft: 5,
                color: '#2E7D32',
                fontWeight: 'bold',
              }}
            >
              Editar
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
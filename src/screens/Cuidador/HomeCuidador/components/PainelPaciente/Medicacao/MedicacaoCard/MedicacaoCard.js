import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../../../../theme';

export function MedicacaoCard({ medicacao, onLembrete, onEditar }) {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            💊 {medicacao.nome}
          </Text>

          <Text
            style={{
              marginTop: 8,
              color: '#666',
            }}
          >
            Quantidade: {medicacao.quantidade}
          </Text>

          <Text
            style={{
              marginTop: 4,
              color: '#666',
            }}
          >
            Horário: {medicacao.horario}
          </Text>
        </View>

        <MaterialIcons name="medication" size={35} color={colors.primary} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginTop: 15,
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={onLembrete}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            backgroundColor: colors.primary,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
            }}
          >
            🔔 Lembrete
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onEditar}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.primary,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: colors.primary,
              fontWeight: 'bold',
            }}
          >
            Editar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

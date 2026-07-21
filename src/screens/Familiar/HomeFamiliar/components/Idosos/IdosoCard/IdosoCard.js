import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../../../theme';

export function IdosoCard({ idoso, onConectarCuidador, onExcluir }) {
  return (
    <View
      style={{
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <FontAwesome5 name="user-injured" size={24} color={colors.primary} />
        <View style={{ marginLeft: 15 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{idoso.nome}</Text>
          <Text style={{ color: '#666', fontSize: 14 }}>{idoso.idade} anos • CPF: {idoso.cpf}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Botão de Conectar Cuidador */}
        <TouchableOpacity onPress={onConectarCuidador} style={{ padding: 8 }}>
          <MaterialIcons name="person-add" size={22} color={colors.primary} />
        </TouchableOpacity>

        {/* Botão de Excluir */}
        <TouchableOpacity onPress={onExcluir} style={{ padding: 8 }}>
          <MaterialIcons name="delete-outline" size={22} color="#E53935" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
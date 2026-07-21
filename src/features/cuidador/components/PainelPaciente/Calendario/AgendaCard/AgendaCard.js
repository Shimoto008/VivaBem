import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../../../contexts/ThemeContext';

export function AgendaCard({
  atividade,
  onEditar,
  onExcluir,
}) {
  const { themeColors: colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
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
          alignItems: 'flex-start',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.textPrimary,
            }}
          >
            📅 Atividade
          </Text>

          <Text
            style={{
              marginTop: 8,
              color: colors.textSecondary,
            }}
          >
            {atividade.conteudo}
          </Text>

          <Text
            style={{
              marginTop: 6,
              color: colors.textTertiary,
            }}
          >
            {atividade.data_referencia}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 12,
          }}
        >
          <TouchableOpacity onPress={onEditar}>
            <MaterialIcons
              name="edit"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onExcluir}>
            <MaterialIcons
              name="delete-outline"
              size={24}
              color={colors.danger}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={onExcluir}
        style={{
          marginTop: 15,
          borderWidth: 1,
          borderColor: colors.danger,
          borderRadius: 8,
          padding: 10,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: colors.danger,
            fontWeight: 'bold',
          }}
        >
          Excluir
        </Text>
      </TouchableOpacity>
    </View>
  );
}

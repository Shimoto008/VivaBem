import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../../../contexts/ThemeContext';

export function MedicacaoCard({ medicacao, onLembrete, onEditar, onExcluir }) {
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
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.textPrimary,
            }}
          >
            💊 {medicacao.nome}
          </Text>

          <Text
            style={{
              marginTop: 8,
              color: colors.textSecondary,
            }}
          >
            Quantidade: {medicacao.quantidade}
          </Text>

          <Text
            style={{
              marginTop: 4,
              color: colors.textSecondary,
            }}
          >
            Horário: {medicacao.horario}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 12,
          }}
        >
          <TouchableOpacity onPress={onEditar}>
            <MaterialIcons name="edit" size={24} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onExcluir}>
            <MaterialIcons name="delete-outline" size={24} color={colors.danger} />
          </TouchableOpacity>
        </View>
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
            padding: 12,
            borderRadius: 8,
            backgroundColor: colors.primary,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <MaterialIcons name="notifications-active" size={20} color={colors.textOnPrimary} />

            <Text
              style={{
                color: colors.textOnPrimary,
                fontWeight: 'bold',
                marginLeft: 8,
              }}
            >
              Configurar lembrete
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onExcluir}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.danger,
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
    </View>
  );
}

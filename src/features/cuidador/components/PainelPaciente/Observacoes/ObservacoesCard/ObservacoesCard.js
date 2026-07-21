import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../../../contexts/ThemeContext';

export function ObservacaoCard({
  observacao,
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

        <View
          style={{
            flex: 1,
          }}
        >

          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.textPrimary,
            }}
          >
            📝 {observacao.categoria}
          </Text>


          <Text
            style={{
              marginTop: 10,
              color: colors.textSecondary,
              lineHeight: 20,
            }}
          >
            {observacao.texto}
          </Text>


          <Text
            style={{
              marginTop: 10,
              color: colors.textTertiary,
              fontSize: 12,
            }}
          >
            {observacao.data}
          </Text>


        </View>


        <View
          style={{
            flexDirection: 'row',
            gap: 12,
            marginLeft: 10,
          }}
        >

          <TouchableOpacity
            onPress={onEditar}
          >

            <MaterialIcons
              name="edit"
              size={24}
              color={colors.primary}
            />

          </TouchableOpacity>


          <TouchableOpacity
            onPress={onExcluir}
          >

            <MaterialIcons
              name="delete-outline"
              size={24}
              color={colors.danger}
            />

          </TouchableOpacity>


        </View>


      </View>



      <View
        style={{
          marginTop: 15,
          padding: 10,
          borderRadius: 8,
          backgroundColor: colors.background,
        }}
      >

        <Text
          style={{
            fontSize: 13,
            color: colors.textSecondary,
          }}
        >
          Categoria: {observacao.categoria}
        </Text>


      </View>


    </View>
  );
}

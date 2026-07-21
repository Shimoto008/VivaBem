import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../../../contexts/ThemeContext';

export function RelatorioCard({
  relatorio,
  onEditar,
  onExcluir,
}) {
  const { themeColors: colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        padding: 15,
        borderRadius: 12,
        marginTop: 12,
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
            📄 Relatório
          </Text>


          <Text
            style={{
              marginTop: 10,
              color: colors.textSecondary,
            }}
          >
            {relatorio.conteudo}
          </Text>


        </View>


        <View
          style={{
            flexDirection: 'row',
            gap: 10,
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


    </View>
  );
}

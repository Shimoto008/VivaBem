import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../../../../contexts/ThemeContext';

export function ObservacaoForm({
  categoria,
  texto,
  setCategoria,
  setTexto,
  onSalvar,
  onCancelar,
  processando,
}) {
  const { themeColors: colors } = useTheme();

  const categorias = [
    'Saúde',
    'Humor',
    'Alimentação',
    'Sono',
    'Outros',
  ];


  return (
    <View
      style={{
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 12,
        elevation: 3,
        marginBottom: 20,
      }}
    >

      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 15,
          color: colors.textPrimary,
        }}
      >
        Nova Observação
      </Text>


      <Text
        style={{
          marginBottom: 10,
          color: colors.textSecondary,
        }}
      >
        Categoria
      </Text>


      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 15,
        }}
      >

        {categorias.map((item) => (

          <TouchableOpacity
            key={item}
            onPress={() => setCategoria(item)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor:
                categoria === item
                  ? colors.primary
                  : colors.divider,
            }}
          >

            <Text
              style={{
                color:
                  categoria === item
                    ? colors.textOnPrimary
                    : colors.textPrimary,
              }}
            >
              {item}
            </Text>

          </TouchableOpacity>

        ))}

      </View>


      <TextInput
        placeholder="Digite a observação..."
        placeholderTextColor={colors.placeholder}
        value={texto}
        onChangeText={setTexto}
        multiline
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          padding: 12,
          minHeight: 120,
          textAlignVertical: 'top',
          color: colors.textPrimary,
        }}
      />


      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 15,
        }}
      >

        <TouchableOpacity
          onPress={onCancelar}
        >
          <Text style={{ color: colors.textPrimary }}>
            Cancelar
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={onSalvar}
          disabled={processando}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 25,
            paddingVertical: 12,
            borderRadius: 10,
          }}
        >

          <Text
            style={{
              color: colors.textOnPrimary,
              fontWeight: 'bold',
            }}
          >
            {processando ? 'Salvando...' : 'Salvar'}
          </Text>


        </TouchableOpacity>


      </View>


    </View>
  );
}

import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../../../contexts/ThemeContext';

export function AgendaForm({
  titulo,
  textoBotao,
  conteudo,
  setConteudo,
  data,
  onSalvar,
  onCancelar,
  processando,
}) {
  const { themeColors: colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        elevation: 3,
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
        {titulo}
      </Text>

      <Text
        style={{
          color: colors.textSecondary,
          marginBottom: 10,
        }}
      >
        Data selecionada:
      </Text>

      <Text
        style={{
          marginBottom: 15,
          fontWeight: 'bold',
          color: colors.textPrimary,
        }}
      >
        {data}
      </Text>

      <TextInput
        placeholder="Descrição da atividade"
        placeholderTextColor={colors.placeholder}
        value={conteudo}
        onChangeText={setConteudo}
        multiline
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          padding: 12,
          minHeight: 100,
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
          style={{
            padding: 15,
          }}
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
            paddingVertical: 15,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: colors.textOnPrimary,
              fontWeight: 'bold',
            }}
          >
            {processando ? 'Salvando...' : textoBotao}
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../../../contexts/ThemeContext';

export function RelatorioForm({
  conteudo,
  setConteudo,
  onSalvar,
  onCancelar,
  processando,
}) {
  const { themeColors: colors } = useTheme();

  return (
    <View
      style={{
        marginTop: 20,
        padding: 15,
        backgroundColor: colors.surface,
        borderRadius: 12,
      }}
    >

      <Text
        style={{
          fontWeight: 'bold',
          marginBottom: 8,
          color: colors.textPrimary,
        }}
      >
        Descrição do relatório
      </Text>


      <TextInput
        placeholder="Digite as observações do paciente..."
        placeholderTextColor={colors.placeholder}
        value={conteudo}
        onChangeText={setConteudo}
        multiline
        style={{
          height: 120,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          padding: 10,
          textAlignVertical: 'top',
          color: colors.textPrimary,
        }}
      />


      <TouchableOpacity
        onPress={onSalvar}
        disabled={processando}
        style={{
          backgroundColor: colors.success,
          padding: 14,
          borderRadius: 10,
          marginTop: 15,
        }}
      >

        <Text
          style={{
            color: colors.textOnPrimary,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {processando ? 'Salvando...' : 'Salvar Relatório'}
        </Text>

      </TouchableOpacity>


      <TouchableOpacity
        onPress={onCancelar}
        style={{
          marginTop: 10,
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            color: colors.textSecondary,
          }}
        >
          Cancelar
        </Text>
      </TouchableOpacity>


    </View>
  );
}

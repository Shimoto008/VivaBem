import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

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
  return (
    <View
      style={{
        backgroundColor: '#fff',
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
        }}
      >
        {titulo}
      </Text>

      <Text
        style={{
          color: '#666',
          marginBottom: 10,
        }}
      >
        Data selecionada:
      </Text>

      <Text
        style={{
          marginBottom: 15,
          fontWeight: 'bold',
        }}
      >
        {data}
      </Text>

      <TextInput
        placeholder="Descrição da atividade"
        value={conteudo}
        onChangeText={setConteudo}
        multiline
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 10,
          padding: 12,
          minHeight: 100,
          textAlignVertical: 'top',
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
          <Text>
            Cancelar
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={onSalvar}
          disabled={processando}
          style={{
            backgroundColor: '#0e40ca',
            paddingHorizontal: 25,
            paddingVertical: 15,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: '#fff',
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
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';


export function RelatorioForm({
  conteudo,
  setConteudo,
  onSalvar,
  onCancelar,
  processando
}) {

  return (
    <View
      style={{
        marginTop:20,
        padding:15,
        backgroundColor:'#fff',
        borderRadius:12
      }}
    >

      <Text
        style={{
          fontWeight:'bold',
          marginBottom:8
        }}
      >
        Descrição do relatório
      </Text>


      <TextInput
        placeholder="Digite as observações do paciente..."
        value={conteudo}
        onChangeText={setConteudo}
        multiline
        style={{
          height:120,
          borderWidth:1,
          borderColor:'#ccc',
          borderRadius:10,
          padding:10,
          textAlignVertical:'top'
        }}
      />


      <TouchableOpacity
        onPress={onSalvar}
        disabled={processando}
        style={{
          backgroundColor:'#2E7D32',
          padding:14,
          borderRadius:10,
          marginTop:15
        }}
      >

        <Text
          style={{
            color:'#fff',
            textAlign:'center',
            fontWeight:'bold'
          }}
        >
          {processando ? 'Salvando...' : 'Salvar Relatório'}
        </Text>

      </TouchableOpacity>


      <TouchableOpacity
        onPress={onCancelar}
        style={{
          marginTop:10
        }}
      >
        <Text
          style={{
            textAlign:'center',
            color:'#666'
          }}
        >
          Cancelar
        </Text>
      </TouchableOpacity>


    </View>
  );
}
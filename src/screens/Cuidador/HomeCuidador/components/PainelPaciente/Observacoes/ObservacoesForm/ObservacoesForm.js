import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';


export function ObservacaoForm({
  categoria,
  texto,
  setCategoria,
  setTexto,
  onSalvar,
  onCancelar,
  processando,
}) {

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
        backgroundColor:'#fff',
        padding:16,
        borderRadius:12,
        elevation:3,
        marginBottom:20,
      }}
    >

      <Text
        style={{
          fontSize:20,
          fontWeight:'bold',
          marginBottom:15,
        }}
      >
        Nova Observação
      </Text>


      <Text
        style={{
          marginBottom:10,
          color:'#666'
        }}
      >
        Categoria
      </Text>


      <View
        style={{
          flexDirection:'row',
          flexWrap:'wrap',
          gap:8,
          marginBottom:15
        }}
      >

        {categorias.map((item)=>(

          <TouchableOpacity
            key={item}
            onPress={()=>setCategoria(item)}
            style={{
              paddingHorizontal:12,
              paddingVertical:8,
              borderRadius:20,
              backgroundColor:
                categoria === item
                ? '#0e40ca'
                : '#eee'
            }}
          >

            <Text
              style={{
                color:
                  categoria === item
                  ? '#fff'
                  : '#333'
              }}
            >
              {item}
            </Text>

          </TouchableOpacity>

        ))}

      </View>


      <TextInput
        placeholder="Digite a observação..."
        value={texto}
        onChangeText={setTexto}
        multiline
        style={{
          borderWidth:1,
          borderColor:'#ddd',
          borderRadius:10,
          padding:12,
          minHeight:120,
          textAlignVertical:'top'
        }}
      />


      <View
        style={{
          flexDirection:'row',
          justifyContent:'space-between',
          marginTop:15
        }}
      >

        <TouchableOpacity
          onPress={onCancelar}
        >
          <Text>
            Cancelar
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={onSalvar}
          disabled={processando}
          style={{
            backgroundColor:'#0e40ca',
            paddingHorizontal:25,
            paddingVertical:12,
            borderRadius:10
          }}
        >

          <Text
            style={{
              color:'#fff',
              fontWeight:'bold'
            }}
          >
            {processando ? 'Salvando...' : 'Salvar'}
          </Text>


        </TouchableOpacity>


      </View>


    </View>
  );
}
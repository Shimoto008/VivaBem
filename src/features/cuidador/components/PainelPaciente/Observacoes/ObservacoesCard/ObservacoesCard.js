import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../../../theme';


export function ObservacaoCard({
  observacao,
  onEditar,
  onExcluir,
}) {

  return (
    <View
      style={{
        backgroundColor:'#fff',
        borderRadius:12,
        padding:16,
        marginBottom:12,
        elevation:3,
      }}
    >

      <View
        style={{
          flexDirection:'row',
          justifyContent:'space-between',
          alignItems:'flex-start',
        }}
      >

        <View
          style={{
            flex:1,
          }}
        >

          <Text
            style={{
              fontSize:18,
              fontWeight:'bold',
            }}
          >
            📝 {observacao.categoria}
          </Text>


          <Text
            style={{
              marginTop:10,
              color:'#555',
              lineHeight:20,
            }}
          >
            {observacao.texto}
          </Text>


          <Text
            style={{
              marginTop:10,
              color:'#888',
              fontSize:12,
            }}
          >
            {observacao.data}
          </Text>


        </View>


        <View
          style={{
            flexDirection:'row',
            gap:12,
            marginLeft:10,
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
              color="#D32F2F"
            />

          </TouchableOpacity>


        </View>


      </View>



      <View
        style={{
          marginTop:15,
          padding:10,
          borderRadius:8,
          backgroundColor:'#f5f5f5',
        }}
      >

        <Text
          style={{
            fontSize:13,
            color:'#666',
          }}
        >
          Categoria: {observacao.categoria}
        </Text>


      </View>


    </View>
  );
}
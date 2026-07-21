import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../../../../theme';


export function RelatorioCard({
  relatorio,
  onEditar,
  onExcluir,
}) {

  return (
    <View
      style={{
        backgroundColor:'#fff',
        padding:15,
        borderRadius:12,
        marginTop:12,
        elevation:3,
      }}
    >

      <View
        style={{
          flexDirection:'row',
          justifyContent:'space-between',
          alignItems:'center'
        }}
      >

        <View
          style={{
            flex:1
          }}
        >

          <Text
            style={{
              fontSize:18,
              fontWeight:'bold'
            }}
          >
            📄 Relatório
          </Text>


          <Text
            style={{
              marginTop:10,
              color:'#555'
            }}
          >
            {relatorio.conteudo}
          </Text>


        </View>


        <View
          style={{
            flexDirection:'row',
            gap:10
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
              color="#D32F2F"
            />
          </TouchableOpacity>


        </View>


      </View>


    </View>
  );
}
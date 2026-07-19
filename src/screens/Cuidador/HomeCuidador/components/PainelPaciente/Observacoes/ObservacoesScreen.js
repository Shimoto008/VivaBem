import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useAtividadesPaciente } from '../../../../../../hooks/useAtividadesPaciente';
import { ATIVIDADE_TIPOS } from '../../../../../../constants/atividadeTipos';

import { ObservacaoForm } from './ObservacoesForm/ObservacoesForm';
import { ObservacaoCard } from './ObservacoesCard/ObservacoesCard';

export default function ObservacoesScreen({ route }) {

  const idoso = route?.params?.idoso;
  const cuidadorId = route?.params?.cuidadorId;


  const [novaObservacao, setNovaObservacao] = useState(false);

  const [categoria, setCategoria] = useState('');

  const [texto, setTexto] = useState('');



  if (!idoso) {

    return (

      <View
        style={{
          flex:1,
          justifyContent:'center',
          alignItems:'center'
        }}
      >

        <Text>
          Nenhum paciente selecionado.
        </Text>

      </View>

    );

  }



  const {
    atividades,
    salvar,
    excluir,
    iniciarEdicao,
    cancelarEdicao,
    itemEmEdicao,
    processando,

  } = useAtividadesPaciente(
    idoso.id,
    cuidadorId
  );



  const observacoes = useMemo(()=>{

    return atividades

      .filter(
        item =>
          item.tipo === ATIVIDADE_TIPOS.OBSERVACAO
      )

      .map(item=>{

        const dados = JSON.parse(item.conteudo);


        return {

          id:item.id,

          categoria:dados.categoria,

          texto:dados.texto,

          data:item.created_at,

          original:item,

        };

      });


  },[atividades]);




  function editarObservacao(item){

    setCategoria(item.categoria);

    setTexto(item.texto);


    iniciarEdicao(
      item.original
    );


    setNovaObservacao(true);

  }




  async function salvarObservacao(){


    if(
      !categoria ||
      !texto.trim()
    ){

      Alert.alert(
        'Atenção',
        'Preencha categoria e observação.'
      );

      return;

    }



    const observacao = JSON.stringify({

      categoria,

      texto:texto.trim(),

    });



    await salvar(

      ATIVIDADE_TIPOS.OBSERVACAO,

      observacao,

      null

    );



    cancelarEdicao();


    setCategoria('');

    setTexto('');

    setNovaObservacao(false);


  }




  function excluirObservacao(item){


    Alert.alert(

      'Excluir observação',

      'Deseja realmente excluir esta observação?',

      [

        {
          text:'Cancelar',
          style:'cancel'
        },


        {

          text:'Excluir',

          style:'destructive',

          onPress:()=>{

            excluir(
              item.original.id
            );

          }

        }

      ]

    );


  }




  return (

    <View
      style={{
        flex:1,
        padding:20
      }}
    >


      <Text
        style={{
          fontSize:24,
          fontWeight:'bold'
        }}
      >

        Observações

      </Text>



      <Text
        style={{
          marginTop:5,
          marginBottom:20,
          color:'#666'
        }}
      >

        Paciente: {idoso.nome}

      </Text>




      <TouchableOpacity

        onPress={()=>{

          setCategoria('');

          setTexto('');

          setNovaObservacao(true);

        }}

        style={{
          backgroundColor:'#0e40ca',
          padding:15,
          borderRadius:10,
          alignItems:'center',
          marginBottom:20
        }}

      >

        <Text
          style={{
            color:'#fff',
            fontWeight:'bold'
          }}
        >

          + Nova Observação

        </Text>


      </TouchableOpacity>





      {
        novaObservacao && (

          <ObservacaoForm

            categoria={categoria}

            texto={texto}

            setCategoria={setCategoria}

            setTexto={setTexto}


            onSalvar={salvarObservacao}


            onCancelar={()=>{

              cancelarEdicao();

              setCategoria('');

              setTexto('');

              setNovaObservacao(false);

            }}


            processando={processando}

          />

        )
      }






      <Text

        style={{
          fontSize:18,
          fontWeight:'bold',
          marginBottom:10
        }}

      >

        Histórico de observações

      </Text>




      {
        observacoes.length === 0 ?

        (

          <Text
            style={{
              color:'#777'
            }}
          >

            Nenhuma observação cadastrada.

          </Text>

        )

        :

        (

          observacoes.map(item=>(

            <ObservacaoCard

              key={item.id}

              observacao={item}

              onEditar={()=>editarObservacao(item)}

              onExcluir={()=>excluirObservacao(item)}

            />

          ))

        )

      }



    </View>

  );

}
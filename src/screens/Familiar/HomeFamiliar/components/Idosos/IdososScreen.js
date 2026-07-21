import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import { colors } from '../../../../../theme';
import { ScreenHeader } from '../../../../../components/ui';

import { CadastroIdosoForm } from './CadastroIdosoForm/CadastroIdosoForm';
import { useCadastroPacienteForm } from '../../../../../hooks/useCadastroPacienteForm';
import { useSession } from '../../../../../contexts/SessionContext';

export default function IdososScreen() {
  const { familiar } = useSession();

  // Estado para armazenar a lista de idosos para teste local
  const [idosos, setIdosos] = useState([
    { id: '1', nome: 'Idoso de Teste', idade: '78', cpf: '123.456.789-00' }
  ]);
  const [idosoSelecionado, setIdosoSelecionado] = useState(null);

  // Função executada ao clicar no botão "Cadastrar Idoso" do formulário
  const handleCadastrarIdoso = async (dadosIdoso) => {
    try {
      const novoIdoso = {
        id: String(Date.now()),
        nome: dadosIdoso.nome || nome,
        idade: dadosIdoso.idade || idade,
        cpf: dadosIdoso.cpf || cpf,
        familiar_id: familiar?.id,
      };

      // Adiciona na lista local na hora para você testar sem depender do banco
      setIdosos((prev) => [...prev, novoIdoso]);
      Alert.alert('Sucesso', 'Idoso cadastrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar idoso');
    }
  };

  // Instancia o hook de cadastro exatamente como usávamos no ResumoTab
  const {
    nome,
    setNome,
    idade,
    setIdade,
    cpf,
    alterarCpf,
    erros,
    enviando,
    salvar,
  } = useCadastroPacienteForm(handleCadastrarIdoso);

  // Alterna a seleção do idoso ao clicar na lista (igual ao ResumoTab)
  const selecionarPaciente = (idoso) => {
    if (idosoSelecionado?.id === idoso.id) {
      setIdosoSelecionado(null); // Fecha se já estiver aberto
    } else {
      setIdosoSelecionado(idoso); // Abre os detalhes
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background || '#F5F5F5' }}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        title="Cadastro de Idosos"
        subtitle="Cadastre o idoso e acompanhe as informações"
      />

      {/* 1. FORMULÁRIO DE CADASTRO SEMPRE VISÍVEL PARA TESTAR */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 5 }}>
        Novo Cadastro
      </Text>
      
      <CadastroIdosoForm
        nome={nome}
        setNome={setNome}
        idade={idade}
        setIdade={setIdade}
        cpf={cpf}
        alterarCpf={alterarCpf}
        erros={erros}
        enviando={enviando}
        onSalvar={salvar}
      />

      {/* 2. LISTA DE IDOSOS NO ESTILO DO RESUMOTAB */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 25, marginBottom: 15 }}>
        Idosos Cadastrados ({idosos.length})
      </Text>

      {idosos.map((idoso) => (
        <View
          key={idoso.id}
          style={{
            backgroundColor: '#FFF',
            borderRadius: 12,
            marginBottom: 10,
            overflow: 'hidden',
            elevation: 2,
          }}
        >
          {/* Item da Lista Clicável */}
          <TouchableOpacity
            style={{
              padding: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onPress={() => selecionarPaciente(idoso)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <FontAwesome5 name="user-injured" size={24} color={colors.primary} />
              <View style={{ marginLeft: 15 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{idoso.nome}</Text>
                <Text style={{ color: '#666', fontSize: 13 }}>
                  {idoso.idade ? `${idoso.idade} anos` : 'Idade não informada'}
                </Text>
              </View>
            </View>

            <MaterialIcons
              name={idosoSelecionado?.id === idoso.id ? 'expand-less' : 'expand-more'}
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>

          {/* Conteúdo Expandido (Painel do Idoso ao Clicar) */}
          {idosoSelecionado?.id === idoso.id && (
            <View
              style={{
                padding: 15,
                backgroundColor: '#F9F9F9',
                borderTopWidth: 1,
                borderTopColor: '#EEE',
              }}
            >
              <Text style={{ fontWeight: 'bold', color: '#444' }}>Dados do Paciente:</Text>
              <Text style={{ color: '#666', marginTop: 4 }}>CPF: {idoso.cpf || 'Não informado'}</Text>
              <Text style={{ color: '#666', marginTop: 2 }}>ID do Registro: {idoso.id}</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
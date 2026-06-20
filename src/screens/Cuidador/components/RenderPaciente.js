import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import styles from "../HomeCuidador/Style";
import { PainelPaciente } from './PainelPaciente';

export function RenderPaciente({ controlador }) {
  const {
    listaPacientes,
    pacienteSelecionado, setPacienteSelecionado,
    exibirFormCadastro, setExibirFormCadastro,
    setSubAtividadeAtiva,
    nomeIdoso, setNomeIdoso,
    idadeIdoso, setIdadeIdoso,
    cpfIdoso, setCpfIdoso,
    handleCadastrarIdoso
  } = controlador;

  return (
    <View style={styles.containerAbas}>
      <TouchableOpacity 
        style={styles.btnToggleCadastro} 
        onPress={() => setExibirFormCadastro(!exibirFormCadastro)}
      >
        <MaterialIcons name={exibirFormCadastro ? "remove-circle-outline" : "add-circle-outline"} size={28} color="#4169E1" />
        <Text style={styles.txtToggleCadastro}>Cadastrar Novo Idoso</Text>
      </TouchableOpacity>
      
      {exibirFormCadastro && (
        <View style={styles.formulario}>
          <TextInput style={styles.input} placeholder="Nome Completo" value={nomeIdoso} onChangeText={setNomeIdoso} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextInput style={[styles.input, { width: '30%' }]} placeholder="Idade" keyboardType="numeric" value={idadeIdoso} onChangeText={setIdadeIdoso} />
            <TextInput style={[styles.input, { width: '65%' }]} placeholder="CPF" keyboardType="numeric" maxLength={14} value={cpfIdoso} onChangeText={setCpfIdoso} />
          </View>
          <TouchableOpacity style={styles.btnSalvar} onPress={handleCadastrarIdoso}>
            <Text style={styles.btnSalvarTexto}>Finalizar Cadastro</Text>
          </TouchableOpacity>
        </View>
      )}

      {listaPacientes.map((idoso) => (
        <View key={idoso.id} style={styles.wrapperPaciente}>
          <TouchableOpacity 
            style={styles.itemListaPaciente} 
            onPress={() => { 
              setPacienteSelecionado(pacienteSelecionado?.id === idoso.id ? null : idoso); 
              setSubAtividadeAtiva(null); 
            }}
          >
            <FontAwesome5 name="user-injured" size={24} color="#4169E1" />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{idoso.nome}</Text>
            </View>
            <MaterialIcons name={pacienteSelecionado?.id === idoso.id ? "expand-less" : "expand-more"} size={24} color="#4169E1" />
          </TouchableOpacity>

          {pacienteSelecionado?.id === idoso.id && (
            <PainelPaciente idoso={pacienteSelecionado} controlador={controlador} />
          )}
        </View>
      ))}
    </View>
  );
}
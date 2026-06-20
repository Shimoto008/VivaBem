import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { 
  Text, 
  View, 
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard, Modal, FlatList
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

import styles from "./Style";
import { supabase } from "../../services/supabase";
import { CadastroCuidador } from "./CadastroCuidador";
import { validarCPF, LISTA_ESPECIALIDADES } from "../../services/validation";

export default function Cuidador() {
  const {
    name, fone, cpf, especialidade, outraEspecialidade, mostrarModal, erros,
    setEspecialidade, setMostrarModal, setErros,
    lidarComCPF, lidarComTelefone, limparErroDoCampo, salvarCuidador
  } = CadastroCuidador();

  return (
    <KeyboardAwareScrollView
      style={styles.containerScroll}
      contentContainerStyle={styles.contentScroll}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
      enableOnAndroid={true}
      extraScrollHeight={100} 
      keyboardShouldPersistTaps="handled"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.viewPrincipal}>
          
          <Image style={styles.img} source={require('../../../assets/VivaBem.png')} /> 
          <Text style={styles.titulo}>ÁREA DE CADASTRO</Text>
          
          {/* Nome Completo */}
          <Text style={styles.txt}>Nome Completo</Text>
          <TextInput 
            style={[styles.input, erros.name && styles.inputErro]}
            placeholder="Digite seu nome completo"
            onChangeText={(t) => limparErroDoCampo('name', t)}
            value={name}
          />
          {erros.name && <Text style={styles.txtErro}>{erros.name}</Text>}
            
          {/* CPF */}
          <Text style={styles.txt}>CPF</Text>
          <TextInput 
            style={[styles.input, erros.cpf && styles.inputErro]}
            onChangeText={lidarComCPF} 
            value={cpf}
            placeholder="000.000.000-00"
            keyboardType="numeric"
            maxLength={14}
          />
          {erros.cpf && <Text style={styles.txtErro}>{erros.cpf}</Text>}
        
          {/* Telefone */}
          <Text style={styles.txt}>Telefone</Text>
          <TextInput 
            style={[styles.input, erros.fone && styles.inputErro]}
            onChangeText={lidarComTelefone} 
            value={fone}
            placeholder="(11) 00000-0000"
            keyboardType="numeric"
            maxLength={15}
          />
          {erros.fone && <Text style={styles.txtErro}>{erros.fone}</Text>}

          {/* Especialidade */}
          <Text style={styles.txt}>Digite sua especialidade</Text>
          {especialidade !== "Outros" ? (
            <TouchableOpacity 
              style={[styles.inputSeletor, erros.especialidade && styles.inputErro]} 
              onPress={() => setMostrarModal(true)}
            >
              <Text style={especialidade ? styles.txtSeletorAtivo : styles.txtSeletorPlaceholder}>
                {especialidade || "Selecione uma opção..."}
              </Text>
            </TouchableOpacity>
          ) : (
            <TextInput 
              style={[styles.input, erros.especialidade && styles.inputErro]}
              onChangeText={(text) => limparErroDoCampo('especialidade', text)}
              placeholder="Escreva sua especialidade aqui..."
              autoFocus={true}
            />
          )}
          {erros.especialidade && <Text style={styles.txtErro}>{erros.especialidade}</Text>}

          {/* Botão de cadastro */}
          <TouchableOpacity style={styles.cadastro} onPress={salvarCuidador}>
            <Text style={styles.txt_cad}>CADASTRAR</Text>
          </TouchableOpacity>

        </View>
      </TouchableWithoutFeedback>
    
      <StatusBar style="auto" />

      {/* Modal de Opções */}
      <Modal visible={mostrarModal} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setMostrarModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalConteudo}>
              <Text style={styles.modalTitulo}>Selecione a Especialidade</Text>
              <FlatList
                data={LISTA_ESPECIALIDADES}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.modalOpcao} 
                    onPress={() => {
                      setEspecialidade(item);
                      setMostrarModal(false);
                      setErros(prev => ({ ...prev, especialidade: null }));
                    }}
                  >
                    <Text style={styles.modalOpcaoTxt}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAwareScrollView>
  );
}
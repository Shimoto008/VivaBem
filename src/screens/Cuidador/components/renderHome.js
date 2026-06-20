import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import styles from "../HomeCuidador/Style";
import { PainelPaciente } from './PainelPaciente';

export function RenderHome({ controlador }) {
  const { 
    listaPacientes, 
    pacienteSelecionado, 
    setPacienteSelecionado, 
    setSubAtividadeAtiva 
  } = controlador;

  return (
    <View style={styles.containerAbas}>
      {/* Grid de Atalhos Rápidos */}
      <View style={styles.grid}>
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <MaterialIcons name="star-outline" size={24} color="#4169E1" />
            <Text style={styles.statusBadge}>Painel</Text>
          </View>
          <View style={styles.iconContainer}>
            <MaterialIcons name="add-box" size={50} color="#4169E1" />
          </View>
          <Text style={styles.cardTitle}>Medicações</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTop}>
            <MaterialIcons name="star-outline" size={24} color="#4169E1" />
            <Text style={styles.statusBadge}>Segurança</Text>
          </View>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="accessible-icon" size={45} color="#4169E1" />
          </View>
          <Text style={styles.cardTitle}>Risco Engasgo</Text>
        </View>
      </View>

      <Text style={styles.secaoTitulo}>Idosos Ativos</Text>
      
      {listaPacientes.length === 0 ? (
        <View style={styles.cardVazio}>
          <Text style={styles.txtVazio}>Nenhum idoso cadastrado.</Text>
        </View>
      ) : (
        listaPacientes.map((idoso) => (
          <View key={idoso.id} style={styles.wrapperPaciente}>
            <TouchableOpacity 
              style={styles.cardPacienteHome} 
              onPress={() => { 
                setPacienteSelecionado(pacienteSelecionado?.id === idoso.id ? null : idoso); 
                setSubAtividadeAtiva(null); 
              }}
            >
              <FontAwesome5 name="user-circle" size={40} color="#4169E1" />
              <View style={styles.infoPacienteHome}>
                <Text style={styles.nomePacienteHome}>{idoso.nome}</Text>
                <Text style={styles.detalhesPacienteHome}>{idoso.idade} anos</Text>
              </View>
              <MaterialIcons 
                name={pacienteSelecionado?.id === idoso.id ? "expand-less" : "expand-more"} 
                size={28} 
                color="#4169E1" 
              />
            </TouchableOpacity>

            {/* Se o idoso for selecionado, abre o painel de ações */}
            {pacienteSelecionado?.id === idoso.id && (
              <PainelPaciente idoso={pacienteSelecionado} controlador={controlador} />
            )}
          </View>
        ))
      )}
    </View>
  );
}
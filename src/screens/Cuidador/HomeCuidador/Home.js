import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useHomeCuidador } from './UseHomeCuidador';
import styles from "./Style";


import { RenderHome } from '../components/renderHome';
import { RenderPaciente } from '../components/RenderPaciente';
import { RenderPerfilCuidador } from '../components/RenderPerfilCuidador';

export default function HomeCuidador() {
  // Chamada do hook com as funções e estados compartilhados
  const controlador = useHomeCuidador();
  const { abaAtiva, setAbaAtiva } = controlador;

  // Renderiza a tela correta baseado na aba ativa
  const renderConteudo = () => {
    if (abaAtiva === 'home') return <RenderHome controlador={controlador} />;
    if (abaAtiva === 'paciente') return <RenderPaciente controlador={controlador} />;
    if (abaAtiva === 'perfil') return <RenderPerfilCuidador />;
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderConteudo()}
        </ScrollView>

        {/* Menu de Navegação Inferior */}
        <View style={styles.bottomTab}>
          <TouchableOpacity style={styles.tabItem} onPress={() => setAbaAtiva('home')}>
            <MaterialIcons name="home" size={28} color={abaAtiva === 'home' ? '#4169E1' : '#000'} />
            <Text style={styles.tabText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => setAbaAtiva('paciente')}>
            <FontAwesome5 name="user-injured" size={22} color={abaAtiva === 'paciente' ? '#4169E1' : '#000'} />
            <Text style={styles.tabText}>Paciente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => setAbaAtiva('perfil')}>
            <MaterialIcons name="account-circle" size={28} color={abaAtiva === 'perfil' ? '#4169E1' : '#000'} />
            <Text style={styles.tabText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
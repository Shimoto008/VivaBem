import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function HomeCuidador({ route }) {
  // Captura o nome vindo do cadastro
  const { nomeUsuario } = route.params || { nomeUsuario: 'Cuidador' };

  // ESTADO CENTRAL: Controla qual aba está ativa ('home', 'paciente', 'relatorios')
  const [abaAtiva, setAbaAtiva] = useState('home');

  // --- FUNÇÃO QUE RENDERIZA O CONTEÚDO DE ACORDO COM A ABA ATIVA ---
  const renderConteudo = () => {
    switch (abaAtiva) {
      case 'home':
        return (
          <View style={styles.grid}>
            {/* CARD MEDICAÇÃO */}
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardTop}>
                <MaterialIcons name="star-outline" size={24} color="#4169E1" />
                <Text style={styles.statusBadge}>Sem lançamento</Text>
              </View>
              <View style={styles.iconContainer}>
                <MaterialIcons name="add-box" size={50} color="#4169E1" />
              </View>
              <Text style={styles.cardTitle}>Medicação</Text>
              <View style={styles.cardFooter}>
                <MaterialIcons name="insert-chart-outlined" size={18} color="#4169E1" />
                <View>
                  <Text style={styles.footerTitle}>Relatório</Text>
                  <Text style={styles.footerSub}>Nenhum lançamento...</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* CARD RISCO DE ENGASGO */}
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardTop}>
                <MaterialIcons name="star-outline" size={24} color="#4169E1" />
                <Text style={styles.statusBadge}>Sem lançamento</Text>
              </View>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="accessible-icon" size={45} color="#4169E1" />
              </View>
              <Text style={styles.cardTitle}>Risco de engasgo</Text>
              <View style={styles.cardFooter}>
                <MaterialIcons name="insert-chart-outlined" size={18} color="#4169E1" />
                <View>
                  <Text style={styles.footerTitle}>Relatório</Text>
                  <Text style={styles.footerSub}>Nenhum lançamento...</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );

      case 'paciente':
        return (
          <View style={styles.telaPlaceholder}>
            <FontAwesome5 name="user-injured" size={50} color="#4169E1" />
            <Text style={styles.tituloPlaceholder}>Área do Paciente</Text>
            <Text style={styles.subtituloPlaceholder}>
              Aqui você poderá listar e gerenciar os idosos sob seus cuidados.
            </Text>
          </View>
        );

      case 'relatorios':
        return (
          <View style={styles.telaPlaceholder}>
            <MaterialIcons name="assessment" size={55} color="#4169E1" />
            <Text style={styles.tituloPlaceholder}>Histórico e Relatórios</Text>
            <Text style={styles.subtituloPlaceholder}>
              Gráficos de evolução e evolução diária do paciente aparecerão aqui.
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* HEADER / BARRA SUPERIOR */}
        <View style={styles.header}>
          <Text style={styles.userName}>{nomeUsuario.toLowerCase()}</Text>
          <TouchableOpacity>
            <MaterialIcons name="search" size={28} color="#4169E1" />
          </TouchableOpacity>
        </View>

        {/* CONTEÚDO DINÂMICO ROLÁVEL */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderConteudo()}
        </ScrollView>

        {/* MENU INFERIOR ATUALIZADO (Aba "Mais" removida) */}
        <View style={styles.bottomTab}>
          
          {/* BOTÃO HOME */}
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => setAbaAtiva('home')}
          >
            <MaterialIcons 
              name="home" 
              size={28} 
              color={abaAtiva === 'home' ? '#4169E1' : '#000'} 
            />
            <Text style={[styles.tabText, abaAtiva === 'home' && styles.tabTextAtivo]}>Home</Text>
          </TouchableOpacity>
          
          {/* BOTÃO PACIENTE */}
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => setAbaAtiva('paciente')}
          >
            <FontAwesome5 
              name="user-injured" 
              size={22} 
              color={abaAtiva === 'paciente' ? '#4169E1' : '#000'} 
            />
            <Text style={[styles.tabText, abaAtiva === 'paciente' && styles.tabTextAtivo]}>Paciente</Text>
          </TouchableOpacity>

          {/* BOTÃO RELATÓRIOS */}
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => setAbaAtiva('relatorios')}
          >
            <MaterialIcons 
              name="assessment" 
              size={28} 
              color={abaAtiva === 'relatorios' ? '#4169E1' : '#000'} 
            />
            <Text style={[styles.tabText, abaAtiva === 'relatorios' && styles.tabTextAtivo]}>Relatórios</Text>
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}

// ESTILIZAÇÃO DO TEMA CLARO / AZUL ROYAL
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  userName: {
    fontSize: 22,
    color: '#000',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 15,
    flexGrow: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFF',
    width: '48%',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2, 
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusBadge: {
    backgroundColor: '#4169E122',
    color: '#4169E1',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
  },
  cardTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
    paddingTop: 10,
    marginTop: 5,
    alignItems: 'center',
  },
  footerTitle: { color: '#4169E1', fontSize: 11, fontWeight: 'bold', marginLeft: 5 },
  footerSub: { color: '#666', fontSize: 9, marginLeft: 5 },
  
  // ESTILOS DAS TELAS VAZIAS (PLACEHOLDERS)
  telaPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 50,
  },
  tituloPlaceholder: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 15,
    marginBottom: 8,
  },
  subtituloPlaceholder: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },

  // ESTILOS DA BOTTOM TAB
  bottomTab: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 11,
    color: '#000',
    marginTop: 4,
  },
  tabTextAtivo: {
    color: '#4169E1',
    fontWeight: 'bold',
  }
});
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';

import { colors } from '../../../../theme'; // Ajuste o caminho do seu arquivo de tema
import { useSession } from '../../../../contexts/SessionContext';
import { useConexaoFamiliar } from '../../../../contexts/ConexaoFamiliarContext';

export default function PerfilFamiliarTab() {
  const { familiar, logout } = useSession();
    const conectado = false; 
  const cuidador = null;
  // Estados de Personalização
  const [modoEscuro, setModoEscuro] = useState(false);
  const [corTema, setCorTema] = useState('#3B82F6'); // Azul padrão

  // Cores disponíveis para personalização de tema
  const opcoesCores = [
    { id: 'blue', hex: '#3B82F6', nome: 'Azul' },
    { id: 'emerald', hex: '#10B981', nome: 'Verde' },
    { id: 'purple', hex: '#8B5CF6', nome: 'Roxo' },
    { id: 'rose', hex: '#F43F5E', nome: 'Rosa' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => logout && logout(),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: modoEscuro ? '#121212' : '#F5F5F5' }}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. CABEÇALHO DO PERFIL */}
      <View style={[styles.card, { backgroundColor: modoEscuro ? '#1E1E1E' : '#FFF' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.avatar, { backgroundColor: corTema }]}>
            <FontAwesome5 name="user" size={30} color="#FFF" />
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={[styles.nome, { color: modoEscuro ? '#FFF' : '#333' }]}>
              {familiar?.nome || 'Nome do Familiar'}
            </Text>
            <Text style={{ color: '#888', fontSize: 13, marginTop: 2 }}>
              {familiar?.email || 'email@exemplo.com'}
            </Text>
            <Text style={{ color: '#888', fontSize: 13, marginTop: 1 }}>
              {familiar?.telefone || 'Telefone não informado'}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. CARD DE STATUS DA CONEXÃO */}
      <Text style={[styles.secaoTitulo, { color: modoEscuro ? '#BBB' : '#555' }]}>
        Cuidador Vinculado
      </Text>
      <View style={[styles.card, { backgroundColor: modoEscuro ? '#1E1E1E' : '#FFF' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <MaterialIcons
              name={conectado ? 'verified-user' : 'link-off'}
              size={28}
              color={conectado ? '#10B981' : '#E53935'}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.cardTitulo, { color: modoEscuro ? '#FFF' : '#333' }]}>
                {conectado ? cuidador?.nome || 'Cuidador Conectado' : 'Sem Conexão'}
              </Text>
              <Text style={{ color: '#888', fontSize: 12, marginTop: 2 }}>
                {conectado
                  ? `Ativo • ${cuidador?.telefone || 'Sem contato'}`
                  : 'Vincule um cuidador usando o código de 6 dígitos'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. OPÇÕES DE PERSONALIZAÇÃO E ACESSIBILIDADE */}
      <Text style={[styles.secaoTitulo, { color: modoEscuro ? '#BBB' : '#555' }]}>
        Aparência e Preferências
      </Text>
      <View style={[styles.card, { backgroundColor: modoEscuro ? '#1E1E1E' : '#FFF' }]}>
        
        {/* Alternar Modo Escuro */}
        <View style={styles.linhaOpcao}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="moon-outline" size={22} color={modoEscuro ? '#FFF' : '#333'} />
            <Text style={[styles.opcaoTexto, { color: modoEscuro ? '#FFF' : '#333' }]}>
              Modo Escuro
            </Text>
          </View>
          <Switch
            value={modoEscuro}
            onValueChange={setModoEscuro}
            trackColor={{ false: '#767577', true: corTema }}
          />
        </View>

        <View style={styles.divisor} />

        {/* Escolha da Cor de Destaque */}
        <Text style={[styles.subtemaTexto, { color: modoEscuro ? '#AAA' : '#666' }]}>
          Cor do Aplicativo
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
          {opcoesCores.map((cor) => (
            <TouchableOpacity
              key={cor.id}
              onPress={() => setCorTema(cor.hex)}
              style={[
                styles.bolaCor,
                { backgroundColor: cor.hex },
                corTema === cor.hex && styles.bolaCorSelecionada,
              ]}
            >
              {corTema === cor.hex && <MaterialIcons name="check" size={16} color="#FFF" />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 4. BOTÃO DE SAIR */}
      <TouchableOpacity
        onPress={handleLogout}
        activeOpacity={0.8}
        style={[styles.botaoLogout, { backgroundColor: '#FEE2E2' }]}
      >
        <MaterialIcons name="logout" size={20} color="#DC2626" />
        <Text style={{ color: '#DC2626', fontWeight: 'bold', marginLeft: 8, fontSize: 16 }}>
          Sair da Conta
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  secaoTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 10,
    marginLeft: 4,
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  linhaOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  opcaoTexto: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12,
  },
  subtemaTexto: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  divisor: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 12,
  },
  bolaCor: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bolaCorSelecionada: {
    borderWidth: 3,
    borderColor: '#FFF',
    elevation: 4,
  },
  botaoLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
    marginBottom: 30,
  },
});
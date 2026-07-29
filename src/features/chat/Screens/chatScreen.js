import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function ChatScreen() {
  const route = useRoute();
  
  // Extrai os dados do cuidador passados via navegação
  const { cuidadorId, nomeCuidador, telefoneCuidador, especialidade } = route.params || {};

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Conversa com {nomeCuidador}</Text>
      <Text style={{ color: '#666' }}>Especialidade: {especialidade}</Text>
      <Text style={{ color: '#666' }}>ID: {cuidadorId}</Text>
    </View>
  );
}
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../contexts/ThemeContext';

export function EmptyPacienteMessage() {
  const { themeColors } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.background }}>
      <Text style={{ color: themeColors.textSecondary }}>Nenhum paciente selecionado.</Text>
    </View>
  );
}

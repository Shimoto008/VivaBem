import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../../../../../contexts/ThemeContext';

export function MedicacaoForm({
  titulo,
  textoBotao,

  nome,
  quantidade,
  horario,
  setNome,
  setQuantidade,
  setHorario,

  onSalvar,
  onCancelar,
  processando,
}) {
  const { themeColors: colors } = useTheme();
  const [mostrarHorario, setMostrarHorario] = useState(false);

  return (
    <View
      style={{
        marginTop: 20,
        padding: 15,
        borderRadius: 12,
        backgroundColor: colors.surface,
      }}
    >

      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 20,
          color: colors.textPrimary,
        }}
      >
        {titulo}
      </Text>

      <Text
        style={{
          fontWeight: 'bold',
          marginBottom: 5,
          color: colors.textPrimary,
        }}
      >
        Nome do medicamento
      </Text>

      <TextInput
        placeholder="Ex: Dipirona"
        placeholderTextColor={colors.placeholder}
        value={nome}
        onChangeText={setNome}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          padding: 12,
          marginBottom: 15,
          color: colors.textPrimary,
        }}
      />

      <Text
        style={{
          fontWeight: 'bold',
          marginBottom: 5,
          color: colors.textPrimary,
        }}
      >
        Quantidade
      </Text>

      <TextInput
        placeholder="Ex: 500mg"
        placeholderTextColor={colors.placeholder}
        value={quantidade}
        onChangeText={setQuantidade}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          padding: 12,
          marginBottom: 15,
          color: colors.textPrimary,
        }}
      />

      <Text
        style={{
          fontWeight: 'bold',
          marginBottom: 5,
          color: colors.textPrimary,
        }}
      >
        Horário
      </Text>

      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          padding: 12,
          marginBottom: 15,
        }}
        onPress={() => setMostrarHorario(true)}
      >
        <Text style={{ color: horario ? colors.textPrimary : colors.placeholder }}>{horario || 'Selecionar horário'}</Text>
      </TouchableOpacity>

      {mostrarHorario && (
        <DateTimePicker
          value={horario ? new Date(`2026-01-01T${horario}:00`) : new Date()}
          mode="time"
          is24Hour={true}
          onChange={(event, selectedDate) => {
            setMostrarHorario(false);

            if (selectedDate) {
              const horas = selectedDate.getHours().toString().padStart(2, '0');

              const minutos = selectedDate.getMinutes().toString().padStart(2, '0');

              setHorario(`${horas}:${minutos}`);
            }
          }}
        />
      )}

      <TouchableOpacity
        onPress={onSalvar}
        disabled={processando}
        style={{
          backgroundColor: colors.success,
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: colors.textOnPrimary,
            fontWeight: 'bold',
          }}
        >
          {processando ? 'Salvando...' : textoBotao}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onCancelar}
        style={{
          marginTop: 10,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: colors.textSecondary,
          }}
        >
          Cancelar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

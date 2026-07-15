import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

export function MedicacaoForm({
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
  const [mostrarHorario, setMostrarHorario] = useState(false);

  return (
    <View
      style={{
        marginTop: 20,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#fff',
      }}
    >
      <Text
        style={{
          fontWeight: 'bold',
          marginBottom: 5,
        }}
      >
        Nome do medicamento
      </Text>

      <TextInput
        placeholder="Ex: Dipirona"
        value={nome}
        onChangeText={setNome}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 15,
        }}
      />

      <Text
        style={{
          fontWeight: 'bold',
          marginBottom: 5,
        }}
      >
        Quantidade
      </Text>

      <TextInput
        placeholder="Ex: 500mg"
        value={quantidade}
        onChangeText={setQuantidade}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 15,
        }}
      />

      <Text
        style={{
          fontWeight: 'bold',
          marginBottom: 5,
        }}
      >
        Horário
      </Text>

      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 15,
        }}
        onPress={() => setMostrarHorario(true)}
      >
        <Text>{horario || 'Selecionar horário'}</Text>
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
          backgroundColor: '#2E7D32',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          {processando ? 'Salvando...' : 'Salvar Medicação'}
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
            color: '#666',
          }}
        >
          Cancelar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

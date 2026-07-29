import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useTheme } from '../../../../../../contexts/ThemeContext';
import { radius, spacing, typography } from '../../../../../../theme';

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
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  const [mostrarHorario, setMostrarHorario] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>

      <Text style={styles.rotulo}>Nome do medicamento</Text>

      <TextInput
        placeholder="Ex: Dipirona"
        placeholderTextColor={themeColors.placeholder}
        value={nome}
        onChangeText={setNome}
        accessibilityLabel="Nome do medicamento"
        style={styles.campo}
      />

      <Text style={styles.rotulo}>Quantidade</Text>

      <TextInput
        placeholder="Ex: 500mg"
        placeholderTextColor={themeColors.placeholder}
        value={quantidade}
        onChangeText={setQuantidade}
        accessibilityLabel="Quantidade do medicamento"
        style={styles.campo}
      />

      <Text style={styles.rotulo}>Horário</Text>

      <TouchableOpacity
        onPress={() => setMostrarHorario(true)}
        accessibilityRole="button"
        accessibilityLabel="Selecionar horário da medicação"
        style={styles.seletorHorario}
      >
        <Text
          style={[
            styles.textoSeletorHorario,
            { color: horario ? themeColors.textPrimary : themeColors.placeholder },
          ]}
        >
          {horario || 'Selecionar horário'}
        </Text>
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
        accessibilityRole="button"
        accessibilityLabel={textoBotao}
        accessibilityState={{ disabled: !!processando }}
        style={styles.botaoSalvar}
      >
        {processando ? (
          <ActivityIndicator color={themeColors.textOnPrimary} />
        ) : (
          <Text style={styles.textoBotaoSalvar}>{textoBotao}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onCancelar}
        accessibilityRole="button"
        accessibilityLabel="Cancelar"
        style={styles.botaoCancelar}
      >
        <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      marginTop: spacing.xl,
      marginBottom: spacing.xl,
      padding: spacing.lg,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
    },
    titulo: { ...typography.title1, color: colors.textPrimary, marginBottom: spacing.xl },
    rotulo: { ...typography.bodyBold, color: colors.textPrimary, marginBottom: spacing.xs },
    campo: {
      ...typography.body,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.sm,
      padding: spacing.md,
      marginBottom: spacing.lg,
      color: colors.textPrimary,
    },
    seletorHorario: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.sm,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    textoSeletorHorario: { ...typography.body },
    botaoSalvar: {
      backgroundColor: colors.success,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
    },
    textoBotaoSalvar: { ...typography.bodyBold, color: colors.textOnPrimary },
    botaoCancelar: { marginTop: spacing.md, paddingVertical: spacing.sm, alignItems: 'center' },
    textoBotaoCancelar: { ...typography.body, color: colors.textSecondary },
  });

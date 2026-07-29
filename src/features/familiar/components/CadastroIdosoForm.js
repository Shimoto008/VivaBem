import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Input, Button } from '../../../components/ui';
import { radius, spacing } from '../../../theme';
import { useTheme } from '../../../contexts/ThemeContext';

export function CadastroIdosoForm({
  nome,
  setNome,
  idade,
  setIdade,
  cpf,
  alterarCpf,
  erros,
  enviando,
  onSalvar,
}) {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  return (
    <View style={styles.container}>
      <Input
        label="Nome Completo"
        placeholder="Nome do idoso"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
        error={erros.nome}
      />

      <View style={styles.linhaCampos}>
        <View style={styles.campoIdade}>
          <Input
            label="Idade"
            placeholder="Ex.: 78"
            keyboardType="numeric"
            maxLength={3}
            value={idade}
            onChangeText={setIdade}
            error={erros.idade}
          />
        </View>

        <View style={styles.campoCpf}>
          <Input
            label="CPF"
            placeholder="000.000.000-00"
            keyboardType="numeric"
            maxLength={14}
            value={cpf}
            onChangeText={alterarCpf}
            error={erros.cpf}
          />
        </View>
      </View>

      <Button title="Cadastrar Idoso" onPress={onSalvar} loading={enviando} style={styles.botao} />
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      padding: spacing.xl,
      borderRadius: radius.lg,
      marginTop: spacing.xl,
      borderWidth: 1,
      borderColor: colors.border,
    },
    linhaCampos: { flexDirection: 'row', justifyContent: 'space-between' },
    campoIdade: { width: '30%' },
    campoCpf: { width: '65%' },
    botao: { width: '100%', marginTop: spacing.sm },
  });

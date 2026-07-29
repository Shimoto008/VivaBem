import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getStyles } from './Idoso.styles';
import { useIdosoCadastro } from '../hooks/useIdosoCadastro';
import { Input, Button, ScreenHeader } from '../../../components/ui';
import { useTheme } from '../../../contexts/ThemeContext';

export default function IdosoScreen() {
  const navigation = useNavigation();
  const { nome, cpf, telefone, erros, enviando, alterarNome, alterarCpf, alterarTelefone, salvar } =
    useIdosoCadastro();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader
            title="Área de Cadastro"
            subtitle="Idoso"
            onBack={() => navigation.goBack()}
          />

          <Image style={styles.img} source={require('../../../../assets/VivaBem.png')} />

          <Input
            label="Nome Completo"
            placeholder="Digite o nome completo"
            value={nome}
            onChangeText={alterarNome}
            autoCapitalize="words"
            autoCorrect={false}
            error={erros.nome}
          />

          <Input
            label="CPF"
            placeholder="000.000.000-00"
            value={cpf}
            onChangeText={alterarCpf}
            keyboardType="numeric"
            autoCapitalize="none"
            maxLength={14}
            error={erros.cpf}
          />

          <Input
            label="Telefone"
            placeholder="(11) 00000-0000"
            value={telefone}
            onChangeText={alterarTelefone}
            keyboardType="numeric"
            autoCapitalize="none"
            maxLength={15}
            error={erros.telefone}
          />

          <Button
            title="Cadastrar"
            onPress={salvar}
            loading={enviando}
            style={styles.botaoCadastrar}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

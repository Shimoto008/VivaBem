import React from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getStyles } from './CadastroFamiliar.styles';
import { useFamiliarCadastro } from '../hooks/useFamiliarCadastro';
import { Input, Button, Card, ScreenHeader } from '../../../components/ui';
import { ROUTES } from '../../../constants/routeNames';
import { useTheme } from '../../../contexts/ThemeContext';

export default function CadastroFamiliarScreen() {
  const navigation = useNavigation();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  const {
    nome,
    cpf,
    telefone,
    senha, // <-- Adicionado
    erros,
    enviando,
    alterarNome,
    alterarCpf,
    alterarTelefone,
    alterarSenha, // <-- Adicionado
    salvar,
  } = useFamiliarCadastro();

  return (
    <SafeAreaView style={styles.containerScroll} edges={['top', 'bottom']}>
      <KeyboardAwareScrollView
        style={styles.containerScroll}
        contentContainerStyle={styles.contentScroll}
        enableOnAndroid
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.viewPrincipal}>
            <ScreenHeader
              title="Cadastro de Familiar"
              subtitle="Acompanhe a rotina de quem você ama"
              onBack={() => navigation.goBack()}
            />

            <View style={styles.heroIcone}>
              <MaterialIcons name="family-restroom" size={44} color={themeColors.primary} />
            </View>

            <Card style={styles.card}>
              <Input
                label="Nome Completo"
                placeholder="Digite seu nome completo"
                value={nome}
                onChangeText={alterarNome}
                autoCapitalize="words"
                autoCorrect={false}
                textContentType="name"
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
                textContentType="telephoneNumber"
                error={erros.telefone}
              />
              <Input
                label="Senha"
                placeholder="Crie uma senha (mínimo 6 caracteres)"
                value={senha}
                onChangeText={alterarSenha}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                error={erros.senha}
              />
              <Button title="Cadastrar" onPress={salvar} loading={enviando} style={styles.botao} />
            </Card>

            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
              accessibilityRole="button"
              accessibilityLabel="Entrar em uma conta existente"
              style={styles.linkLogin}
            >
              <Text style={styles.textoLinkLogin}>Já tenho conta — entrar com CPF</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
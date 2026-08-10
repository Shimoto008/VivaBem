import React from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { Input, Button, Card, ScreenHeader } from '../../../components/ui';
import { spacing, typography } from '../../../theme';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLogin } from '../hooks/useLogin';
import { getLogoSource } from '../../../constants/brandAssets';

/**
 * Login por CPF: o e-mail exigido pelo Supabase Auth é derivado do CPF dentro
 * de `authService`, então o usuário nunca precisa conhecer esse e-mail interno.
 */
export default function LoginScreen() {
  const navigation = useNavigation();
  const { themeColors, isDarkMode } = useTheme();
  const styles = getStyles(themeColors);
  const { cpf, senha, erros, entrando, alterarCpf, alterarSenha, entrar } = useLogin();

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
            title="Entrar na Conta"
            subtitle="Use o CPF e a senha do seu cadastro"
            onBack={() => navigation.goBack()}
          />

          <Image style={styles.img} source={getLogoSource(isDarkMode)} />

          <Card>
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
              label="Senha"
              placeholder="Digite sua senha"
              value={senha}
              onChangeText={alterarSenha}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              error={erros.senha}
            />

            <Button title="Entrar" onPress={entrar} loading={entrando} />
          </Card>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a escolha de perfil e criar uma conta"
            style={styles.linkCadastro}
          >
            <Text style={styles.textoLink}>Ainda não tenho conta — quero me cadastrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    conteudo: {
      flexGrow: 1,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xxxl,
    },
    img: {
      width: 130,
      height: 90,
      resizeMode: 'contain',
      alignSelf: 'center',
      marginVertical: spacing.lg,
    },
    linkCadastro: { alignSelf: 'center', marginTop: spacing.xl, padding: spacing.sm },
    textoLink: { ...typography.bodyBold, color: colors.primary },
  });

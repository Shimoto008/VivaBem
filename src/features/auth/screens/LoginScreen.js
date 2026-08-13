import React from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { Input, Button, Card, ScreenHeader } from '../../../components/ui';
import { spacing, typography } from '../../../theme';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLogin } from '../hooks/useLogin';
import { getLogoSource } from '../../../constants/brandAssets';
import { ROUTES } from '../../../constants/routeNames';

/**
 * Login por e-mail + senha: é o mesmo e-mail informado no cadastro e usado no
 * Supabase Auth, o que permite a recuperação de senha por e-mail.
 */
export default function LoginScreen() {
  const navigation = useNavigation();
  const { themeColors, isDarkMode } = useTheme();
  const styles = getStyles(themeColors);
  const { email, senha, erros, entrando, alterarEmail, alterarSenha, entrar } = useLogin();

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
            subtitle="Use o e-mail e a senha do seu cadastro"
            onBack={() => navigation.goBack()}
          />

          <Image style={styles.img} source={getLogoSource(isDarkMode)} />

          <Card>
            <Input
              label="E-mail"
              placeholder="exemplo@email.com"
              value={email}
              onChangeText={alterarEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              error={erros.email}
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

            {/* BOTAO DE ESQUECI MINHA SENHA ALINHADO Á DIREITA */}
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.RECUPERAR_SENHA || 'RecuperarSenha')}
              accessibilityRole="button"
              accessibilityLabel="Esqueci minha senha"
              style={styles.linkEsqueciSenha}
              activeOpacity={0.7}
            >
              <Text style={styles.textoEsqueciSenha}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <Button title="Entrar" onPress={entrar} loading={entrando} />
          </Card>

          {/* ÁREA INFERIOR DE REDIRECIONAMENTO */}
          <View style={styles.containerLinksInferiores}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Voltar para a escolha de perfil e criar uma conta"
              style={styles.linkCadastro}
              activeOpacity={0.7}
            >
              <Text style={styles.textoSubtituloLink}>Não tem uma conta?</Text>
              <Text style={styles.textoLink}>Criar conta</Text>
            </TouchableOpacity>
          </View>
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
    linkEsqueciSenha: {
      alignSelf: 'flex-end',
      marginBottom: spacing.lg,
      marginTop: -spacing.xs,
      paddingVertical: 4,
    },
    textoEsqueciSenha: {
      ...typography.caption,
      color: colors.primary,
      fontWeight: '600',
    },
    containerLinksInferiores: {
      alignItems: 'center',
      marginTop: spacing.xl,
    },
    linkCadastro: {
      alignItems: 'center',
      padding: spacing.sm,
    },
    textoSubtituloLink: {
      ...typography.caption,
      color: colors.textSecondary || '#6C757D',
      marginBottom: 2,
    },
    textoLink: { 
      ...typography.bodyBold, 
      color: colors.primary 
    },
  });
import React from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

import { useRecuperarSenha } from '../hooks/useRecuperarSenha';
import { Input, Button, ScreenHeader } from '../../../components/ui';
import { useTheme } from '../../../contexts/ThemeContext';
import { getStyles } from './RecuperarSenhaStyles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function RecuperarSenhaScreen() {
  const navigation = useNavigation();
  const { themeColors } = useTheme();
  const {
    passo,
    setPasso,
    email,
    setEmail,
    codigo,
    setCodigo,
    novaSenha,
    setNovaSenha,
    confirmarNovaSenha,
    setConfirmarNovaSenha,
    carregando,
    erros,
    solicitarCodigo,
    redefinirSenha,
  } = useRecuperarSenha();

  const styles = getStyles(themeColors);

  const handleVoltarPasso = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (passo === 2) {
      setPasso(1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.contentScroll}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader
          title={passo === 1 ? "Recuperar Conta" : "Validar Código"}
          subtitle={
            passo === 1
              ? "Digite seu e-mail para receber o código de verificação"
              : `Enviamos um código de recuperação para ${email.trim()}`
          }
          onBack={handleVoltarPasso}
        />

        <View style={styles.cardForm}>
          {passo === 1 ? (
            /* PASSO 1: DIGITAR E-MAIL */
            <>
              <Input
                label="E-mail Cadastrado"
                placeholder="exemplo@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                error={erros.email}
              />

              <Button
                title="Enviar código de recuperação"
                onPress={solicitarCodigo}
                loading={carregando}
                style={styles.botaoAcao}
              />
            </>
          ) : (
            /* PASSO 2: DIGITAR CÓDIGO + NOVA SENHA */
            <>
              <Input
                label="Código de Verificação"
                placeholder="Ex.: 123456"
                value={codigo}
                onChangeText={setCodigo}
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="oneTimeCode"
                style={styles.inputCodigo}
                error={erros.codigo}
              />

              <Text style={styles.textoAjudaCodigo}>
                Digite ou cole o código recebido no seu e-mail
              </Text>

              <Input
                label="Nova Senha"
                placeholder="Digite sua nova senha"
                value={novaSenha}
                onChangeText={setNovaSenha}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                error={erros.novaSenha}
              />

              <Input
                label="Confirmar Nova Senha"
                placeholder="Repita a nova senha"
                value={confirmarNovaSenha}
                onChangeText={setConfirmarNovaSenha}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                error={erros.confirmarNovaSenha}
              />

              <Button
                title="Alterar Senha"
                onPress={() => redefinirSenha(() => navigation.goBack())}
                loading={carregando}
                style={styles.botaoAcao}
              />

              <TouchableOpacity
                onPress={solicitarCodigo}
                style={[styles.btnReenviar, carregando && styles.btnReenviarDesabilitado]}
                disabled={carregando}
                accessibilityRole="button"
                accessibilityLabel="Reenviar código de recuperação"
                accessibilityState={{ disabled: carregando }}
              >
                <Text style={styles.textoReenviar}>
                  Não recebeu? <Text style={styles.textoReenviarDestaque}>Reenviar código</Text>
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
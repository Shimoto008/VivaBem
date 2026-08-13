import React from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useRecuperarSenha } from './hooks/useRecuperarSenha';
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
    telefone,
    setTelefone,
    codigo,
    setCodigo,
    novaSenha,
    setNovaSenha,
    carregando,
    erros,
    solicitarCodigo,
    redefinirSenha,
  } = useRecuperarSenha();

  const styles = getStyles(themeColors);

  // Formata o número de telefone conforme digita
  const handleTelefoneChange = (text) => {
    const limpo = text.replace(/\D/g, '');
    let formatado = limpo;
    if (limpo.length > 2) {
      formatado = `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7, 11)}`;
    }
    setTelefone(formatado);
  };

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
              ? "Digite seu telefone para receber o código de verificação"
              : `Enviamos um código de 6 dígitos para ${telefone}`
          }
          onBack={handleVoltarPasso}
        />

        <View style={styles.cardForm}>
          {passo === 1 ? (
            /* PASSO 1: DIGITAR TELEFONE */
            <>
              <Input
                label="Telefone Cadastrado"
                placeholder="(11) 90000-0000"
                value={telefone}
                onChangeText={handleTelefoneChange}
                keyboardType="numeric"
                maxLength={15}
                error={erros.telefone}
              />

              <Button
                title="Enviar Código"
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
                placeholder="000000"
                value={codigo}
                onChangeText={(t) => setCodigo(t.replace(/\D/g, ''))}
                keyboardType="numeric"
                maxLength={6}
                error={erros.codigo}
              />

              <Input
                label="Nova Senha"
                placeholder="Digite sua nova senha"
                value={novaSenha}
                onChangeText={setNovaSenha}
                secureTextEntry
                error={erros.novaSenha}
              />

              <Button
                title="Redefinir Senha"
                onPress={() => redefinirSenha(() => navigation.goBack())}
                loading={carregando}
                style={styles.botaoAcao}
              />

              <TouchableOpacity
                onPress={solicitarCodigo}
                style={styles.btnReenviar}
                disabled={carregando}
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
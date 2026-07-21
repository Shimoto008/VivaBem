import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from './CadastroFamiliar.styles';
import { useFamiliarCadastro } from '../hooks/useFamiliarCadastro';
import { Input, Button, Card, ScreenHeader } from '../../../components/ui';
import { colors } from '../../../theme';

/**
 * Antes (Familiar.js): tela "burra" de verdade, mas no sentido errado —
 * o botão de cadastro não tinha onPress, então a tela não fazia nada.
 * Agora é uma tela burra de propósito: toda a lógica está em
 * useFamiliarCadastro, ela só desenha a UI.
 */
export default function CadastroFamiliarScreen() {
  const navigation = useNavigation();
  const { nome, cpf, telefone, erros, enviando, alterarNome, alterarCpf, alterarTelefone, salvar } = useFamiliarCadastro();

  return (
    <KeyboardAwareScrollView
      style={styles.containerScroll}
      contentContainerStyle={styles.contentScroll}
      enableOnAndroid
      extraScrollHeight={100}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.viewPrincipal}>
          <ScreenHeader title="Cadastro de Familiar" subtitle="Acompanhe a rotina de quem você ama" onBack={() => navigation.goBack()} />

          <View style={styles.heroIcone}>
            <MaterialIcons name="family-restroom" size={44} color={colors.primary} />
          </View>

          <Card style={styles.card}>
            <Input label="Nome Completo" placeholder="Digite seu nome completo" value={nome} onChangeText={alterarNome} error={erros.nome} />
            <Input label="CPF" placeholder="000.000.000-00" value={cpf} onChangeText={alterarCpf} keyboardType="numeric" maxLength={14} error={erros.cpf} />
            <Input label="Telefone" placeholder="(11) 00000-0000" value={telefone} onChangeText={alterarTelefone} keyboardType="numeric" maxLength={15} error={erros.telefone} />
            <Button title="Cadastrar" onPress={salvar} loading={enviando} style={{ marginTop: 4 }} />
          </Card>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
}

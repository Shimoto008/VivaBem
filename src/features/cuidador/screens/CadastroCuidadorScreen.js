import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getStyles } from './CadastroCuidador.styles';
import { useCuidadorCadastro } from '../hooks/useCuidadorCadastro';
import { Input, Button, ScreenHeader, SelectModal } from '../../../components/ui';
import { LISTA_ESPECIALIDADES } from '../../../constants/especialidades';
import { ROUTES } from '../../../constants/routeNames';
import { useTheme } from '../../../contexts/ThemeContext';

const OPCAO_OUTRA_ESPECIALIDADE = 'Outros';

export default function CadastroCuidadorScreen() {
  const navigation = useNavigation();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  const {
    nome,
    telefone,
    cpf,
    senha,
    especialidade,
    outraEspecialidade,
    erros,
    enviando,
    modalEspecialidadeVisivel,
    setModalEspecialidadeVisivel,
    alterarNome,
    alterarCpf,
    alterarTelefone,
    alterarSenha,
    alterarOutraEspecialidade,
    selecionarEspecialidade,
    salvar,
  } = useCuidadorCadastro();

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
              title="Área de Cadastro"
              subtitle="Cuidador"
              onBack={() => navigation.goBack()}
            />
            <Image style={styles.img} source={require('../../../../assets/VivaBem.png')} />

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

            <Text style={styles.rotuloEspecialidade}>Especialidade</Text>
            {especialidade !== OPCAO_OUTRA_ESPECIALIDADE ? (
              <TouchableOpacity
                style={styles.seletor}
                onPress={() => setModalEspecialidadeVisivel(true)}
                accessibilityRole="button"
                accessibilityLabel="Selecionar especialidade"
              >
                <Text
                  style={especialidade ? styles.seletorTextoPreenchido : styles.seletorTextoVazio}
                >
                  {especialidade || 'Selecione uma opção...'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Input
                placeholder="Escreva sua especialidade aqui..."
                value={outraEspecialidade}
                onChangeText={alterarOutraEspecialidade}
                autoCapitalize="words"
                autoFocus
              />
            )}
            {erros.especialidade ? (
              <Text style={styles.erroEspecialidade}>{erros.especialidade}</Text>
            ) : null}

            <Button title="Cadastrar" onPress={salvar} loading={enviando} />

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

        <SelectModal
          visible={modalEspecialidadeVisivel}
          title="Selecione a Especialidade"
          options={LISTA_ESPECIALIDADES}
          onSelect={selecionarEspecialidade}
          onClose={() => setModalEspecialidadeVisivel(false)}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
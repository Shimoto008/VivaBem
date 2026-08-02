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
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { getStyles } from './CadastroUnificado.styles';
import {
  useCadastroUnificado,
  TIPOS_CADASTRO,
  OPCAO_OUTRA_ESPECIALIDADE,
  ACCENTS_POR_TIPO,
} from '../hooks/useCadastroUnificado';
import { Input, Button, ScreenHeader, SelectModal } from '../../../components/ui';
import { LISTA_ESPECIALIDADES } from '../../../constants/especialidades';
import { ROUTES } from '../../../constants/routeNames';
import { useTheme } from '../../../contexts/ThemeContext';

const OPCOES_TIPO = [
  {
    key: TIPOS_CADASTRO.CUIDADOR,
    label: 'Cuidador',
    icon: 'health-and-safety',
    iconFamily: 'MaterialIcons',
  },
  {
    key: TIPOS_CADASTRO.FAMILIAR,
    label: 'Familiar',
    icon: 'home',
    iconFamily: 'MaterialIcons',
  },
  {
    key: TIPOS_CADASTRO.IDOSO,
    label: 'Idoso',
    icon: 'user-alt',
    iconFamily: 'FontAwesome5',
  },
];

export default function CadastroUnificadoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { themeColors } = useTheme();
  const tipoInicial = route.params?.tipoInicial;

  const {
    tipo,
    accentColor,
    tituloBotao,
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
    selecionarTipo,
    alterarNome,
    alterarCpf,
    alterarTelefone,
    alterarSenha,
    alterarOutraEspecialidade,
    selecionarEspecialidade,
    salvar,
  } = useCadastroUnificado(tipoInicial);

  const styles = getStyles(themeColors, accentColor);
  const precisaSenha = tipo === TIPOS_CADASTRO.CUIDADOR || tipo === TIPOS_CADASTRO.FAMILIAR;
  const precisaEspecialidade = tipo === TIPOS_CADASTRO.CUIDADOR;

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
              title="Criar conta"
              subtitle="Escolha o perfil e preencha seus dados"
              onBack={() => navigation.goBack()}
            />
            <Image style={styles.img} source={require('../../../../assets/VivaBem.png')} />

            <Text style={styles.seletorTitulo}>Tipo de perfil</Text>
            <View style={styles.seletorRow}>
              {OPCOES_TIPO.map((opcao) => {
                const ativo = tipo === opcao.key;
                const cor = ACCENTS_POR_TIPO[opcao.key];
                const Icone =
                  opcao.iconFamily === 'FontAwesome5' ? FontAwesome5 : MaterialIcons;
                return (
                  <TouchableOpacity
                    key={opcao.key}
                    style={[styles.cardTipo, ativo && styles.cardTipoAtivo]}
                    onPress={() => selecionarTipo(opcao.key)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityState={{ selected: ativo }}
                    accessibilityLabel={`Selecionar perfil ${opcao.label}`}
                  >
                    <Icone name={opcao.icon} size={22} color={ativo ? cor : themeColors.textSecondary} />
                    <Text style={[styles.cardTipoLabel, ativo && styles.cardTipoLabelAtivo]}>
                      {opcao.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

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

            {precisaSenha ? (
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
            ) : null}

            {precisaEspecialidade ? (
              <>
                <Text style={styles.rotuloEspecialidade}>Especialidade</Text>
                {especialidade !== OPCAO_OUTRA_ESPECIALIDADE ? (
                  <TouchableOpacity
                    style={styles.seletor}
                    onPress={() => setModalEspecialidadeVisivel(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Selecionar especialidade"
                  >
                    <Text
                      style={
                        especialidade
                          ? styles.seletorTextoPreenchido
                          : styles.seletorTextoVazio
                      }
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
              </>
            ) : null}

            <Button
              title={tituloBotao}
              onPress={salvar}
              loading={enviando}
              style={styles.botaoAcao}
            />

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

import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  UIManager,
  LayoutAnimation,
  ScrollView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
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

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OPCOES_TIPO = [
  {
    key: TIPOS_CADASTRO.CUIDADOR,
    label: 'Cuidador',
    descricao: 'Cadastre-se para oferecer seus serviços, encontrar famílias e trabalhar com cuidado de idosos.',
    icon: 'health-and-safety',
    iconFamily: 'MaterialIcons',
  },
  {
    key: TIPOS_CADASTRO.FAMILIAR,
    label: 'Familiar',
    descricao: 'Cadastre-se para gerenciar a rotina do idoso, acompanhar relatórios diários e contratar cuidadores.',
    icon: 'home',
    iconFamily: 'MaterialIcons',
  },
  {
    key: TIPOS_CADASTRO.IDOSO,
    label: 'Idoso',
    descricao: 'Perfil simplificado e prático para o idoso acompanhar suas atividades, compromissos e lembretes.',
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
  const precisaSenha =
    tipo === TIPOS_CADASTRO.CUIDADOR ||
    tipo === TIPOS_CADASTRO.FAMILIAR ||
    tipo === TIPOS_CADASTRO.IDOSO;
  const precisaEspecialidade = tipo === TIPOS_CADASTRO.CUIDADOR;

  const perfilSelecionadoInfo = OPCOES_TIPO.find((item) => item.key === tipo);

  const handleSelecionarTipo = useCallback(
    (key) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      selecionarTipo(key);
    },
    [selecionarTipo]
  );

  return (
    <SafeAreaView style={styles.containerScroll} edges={['top', 'bottom']}>
      {/* ScrollView externa configurada para aceitar gestos de Zoom (Pinça com dois dedos) */}
      <ScrollView
        maximumZoomScale={2.5}
        minimumZoomScale={1}
        bouncesZoom={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <KeyboardAwareScrollView
          style={styles.containerScroll}
          contentContainerStyle={styles.contentScroll}
          enableOnAndroid
          extraScrollHeight={100}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.viewPrincipal}>
              <ScreenHeader
                title="Criar conta"
                subtitle="Escolha o perfil e preencha seus dados"
                onBack={() => navigation.goBack()}
              />

              {/* SELETOR DE TIPO DE PERFIL */}
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
                      style={[
                        styles.cardTipo,
                        ativo && [styles.cardTipoAtivo, { borderColor: cor }],
                      ]}
                      onPress={() => handleSelecionarTipo(opcao.key)}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityState={{ selected: ativo }}
                      accessibilityLabel={`Selecionar perfil ${opcao.label}`}
                    >
                      <View
                        style={[
                          styles.iconeCircle,
                          ativo && { backgroundColor: `${cor}20` },
                        ]}
                      >
                        <Icone
                          name={opcao.icon}
                          size={22}
                          color={ativo ? cor : themeColors.textSecondary}
                        />
                      </View>
                      <Text
                        style={[
                          styles.cardTipoLabel,
                          ativo && [styles.cardTipoLabelAtivo, { color: cor }],
                        ]}
                      >
                        {opcao.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* BALÃO INTERATIVO DE INFORMAÇÃO DO PERFIL */}
              {perfilSelecionadoInfo && (
                <View
                  style={[
                    styles.balaoInfo,
                    { backgroundColor: `${accentColor}12`, borderColor: accentColor },
                  ]}
                >
                  <View style={styles.balaoHeader}>
                    <View style={[styles.badgeIcon, { backgroundColor: accentColor }]}>
                      <MaterialIcons name="auto-awesome" size={14} color="#FFF" />
                    </View>
                    <Text style={[styles.balaoTitulo, { color: accentColor }]}>
                      Perfil: {perfilSelecionadoInfo.label}
                    </Text>
                  </View>
                  <Text style={styles.balaoTexto}>
                    {perfilSelecionadoInfo.descricao}
                  </Text>
                </View>
              )}

              {/* DADOS PESSOAIS SOLTOS NA TELA (SEM CARD/LABEL ENVOLTA) */}
              <View style={styles.containerInputsPessoais}>
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
                  <View style={styles.wrapperEspecialidade}>
                    <Text style={styles.rotuloEspecialidade}>Especialidade</Text>
                    {especialidade !== OPCAO_OUTRA_ESPECIALIDADE ? (
                      <TouchableOpacity
                        style={styles.seletor}
                        onPress={() => {
                          Haptics.selectionAsync();
                          setModalEspecialidadeVisivel(true);
                        }}
                        activeOpacity={0.7}
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
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          size={22}
                          color={themeColors.textSecondary}
                        />
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
                  </View>
                ) : null}
              </View>

              {/* BOTÃO PRINCIPAL */}
              <Button
                title={tituloBotao}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  salvar();
                }}
                loading={enviando}
                style={styles.botaoAcao}
              />

              <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.LOGIN)}
                accessibilityRole="button"
                accessibilityLabel="Entrar em uma conta existente"
                style={styles.linkLogin}
                activeOpacity={0.7}
              >
                <Text style={styles.textoLinkLogin}>
                  Já tenho conta — <Text style={{ color: accentColor, fontWeight: '700' }}>entrar com CPF</Text>
                </Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}
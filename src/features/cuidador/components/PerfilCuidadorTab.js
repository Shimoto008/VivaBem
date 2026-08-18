import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons } from '@expo/vector-icons';

import {
  Input,
  Button,
  PreferenciasAparencia,
  SecaoInstitucional,
  BotaoLogout,
  BotaoExcluirConta,
  AvatarPerfil,
} from '../../../components/ui';
import { radius, spacing, typography } from '../../../theme';
import { useTheme } from '../../../contexts/ThemeContext';
import { useSession } from '../../../contexts/SessionContext';
import { atualizarPerfilCuidador } from '../../../services/cuidadorService';
import { aplicarMascaraTelefone, somenteDigitos } from '../../../utils/masks';
import { useFotoPerfil } from '../../../hooks/useFotoPerfil';

const DURACAO_FEEDBACK_COPIA_MS = 2000;

export function PerfilCuidadorTab() {
  const { perfil: cuidador, atualizarPerfilLocal, carregando } = useSession();
  const { themeColors, primaryColor } = useTheme();
  const styles = getStyles(themeColors);

  const persistirFoto = useCallback(
    (fotoUrl) => atualizarPerfilCuidador(cuidador?.id, { foto_url: fotoUrl }),
    [cuidador?.id]
  );
  const { enviando: enviandoFoto, selecionarEEnviar } = useFotoPerfil({
    userId: cuidador?.id,
    persistirUrl: persistirFoto,
    atualizarPerfilLocal,
  });

  const [editando, setEditando] = useState(false);
  const [telefoneEdicao, setTelefoneEdicao] = useState('');
  const [especialidadeEdicao, setEspecialidadeEdicao] = useState('');
  const [formacaoEdicao, setFormacaoEdicao] = useState('');
  const [biografiaEdicao, setBiografiaEdicao] = useState('');

  const [salvando, setSalvando] = useState(false);
  const [codigoCopiado, setCodigoCopiado] = useState(false);
  const [modalConfiguracoesVisivel, setModalConfiguracoesVisivel] = useState(false);

  const temporizadorCopiaRef = useRef(null);

  useEffect(() => {
    setTelefoneEdicao(aplicarMascaraTelefone(cuidador?.telefone ?? ''));
    setEspecialidadeEdicao(cuidador?.especialidade ?? '');
    setFormacaoEdicao(cuidador?.formacao ?? '');
    setBiografiaEdicao(cuidador?.biografia ?? '');
  }, [cuidador?.telefone, cuidador?.especialidade, cuidador?.formacao, cuidador?.biografia]);

  useEffect(() => () => clearTimeout(temporizadorCopiaRef.current), []);

  async function copiarCodigo() {
    if (!cuidador?.codigo) return;
    try {
      await Clipboard.setStringAsync(cuidador.codigo);
      setCodigoCopiado(true);
      clearTimeout(temporizadorCopiaRef.current);
      temporizadorCopiaRef.current = setTimeout(
        () => setCodigoCopiado(false),
        DURACAO_FEEDBACK_COPIA_MS
      );
    } catch {
      Alert.alert('Não foi possível copiar', 'Copie o código manualmente e envie ao familiar.');
    }
  }

  async function salvarEdicao() {
    setSalvando(true);
    try {
      const atualizado = await atualizarPerfilCuidador(cuidador.id, {
        telefone: somenteDigitos(telefoneEdicao),
        especialidade: especialidadeEdicao.trim() || null,
        formacao: formacaoEdicao.trim() || null,
        biografia: biografiaEdicao.trim() || null,
      });
      atualizarPerfilLocal(atualizado);
      setEditando(false);
      Alert.alert('Sucesso', 'Dados atualizados.');
    } catch (error) {
      const detalhe =
        error?.message ||
        error?.error_description ||
        'Não foi possível salvar as alterações.';
      Alert.alert('Erro', detalhe);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.containerCarregando}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  if (!cuidador) {
    return (
      <View style={styles.containerCarregando}>
        <MaterialIcons name="person-off" size={32} color={themeColors.textTertiary} />
        <Text style={styles.textoSecundario}>Nenhum cuidador logado nesta sessão.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerTopo}>
        <Text style={styles.tituloPagina}>Meu Perfil</Text>
        <TouchableOpacity
          onPress={() => setModalConfiguracoesVisivel(true)}
          style={styles.botaoConfiguracoes}
          accessibilityRole="button"
          accessibilityLabel="Abrir configurações"
        >
          <MaterialIcons name="settings" size={26} color={themeColors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.linhaCentralizada}>
          <AvatarPerfil
            uri={cuidador.foto_url}
            size={60}
            onPress={selecionarEEnviar}
            carregando={enviandoFoto}
            iconName="user-nurse"
            iconFamily="FontAwesome5"
            iconSize={28}
            accessibilityLabel="Alterar foto de perfil"
          />

          <View style={styles.infoPerfil}>
            <Text style={styles.nome}>{cuidador.nome}</Text>
            <Text style={styles.textoSecundario}>
              {cuidador.especialidade || 'Especialidade não informada'}
            </Text>
            <Text style={styles.textoSecundario}>
              {aplicarMascaraTelefone(cuidador.telefone ?? '') || 'Telefone não informado'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setEditando((atual) => !atual)}
            accessibilityRole="button"
            accessibilityLabel={editando ? 'Cancelar edição' : 'Editar perfil'}
            style={styles.botaoEditar}
          >
            <MaterialIcons
              name={editando ? 'close' : 'edit'}
              size={18}
              color={themeColors.textOnPrimary}
            />
          </TouchableOpacity>
        </View>

        {editando ? (
          <View style={styles.formularioEdicao}>
            <Input
              label="Telefone"
              value={telefoneEdicao}
              onChangeText={(texto) => setTelefoneEdicao(aplicarMascaraTelefone(texto))}
              keyboardType="numeric"
              maxLength={15}
              placeholder="(11) 90000-0000"
            />
            <Input
              label="Especialidade"
              value={especialidadeEdicao}
              onChangeText={setEspecialidadeEdicao}
              autoCapitalize="words"
              placeholder="Ex.: Técnico em Enfermagem"
            />
            <Input
              label="Formação Acadêmica / Cursos"
              value={formacaoEdicao}
              onChangeText={setFormacaoEdicao}
              autoCapitalize="sentences"
              placeholder="Ex.: Auxiliar de Enfermagem (Senac) - 2021"
            />
            <Input
              label="Sobre Mim (Biografia)"
              value={biografiaEdicao}
              onChangeText={setBiografiaEdicao}
              autoCapitalize="sentences"
              placeholder="Escreva um pouco sobre sua experiência profissional e perfil de atendimento..."
              multiline
              numberOfLines={4}
              style={{ minHeight: 90, textAlignVertical: 'top' }}
            />
            <Button title="Salvar Alterações" onPress={salvarEdicao} loading={salvando} />
          </View>
        ) : null}
      </View>

      {!editando && (
        <View style={styles.cardInfoSecundaria}>
          <Text style={styles.secaoSubtitulo}>Formação Acadêmica</Text>
          <Text style={styles.textoDetalhe}>
            {cuidador.formacao || 'Nenhuma formação cadastrada ainda.'}
          </Text>

          <View style={styles.divisorApresentacao} />

          <Text style={styles.secaoSubtitulo}>Biografia / Apresentação</Text>
          <Text style={styles.textoDetalhe}>
            {cuidador.biografia || 'Adicione uma breve apresentação para que os familiares te conheçam melhor.'}
          </Text>
        </View>
      )}

      <Modal
        visible={modalConfiguracoesVisivel}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalConfiguracoesVisivel(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitulo}>Configurações</Text>
            <TouchableOpacity onPress={() => setModalConfiguracoesVisivel(false)}>
              <MaterialIcons name="close" size={28} color={themeColors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalConteudo} showsVerticalScrollIndicator={false}>
            <Text style={styles.secaoTitulo}>Código de Vínculo</Text>
            <View style={[styles.cardCodigo, { borderColor: primaryColor }]}>
              <Text style={styles.textoSecundario}>
                Informe este código ao familiar para que ele se conecte a você.
              </Text>

              <View style={styles.linhaCodigo}>
                <Text style={[styles.codigo, { color: primaryColor }]}>
                  {cuidador.codigo ?? '------'}
                </Text>
                <TouchableOpacity
                  onPress={copiarCodigo}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Copiar código de vínculo"
                  style={[styles.botaoCopiar, { backgroundColor: primaryColor }]}
                >
                  <MaterialIcons
                    name={codigoCopiado ? 'check' : 'content-copy'}
                    size={16}
                    color={themeColors.textOnPrimary}
                  />
                  <Text style={styles.textoBotaoCopiar}>
                    {codigoCopiado ? 'Copiado!' : 'Copiar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.secaoTitulo}>Aparência e Preferências</Text>
            <PreferenciasAparencia />

            <SecaoInstitucional />

            <View style={styles.divisorLogout} />

            <BotaoLogout />
            <BotaoExcluirConta />
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, paddingBottom: spacing.xl, paddingHorizontal: spacing.sm },
    containerCarregando: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      gap: spacing.sm,
    },
    headerTopo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: spacing.md,
      paddingHorizontal: spacing.xs,
    },
    tituloPagina: {
      ...typography.title1,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    botaoConfiguracoes: {
      padding: spacing.xs,
    },
    card: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: radius.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    linhaCentralizada: { flexDirection: 'row', alignItems: 'center' },
    infoPerfil: { flex: 1, marginLeft: spacing.lg },
    nome: { ...typography.title2, color: colors.textPrimary },
    textoSecundario: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
    botaoEditar: {
      width: 44,
      height: 44,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    formularioEdicao: {
      marginTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      paddingTop: spacing.lg,
    },
    cardInfoSecundaria: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: radius.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    secaoSubtitulo: {
      ...typography.caption,
      fontWeight: 'bold',
      fontSize: 13,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    textoDetalhe: {
      ...typography.caption,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    divisorApresentacao: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.md,
    },
    secaoTitulo: {
      ...typography.caption,
      fontWeight: '700',
      textTransform: 'uppercase',
      color: colors.textSecondary,
      marginBottom: spacing.sm,
      marginLeft: spacing.xs,
    },
    cardCodigo: {
      backgroundColor: colors.primarySoft,
      padding: spacing.lg,
      borderRadius: radius.lg,
      marginBottom: spacing.lg,
      borderWidth: 1.5,
      borderStyle: 'dashed',
    },
    linhaCodigo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.sm,
    },
    codigo: { ...typography.largeTitle, letterSpacing: 4 },
    botaoCopiar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.full,
    },
    textoBotaoCopiar: {
      ...typography.caption,
      fontWeight: '700',
      color: colors.textOnPrimary,
      marginLeft: spacing.xs,
    },
    modalContainer: {
      flex: 1,
      padding: spacing.lg,
      paddingTop: spacing.xl * 1.5,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    modalTitulo: {
      ...typography.title2,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    modalConteudo: {
      flex: 1,
    },
    divisorLogout: {
      marginVertical: spacing.xl,
    },
  });
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

import { Input, Button, PreferenciasAparencia, BotaoLogout } from '../../../components/ui';
import { radius, spacing, typography } from '../../../theme';
import { useTheme } from '../../../contexts/ThemeContext';
import { useSession } from '../../../contexts/SessionContext';
import { atualizarPerfilCuidador } from '../../../services/cuidadorService';
import { aplicarMascaraTelefone, somenteDigitos } from '../../../utils/masks';

const DURACAO_FEEDBACK_COPIA_MS = 2000;
const QUALIDADE_FOTO = 0.7;

export function PerfilCuidadorTab() {
  const { perfil: cuidador, atualizarPerfilLocal, carregando } = useSession();
  const { themeColors, primaryColor } = useTheme();
  const styles = getStyles(themeColors);

  const [foto, setFoto] = useState(null);
  const [editando, setEditando] = useState(false);
  const [telefoneEdicao, setTelefoneEdicao] = useState('');
  const [especialidadeEdicao, setEspecialidadeEdicao] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [codigoCopiado, setCodigoCopiado] = useState(false);
  const temporizadorCopiaRef = useRef(null);

  useEffect(() => {
    setTelefoneEdicao(aplicarMascaraTelefone(cuidador?.telefone ?? ''));
    setEspecialidadeEdicao(cuidador?.especialidade ?? '');
  }, [cuidador?.telefone, cuidador?.especialidade]);

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

  async function selecionarFoto() {
    try {
      const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissao.granted) {
        Alert.alert('Permissão necessária', 'Autorize o acesso à galeria para escolher uma foto.');
        return;
      }
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: QUALIDADE_FOTO,
      });
      if (!resultado.canceled) setFoto(resultado.assets[0].uri);
    } catch {
      Alert.alert('Não foi possível abrir a galeria', 'Tente novamente em alguns instantes.');
    }
  }

  async function salvarEdicao() {
    setSalvando(true);
    try {
      const atualizado = await atualizarPerfilCuidador(cuidador.id, {
        telefone: somenteDigitos(telefoneEdicao),
        especialidade: especialidadeEdicao.trim() || null,
      });
      atualizarPerfilLocal(atualizado);
      setEditando(false);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
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
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.linhaCentralizada}>
          <TouchableOpacity
            onPress={selecionarFoto}
            accessibilityRole="button"
            accessibilityLabel="Alterar foto de perfil"
          >
            {foto ? (
              <Image source={{ uri: foto }} style={styles.foto} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
                <FontAwesome5 name="user-nurse" size={28} color={themeColors.white} />
              </View>
            )}
          </TouchableOpacity>

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
            <Button title="Salvar Alterações" onPress={salvarEdicao} loading={salvando} />
          </View>
        ) : null}
      </View>

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
            <Text style={styles.textoBotaoCopiar}>{codigoCopiado ? 'Copiado!' : 'Copiar'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.secaoTitulo}>Aparência e Preferências</Text>
      <PreferenciasAparencia />

      <BotaoLogout />
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, paddingBottom: spacing.lg },
    containerCarregando: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      gap: spacing.sm,
    },
    card: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: radius.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    linhaCentralizada: { flexDirection: 'row', alignItems: 'center' },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    foto: { width: 60, height: 60, borderRadius: radius.full },
    infoPerfil: { flex: 1, marginLeft: spacing.lg },
    nome: { ...typography.title2, color: colors.textPrimary },
    textoSecundario: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
    botaoEditar: {
      width: 36,
      height: 36,
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
  });

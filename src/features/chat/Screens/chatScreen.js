import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../../../contexts/ThemeContext';
import { useSession } from '../../../contexts/SessionContext';
import { EmptyState } from '../../../components/ui';
import { radius, spacing, typography } from '../../../theme';
import {
  buscarMensagens,
  enviarMensagem,
  escutarNovasMensagens,
} from '../../../services/ChatServices';

const KEYBOARD_VERTICAL_OFFSET_IOS = 64;

function formatarHora(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function resolverDestinatario(params) {
  const {
    destinatarioId,
    nomeDestinatario,
    cuidadorId,
    nomeCuidador,
    familiarId,
    nomeFamiliar,
  } = params || {};

  if (destinatarioId) {
    return { destinatarioId, titulo: nomeDestinatario || 'Conversa' };
  }
  if (cuidadorId) {
    return { destinatarioId: cuidadorId, titulo: nomeCuidador || 'Conversa' };
  }
  if (familiarId) {
    return { destinatarioId: familiarId, titulo: nomeFamiliar || 'Conversa' };
  }
  return { destinatarioId: null, titulo: 'Conversa' };
}

export default function ChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { themeColors, primaryColor } = useTheme();
  const { user, perfil } = useSession();
  const styles = getStyles(themeColors, primaryColor);
  const listaRef = useRef(null);
  const erroAlertadoRef = useRef(null);

  const { destinatarioId, titulo } = resolverDestinatario(route.params);
  const euId = user?.id ?? perfil?.id;

  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensagemTexto, setMensagemTexto] = useState('');
  const [erro, setErro] = useState(null);
  const [tecladoVisivel, setTecladoVisivel] = useState(false);

  useEffect(() => {
    if (!euId || !destinatarioId) {
      setCarregando(false);
      return undefined;
    }

    let ativo = true;
    setCarregando(true);
    setErro(null);

    async function carregarHistorico() {
      try {
        const dados = await buscarMensagens({ euId, outroId: destinatarioId });
        if (ativo) setMensagens(dados);
      } catch (err) {
        if (ativo) setErro(err.message || 'Erro ao carregar mensagens.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarHistorico();

    const cancelar = escutarNovasMensagens({ euId, outroId: destinatarioId }, (nova) => {
      if (!ativo) return;
      setMensagens((prev) => {
        if (prev.some((m) => m.id === nova.id)) return prev;
        return [...prev, nova];
      });
    });

    return () => {
      ativo = false;
      cancelar();
    };
  }, [euId, destinatarioId]);

  useEffect(() => {
    if (!erro || erroAlertadoRef.current === erro) return;
    erroAlertadoRef.current = erro;
    Alert.alert('Chat', erro);
  }, [erro]);

  useEffect(() => {
    const eventoShow = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const eventoHide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const subShow = Keyboard.addListener(eventoShow, () => {
      setTecladoVisivel(true);
      requestAnimationFrame(() => {
        listaRef.current?.scrollToEnd({ animated: true });
      });
    });
    const subHide = Keyboard.addListener(eventoHide, () => {
      setTecladoVisivel(false);
    });

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  const podeEnviar = !!mensagemTexto.trim() && !enviando && !!euId && !!destinatarioId;
  const paddingInputBottom = tecladoVisivel ? spacing.md : spacing.md + insets.bottom;

  async function handleEnviar() {
    if (!podeEnviar) return;
    const texto = mensagemTexto.trim();
    setMensagemTexto('');
    setEnviando(true);
    setErro(null);

    const tempId = `temp_${Date.now()}`;
    setMensagens((prev) => [
      ...prev,
      {
        id: tempId,
        remetente_id: euId,
        destinatario_id: destinatarioId,
        conteudo: texto,
        created_at: new Date().toISOString(),
      },
    ]);

    try {
      const salva = await enviarMensagem({ destinatarioId, conteudo: texto });
      setMensagens((prev) => {
        const semTemp = prev.filter((m) => m.id !== tempId);
        if (salva?.id && !semTemp.some((m) => m.id === salva.id)) {
          return [...semTemp, salva];
        }
        return semTemp;
      });
    } catch (err) {
      setMensagens((prev) => prev.filter((m) => m.id !== tempId));
      setErro(err.message || 'Não foi possível enviar a mensagem.');
    } finally {
      setEnviando(false);
    }
  }

  function scrollParaFim() {
    if (mensagens.length > 0) {
      listaRef.current?.scrollToEnd({ animated: true });
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? KEYBOARD_VERTICAL_OFFSET_IOS : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <MaterialIcons name="arrow-back" size={24} color={themeColors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.nome} numberOfLines={1}>
            {titulo}
          </Text>
        </View>

        {carregando ? (
          <ActivityIndicator size="large" color={primaryColor} style={styles.flex} />
        ) : (
          <FlatList
            ref={listaRef}
            data={mensagens}
            keyExtractor={(item) => String(item.id)}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            contentContainerStyle={[
              styles.listaMensagens,
              mensagens.length === 0 && styles.listaVazia,
            ]}
            onContentSizeChange={scrollParaFim}
            onLayout={scrollParaFim}
            ListEmptyComponent={
              <EmptyState
                icon="chat-bubble-outline"
                title="Nenhuma mensagem ainda"
                description="Envie a primeira mensagem para iniciar a conversa."
              />
            }
            renderItem={({ item }) => {
              const enviadoPorMim = item.remetente_id === euId;
              return (
                <View
                  style={[
                    styles.balaoMensagem,
                    enviadoPorMim ? styles.balaoMinhaMensagem : styles.balaoOutraMensagem,
                  ]}
                >
                  <Text
                    style={enviadoPorMim ? styles.textoMinhaMensagem : styles.textoOutraMensagem}
                  >
                    {item.conteudo}
                  </Text>
                  <Text
                    style={enviadoPorMim ? styles.horaMinhaMensagem : styles.horaOutraMensagem}
                  >
                    {formatarHora(item.created_at)}
                  </Text>
                </View>
              );
            }}
          />
        )}

        <View style={[styles.containerInput, { paddingBottom: paddingInputBottom }]}>
          <TextInput
            style={styles.input}
            placeholder="Digite uma mensagem..."
            placeholderTextColor={themeColors.textSecondary}
            value={mensagemTexto}
            onChangeText={setMensagemTexto}
            multiline
            maxLength={1000}
            editable={!!euId && !!destinatarioId}
          />
          <TouchableOpacity
            style={[styles.botaoEnviar, !podeEnviar && styles.botaoEnviarDesabilitado]}
            onPress={handleEnviar}
            disabled={!podeEnviar}
            accessibilityRole="button"
            accessibilityLabel="Enviar mensagem"
          >
            {enviando ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <MaterialIcons name="send" size={20} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors, primaryColor) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    nome: {
      ...typography.title3,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginLeft: spacing.md,
      flex: 1,
    },
    listaMensagens: { padding: spacing.lg, flexGrow: 1 },
    listaVazia: { justifyContent: 'center' },
    balaoMensagem: {
      maxWidth: '80%',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      borderRadius: radius.lg,
      marginBottom: spacing.sm,
    },
    balaoMinhaMensagem: {
      alignSelf: 'flex-end',
      backgroundColor: primaryColor,
      borderBottomRightRadius: 4,
    },
    balaoOutraMensagem: {
      alignSelf: 'flex-start',
      backgroundColor: colors.surface,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    textoMinhaMensagem: { ...typography.body, color: '#FFF' },
    textoOutraMensagem: { ...typography.body, color: colors.textPrimary },
    horaMinhaMensagem: {
      ...typography.caption,
      fontSize: 11,
      color: 'rgba(255,255,255,0.75)',
      marginTop: 4,
      alignSelf: 'flex-end',
    },
    horaOutraMensagem: {
      ...typography.caption,
      fontSize: 11,
      color: colors.textTertiary,
      marginTop: 4,
      alignSelf: 'flex-end',
    },
    containerInput: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    input: {
      flex: 1,
      borderRadius: radius.full,
      paddingHorizontal: spacing.lg,
      paddingVertical: Platform.OS === 'ios' ? spacing.sm + 2 : spacing.sm,
      marginRight: spacing.sm,
      maxHeight: 120,
      color: colors.textPrimary,
      backgroundColor: colors.background,
      fontSize: 16,
    },
    botaoEnviar: {
      width: 44,
      height: 44,
      borderRadius: radius.full,
      backgroundColor: primaryColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    botaoEnviarDesabilitado: { opacity: 0.45 },
  });

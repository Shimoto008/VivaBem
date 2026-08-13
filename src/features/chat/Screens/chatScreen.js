import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../../../contexts/ThemeContext';
import { useSession } from '../../../contexts/SessionContext';
import { EmptyState } from '../../../components/ui';
import { spacing } from '../../../theme';
import { formatarHoraPtBR } from '../../../utils/dateUtils';
import { useChat } from '../hooks/useChat';
import { getStyles } from './ChatScreen.styles';

const KEYBOARD_VERTICAL_OFFSET_IOS = 64;

export default function ChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { themeColors, primaryColor } = useTheme();
  const { user, perfil } = useSession();
  const styles = getStyles(themeColors, primaryColor);
  const listaRef = useRef(null);

  const destinatarioId = route.params?.destinatarioId ?? null;
  const titulo = route.params?.nomeDestinatario || 'Conversa';
  const euId = user?.id ?? perfil?.id;

  const {
    mensagens,
    carregando,
    enviando,
    mensagemTexto,
    setMensagemTexto,
    podeEnviar,
    enviar,
  } = useChat({ euId, destinatarioId });

  const [tecladoVisivel, setTecladoVisivel] = useState(false);

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

  const paddingInputBottom = tecladoVisivel ? spacing.md : spacing.md + insets.bottom;

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
                    {formatarHoraPtBR(item.created_at)}
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
            onPress={enviar}
            disabled={!podeEnviar}
            accessibilityRole="button"
            accessibilityLabel="Enviar mensagem"
          >
            {enviando ? (
              <ActivityIndicator size="small" color={themeColors.textOnPrimary} />
            ) : (
              <MaterialIcons name="send" size={20} color={themeColors.textOnPrimary} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

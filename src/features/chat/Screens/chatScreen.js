import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useSession } from '../../../contexts/SessionContext';
import {
  buscarMensagens,
  enviarMensagemBanco,
  escutarNovasMensagens,
} from '../../../services/ChatServices';

export default function ChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { themeColors, primaryColor } = useTheme();
  const { user } = useSession(); // Dados do usuário logado na sessão

  const { cuidadorId, nomeCuidador } = route.params || {};

  const [mensagemTexto, setMensagemTexto] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // 1. Carregar histórico e ativar Realtime ao abrir a tela
  useEffect(() => {
    if (!cuidadorId) return;

    async function carregarHistorico() {
      try {
        const dados = await buscarMensagens(cuidadorId);
        setMensagens(dados);
      } catch (err) {
        console.error('Erro ao carregar chat:', err);
      } finally {
        setCarregando(false);
      }
    }

    carregarHistorico();

    // Inscrição no canal em tempo real
    const cancelarInscricao = escutarNovasMensagens(cuidadorId, (novaMsg) => {
      setMensagens((prev) => [...prev, novaMsg]);
    });

    return () => {
      cancelarInscricao();
    };
  }, [cuidadorId]);

  // 2. Função de Envio de Mensagem
  const handleEnviarMensagem = async () => {
    if (!mensagemTexto.trim()) return;

    const textoParaEnviar = mensagemTexto.trim();
    setMensagemTexto('');

    try {
      await enviarMensagemBanco({
        cuidadorId,
        remetenteId: user.id,
        texto: textoParaEnviar,
      });
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* CABEÇALHO */}
        <View style={[styles.header, { backgroundColor: themeColors.surface }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={themeColors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.nome, { color: themeColors.textPrimary, marginLeft: 12 }]}>
            {nomeCuidador || 'Conversa'}
          </Text>
        </View>

        {/* LISTA DE MENSAGENS */}
        {carregando ? (
          <ActivityIndicator size="large" color={primaryColor} style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={mensagens}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listaMensagens}
            renderItem={({ item }) => {
              const enviadoPorMim = item.remetente_id === user?.id;
              return (
                <View
                  style={[
                    styles.balaoMensagem,
                    enviadoPorMim
                      ? [styles.balaoMinhaMensagem, { backgroundColor: primaryColor }]
                      : [styles.balaoOutraMensagem, { backgroundColor: themeColors.surface }],
                  ]}
                >
                  <Text style={{ color: enviadoPorMim ? '#FFF' : themeColors.textPrimary }}>
                    {item.texto}
                  </Text>
                </View>
              );
            }}
          />
        )}

        {/* CAMPO DE DIGITAÇÃO */}
        <View style={[styles.containerInput, { backgroundColor: themeColors.surface }]}>
          <TextInput
            style={[styles.input, { color: themeColors.textPrimary, backgroundColor: themeColors.background }]}
            placeholder="Digite uma mensagem..."
            placeholderTextColor={themeColors.textSecondary}
            value={mensagemTexto}
            onChangeText={setMensagemTexto}
          />
          <TouchableOpacity
            style={[styles.botaoEnviar, { backgroundColor: primaryColor }]}
            onPress={handleEnviarMensagem}
          >
            <MaterialIcons name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, elevation: 2 },
  nome: { fontSize: 18, fontWeight: 'bold' },
  listaMensagens: { padding: 16 },
  balaoMensagem: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 10 },
  balaoMinhaMensagem: { alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  balaoOutraMensagem: { alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
  containerInput: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  botaoEnviar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../../../contexts/ThemeContext';
import { useSession } from '../../../contexts/SessionContext';
import { EmptyState } from '../../../components/ui';
import { ROUTES } from '../../../constants/routeNames';
import { listarConversas } from '../../../services/ChatServices';
import { radius, spacing, typography } from '../../../theme';

function formatarDataCurta(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function ConversasScreen() {
  const navigation = useNavigation();
  const { themeColors, primaryColor } = useTheme();
  const { user, perfil, tipoUsuario } = useSession();
  const styles = getStyles(themeColors, primaryColor);
  const euId = user?.id ?? perfil?.id;

  const [conversas, setConversas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(null);

  const emptyDescription =
    tipoUsuario === 'familiar'
      ? 'Nenhuma conversa iniciada. Encontre cuidadores no mapa para solicitar o código de conexão!'
      : 'Quando um familiar iniciar uma conversa com você, ela aparecerá aqui.';

  const carregar = useCallback(
    async (silencioso = false) => {
      if (!euId) {
        setCarregando(false);
        return;
      }
      if (!silencioso) setCarregando(true);
      setErro(null);
      try {
        const lista = await listarConversas(euId);
        setConversas(lista);
      } catch (err) {
        setErro(err.message || 'Erro ao carregar conversas.');
      } finally {
        setCarregando(false);
        setAtualizando(false);
      }
    },
    [euId]
  );

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function abrirConversa(item) {
    navigation.navigate(ROUTES.CHAT, {
      destinatarioId: item.destinatarioId,
      nomeDestinatario: item.nomeDestinatario,
    });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <MaterialIcons name="arrow-back" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.titulo}>Conversas</Text>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color={primaryColor} style={styles.flex} />
      ) : (
        <FlatList
          data={conversas}
          keyExtractor={(item) => String(item.destinatarioId)}
          contentContainerStyle={[
            styles.lista,
            conversas.length === 0 && styles.listaVazia,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => {
                setAtualizando(true);
                carregar(true);
              }}
              tintColor={primaryColor}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="chat-bubble-outline"
              title="Sem conversas"
              description={erro || emptyDescription}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => abrirConversa(item)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={`Abrir conversa com ${item.nomeDestinatario}`}
            >
              <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
                <MaterialIcons name="person" size={22} color="#FFF" />
              </View>
              <View style={styles.info}>
                <View style={styles.linhaTitulo}>
                  <Text style={styles.nome} numberOfLines={1}>
                    {item.nomeDestinatario}
                  </Text>
                  <Text style={styles.data}>{formatarDataCurta(item.ultimaMensagemEm)}</Text>
                </View>
                <Text style={styles.preview} numberOfLines={1}>
                  {item.ultimaMensagem || 'Sem mensagens'}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={themeColors.textTertiary} />
            </TouchableOpacity>
          )}
        />
      )}
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
      gap: spacing.md,
    },
    titulo: {
      ...typography.title3,
      fontWeight: 'bold',
      color: colors.textPrimary,
      flex: 1,
    },
    lista: { padding: spacing.lg, flexGrow: 1 },
    listaVazia: { justifyContent: 'center' },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.md,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: { flex: 1, minWidth: 0 },
    linhaTitulo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    nome: {
      ...typography.bodyBold,
      color: colors.textPrimary,
      flex: 1,
    },
    data: {
      ...typography.caption,
      fontSize: 11,
      color: colors.textTertiary,
    },
    preview: {
      ...typography.caption,
      color: colors.textSecondary,
      marginTop: 2,
    },
  });

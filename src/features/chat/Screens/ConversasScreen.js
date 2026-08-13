import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../../../contexts/ThemeContext';
import { useSession } from '../../../contexts/SessionContext';
import { EmptyState } from '../../../components/ui';
import { ROUTES } from '../../../constants/routeNames';
import { formatarDataHoraCurtaPtBR } from '../../../utils/dateUtils';
import { useConversas } from '../hooks/useConversas';
import { getStyles } from './ConversasScreen.styles';

export default function ConversasScreen() {
  const navigation = useNavigation();
  const { themeColors, primaryColor } = useTheme();
  const { user, perfil, tipoUsuario } = useSession();
  const styles = getStyles(themeColors, primaryColor);
  const euId = user?.id ?? perfil?.id;

  const { conversas, carregando, atualizando, erro, atualizarManualmente } = useConversas(euId);

  const emptyDescription =
    tipoUsuario === 'familiar'
      ? 'Nenhuma conversa iniciada. Encontre cuidadores no mapa para solicitar o código de conexão!'
      : 'Quando um familiar iniciar uma conversa com você, ela aparecerá aqui.';

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
              onRefresh={atualizarManualmente}
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
              <View style={styles.avatar}>
                <MaterialIcons name="person" size={22} color={themeColors.textOnPrimary} />
              </View>
              <View style={styles.info}>
                <View style={styles.linhaTitulo}>
                  <Text style={styles.nome} numberOfLines={1}>
                    {item.nomeDestinatario}
                  </Text>
                  <Text style={styles.data}>
                    {formatarDataHoraCurtaPtBR(item.ultimaMensagemEm)}
                  </Text>
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

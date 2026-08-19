import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useBuscarCuidadores } from '../hooks/useBuscarCuidador';
import { useTheme } from '../../../contexts/ThemeContext';
import { ROUTES } from '../../../constants/routeNames';
import { radius, spacing, typography } from '../../../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Posição padrão fallback garantida para evitar lat/lng undefined
const POSICAO_PADRAO = {
  latitude: -23.55052,
  longitude: -46.633308,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapaCuidador() {
  const navigation = useNavigation();
  const { themeColors, primaryColor } = useTheme();
  const styles = getStyles(themeColors, primaryColor);

  const { minhaPosicao, cuidadoresProximos = [], loading, error } = useBuscarCuidadores(10000);

  const [cuidadorSelecionado, setCuidadorSelecionado] = useState(null);
  const [listaExpandida, setListaExpandida] = useState(false);

  // Garante que a latitude/longitude sejam números válidos
  const regiaoInicial = {
    latitude: Number(minhaPosicao?.latitude) || POSICAO_PADRAO.latitude,
    longitude: Number(minhaPosicao?.longitude) || POSICAO_PADRAO.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const handleIniciarChat = (cuidador) => {
    navigation.navigate(ROUTES.CHAT, {
      destinatarioId: cuidador.id,
      nomeDestinatario: cuidador.nome,
    });
  };

  if (loading) {
    return (
      <View style={styles.containerCarregando}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={styles.textoCarregando}>Buscando cuidadores no banco de dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapa}
        provider={PROVIDER_DEFAULT}
        initialRegion={regiaoInicial}
        showsUserLocation={!!minhaPosicao}
        showsMyLocationButton={!!minhaPosicao}
      >
        {Array.isArray(cuidadoresProximos) &&
          cuidadoresProximos.map((cuidador) => {
            const lat = Number(cuidador?.lat);
            const lng = Number(cuidador?.lng);

            // Se as coordenadas do cuidador forem inválidas, ignora para não fechar o app
            if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return null;

            return (
              <Marker
                key={cuidador.id}
                coordinate={{ latitude: lat, longitude: lng }}
                pinColor={cuidadorSelecionado?.id === cuidador.id ? '#10B981' : primaryColor}
                onPress={() => setCuidadorSelecionado(cuidador)}
              >
                <Callout
                  style={styles.callout}
                  onPress={() => handleIniciarChat(cuidador)}
                >
                  <Text style={styles.calloutNome}>{cuidador.nome}</Text>
                  <Text style={styles.calloutEspecialidade}>{cuidador.especialidade}</Text>
                  <Text style={styles.calloutAcao}>Toque para conversar</Text>
                </Callout>
              </Marker>
            );
          })}
      </MapView>

      <View style={[styles.abaInferior, listaExpandida && styles.abaInferiorExpandida]}>
        <TouchableOpacity
          style={styles.alcaAba}
          onPress={() => setListaExpandida(!listaExpandida)}
          activeOpacity={0.8}
        >
          <View style={styles.barraAlca} />
          <View style={styles.linhaHeaderAba}>
            <Text style={styles.tituloAba}>
              Cuidadores Cadastrados ({cuidadoresProximos?.length || 0})
            </Text>
            <MaterialIcons
              name={listaExpandida ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
              size={24}
              color={themeColors.textSecondary}
            />
          </View>
        </TouchableOpacity>

        {error && <Text style={styles.textoErro}>Erro ao carregar: {error}</Text>}

        <FlatList
          data={cuidadoresProximos}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          ListEmptyComponent={
            <Text style={styles.textoVazio}>
              Nenhum cuidador cadastrado foi encontrado nesta região.
            </Text>
          }
          renderItem={({ item }) => {
            const isSelecionado = cuidadorSelecionado?.id === item.id;
            const distanciaKm = item.distancia_metros
              ? (item.distancia_metros / 1000).toFixed(1)
              : null;

            return (
              <TouchableOpacity
                style={[
                  styles.cardCuidador,
                  isSelecionado && { borderColor: primaryColor, borderWidth: 2 },
                ]}
                onPress={() => setCuidadorSelecionado(item)}
                activeOpacity={0.7}
              >
                <View style={styles.avatarIcone}>
                  <MaterialIcons name="person" size={24} color={primaryColor} />
                </View>

                <View style={styles.infoCuidador}>
                  <Text style={styles.nomeCuidador}>{item.nome}</Text>
                  <Text style={styles.especialidadeCuidador}>{item.especialidade}</Text>
                  {distanciaKm && (
                    <Text style={styles.textoDetalhe}>• a {distanciaKm} km de você</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.botaoContato}
                  onPress={() => handleIniciarChat(item)}
                >
                  <MaterialIcons name="chat" size={20} color="#FFF" />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
}

const getStyles = (colors, primaryColor) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    containerCarregando: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    textoCarregando: {
      ...typography.caption,
      color: colors.textSecondary,
      marginTop: spacing.sm,
    },
    textoErro: {
      ...typography.caption,
      color: colors.danger || '#EF4444',
      marginBottom: spacing.xs,
    },
    textoVazio: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: 'center',
      marginVertical: spacing.lg,
    },
    mapa: { flex: 1, width: '100%', height: '100%' },
    callout: { padding: spacing.xs, minWidth: 150, alignItems: 'center' },
    calloutNome: { ...typography.title3 },
    calloutEspecialidade: { ...typography.caption, color: colors.textSecondary },
    calloutAcao: { ...typography.caption2, color: primaryColor, marginTop: 4, fontWeight: '600' },
    abaInferior: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      paddingHorizontal: spacing.lg,
      maxHeight: SCREEN_HEIGHT * 0.38,
      borderTopWidth: 1,
      borderColor: colors.border,
      elevation: 8,
    },
    abaInferiorExpandida: { maxHeight: SCREEN_HEIGHT * 0.7 },
    alcaAba: { alignItems: 'center', paddingVertical: spacing.sm },
    barraAlca: {
      width: 40,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      marginBottom: spacing.xs,
    },
    linhaHeaderAba: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    tituloAba: { ...typography.title3, color: colors.textPrimary, fontWeight: 'bold' },
    cardCuidador: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: spacing.md,
      borderRadius: radius.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    avatarIcone: {
      width: 42,
      height: 42,
      borderRadius: radius.full,
      backgroundColor: `${primaryColor}18`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.sm,
    },
    infoCuidador: { flex: 1 },
    nomeCuidador: { ...typography.title3, color: colors.textPrimary },
    especialidadeCuidador: { ...typography.caption, color: colors.textSecondary },
    textoDetalhe: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
    botaoContato: {
      backgroundColor: primaryColor,
      padding: spacing.xs + 4,
      borderRadius: radius.full,
      marginLeft: spacing.xs,
    },
  });
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useBuscarCuidadores } from '../hooks/useBuscarCuidador';
import { useTheme } from '../../../contexts/ThemeContext';
import { ROUTES } from '../../../constants/routeNames';
import { radius, spacing, typography } from '../../../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const DELTA_PADRAO = 0.05;

const POSICAO_PADRAO = {
  latitude: -23.55052,
  longitude: -46.633308,
  latitudeDelta: DELTA_PADRAO,
  longitudeDelta: DELTA_PADRAO,
};

const MAP_PROVIDER = Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined;

function coordenadaValida(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
}

export default function MapaCuidador() {
  const navigation = useNavigation();
  const { themeColors, primaryColor } = useTheme();
  const styles = useMemo(() => getStyles(themeColors, primaryColor), [themeColors, primaryColor]);

  const {
    minhaPosicao,
    cuidadoresProximos,
    loading,
    error,
    permissaoNegada,
    gpsDesligado,
    recarregar,
  } = useBuscarCuidadores(10000);

  const [cuidadorSelecionado, setCuidadorSelecionado] = useState(null);
  const [listaExpandida, setListaExpandida] = useState(false);

  const regiaoInicial = useMemo(() => {
    const lat = Number(minhaPosicao?.latitude);
    const lng = Number(minhaPosicao?.longitude);
    if (!coordenadaValida(lat, lng)) return POSICAO_PADRAO;
    return { latitude: lat, longitude: lng, latitudeDelta: DELTA_PADRAO, longitudeDelta: DELTA_PADRAO };
  }, [minhaPosicao]);

  const marcadores = useMemo(
    () =>
      (Array.isArray(cuidadoresProximos) ? cuidadoresProximos : [])
        .map((cuidador) => ({ cuidador, lat: Number(cuidador?.lat), lng: Number(cuidador?.lng) }))
        .filter(({ cuidador, lat, lng }) => cuidador?.id != null && coordenadaValida(lat, lng)),
    [cuidadoresProximos]
  );

  const handleIniciarChat = useCallback(
    (cuidador) => {
      navigation.navigate(ROUTES.CHAT, {
        destinatarioId: cuidador.id,
        nomeDestinatario: cuidador.nome,
      });
    },
    [navigation]
  );

  const keyExtractor = useCallback((item, index) => String(item?.id ?? index), []);

  const renderItem = useCallback(
    ({ item }) => {
      const isSelecionado = cuidadorSelecionado?.id === item.id;
      const distanciaKm = item.distancia_metros
        ? (item.distancia_metros / 1000).toFixed(1)
        : null;

      return (
        <TouchableOpacity
          style={[styles.cardCuidador, isSelecionado && styles.cardCuidadorSelecionado]}
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

          <TouchableOpacity style={styles.botaoContato} onPress={() => handleIniciarChat(item)}>
            <MaterialIcons name="chat" size={20} color={themeColors.textOnPrimary} />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    },
    [cuidadorSelecionado, styles, primaryColor, themeColors.textOnPrimary, handleIniciarChat]
  );

  if (loading) {
    return (
      <View style={styles.containerCarregando}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={styles.textoCarregando}>Buscando cuidadores próximos...</Text>
      </View>
    );
  }

  const acaoAviso = permissaoNegada
    ? { rotulo: 'Abrir configurações', aoPressionar: () => Linking.openSettings() }
    : { rotulo: 'Tentar novamente', aoPressionar: recarregar };

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <View style={styles.mapaFallback}>
          <MaterialIcons name="map" size={44} color={primaryColor} />
          <Text style={styles.tituloFallback}>Mapa indisponível no navegador</Text>
          <Text style={styles.textoFallback}>
            Abra o app no Android ou iOS para visualizar o mapa de cuidadores próximos.
          </Text>
        </View>
      ) : (
        <MapView
          key={minhaPosicao ? 'posicao-usuario' : 'posicao-padrao'}
          style={styles.mapa}
          provider={MAP_PROVIDER}
          initialRegion={regiaoInicial}
          loadingEnabled
          loadingIndicatorColor={primaryColor}
          showsUserLocation={!!minhaPosicao}
          showsMyLocationButton={!!minhaPosicao}
        >
          {marcadores.map(({ cuidador, lat, lng }) => (
            <Marker
              key={String(cuidador.id)}
              coordinate={{ latitude: lat, longitude: lng }}
              pinColor={cuidadorSelecionado?.id === cuidador.id ? themeColors.success : primaryColor}
              onPress={() => setCuidadorSelecionado(cuidador)}
            >
              <Callout style={styles.callout} onPress={() => handleIniciarChat(cuidador)}>
                <Text style={styles.calloutNome}>{cuidador.nome}</Text>
                <Text style={styles.calloutEspecialidade}>{cuidador.especialidade}</Text>
                <Text style={styles.calloutAcao}>Toque para conversar</Text>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}

      {error ? (
        <View style={styles.avisoMapa}>
          <MaterialIcons
            name={gpsDesligado || permissaoNegada ? 'location-off' : 'warning'}
            size={18}
            color={themeColors.danger}
          />
          <Text style={styles.textoErroMapa}>{error}</Text>
          <TouchableOpacity onPress={acaoAviso.aoPressionar} style={styles.botaoAviso}>
            <Text style={styles.textoBotaoAviso}>{acaoAviso.rotulo}</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={[styles.abaInferior, listaExpandida && styles.abaInferiorExpandida]}>
        <TouchableOpacity
          style={styles.alcaAba}
          onPress={() => setListaExpandida((atual) => !atual)}
          activeOpacity={0.8}
        >
          <View style={styles.barraAlca} />
          <View style={styles.linhaHeaderAba}>
            <Text style={styles.tituloAba}>
              Cuidadores Cadastrados ({cuidadoresProximos.length})
            </Text>
            <MaterialIcons
              name={listaExpandida ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
              size={24}
              color={themeColors.textSecondary}
            />
          </View>
        </TouchableOpacity>

        <FlatList
          data={cuidadoresProximos}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          extraData={cuidadorSelecionado}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews={Platform.OS === 'android'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.conteudoLista}
          ListEmptyComponent={
            <Text style={styles.textoVazio}>
              {error
                ? 'Não foi possível listar os cuidadores agora.'
                : 'Nenhum cuidador cadastrado foi encontrado nesta região.'}
            </Text>
          }
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
    textoVazio: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: 'center',
      marginVertical: spacing.lg,
    },
    mapa: { flex: 1, width: '100%', height: '100%' },
    mapaFallback: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      backgroundColor: colors.background,
    },
    tituloFallback: {
      ...typography.title3,
      color: colors.textPrimary,
      marginTop: spacing.md,
      textAlign: 'center',
    },
    textoFallback: {
      ...typography.caption,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      textAlign: 'center',
      lineHeight: 20,
    },
    avisoMapa: {
      position: 'absolute',
      top: spacing.md,
      left: spacing.md,
      right: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.sm,
    },
    textoErroMapa: {
      ...typography.caption,
      color: colors.danger,
      flex: 1,
    },
    botaoAviso: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.md,
      backgroundColor: primaryColor,
    },
    textoBotaoAviso: {
      ...typography.caption2,
      color: colors.textOnPrimary,
      fontWeight: '600',
    },
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
    conteudoLista: { paddingBottom: spacing.xl },
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
    cardCuidadorSelecionado: { borderColor: primaryColor, borderWidth: 2 },
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

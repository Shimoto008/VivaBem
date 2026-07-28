import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useBuscarCuidadores } from '../Hooks/useBuscarCuidadores';

export default function MapaCuidadoresScreen() {
  // Chamada limpa do hook do módulo Familiar (raio de 10km)
  const { minhaPosicao, cuidadoresProximos, loading, error } = useBuscarCuidadores(10000);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Procurando cuidadores na região...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {minhaPosicao && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: minhaPosicao.latitude,
            longitude: minhaPosicao.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
        >
          {cuidadoresProximos.map((cuidador) => (
            <Marker
              key={cuidador.id}
              coordinate={{
                latitude: cuidador.lat,
                longitude: cuidador.lng,
              }}
              title={cuidador.nome}
            >
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.nome}>{cuidador.nome}</Text>
                  <Text style={styles.especialidade}>{cuidador.especialidade}</Text>
                  <Text style={styles.distancia}>
                    A {(cuidador.distancia_metros / 1000).toFixed(1)} km
                  </Text>
                  <Text style={styles.codigo}>Código: {cuidador.codigo}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { width: '100%', height: '100%' },
  callout: { padding: 5, width: 150 },
  nome: { fontWeight: 'bold' },
  especialidade: { fontSize: 12 },
  distancia: { fontSize: 11, color: '#666' },
  codigo: { fontSize: 11, color: '#007AFF', fontWeight: 'bold' },
});
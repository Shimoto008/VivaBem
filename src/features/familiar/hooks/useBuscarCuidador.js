import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { supabase } from '../../../services/supabaseClient'; // Ajuste o caminho

export function useBuscarCuidadores(raioMetros = 10000) {
  const [minhaPosicao, setMinhaPosicao] = useState(null);
  const [cuidadoresProximos, setCuidadoresProximos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarEBuscar() {
      try {
        // 1. Pede GPS do Familiar
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permissão de localização negada.');
          setLoading(false);
          return;
        }

        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const lat = loc.coords.latitude;
        const lng = loc.coords.longitude;
        setMinhaPosicao({ latitude: lat, longitude: lng });

        // 2. Busca cuidadores no raio especificado via RPC no Supabase
        const { data, error: rpcError } = await supabase.rpc('buscar_cuidadores_proximos', {
          p_lat: lat,
          p_lng: lng,
          p_raio_metros: raioMetros,
        });

        if (rpcError) throw rpcError;

        setCuidadoresProximos(data || []);
      } catch (err) {
        setError(err.message || 'Erro ao buscar cuidadores.');
      } finally {
        setLoading(false);
      }
    }

    carregarEBuscar();
  }, [raioMetros]);

  return { minhaPosicao, cuidadoresProximos, loading, error };
}
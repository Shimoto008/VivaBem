import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { supabase } from '../../../services/supabaseClient'; // Ajuste o caminho se necessário

export function useBuscarCuidadores(raioMetros = 10000) {
  const [minhaPosicao, setMinhaPosicao] = useState(null);
  const [cuidadoresProximos, setCuidadoresProximos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function carregarEBuscar() {
      try {
        setLoading(true);
        setError(null);

        // 1. Pede permissão de GPS do Familiar
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) {
            setError('Permissão de localização negada.');
            setLoading(false);
          }
          return;
        }

        // 2. Obtém a posição atual com precisão adequada
        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!loc || !loc.coords) {
          throw new Error('Não foi possível obter a localização atual do dispositivo.');
        }

        const lat = Number(loc.coords.latitude);
        const lng = Number(loc.coords.longitude);

        if (isNaN(lat) || isNaN(lng)) {
          throw new Error('Coordenadas de GPS inválidas.');
        }

        if (isMounted) {
          setMinhaPosicao({ latitude: lat, longitude: lng });
        }

        // 3. Busca cuidadores no raio especificado via RPC no Supabase
        const { data, error: rpcError } = await supabase.rpc('buscar_cuidadores_proximos', {
          p_lat: lat,
          p_lng: lng,
          p_raio_metros: Number(raioMetros),
        });

        if (rpcError) throw rpcError;

        if (isMounted) {
          setCuidadoresProximos(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Erro ao buscar cuidadores próximos.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    carregarEBuscar();

    return () => {
      isMounted = false;
    };
  }, [raioMetros]);

  return { minhaPosicao, cuidadoresProximos, loading, error };
}
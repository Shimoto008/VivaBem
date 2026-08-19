import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { supabase } from '../../../services/supabaseClient';

export function useBuscarCuidadores(raioMetros = 10000) {
  const [minhaPosicao, setMinhaPosicao] = useState(null);
  const [cuidadoresProximos, setCuidadoresProximos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function carregarEBuscar() {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        // 1. Verifica se os serviços de localização do celular estão ativos
        const gpsAtivo = await Location.hasServicesEnabledAsync();
        if (!gpsAtivo) {
          if (isMounted) {
            setError('O GPS do seu celular está desativado. Ative-o para ver o mapa.');
            setLoading(false);
          }
          return;
        }

        // 2. Pede permissão de GPS
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) {
            setError('Permissão de localização negada.');
            setLoading(false);
          }
          return;
        }

        // 3. Tenta obter a localização com 'getLastKnownPositionAsync' primeiro
        // (Isso evita a lentidão e o Timeout no Android)
        let loc = await Location.getLastKnownPositionAsync({});

        if (!loc) {
          // Caso não haja localização recente em cache, busca a atual com alta prioridade de resposta rápida
          loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
        }

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

        // 4. Busca cuidadores no raio especificado via RPC no Supabase
        const { data, error: rpcError } = await supabase.rpc('buscar_cuidadores_proximos', {
          p_lat: lat,
          p_lng: lng,
          p_raio_metros: Number(raioMetros),
        });

        if (rpcError) {
          console.warn('Erro na RPC do Supabase:', rpcError.message);
          throw new Error('Erro ao consultar cuidadores no banco de dados.');
        }

        if (isMounted) {
          setCuidadoresProximos(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Erro ao carregar dados do mapa.');
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
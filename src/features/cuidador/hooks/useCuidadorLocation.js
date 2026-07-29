import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { supabase } from '../../../services/supabaseClient'; // Ajuste o caminho

export function useCuidadorLocation(cuidadorId) {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Pega permissão e localização do GPS
  useEffect(() => {
    async function obterGPS() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permissão de GPS negada.');
          setLoading(false);
          return;
        }

        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setCoords({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (err) {
        setError('Erro ao ler GPS do dispositivo.');
      } finally {
        setLoading(false);
      }
    }

    obterGPS();
  }, []);

  // 2. Função para salvar no Supabase (Executa o SQL que criamos)
  async function atualizarLocalizacaoNoBanco() {
    if (!coords || !cuidadorId) return;

    setLoading(true);
    try {
      const { error: rpcError } = await supabase.rpc('atualizar_localizacao_cuidador', {
        p_cuidador_id: cuidadorId,
        p_lat: coords.latitude,
        p_lng: coords.longitude,
      });

      if (rpcError) throw rpcError;
      alert('Sua localização foi atualizada com sucesso!');
    } catch (err) {
      setError(err.message || 'Erro ao salvar localização.');
    } finally {
      setLoading(false);
    }
  }

  return { coords, loading, error, atualizarLocalizacaoNoBanco };
}
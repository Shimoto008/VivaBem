// @ts-check
import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import { supabase } from '../../../services/supabaseClient';

const TIMEOUT_LOCALIZACAO_MS = 10000;

/**
 * @template T
 * @param {Promise<T>} promessa
 * @param {number} ms
 * @returns {Promise<T>}
 */
function comTimeout(promessa, ms) {
  let timer;
  const timeout = new Promise((_, rejeitar) => {
    timer = setTimeout(
      () => rejeitar(new Error('Não foi possível obter sua localização a tempo. Tente novamente.')),
      ms
    );
  });
  return Promise.race([promessa, timeout]).finally(() => clearTimeout(timer));
}

/**
 * Obtém a posição do usuário e busca cuidadores dentro do raio informado.
 *
 * @param {number} [raioMetros]
 * @returns {{
 *   minhaPosicao: import('../../../types/models').Posicao | null,
 *   cuidadoresProximos: import('../../../types/models').CuidadorProximo[],
 *   loading: boolean,
 *   error: string | null,
 *   permissaoNegada: boolean,
 *   gpsDesligado: boolean,
 *   recarregar: () => Promise<void>,
 * }}
 */
export function useBuscarCuidadores(raioMetros = 10000) {
  const [minhaPosicao, setMinhaPosicao] = useState(
    /** @type {import('../../../types/models').Posicao | null} */ (null)
  );
  const [cuidadoresProximos, setCuidadoresProximos] = useState(
    /** @type {import('../../../types/models').CuidadorProximo[]} */ ([])
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(/** @type {string | null} */ (null));
  const [permissaoNegada, setPermissaoNegada] = useState(false);
  const [gpsDesligado, setGpsDesligado] = useState(false);
  const montadoRef = useRef(true);

  useEffect(() => {
    montadoRef.current = true;
    return () => {
      montadoRef.current = false;
    };
  }, []);

  const recarregar = useCallback(async () => {
    const seMontado = (fn) => {
      if (montadoRef.current) fn();
    };

    seMontado(() => {
      setLoading(true);
      setError(null);
      setPermissaoNegada(false);
      setGpsDesligado(false);
    });

    try {
      const gpsAtivo = await Location.hasServicesEnabledAsync();
      if (!gpsAtivo) {
        seMontado(() => {
          setGpsDesligado(true);
          setError('O GPS do seu celular está desativado. Ative-o para ver os cuidadores próximos.');
        });
        return;
      }

      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        ({ status } = await Location.requestForegroundPermissionsAsync());
      }
      if (status !== 'granted') {
        seMontado(() => {
          setPermissaoNegada(true);
          setError('Permissão de localização negada. Libere o acesso nas configurações do aparelho.');
        });
        return;
      }

      let loc = await Location.getLastKnownPositionAsync({});
      if (!loc) {
        loc = await comTimeout(
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
          TIMEOUT_LOCALIZACAO_MS
        );
      }

      const lat = Number(loc?.coords?.latitude);
      const lng = Number(loc?.coords?.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        throw new Error('Não foi possível obter uma localização válida do aparelho.');
      }

      seMontado(() => setMinhaPosicao({ latitude: lat, longitude: lng }));

      const { data, error: rpcError } = await supabase.rpc('buscar_cuidadores_proximos', {
        p_lat: lat,
        p_lng: lng,
        p_raio_metros: Number(raioMetros),
      });

      if (rpcError) {
        throw new Error('Não foi possível consultar os cuidadores. Verifique sua conexão.');
      }

      seMontado(() => setCuidadoresProximos(Array.isArray(data) ? data : []));
    } catch (err) {
      seMontado(() => setError(err?.message || 'Erro ao carregar os dados do mapa.'));
    } finally {
      seMontado(() => setLoading(false));
    }
  }, [raioMetros]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return {
    minhaPosicao,
    cuidadoresProximos,
    loading,
    error,
    permissaoNegada,
    gpsDesligado,
    recarregar,
  };
}

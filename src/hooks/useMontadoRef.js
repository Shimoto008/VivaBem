// @ts-check
import { useEffect, useRef } from 'react';

/**
 * Ref que indica se o componente ainda está montado, para evitar `setState`
 * depois que uma chamada assíncrona termina com a tela já fechada.
 * @returns {import('react').MutableRefObject<boolean>}
 */
export function useMontadoRef() {
  const montadoRef = useRef(true);

  useEffect(() => {
    montadoRef.current = true;
    return () => {
      montadoRef.current = false;
    };
  }, []);

  return montadoRef;
}

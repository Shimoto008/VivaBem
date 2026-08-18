import { useState } from 'react';

export function useHomeIdoso() {
  const [abaAtiva, setAbaAtiva] = useState('home');

  return {
    abaAtiva,
    setAbaAtiva,
  };
}

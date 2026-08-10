import { useState } from 'react';

export function useHomeIdoso() {
  const [abaAtiva, setAbaAtiva] = useState('dia');

  return {
    abaAtiva,
    setAbaAtiva,
  };
}

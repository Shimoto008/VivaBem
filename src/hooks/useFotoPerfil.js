import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { uploadAvatar } from '../services/avatarService';
import { escolherFotoDaGaleria } from '../utils/imagePickerPerfil';

/**
 * Escolhe foto na galeria, envia ao Storage e grava `foto_url` no perfil.
 * `persistirUrl(url)` deve atualizar a tabela correspondente e devolver a linha.
 */
export function useFotoPerfil({ userId, persistirUrl, atualizarPerfilLocal }) {
  const [enviando, setEnviando] = useState(false);
  const montadoRef = useRef(true);

  useEffect(() => {
    montadoRef.current = true;
    return () => {
      montadoRef.current = false;
    };
  }, []);

  const selecionarEEnviar = useCallback(async () => {
    if (!userId || enviando) return;

    const uriLocal = await escolherFotoDaGaleria();
    if (!uriLocal) return;

    setEnviando(true);
    try {
      const fotoUrl = await uploadAvatar(userId, uriLocal);
      if (!montadoRef.current) return;
      const atualizado = await persistirUrl(fotoUrl);
      if (!montadoRef.current) return;
      atualizarPerfilLocal?.(atualizado);
    } catch (erro) {
      if (!montadoRef.current) return;
      Alert.alert('Não foi possível alterar a foto', erro?.message || 'Tente novamente.');
    } finally {
      if (montadoRef.current) setEnviando(false);
    }
  }, [userId, enviando, persistirUrl, atualizarPerfilLocal]);

  return { enviando, selecionarEEnviar };
}

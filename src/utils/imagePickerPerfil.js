import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const QUALIDADE_FOTO = 0.7;

/**
 * Abre a galeria e devolve a URI local da imagem escolhida, ou `null`
 * se o usuário cancelar / negar permissão.
 */
export async function escolherFotoDaGaleria() {
  try {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Autorize o acesso à galeria para escolher uma foto.');
      return null;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: QUALIDADE_FOTO,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (resultado.canceled) return null;
    return resultado.assets?.[0]?.uri ?? null;
  } catch {
    Alert.alert('Não foi possível abrir a galeria', 'Tente novamente em alguns instantes.');
    return null;
  }
}

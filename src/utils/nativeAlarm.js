import { Platform, Linking, Alert } from 'react-native';

/**
 * Abre o app de despertador nativo. Antes chamava Linking.openURL direto
 * (iOS) sem checar canOpenURL e sem try/catch — podia falhar silenciosamente
 * ou quebrar caso o esquema de URL não esteja disponível no dispositivo.
 */
export async function abrirDespertadorNativo() {
  try {
    if (Platform.OS === 'android') {
      await Linking.sendIntent('android.intent.action.SET_ALARM');
      return;
    }

    const url = 'clock-alarm://';
    const podeAbrir = await Linking.canOpenURL(url);
    if (podeAbrir) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Não foi possível abrir o despertador', 'Abra o app Relógio manualmente para configurar o alarme.');
    }
  } catch {
    Alert.alert('Não foi possível abrir o despertador', 'Abra o app de relógio/alarme manualmente.');
  }
}

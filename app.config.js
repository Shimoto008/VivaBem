/**
 * Estende o app.json injetando valores vindos de variáveis de ambiente.
 * O Expo CLI carrega o `.env` antes de avaliar este arquivo; no EAS Build as
 * variáveis vêm do ambiente configurado com `eas env:create`.
 *
 * A chave só vale em builds nativos (development build / APK). O Expo Go usa a
 * própria chave embutida, que está expirada a partir do SDK 55.
 */
module.exports = ({ config }) => {
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    console.warn(
      '[app.config] EXPO_PUBLIC_GOOGLE_MAPS_API_KEY não definida: o mapa ficará em branco no Android.'
    );
  }

  return {
    ...config,
    plugins: [
      ...(config.plugins ?? []),
      ['react-native-maps', { androidGoogleMapsApiKey: googleMapsApiKey }],
    ],
  };
};

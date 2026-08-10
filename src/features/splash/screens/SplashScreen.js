import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getStyles } from './Splash.styles';
import { useTheme } from '../../../contexts/ThemeContext';
import { ROUTES } from '../../../constants/routeNames';
import { getLogoSource } from '../../../constants/brandAssets';

const { height } = Dimensions.get('window');
const DURACAO_SUBIDA_LOGO_MS = 1500;
const DURACAO_TOTAL_SPLASH_MS = 5500;

/**
 * `autoNavegar` fica desligado quando a Splash é usada apenas como tela de
 * espera pelo carregamento da sessão (fora do Stack.Navigator, em routes.js):
 * ali não existe rota para onde navegar.
 */
export default function SplashScreen({ autoNavegar = true }) {
  const navigation = useNavigation();
  const { themeColors, isDarkMode } = useTheme();
  const styles = getStyles(themeColors);
  const posicaoLogo = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.timing(posicaoLogo, {
      toValue: 0,
      duration: DURACAO_SUBIDA_LOGO_MS,
      useNativeDriver: true,
    }).start();
  }, [posicaoLogo]);

  useEffect(() => {
    if (!autoNavegar) return undefined;

    const temporizador = setTimeout(() => {
      navigation.replace(ROUTES.ONBOARDING);
    }, DURACAO_TOTAL_SPLASH_MS);

    return () => clearTimeout(temporizador);
  }, [autoNavegar, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.logoWrapper, { transform: [{ translateY: posicaoLogo }] }]}>
        <Image style={styles.logo} source={getLogoSource(isDarkMode)} />
      </Animated.View>
    </SafeAreaView>
  );
}

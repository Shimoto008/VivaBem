import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './Splash.styles';
import { ROUTES } from '../../constants/routeNames';

const { height } = Dimensions.get('window');
const DURACAO_SUBIDA_LOGO_MS = 1500;
const DURACAO_TOTAL_SPLASH_MS = 5500;

export default function SplashScreen() {
  const navigation = useNavigation();
  const posicaoLogo = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.timing(posicaoLogo, {
      toValue: 0,
      duration: DURACAO_SUBIDA_LOGO_MS,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace(ROUTES.ONBOARDING);
    }, DURACAO_TOTAL_SPLASH_MS);

    return () => clearTimeout(timer);
  }, [navigation, posicaoLogo]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ translateY: posicaoLogo }],
          alignItems: 'center',
        }}
      >
        <Image
          style={{
            width: 140,
            height: 140,
            resizeMode: 'contain',
          }}
          source={require('../../../assets/VivaBem.png')}
        />
      </Animated.View>
    </View>
  );
}
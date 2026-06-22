import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import StackRoutes from './src/navigation/routes';

// IMPORTAÇÃO DOS SEUS ESTILOS SEPARADOS
import { styles } from './Style_App'; 

const { height } = Dimensions.get('window');

export default function App() {
  const [fluxoAtual, setFluxoAtual] = useState('splash'); 
  const [passoOnboarding, setPassoOnboarding] = useState(1); 

  const posicaoLogo = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (fluxoAtual === 'splash') {
      Animated.timing(posicaoLogo, {
        toValue: 0, 
        duration: 1500, // Aumentei um pouco o tempo da subida da animação (1.5s)
        useNativeDriver: true,
      }).start();

      // Tempo total da Splash aumentado para 5500ms (5.5 segundos)
      const timer = setTimeout(() => {
        setFluxoAtual('onboarding');
      }, 5500);

      return () => clearTimeout(timer);
    }
  }, [fluxoAtual]);

  if (fluxoAtual === 'splash') {
    return (
      // Forçamos o fundo branco e tiramos o azul temporariamente direto na View
      <View style={[styles.containerSplash, { backgroundColor: '#FFFFFF' }]}>
        <Animated.View style={{ transform: [{ translateY: posicaoLogo }], alignItems: 'center' }}>
          {/* Sua logo original renderizada na primeira página */}
          <Image 
            style={{ width: 140, height: 140, resizeMode: 'contain' }}
            source={require('./assets/VivaBem.png')} // Verifique se o caminho da imagem está correto aqui
          /> 
        </Animated.View>
      </View>
    );
  }

  if (fluxoAtual === 'onboarding') {
    return (
      <View style={styles.containerOnboarding}>
        <View style={styles.conteudoOnboarding}>
          {passoOnboarding === 1 && (
            <View style={styles.cardPasso}>
              <MaterialIcons name="waving-hand" size={80} color="#4169E1" />
              <Text style={styles.tituloOnboarding}>Seja Bem-Vindo!</Text>
              <Text style={styles.txtOnboarding}>Estamos muito felizes em ter você aqui conosco para facilitar o cuidado diário.</Text>
            </View>
          )}

          {passoOnboarding === 2 && (
            <View style={styles.cardPasso}>
              <MaterialIcons name="favorite" size={80} color="#FF6347" />
              <Text style={styles.tituloOnboarding}>Nossa Importância</Text>
              <Text style={styles.txtOnboarding}>Este app foi feito para conectar cuidadores, familiares e idosos, garantindo saúde, rotina e segurança em um só lugar.</Text>
            </View>
          )}

          {passoOnboarding === 3 && (
            <View style={styles.cardPasso}>
              <MaterialIcons name="verified" size={80} color="#228B22" />
              <Text style={styles.tituloOnboarding}>Muito Obrigado!</Text>
              <Text style={styles.txtOnboarding}>Agradecemos de coração por confiar no nosso trabalho e escolher usar nosso aplicativo.</Text>
            </View>
          )}
        </View>

        <View style={styles.rodapeOnboarding}>
          <View style={styles.containerBolinhas}>
            <View style={[styles.bolinha, passoOnboarding === 1 && styles.bolinhaAtiva]} />
            <View style={[styles.bolinha, passoOnboarding === 2 && styles.bolinhaAtiva]} />
            <View style={[styles.bolinha, passoOnboarding === 3 && styles.bolinhaAtiva]} />
          </View>

          {passoOnboarding < 3 ? (
            <TouchableOpacity 
              style={styles.btnAvancar} 
              onPress={() => setPassoOnboarding(passoOnboarding + 1)}
            >
              <Text style={styles.btnTexto}>Próximo</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.btnAvancar, { backgroundColor: '#228B22' }]} 
              onPress={() => setFluxoAtual('app_principal')} 
            >
              <Text style={styles.btnTexto}>Fique com o App</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StackRoutes />
    </NavigationContainer>
  );
}
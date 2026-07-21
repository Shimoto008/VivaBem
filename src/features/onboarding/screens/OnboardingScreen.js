import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from './Onboarding.styles';
import { ONBOARDING_STEPS } from './onboardingSteps';
import { Button } from '../../components/ui';
import { ROUTES } from '../../constants/routeNames';

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const [passo, setPasso] = useState(0);
  const passoAtual = ONBOARDING_STEPS[passo];
  const ehUltimoPasso = passo === ONBOARDING_STEPS.length - 1;

  const avancar = () => {
    if (ehUltimoPasso) navigation.replace(ROUTES.HOME);
    else setPasso((atual) => atual + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.conteudo}>
        <View style={styles.cardPasso}>
          <MaterialIcons name={passoAtual.icon} size={80} color={passoAtual.iconColor} />
          <Text style={styles.titulo}>{passoAtual.title}</Text>
          <Text style={styles.texto}>{passoAtual.text}</Text>
        </View>
      </View>

      <View style={styles.rodape}>
        <View style={styles.bolinhas}>
          {ONBOARDING_STEPS.map((_, indice) => (
            <View key={indice} style={[styles.bolinha, indice === passo && styles.bolinhaAtiva]} />
          ))}
        </View>

        <Button
          title={ehUltimoPasso ? 'Fique com o App' : 'Próximo'}
          variant={ehUltimoPasso ? 'primary' : 'primary'}
          onPress={avancar}
          style={styles.botao}
        />
      </View>
    </View>
  );
}

import React from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getStyles } from './Home.styles';
import { Button } from '../../../components/ui';
import { useTheme } from '../../../contexts/ThemeContext';
import { ROUTES } from '../../../constants/routeNames';
import { getLogoSource } from '../../../constants/brandAssets';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { themeColors, isDarkMode } = useTheme();
  const styles = getStyles(themeColors);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 60, // <--- Empurra o conteúdo um pouco para cima do meio
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Image style={styles.img} source={getLogoSource(isDarkMode)} />

        
        <View style={[styles.buttonContainer, { gap: 12, width: '100%' }]}>
          <Button
            title="Criar conta"
            onPress={() => navigation.navigate(ROUTES.CADASTRO)}
            style={styles.ctaCriarConta}
            accessibilityLabel="Criar uma nova conta"
          />

          <Button
            title="Já tenho conta (Entrar)"
            onPress={() => navigation.navigate(ROUTES.LOGIN)}
            variant="outline"
            style={styles.ctaEntrar}
            accessibilityLabel="Entrar em uma conta existente"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
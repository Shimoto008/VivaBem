import React, { useMemo } from 'react';
import { ScrollView, View, Image } from 'react-native';
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
  const styles = useMemo(() => getStyles(themeColors), [themeColors]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Image style={styles.img} source={getLogoSource(isDarkMode)} />

        <View style={styles.buttonContainer}>
          <Button
            title="Criar conta"
            onPress={() => navigation.navigate(ROUTES.CADASTRO)}
            accessibilityLabel="Criar uma nova conta"
          />

          <Button
            title="Já tenho conta (Entrar)"
            onPress={() => navigation.navigate(ROUTES.LOGIN)}
            variant="outline"
            accessibilityLabel="Entrar em uma conta existente"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
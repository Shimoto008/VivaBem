import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackRoutes from './src/navigation/routes';
import { SessionProvider } from './src/contexts/SessionContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

/**
 * App.js agora só monta os providers globais + a navegação. Toda a lógica
 * que antes vivia aqui (splash, onboarding, estilos inline) foi movida
 * para telas/rotas próprias — ver src/navigation/routes.js.
 *
 * `SafeAreaProvider` precisa envolver toda a árvore para que `useSafeAreaInsets`
 * funcione em qualquer tela/componente (ex.: BottomTabBar). `ThemeProvider`
 * fica por fora da navegação para que o modo claro/escuro e a cor de destaque
 * fiquem disponíveis a partir da primeira tela (Splash).
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SessionProvider>
          <NavigationContainer>
            <StackRoutes />
          </NavigationContainer>
        </SessionProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

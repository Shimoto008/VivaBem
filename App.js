import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StackRoutes from './src/navigation/routes';
import { SessionProvider } from './src/contexts/SessionContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { PinchZoomView } from './src/components/ui';

/**
 * App.js monta providers globais + navegação.
 * GestureHandlerRootView + PinchZoomView envolvem o app para zoom por pinça
 * (acessibilidade / baixa visão) em todas as telas.
 */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PinchZoomView>
        <SafeAreaProvider>
          <ThemeProvider>
            <SessionProvider>
              <NavigationContainer>
                <StackRoutes />
              </NavigationContainer>
            </SessionProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </PinchZoomView>
    </GestureHandlerRootView>
  );
}

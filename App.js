import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackRoutes from './src/navigation/routes';
import { SessionProvider } from './src/contexts/SessionContext';

/**
 * App.js agora só monta os providers globais + a navegação. Toda a lógica
 * que antes vivia aqui (splash, onboarding, estilos inline) foi movida
 * para telas/rotas próprias — ver src/navigation/routes.js.
 */
export default function App() {
  return (
    <SessionProvider>
      <NavigationContainer>
        <StackRoutes />
      </NavigationContainer>
    </SessionProvider>
  );
}

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routeNames';
import { useSession } from '../contexts/SessionContext';

import SplashScreen from '../features/splash/screens/SplashScreen';
import OnboardingScreen from '../features/onboarding/screens/OnboardingScreen';
import HomeScreen from '../features/home/screens/HomeScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import CadastroUnificadoScreen from '../features/auth/screens/CadastroUnificadoScreen';
import RecuperarSenhaScreen from '../features/auth/screens/RecuperarSenhaScreen'; // ✅ Importação da nova tela

import HomeCuidadorScreen from '../features/cuidador/screens/HomeCuidadorScreen';
import HomeFamiliarScreen from '../features/familiar/screens/HomeFamiliarScreen';
import IdosoAutonomoScreen from '../features/idoso/screens/IdosoAutonomoScreen';

import MedicacaoScreen from '../features/cuidador/components/PainelPaciente/Medicacao/MedicacaoScreen';
import RelatorioScreen from '../features/cuidador/components/PainelPaciente/Relatorio/RelatorioScreen';
import CalendarioScreen from '../features/cuidador/components/PainelPaciente/Calendario/CalendarioScreen';
import ObservacoesScreen from '../features/cuidador/components/PainelPaciente/Observacoes/ObservacoesScreen';
import ChatScreen from '../features/chat/Screens/chatScreen';
import ConversasScreen from '../features/chat/Screens/ConversasScreen';

// ✅ Nome e componente padronizados em PascalCase
import ExerciciosScreen from '../features/idoso/components/PainelIdoso/Exercicios/ExerciciosScreen';

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  const { session, tipoUsuario, carregando, perfilAusente } = useSession();

  const resolvendoPerfil = !!session && !tipoUsuario && !perfilAusente;
  if (carregando || resolvendoPerfil) {
    return <SplashScreen autoNavegar={false} />;
  }

  const autenticado = !!session && !!tipoUsuario;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!autenticado ? (
        <>
          <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
          <Stack.Screen name={ROUTES.ONBOARDING} component={OnboardingScreen} />
          <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
          <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
          <Stack.Screen name={ROUTES.CADASTRO} component={CadastroUnificadoScreen} />
          <Stack.Screen name={ROUTES.RECUPERAR_SENHA} component={RecuperarSenhaScreen} />
        </>
      ) : tipoUsuario === 'cuidador' ? (
        <>
          <Stack.Screen name={ROUTES.HOME_CUIDADOR} component={HomeCuidadorScreen} />
          <Stack.Screen name={ROUTES.MEDICACAO} component={MedicacaoScreen} />
          <Stack.Screen name={ROUTES.RELATORIO} component={RelatorioScreen} />
          <Stack.Screen name={ROUTES.CALENDARIO} component={CalendarioScreen} />
          <Stack.Screen name={ROUTES.OBSERVACOES} component={ObservacoesScreen} />
          <Stack.Screen name={ROUTES.CONVERSAS} component={ConversasScreen} />
          <Stack.Screen name={ROUTES.CHAT} component={ChatScreen} />
        </>
      ) : tipoUsuario === 'idoso' ? (
        <>
          <Stack.Screen name={ROUTES.HOME_IDOSO} component={IdosoAutonomoScreen} />
          <Stack.Screen name={ROUTES.MEDICACAO} component={MedicacaoScreen} />
          <Stack.Screen name={ROUTES.RELATORIO} component={RelatorioScreen} />
          <Stack.Screen name={ROUTES.CALENDARIO} component={CalendarioScreen} />
          <Stack.Screen name={ROUTES.OBSERVACOES} component={ObservacoesScreen} />
          <Stack.Screen name={ROUTES.EXERCICIOS} component={ExerciciosScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name={ROUTES.HOME_FAMILIAR} component={HomeFamiliarScreen} />
          <Stack.Screen name={ROUTES.MEDICACAO} component={MedicacaoScreen} />
          <Stack.Screen name={ROUTES.RELATORIO} component={RelatorioScreen} />
          <Stack.Screen name={ROUTES.CALENDARIO} component={CalendarioScreen} />
          <Stack.Screen name={ROUTES.OBSERVACOES} component={ObservacoesScreen} />
          <Stack.Screen name={ROUTES.CONVERSAS} component={ConversasScreen} />
          <Stack.Screen name={ROUTES.CHAT} component={ChatScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
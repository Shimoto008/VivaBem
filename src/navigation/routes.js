import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routeNames';

import SplashScreen from '../features/splash/screens/SplashScreen';
import OnboardingScreen from '../features/onboarding/screens/OnboardingScreen';
import HomeScreen from '../features/home/screens/HomeScreen';
import CadastroCuidadorScreen from '../features/cuidador/screens/CadastroCuidadorScreen';
import HomeCuidadorScreen from '../features/cuidador/screens/HomeCuidadorScreen';
import CadastroFamiliarScreen from '../features/familiar/screens/CadastroFamiliarScreen';
import HomeFamiliarScreen from '../features/familiar/screens/HomeFamiliarScreen';
import IdosoScreen from '../features/idoso/screens/IdosoScreen';

import MedicacaoScreen from '../features/cuidador/components/PainelPaciente/Medicacao/MedicacaoScreen';
import RelatorioScreen from '../features/cuidador/components/PainelPaciente/Relatorio/RelatorioScreen';
import CalendarioScreen from '../features/cuidador/components/PainelPaciente/Calendario/CalendarioScreen';
import ObservacoesScreen from '../features/cuidador/components/PainelPaciente/Observacoes/ObservacoesScreen';
const Stack = createNativeStackNavigator();

/**
 * Antes a Splash e o Onboarding viviam como uma máquina de estados manual
 * dentro de App.js, FORA do React Navigation — duas fontes de verdade para
 * "em qual tela eu estou". Agora são rotas normais do Stack, como qualquer
 * outra tela (podem usar goBack, deep link, etc.).
 */
export default function StackRoutes() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.SPLASH} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
      <Stack.Screen name={ROUTES.ONBOARDING} component={OnboardingScreen} />
      <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Stack.Screen name={ROUTES.CADASTRO_CUIDADOR} component={CadastroCuidadorScreen} />
      <Stack.Screen name={ROUTES.HOME_CUIDADOR} component={HomeCuidadorScreen} />
      <Stack.Screen name={ROUTES.CADASTRO_FAMILIAR} component={CadastroFamiliarScreen} />
      <Stack.Screen name={ROUTES.HOME_FAMILIAR} component={HomeFamiliarScreen} />
      <Stack.Screen name={ROUTES.IDOSO} component={IdosoScreen} />

      <Stack.Screen name={ROUTES.MEDICACAO} component={MedicacaoScreen} />
      <Stack.Screen name={ROUTES.RELATORIO} component={RelatorioScreen} />
      <Stack.Screen name={ROUTES.CALENDARIO} component={CalendarioScreen} />
      <Stack.Screen name={ROUTES.OBSERVACOES} component={ObservacoesScreen} />
    </Stack.Navigator>
  );
}

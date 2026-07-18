import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routeNames';

import SplashScreen from '../screens/Splash/SplashScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import CadastroCuidadorScreen from '../screens/Cuidador/CadastroCuidadorScreen';
import HomeCuidadorScreen from '../screens/Cuidador/HomeCuidador/HomeCuidadorScreen';
import CadastroFamiliarScreen from '../screens/Familiar/CadastroFamiliarScreen';
import HomeFamiliarScreen from '../screens/Familiar/HomeFamiliar/HomeFamiliarScreen';
import IdosoScreen from '../screens/Idoso/IdosoScreen';

import MedicacaoScreen from '../screens/Cuidador/HomeCuidador/components/PainelPaciente/Medicacao/MedicacaoScreen';
import RelatorioScreen from '../screens/Cuidador/HomeCuidador/components/PainelPaciente/Relatorio/RelatorioScreen';
import CalendarioScreen from '../screens/Cuidador/HomeCuidador/components/PainelPaciente/Calendario/CalendarioScreen';
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
    </Stack.Navigator>
  );
}

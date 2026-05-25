import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home/Home';
import Cuidador from '../screens/Cuidador/Cuidador';
import Idoso from '../screens/Idoso/Idoso';
import Familiar from '../screens/Familiar/Familiar';
// 1. IMPORTANTE: Importe a sua nova tela (ajuste o caminho da pasta se necessário)
import HomeCuidador from '../screens/Cuidador/home_Cuidador'; 

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Cuidador" component={Cuidador} />
      <Stack.Screen name="Idoso" component={Idoso} />
      <Stack.Screen name="Familiar" component={Familiar} />
      
      {/* 2. REGISTRE A NOVA TELA AQUI */}
      <Stack.Screen name="home_Cuidador" component={HomeCuidador} />
    </Stack.Navigator>
  );
}
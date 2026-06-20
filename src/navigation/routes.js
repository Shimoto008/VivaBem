import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home/Home';
import Cuidador from '../screens/Cuidador/Cuidador';
import Idoso from '../screens/Idoso/Idoso';
import Familiar from '../screens/Familiar/Familiar';
import HomeCuidador from '../screens/Cuidador/HomeCuidador/Home'; 

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
      
      
      <Stack.Screen name="HomeCuidador" component={HomeCuidador} />
    </Stack.Navigator>
  );
}
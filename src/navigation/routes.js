import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Cuidador from '../screens/Cuidador';
import Idoso from '../screens/Idoso';
import Familiar from '../screens/Familiar';
import { Header } from '@react-navigation/stack';

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
    </Stack.Navigator>
  );
}
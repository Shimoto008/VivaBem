import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Home';
import Cuidador from '../Cuidador';
import Idoso from '../Idoso';
import Familiar from '../Familiar';
import { Header } from '@react-navigation/stack';

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} ScreenOptions={{HeaderShown:false}} />
      <Stack.Screen name="Cuidador" component={Cuidador} />
      <Stack.Screen name="Idoso" component={Idoso} />
      <Stack.Screen name="Familiar" component={Familiar} />
    </Stack.Navigator>
  );
}
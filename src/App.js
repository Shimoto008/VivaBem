import { NavigationContainer } from '@react-navigation/native';
import StackRoutes from './navegacao/routes';

export default function App() {
  return (
    <NavigationContainer>
      <StackRoutes />
    </NavigationContainer>
  );
}
import { NavigationContainer } from '@react-navigation/native';
import StackRoutes from './src/navigation/routes';

export default function App() {
  return (
    <NavigationContainer>
      <StackRoutes />
    </NavigationContainer>
  );
}
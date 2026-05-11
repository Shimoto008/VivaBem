import { registerRootComponent } from 'expo';

import App from './App';

const cuidadorRoutes = require('./back-end/src/routes/cuidadorrouter');

App.use('/cuidadores', cuidadorRouter);
// ... resto do código
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

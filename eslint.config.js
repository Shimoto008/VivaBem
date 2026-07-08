// Configuração pronta para uso, mas as dependências não foram instaladas
// automaticamente (sem acesso à rede no ambiente em que esta refatoração
// foi feita). Para ativar: `npx expo install eslint eslint-config-expo --dev`
// e depois `npx eslint .`.
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];

/**
 * Antes os 3 passos do onboarding eram 3 blocos JSX quase idênticos
 * copiados e colados em App.js. Agora são dados — adicionar/remover um
 * passo é só editar este array, sem tocar na tela.
 */
export const ONBOARDING_STEPS = [
  {
    icon: 'waving-hand',
    iconColor: '#4169E1',
    title: 'Seja Bem-Vindo!',
    text: 'Estamos muito felizes em ter você aqui conosco para facilitar o cuidado diário.',
  },
  {
    icon: 'favorite',
    iconColor: '#FF6347',
    title: 'Nossa Importância',
    text: 'Este app foi feito para conectar cuidadores, familiares e idosos, garantindo saúde, rotina e segurança em um só lugar.',
  },
  {
    icon: 'verified',
    iconColor: '#228B22',
    title: 'Muito Obrigado!',
    text: 'Agradecemos de coração por confiar no nosso trabalho e escolher usar nosso aplicativo.',
  },
];

import { ROUTES } from '../../../constants/routeNames';

/** Dados das 3 opções de perfil — extraído da tela para facilitar manutenção. */
export const PERFIL_OPTIONS = [
  {
    key: 'cuidador',
    icon: 'health-and-safety',
    iconFamily: 'MaterialIcons',
    iconColor: '#4169E1',
    title: 'Cuidador',
    description: 'Gerenciar e cuidar da rotina dos idosos e suas atividades diárias',
    route: ROUTES.CADASTRO_CUIDADOR,
  },
  {
    key: 'familiar',
    icon: 'family-restroom',
    iconFamily: 'MaterialIcons',
    iconColor: '#20B2AA',
    title: 'Familiar',
    description: 'Acompanhar o perfil do idoso e as atividades publicadas pelo cuidador',
    route: ROUTES.CADASTRO_FAMILIAR,
  },
  {
    key: 'idoso',
    icon: 'heartbeat',
    iconFamily: 'FontAwesome5',
    iconColor: '#9370DB',
    title: 'Idoso',
    description: 'Jogos, alertas e atividades',
    route: ROUTES.IDOSO,
  },
];

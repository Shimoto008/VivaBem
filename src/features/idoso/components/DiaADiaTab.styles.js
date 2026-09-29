import { StyleSheet, Platform } from 'react-native';
import { radius, spacing } from '../../../theme';

const sombraCard = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  android: { elevation: 4 },
  default: {},
});

export const getStyles = (colors) =>
  StyleSheet.create({
    containerAbas: {
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.lg,
    },

    /* CARD DE BOAS-VINDAS EXPANDIDO */
    boasVindasCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.divider,
      ...sombraCard,
    },
    boasVindasTopo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: spacing.xs,
    },
    saudacao: {
      fontSize: 20,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    nomeDestaque: {
      fontSize: 32,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    subtituloBoasVindas: {
      fontSize: 18,
      lineHeight: 26,
      color: colors.textSecondary,
      fontWeight: '400',
    },

    /* GRID E CARDS DOS ATALHOS MAIORES */
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    cardAtalho: {
      width: '48%',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      paddingVertical: 26,
      paddingHorizontal: spacing.xs,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.divider,
      ...sombraCard,
    },
    iconContainer: {
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xs,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
      textAlign: 'center',
    },

    /* ÁREA DE EMERGÊNCIA */
    cardEmergenciaContainer: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      borderWidth: 1.5,
      borderColor: `${colors.danger}40`,
      ...Platform.select({
        ios: {
          shadowColor: colors.danger,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
        },
        android: { elevation: 5 },
        default: {},
      }),
    },
    emergenciaRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    botaoEmergenciaPrincipal: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      backgroundColor: colors.danger,
      paddingVertical: 16,
      borderRadius: radius.sm,
      ...Platform.select({
        ios: {
          shadowColor: colors.danger,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
        },
        android: { elevation: 4 },
        default: {},
      }),
    },
    textoEmergenciaBranco: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.white,
    },
    botaoEmergenciaSecundarioCard: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      backgroundColor: colors.background,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingVertical: 16,
      borderRadius: radius.sm,
    },
    textoEmergencia: {
      fontSize: 18,
      fontWeight: '800',
    },

    /* MINI ABAS (MODAIS) */
    fundoEscuroModal: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },
    miniAbaModal: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: 30,
    },
    barraHeaderModal: {
      width: 40,
      height: 5,
      backgroundColor: colors.border,
      borderRadius: 3,
      alignSelf: 'center',
      marginBottom: 15,
    },
    tituloModal: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 16,
    },
    opcaoBotaoModal: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: 14,
      borderRadius: 14,
      marginBottom: 10,
    },
    textoContainerModal: {
      marginLeft: 14,
    },
    tituloOpcaoModal: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    subtituloOpcaoModal: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    botaoCancelarModal: {
      marginTop: 8,
      paddingVertical: 14,
      alignItems: 'center',
    },
    textoCancelarModal: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textSecondary,
    },
  });

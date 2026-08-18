import { Platform, StyleSheet } from 'react-native';
import { radius, spacing, typography } from '../../../theme';

const sombraForte = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  android: { elevation: 8 },
  default: {},
});

export const getStyles = (colors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.surface },
    container: { flex: 1, backgroundColor: colors.background },
    containerAbas: { flex: 1 },
    scrollContent: {
      padding: spacing.lg,
      flexGrow: 1,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xxxl,
    },

    boasVindasCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.xl,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      ...sombraForte,
    },
    saudacao: {
      ...typography.caption,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    nomeDestaque: {
      ...typography.title1,
      fontWeight: '800',
      color: colors.textPrimary,
      fontSize: 28,
    },
    subtituloBoasVindas: {
      ...typography.body,
      color: colors.textSecondary,
      marginTop: spacing.sm,
      lineHeight: 22,
    },
    subtituloRotina: {
      ...typography.body,
      color: colors.textSecondary,
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
      lineHeight: 22,
    },

    secaoTitulo: {
      ...typography.title3,
      color: colors.textPrimary,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
      fontSize: 20,
    },

    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    cardAtalho: {
      backgroundColor: colors.surface,
      width: '48%',
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 120,
      justifyContent: 'center',
      ...sombraForte,
    },
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 56,
      marginBottom: spacing.sm,
    },
    cardTitle: {
      ...typography.bodyBold,
      color: colors.textPrimary,
      textAlign: 'center',
      fontSize: 16,
    },

    cardResumo: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      ...sombraForte,
    },
    textoResumo: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
      fontSize: 16,
    },

    emergenciaRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    botaoEmergencia: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      borderWidth: 1.5,
      borderColor: colors.danger,
      minHeight: 88,
      ...sombraForte,
    },
    botaoEmergenciaSecundario: {
      borderColor: colors.primary,
    },
    textoEmergencia: {
      ...typography.bodyBold,
      color: colors.danger,
      textAlign: 'center',
      fontSize: 15,
    },
    textoEmergenciaSecundario: {
      color: colors.primary,
    },

    // Perfil
    headerTopo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    tituloPagina: {
      ...typography.title1,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    botaoConfiguracoes: { padding: spacing.xs },
    card: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: radius.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...sombraForte,
    },
    linhaCentralizada: { flexDirection: 'row', alignItems: 'center' },
    infoPerfil: { flex: 1, marginLeft: spacing.lg },
    nome: { ...typography.title2, color: colors.textPrimary, fontSize: 22 },
    textoSecundario: {
      ...typography.body,
      color: colors.textSecondary,
      marginTop: 4,
    },
    botaoEditar: {
      width: 44,
      height: 44,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    formEdicao: { marginTop: spacing.md, gap: spacing.sm },
    secaoSubtitulo: {
      ...typography.bodyBold,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
      fontSize: 16,
    },
    textoDetalhe: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
      fontSize: 16,
      marginBottom: spacing.md,
    },
    divisor: {
      height: 1,
      backgroundColor: colors.divider,
      marginVertical: spacing.sm,
    },
    modalContainer: { flex: 1, paddingTop: spacing.xxl },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    modalTitulo: {
      ...typography.title2,
      color: colors.textPrimary,
    },
    modalConteudo: {
      paddingHorizontal: spacing.lg,
    },
    divisorLogout: {
      height: 1,
      backgroundColor: colors.divider,
      marginVertical: spacing.xl,
    },
    containerCarregando: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
  });

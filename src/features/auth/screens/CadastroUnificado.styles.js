import { StyleSheet } from 'react-native';
import { radius, spacing, typography } from '../../../theme';

export const getStyles = (colors, accentColor) =>
  StyleSheet.create({
    containerScroll: { flex: 1, backgroundColor: colors.background },
    contentScroll: { flexGrow: 1 },
    viewPrincipal: {
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxxl,
    },
    img: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
      alignSelf: 'center',
      marginBottom: spacing.md,
    },
    seletorTitulo: {
      ...typography.bodyBold,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    seletorRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    cardTipo: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xs,
      borderRadius: radius.lg,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      gap: 6,
    },
    cardTipoAtivo: {
      borderColor: accentColor,
      backgroundColor: `${accentColor}14`,
    },
    cardTipoLabel: {
      ...typography.caption,
      fontWeight: '700',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    cardTipoLabelAtivo: {
      color: accentColor,
    },
    seletor: {
      backgroundColor: colors.surface,
      width: '100%',
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    seletorTextoVazio: { fontSize: 16, color: colors.placeholder },
    seletorTextoPreenchido: { fontSize: 16, color: colors.textPrimary },
    rotuloEspecialidade: {
      ...typography.bodyBold,
      alignSelf: 'flex-start',
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    erroEspecialidade: {
      ...typography.caption,
      alignSelf: 'flex-start',
      color: colors.danger,
      marginBottom: spacing.sm,
    },
    botaoAcao: { backgroundColor: accentColor },
    linkLogin: { alignSelf: 'center', marginTop: spacing.xl, padding: spacing.sm },
    textoLinkLogin: { ...typography.bodyBold, color: accentColor },
  });

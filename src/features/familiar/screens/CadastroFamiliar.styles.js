import { StyleSheet } from 'react-native';
import { spacing, radius, typography } from '../../../theme';

export const getStyles = (colors) =>
  StyleSheet.create({
    containerScroll: { flex: 1, backgroundColor: colors.background },
    contentScroll: { flexGrow: 1 },
    viewPrincipal: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
    heroIcone: {
      width: 88, height: 88, borderRadius: radius.full, backgroundColor: colors.primarySoft,
      alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: spacing.xl,
    },
    card: { marginTop: spacing.lg },
    botao: { marginTop: spacing.xs },
    linkLogin: { alignSelf: 'center', marginTop: spacing.xl, padding: spacing.sm },
    textoLinkLogin: { ...typography.bodyBold, color: colors.primary },
  });

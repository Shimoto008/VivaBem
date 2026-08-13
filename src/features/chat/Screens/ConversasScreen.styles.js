import { StyleSheet } from 'react-native';
import { radius, spacing, typography } from '../../../theme';

export const getStyles = (colors, primaryColor) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: spacing.md,
    },
    titulo: {
      ...typography.title3,
      fontWeight: 'bold',
      color: colors.textPrimary,
      flex: 1,
    },
    lista: { padding: spacing.lg, flexGrow: 1 },
    listaVazia: { justifyContent: 'center' },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.md,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: radius.full,
      backgroundColor: primaryColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: { flex: 1, minWidth: 0 },
    linhaTitulo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    nome: {
      ...typography.bodyBold,
      color: colors.textPrimary,
      flex: 1,
    },
    data: {
      ...typography.caption,
      fontSize: 11,
      color: colors.textTertiary,
    },
    preview: {
      ...typography.caption,
      color: colors.textSecondary,
      marginTop: 2,
    },
  });

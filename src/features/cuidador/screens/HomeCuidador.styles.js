import { StyleSheet } from 'react-native';
import { radius, spacing, typography } from '../../../theme';

/**
 * Estilos compartilhados pela área HomeCuidador (abas Resumo/Pacientes e o
 * painel do paciente). Recebem `colors` de `useTheme()` para reagir ao modo
 * claro/escuro e à cor de destaque escolhidos pelo usuário.
 */
export const getStyles = (colors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.surface },
    container: { flex: 1, backgroundColor: colors.background },
    containerAbas: { flex: 1 },
    scrollContent: { padding: spacing.lg, flexGrow: 1, paddingTop: 50 },

    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: {
      backgroundColor: colors.surface,
      width: '48%',
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statusBadge: {
      backgroundColor: colors.primarySoft,
      color: colors.primary,
      fontSize: 10,
      paddingHorizontal: spacing.xs + 2,
      paddingVertical: 2,
      borderRadius: radius.sm,
      fontWeight: '600',
    },
    iconContainer: { alignItems: 'center', justifyContent: 'center', height: 60, marginTop: spacing.sm },
    cardTitle: {
      ...typography.bodyBold,
      color: colors.textPrimary,
      textAlign: 'center',
      marginVertical: spacing.sm,
    },

    secaoTitulo: {
      ...typography.title3,
      color: colors.textPrimary,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    carregando: { marginTop: spacing.xxl },
    containerMensagem: { padding: spacing.xl, alignItems: 'center' },
    txtMensagem: { color: colors.textSecondary, textAlign: 'center' },

    wrapperPaciente: { marginBottom: spacing.sm },
    cardPacienteHome: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: radius.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoPacienteHome: { marginLeft: spacing.lg, flex: 1 },
    nomePacienteHome: { ...typography.title3, color: colors.textPrimary },
    detalhesPacienteHome: { ...typography.caption2, color: colors.textSecondary },
    itemListaPaciente: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: radius.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },

    containerAcoes: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.primarySoft,
      borderBottomLeftRadius: radius.md,
      borderBottomRightRadius: radius.md,
      padding: spacing.lg,
      marginTop: -4,
    },
    topoAcoes: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    tituloAcoes: { ...typography.caption, fontWeight: '700', color: colors.textSecondary },
  });

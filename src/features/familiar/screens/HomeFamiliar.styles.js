import { StyleSheet } from 'react-native';
import { colors, spacing, radius, typography, shadows } from '../../../theme';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },

  conexaoCard: { marginBottom: spacing.lg },
  conexaoConectadaTopo: { flexDirection: 'row', alignItems: 'center' },
  conexaoIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  conexaoNome: { ...typography.title3, color: colors.textPrimary },
  conexaoEspecialidade: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  conexaoVazioTitulo: { ...typography.title3, color: colors.textPrimary, marginTop: spacing.sm, textAlign: 'center' },
  conexaoVazioTexto: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg, textAlign: 'center' },

  secaoTitulo: { ...typography.title2, color: colors.textPrimary, marginBottom: spacing.md },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.overlay, padding: spacing.xl },
  modalContent: { width: '100%', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl, ...shadows.floating },
  modalTitulo: { ...typography.title2, color: colors.textPrimary, marginBottom: spacing.xs },
  modalSubtitulo: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.lg },
  modalErro: { ...typography.caption, color: colors.danger, marginBottom: spacing.md },
  modalAcoes: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },

  atividadeCard: { marginBottom: spacing.md },
  atividadeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xs },
  atividadePaciente: { ...typography.caption2, color: colors.primary },
  atividadeData: { ...typography.caption2, color: colors.textTertiary },
  atividadeConteudo: { ...typography.body, color: colors.textPrimary, marginTop: spacing.xs },
});

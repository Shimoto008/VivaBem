import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.xl, paddingTop: spacing.xxxl },
  img: { width: 130, height: 90, alignSelf: 'center', resizeMode: 'contain', marginBottom: spacing.lg },
  titulo: { ...typography.title1, color: colors.textPrimary, textAlign: 'center' },
  subtitulo: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
  selecionar: { ...typography.bodyBold, color: colors.textPrimary, marginTop: spacing.xxl, marginBottom: spacing.md },
  lista: { gap: spacing.md },
  cardPerfil: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.divider, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  textoContainer: { flex: 1 },
  escolha: { ...typography.title3, color: colors.textPrimary },
  desc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});

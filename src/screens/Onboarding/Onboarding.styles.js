import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    paddingVertical: spacing.xxxl * 2,
  },
  conteudo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  cardPasso: { alignItems: 'center' },
  titulo: { ...typography.title1, color: colors.textPrimary, marginTop: spacing.xxl, marginBottom: spacing.lg, textAlign: 'center' },
  texto: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  rodape: { alignItems: 'center', gap: spacing.xxl },
  bolinhas: { flexDirection: 'row', gap: spacing.sm },
  bolinha: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border },
  bolinhaAtiva: { backgroundColor: colors.primary, width: 24 },
  botao: { width: 220 },
});

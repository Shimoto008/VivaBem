import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';

export const styles = StyleSheet.create({
  containerScroll: { flex: 1, backgroundColor: colors.background },
  contentScroll: { flexGrow: 1 },
  viewPrincipal: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xxxl, alignItems: 'center' },
  img: { width: 120, height: 120, resizeMode: 'contain', marginBottom: spacing.md },
  seletor: { backgroundColor: colors.surface, width: '100%', borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: spacing.md, justifyContent: 'center', marginBottom: spacing.md },
  seletorTextoVazio: { fontSize: 16, color: colors.placeholder },
  seletorTextoPreenchido: { fontSize: 16, color: colors.textPrimary },
});

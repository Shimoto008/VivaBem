import { StyleSheet } from 'react-native';
import { spacing, radius, typography, shadows } from '../../../theme';

/**
 * Estilos da área HomeFamiliar — recebem `colors` (de `useTheme()`) em vez
 * de importar a paleta estática, para reagir ao modo claro/escuro e à cor
 * de destaque escolhidos pelo usuário.
 */
export const getStyles = (colors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.surface },
    conteudo: { flex: 1 },
    scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },
    blocoConexao: { marginVertical: spacing.lg },

    conexaoCard: { marginBottom: spacing.lg },
    conexaoConectadaTopo: { flexDirection: 'row', alignItems: 'center' },
    conexaoIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
    conexaoNome: { ...typography.title3, color: colors.textPrimary },
    conexaoEspecialidade: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
    conexaoVazioConteudo: { alignItems: 'center' },
    conexaoInfo: { flex: 1 },
    conexaoBotaoDesconectar: { marginTop: spacing.lg },
    conexaoVazioTitulo: { ...typography.title3, color: colors.textPrimary, marginTop: spacing.sm, textAlign: 'center' },
    conexaoVazioTexto: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg, textAlign: 'center' },

    secaoTitulo: { ...typography.title2, color: colors.textPrimary, marginBottom: spacing.md },

    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.overlay,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xl,
    },
    modalKav: { flex: 1 },
    modalSafe: { width: '100%', maxWidth: 420 },
    modalContent: {
      width: '100%',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.xl,
      ...shadows.floating,
    },
    modalTitulo: { ...typography.title2, color: colors.textPrimary, marginBottom: spacing.xs },
    modalSubtitulo: {
      ...typography.caption,
      color: colors.textSecondary,
      marginBottom: spacing.lg,
      lineHeight: 20,
    },
    codigoLabel: {
      ...typography.bodyBold,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    codigoInput: {
      width: '100%',
      borderWidth: 1.5,
      borderRadius: radius.lg,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
      fontSize: 28,
      letterSpacing: 8,
      fontWeight: '700',
      color: colors.textPrimary,
      backgroundColor: colors.background,
      marginBottom: spacing.md,
    },
    modalErro: {
      ...typography.caption,
      color: colors.danger,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    modalAcoes: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    modalBotaoWrap: { flex: 1 },
    modalBotao: { flex: 1 },

    carregando: { marginTop: spacing.xl },

    chipsLinha: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingBottom: spacing.md,
    },
    chip: {
      minHeight: 44,
      paddingHorizontal: spacing.md,
      borderRadius: radius.full,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    chipTexto: {
      ...typography.caption,
      fontWeight: '700',
    },

    categoriaSecao: { marginBottom: spacing.md },
    categoriaCabecalho: {
      minHeight: 52,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.lg,
      borderWidth: 1,
      gap: spacing.sm,
    },
    categoriaIconeWrap: {
      width: 36,
      height: 36,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoriaTitulo: {
      ...typography.title3,
      flex: 1,
    },
    categoriaContagemWrap: {
      minWidth: 28,
      height: 28,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.sm,
    },
    categoriaContagem: {
      ...typography.caption,
      fontWeight: '700',
    },
    categoriaCorpo: { marginTop: spacing.sm },
    categoriaVazio: {
      ...typography.caption,
      color: colors.textTertiary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xs,
    },

    atividadeCard: { marginBottom: spacing.md },
    atividadeBorda: { borderLeftWidth: 4 },
    atividadeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    atividadeTipoLinha: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      flex: 1,
      marginRight: spacing.sm,
    },
    atividadeTipo: { ...typography.caption2, fontWeight: '700', textTransform: 'uppercase' },
    atividadePaciente: { ...typography.caption, color: colors.primary, marginBottom: 2, fontWeight: '600' },
    atividadeData: { ...typography.caption2, color: colors.textTertiary, flexShrink: 1, textAlign: 'right' },
    atividadeConteudo: { ...typography.body, color: colors.textPrimary, marginTop: spacing.xs },
    atividadeDetalhes: { marginTop: spacing.xs, gap: 4 },
    atividadeDadoLinha: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
    atividadeDadoRotulo: { ...typography.caption, color: colors.textTertiary, width: 72 },
    atividadeDadoValor: { ...typography.body, color: colors.textPrimary, flex: 1 },
    atividadeCategoriaObs: {
      ...typography.caption,
      fontWeight: '700',
      marginBottom: 2,
    },
  });

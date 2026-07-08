import { StyleSheet, Dimensions } from 'react-native';
import { colors, radius, spacing, typography, shadows } from '../../../theme';

const { width } = Dimensions.get('window');

/**
 * Estilos da área HomeCuidador — portados do Style.js original para usar
 * os tokens do tema (cores centralizadas) em vez de hex "mágico" repetido.
 * Valores visuais (tamanhos, espaçamentos) mantidos como no original:
 * esta área não foi pedida para redesenho, só para limpeza de código.
 */
export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1, backgroundColor: colors.background },
  containerAbas: { flex: 1 },
  scrollContent: { padding: 15, flexGrow: 1, paddingTop: 50 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: colors.surface, width: '48%', borderRadius: radius.lg, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: colors.border },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { backgroundColor: colors.primarySoft, color: colors.primary, fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, fontWeight: '600' },
  iconContainer: { alignItems: 'center', justifyContent: 'center', height: 60, marginTop: 10 },
  cardTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },

  secaoTitulo: { ...typography.title3, color: '#333', marginTop: 15, marginBottom: 10 },
  cardVazio: { backgroundColor: colors.surface, padding: 20, borderRadius: radius.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  txtVazio: { color: colors.textSecondary, fontWeight: 'bold' },

  btnToggleCadastro: { flexDirection: 'row', backgroundColor: colors.surface, padding: 18, borderRadius: radius.md, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: colors.primaryBorder, borderStyle: 'dashed' },
  txtToggleCadastro: { fontSize: 16, fontWeight: 'bold', color: colors.primary, marginLeft: 10 },
  formulario: { backgroundColor: colors.surface, padding: 15, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, marginBottom: 15 },
  input: { backgroundColor: colors.divider, padding: 12, borderRadius: 8, marginBottom: 10, fontSize: 14, color: colors.textPrimary },
  btnSalvar: { backgroundColor: colors.primary, padding: 14, borderRadius: 8, alignItems: 'center' },
  btnSalvarTexto: { color: colors.white, fontWeight: 'bold', fontSize: 15 },

  wrapperPaciente: { marginBottom: 10 },
  cardPacienteHome: { flexDirection: 'row', backgroundColor: colors.surface, padding: 15, borderRadius: radius.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  infoPacienteHome: { marginLeft: 15, flex: 1 },
  nomePacienteHome: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
  detalhesPacienteHome: { color: colors.textSecondary, fontSize: 12 },

  containerAcoes: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primarySoft, borderBottomLeftRadius: radius.md, borderBottomRightRadius: radius.md, padding: 15, marginTop: -4 },
  topoAcoes: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  tituloAcoes: { fontSize: 13, fontWeight: 'bold', color: colors.textSecondary },
  gridAcoes: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  btnAcaoCard: { backgroundColor: colors.background, width: '48%', padding: 12, borderRadius: radius.sm, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  btnAtivo: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  txtAcaoCard: { fontSize: 11, fontWeight: 'bold', color: '#333', marginTop: 5 },

  itemListaPaciente: { flexDirection: 'row', backgroundColor: colors.surface, padding: 15, borderRadius: radius.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border },

  subAbaAtividade: { marginTop: 10, backgroundColor: colors.background, borderRadius: 8, padding: 12, borderWidth: 1, borderColor: colors.border },
  subAbaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  subAbaTitulo: { fontSize: 14, fontWeight: 'bold', color: colors.primary },

  calendarioContainer: { backgroundColor: colors.surface, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  calendarioHeaderNavegacao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingHorizontal: 10 },
  btnSetas: { padding: 5, justifyContent: 'center', alignItems: 'center' },
  mesTitulo: { fontWeight: 'bold', color: '#333', fontSize: 16 },
  diasGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  diaBotao: { width: '13.5%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', margin: '0.7%', borderRadius: 6, backgroundColor: colors.divider, position: 'relative' },
  diaSelecionado: { backgroundColor: colors.primary },
  diaComInfo: { backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.primaryBorder },
  diaTexto: { fontSize: 12, fontWeight: '500', color: '#333' },
  diaTextoSelecionado: { color: colors.white, fontWeight: 'bold' },
  pontoIndicador: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.warning, position: 'absolute', bottom: 3 },

  legendaInputTitulo: { fontSize: 13, fontWeight: 'bold', color: '#555', marginBottom: 6, marginTop: 4 },
  textArea: { backgroundColor: colors.surface, padding: 10, borderRadius: 6, fontSize: 13, textAlignVertical: 'top', borderWidth: 1, borderColor: colors.border, color: colors.textPrimary, minHeight: 70 },
  btnSalvarNota: { backgroundColor: colors.primary, padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  btnSalvarNotaTexto: { color: colors.white, fontSize: 14, fontWeight: 'bold' },

  bottomTab: { flexDirection: 'row', backgroundColor: colors.surface, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border, justifyContent: 'space-around' },
  tabItem: { alignItems: 'center', flex: 1 },
  tabText: { fontSize: 11, color: '#000', marginTop: 4 },

  containerHistoricoLabels: { marginTop: 20, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 15 },
  tituloLinhaTempo: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  cardLabelHistorico: { backgroundColor: colors.background, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.border, borderLeftWidth: 4, marginBottom: 10 },
  labelHeaderHistorico: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  labelTagIcon: { flexDirection: 'row', alignItems: 'center' },
  txtTagLabel: { fontSize: 11, fontWeight: 'bold', marginLeft: 6 },
  btnEditarLabel: { padding: 4 },
  txtConteudoLabel: { fontSize: 13, color: '#222', lineHeight: 18 },

  headerPerfil: { flexDirection: 'row', backgroundColor: colors.surface, padding: 20, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, alignItems: 'center', marginBottom: 15 },
  infoDireitaPerfil: { marginLeft: 20, flex: 1 },
  nomeCuidador: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  subtituloCuidador: { fontSize: 13, color: colors.textSecondary, marginTop: 2, marginBottom: 8 },
  btnEditarPerfil: { flexDirection: 'row', backgroundColor: colors.primary, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, alignItems: 'center', alignSelf: 'flex-start' },
  txtBtnEditarPerfil: { color: colors.white, fontSize: 11, fontWeight: 'bold', marginLeft: 4 },
  cardSecaoPerfil: { backgroundColor: colors.surface, padding: 15, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, marginBottom: 15 },
  tituloSecaoPerfilContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.divider, paddingBottom: 6 },
  tituloSecaoPerfil: { fontSize: 14, fontWeight: 'bold', color: '#333', marginLeft: 8 },
  conteudoTextoPerfil: { fontSize: 13, color: '#555', lineHeight: 20, marginBottom: 4 },
  itemExperiencia: { marginBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.background, paddingBottom: 8 },
  cargoExperiencia: { fontSize: 13, fontWeight: 'bold', color: colors.primary },
  periodoExperiencia: { fontSize: 11, color: colors.textTertiary, marginVertical: 2 },
  detalheExperiencia: { fontSize: 12, color: '#555', lineHeight: 16 },
});

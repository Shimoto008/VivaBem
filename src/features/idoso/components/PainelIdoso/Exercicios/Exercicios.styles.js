import { StyleSheet, Platform } from 'react-native';

export const getStyles = (colors, primaryColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    /* CABEÇALHO SENIOR - Espaçamento ajustado para não grudar no topo */
    header: {
      paddingHorizontal: 24,
      paddingTop: Platform.OS === 'ios' ? 56 : 40,
      paddingBottom: 16,
    },
    tagMotivacional: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
      backgroundColor: colors.primarySoft,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 12,
    },
    textoTagMotivacional: {
      fontSize: 13,
      fontWeight: '700',
      color: primaryColor,
      letterSpacing: 0.3,
    },
    headerTituloRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    tituloHeader: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: -0.5,
      lineHeight: 34,
      color: colors.textPrimary,
    },
    subtituloHeader: {
      fontSize: 15,
      marginTop: 8,
      lineHeight: 22,
      letterSpacing: -0.2,
      color: colors.textSecondary,
    },

    /* CATEGORIAS (SCROLL HORIZONTAL) */
    categoriasContainer: {
      marginBottom: 16,
    },
    scrollCategorias: {
      paddingHorizontal: 24,
      gap: 10,
    },
    btnCategoria: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 24,
      backgroundColor: colors.divider,
    },
    btnCategoriaSelecionado: {
      backgroundColor: primaryColor,
    },
    txtCategoria: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    txtCategoriaSelecionado: {
      color: colors.textOnPrimary,
    },

    /* LISTA E CARDS */
    listaPadding: {
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    cardExercicio: {
      borderRadius: 24,
      marginBottom: 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.07,
          shadowRadius: 12,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    videoWrapper: {
      width: '100%',
      aspectRatio: 16 / 9,
      backgroundColor: '#000000',
      overflow: 'hidden',
    },
    infoContainer: {
      padding: 20,
    },
    tituloExercicio: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: 12,
      letterSpacing: -0.3,
    },

    /* LABELS INTERATIVAS */
    labelsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    labelBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.primarySoft,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 14,
    },
    labelTexto: {
      fontSize: 14,
      fontWeight: '700',
      color: primaryColor,
    },
    labelBadgeCinza: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.divider,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 14,
    },
    labelTextoCinza: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    labelBadgeVerde: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: `${colors.success}1A`,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 14,
    },
    labelTextoVerde: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.success,
    },

    /* BOX DE INCENTIVO */
    cardIncentivo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.primarySoft,
      padding: 14,
      borderRadius: 16,
      marginBottom: 14,
      borderLeftWidth: 4,
      borderLeftColor: primaryColor,
    },
    textoIncentivo: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      flex: 1,
      lineHeight: 20,
    },
    descricaoExercicio: {
      fontSize: 15,
      lineHeight: 23,
      color: colors.textSecondary,
    },
  });

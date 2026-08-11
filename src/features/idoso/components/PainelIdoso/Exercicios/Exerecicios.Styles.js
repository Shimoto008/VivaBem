import { StyleSheet, Platform } from 'react-native';

export const getStyles = (themeColors, primaryColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    
    /* CABEÇALHO SENIOR - Espaçamento ajustado para não grudar no topo */
    header: {
      paddingHorizontal: 24,
      paddingTop: Platform.OS === 'ios' ? 56 : 40, // Recuo de segurança para o topo
      paddingBottom: 16,
    },
    tagMotivacional: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(65, 105, 225, 0.1)', // Azul Royal com opacidade
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 12,
    },
    textoTagMotivacional: {
      fontSize: 13,
      fontWeight: '700',
      color: '#4169E1', // Azul Royal
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
    },
    subtituloHeader: {
      fontSize: 15,
      marginTop: 8,
      lineHeight: 22,
      letterSpacing: -0.2,
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
      backgroundColor: '#E9ECEF',
    },
    txtCategoria: {
      fontSize: 15,
      fontWeight: '700',
      color: '#495057',
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
      borderColor: 'rgba(0,0,0,0.04)',
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
      backgroundColor: '#000000',
      overflow: 'hidden',
    },
    infoContainer: {
      padding: 20,
    },
    tituloExercicio: {
      fontSize: 22,
      fontWeight: '800',
      color: '#1A1D20',
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
      backgroundColor: `${primaryColor || '#4169E1'}15`,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 14,
    },
    labelTexto: {
      fontSize: 14,
      fontWeight: '700',
      color: primaryColor || '#4169E1',
    },
    labelBadgeCinza: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: '#F1F3F5',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 14,
    },
    labelTextoCinza: {
      fontSize: 14,
      fontWeight: '700',
      color: '#495057',
    },
    labelBadgeVerde: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: '#E8F5E9',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 14,
    },
    labelTextoVerde: {
      fontSize: 14,
      fontWeight: '700',
      color: '#2E7D32',
    },

    /* BOX DE INCENTIVO */
    cardIncentivo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: '#F0F4FF',
      padding: 14,
      borderRadius: 16,
      marginBottom: 14,
      borderLeftWidth: 4,
      borderLeftColor: '#4169E1',
    },
    textoIncentivo: {
      fontSize: 14,
      fontWeight: '600',
      color: '#2B4C7E',
      flex: 1,
      lineHeight: 20,
    },
    descricaoExercicio: {
      fontSize: 15,
      lineHeight: 23,
      color: '#6C757D',
    },
    videoWrapper: {
  width: '100%',
  aspectRatio: 16 / 9,
  backgroundColor: '#000000',
  overflow: 'hidden',
},
  });
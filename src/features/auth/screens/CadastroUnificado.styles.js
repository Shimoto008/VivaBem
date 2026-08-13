import { StyleSheet, Platform } from 'react-native';

export const getStyles = (themeColors, accentColor) =>
  StyleSheet.create({
    containerScroll: {
      flex: 1,
      backgroundColor: themeColors.background || '#F4F5F7',
    },
    contentScroll: {
      paddingHorizontal: 18,
      paddingBottom: 40,
    },
    viewPrincipal: {
      flex: 1,
    },
    seletorHeaderRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginTop: 16,
      marginBottom: 10,
    },
    seletorTitulo: {
      fontSize: 13,
      fontWeight: '700',
      color: themeColors.textSecondary || '#6C757D',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    seletorDica: {
      fontSize: 11,
      fontWeight: '500',
      color: accentColor,
      fontStyle: 'italic',
    },
    seletorContainer: {
      marginBottom: 12,
    },
    seletorRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    cardTipo: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      paddingHorizontal: 4,
      borderRadius: 16,
      backgroundColor: themeColors.surface || '#FFFFFF',
      borderWidth: 2,
      borderColor: 'transparent',
      ...Platform.select({
        ios: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    cardTipoAtivo: {
      backgroundColor: themeColors.surface || '#FFFFFF',
      ...Platform.select({
        ios: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    iconeCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: themeColors.divider,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
    cardTipoLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: themeColors.textSecondary || '#6C757D',
      textAlign: 'center',
    },
    cardTipoLabelAtivo: {
      fontWeight: '700',
    },

    /* BALÃO DE PENSAMENTO / POPOVER COM TRIÂNGULO APONTADOR DINÂMICO */
    balaoPensamentoWrapper: {
      marginTop: 8,
      width: '100%',
      zIndex: 10,
    },
    containerTriangulo: {
      width: '100%',
      height: 10,
      justifyContent: 'center',
    },
    trianguloPensamento: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 8,
      borderRightWidth: 8,
      borderBottomWidth: 10,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
    },
    balaoPensamento: {
      width: '100%',
      borderRadius: 16,
      padding: 14,
      borderWidth: 1.5,
      ...Platform.select({
        ios: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    balaoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6,
    },
    badgeIcon: {
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
    },
    balaoTitulo: {
      fontSize: 14,
      fontWeight: '700',
      flex: 1,
    },
    botaoFecharBalao: {
      padding: 2,
    },
    balaoTexto: {
      fontSize: 13,
      lineHeight: 18,
      color: themeColors.textPrimary || '#2B3036',
      fontWeight: '500',
    },

    /* CARD ELEVADO PREMIUM - DADOS PESSOAIS */
    cardDadosPessoais: {
      backgroundColor: themeColors.surface || '#FFFFFF',
      borderRadius: 24,
      padding: 20,
      marginTop: 8,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.04)',
      ...Platform.select({
        ios: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.09,
          shadowRadius: 20,
        },
        android: {
          elevation: 7,
        },
      }),
    },
    secaoTitulo: {
      fontSize: 16,
      fontWeight: '700',
      color: themeColors.textPrimary || '#1A1D20',
      marginBottom: 16,
      letterSpacing: 0.3,
    },
    wrapperEspecialidade: {
      marginTop: 6,
    },
    rotuloEspecialidade: {
      fontSize: 14,
      fontWeight: '600',
      color: themeColors.textPrimary || '#1A1D20',
      marginBottom: 6,
    },
    seletor: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 52,
      paddingHorizontal: 14,
      borderRadius: 12,
      backgroundColor: themeColors.surface,
      borderWidth: 1,
      borderColor: themeColors.border || '#E9ECEF',
    },
    seletorTextoPreenchido: {
      fontSize: 15,
      color: themeColors.textPrimary || '#1A1D20',
    },
    seletorTextoVazio: {
      fontSize: 15,
      color: themeColors.placeholder || '#ADB5BD',
    },
    erroEspecialidade: {
      fontSize: 12,
      color: themeColors.danger,
      marginTop: 4,
      marginLeft: 4,
    },
    botaoAcao: {
      marginTop: 12,
      borderRadius: 16,
      height: 54,
      ...Platform.select({
        ios: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.18,
          shadowRadius: 10,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    linkLogin: {
      marginTop: 16,
      alignItems: 'center',
      paddingVertical: 8,
    },
    textoLinkLogin: {
      fontSize: 14,
      color: themeColors.textSecondary || '#6C757D',
    },
  });
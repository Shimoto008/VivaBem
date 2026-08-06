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
    seletorTitulo: {
      fontSize: 13,
      fontWeight: '700',
      color: themeColors.textSecondary || '#6C757D',
      marginTop: 16,
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    seletorRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
      marginBottom: 16,
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
          shadowOpacity: 0.08,
          shadowRadius: 10,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    cardTipoAtivo: {
      backgroundColor: themeColors.surface || '#FFFFFF',
      ...Platform.select({
        ios: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.16,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    iconeCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: themeColors.backgroundSecondary || '#F1F3F5',
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

    /* BALÃO DE INFORMAÇÃO */
    balaoInfo: {
      borderRadius: 14,
      padding: 14,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderWidth: 1,
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
    },
    balaoTexto: {
      fontSize: 14,
      lineHeight: 20,
      color: themeColors.textPrimary || '#2B3036',
      fontWeight: '500',
    },

    /* CONTAINER DOS INPUTS PESSOAIS SOLTOS NA TELA */
    containerInputsPessoais: {
      gap: 2,
      marginTop: 4,
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
      backgroundColor: themeColors.surface || '#FFFFFF',
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
      color: themeColors.error || '#DC3545',
      marginTop: 4,
      marginLeft: 4,
    },
    botaoAcao: {
      marginTop: 24,
      borderRadius: 14,
      ...Platform.select({
        ios: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        android: {
          elevation: 5,
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
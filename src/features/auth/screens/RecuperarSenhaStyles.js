import { StyleSheet, Platform } from 'react-native';

export const getStyles = (themeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    contentScroll: {
      paddingHorizontal: 18,
      paddingBottom: 40,
    },
    cardForm: {
      backgroundColor: themeColors.surface,
      borderRadius: 24,
      padding: 20,
      marginTop: 16,
      borderWidth: 1,
      borderColor: themeColors.divider,
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
    botaoAcao: {
      marginTop: 16,
      borderRadius: 16,
      height: 54,
    },
    // Centralizado e espaçado para conferir caractere por caractere com o
    // e-mail aberto ao lado, mas sem exagero: o token pode ser mais longo que
    // os 6 dígitos padrão e precisa caber na linha.
    inputCodigo: {
      textAlign: 'center',
      fontSize: 20,
      letterSpacing: 4,
      fontWeight: '700',
      color: themeColors.textPrimary,
    },
    textoAjudaCodigo: {
      fontSize: 13,
      lineHeight: 18,
      textAlign: 'center',
      color: themeColors.textSecondary,
      marginTop: -8,
      marginBottom: 16,
    },
    btnReenviar: {
      marginTop: 16,
      alignItems: 'center',
      paddingVertical: 8,
    },
    btnReenviarDesabilitado: {
      opacity: 0.5,
    },
    textoReenviar: {
      fontSize: 14,
      color: themeColors.textSecondary,
    },
    textoReenviarDestaque: {
      color: themeColors.primary,
      fontWeight: '700',
    },
  });
import { StyleSheet } from 'react-native';

/**
 * Estrutura/valores visuais preservados do Style.js original — só passam a
 * reagir ao tema global (modo claro/escuro + cor de destaque) via `colors`
 * vindo de `useTheme()`, em vez de hex fixo.
 */
export const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titulo: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 80,
    },
    img: {
      width: 150,
      height: 100,
      alignSelf: 'center',
    },
    input: {
      backgroundColor: colors.surface,
      color: colors.textPrimary,
      width: '90%',
      fontSize: 18,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
    },
    txt: {
      backgroundColor: colors.surface,
      color: colors.textPrimary,
      fontWeight: 'bold',
      width: '88%',
      fontSize: 15,
      marginTop: 20,
    },
    cadastro: {
      backgroundColor: colors.primary,
      marginTop: 60,
      padding: 20,
      borderRadius: 10,
      width: '50%',
      alignItems: 'center',
    },
    txt_cad: {
      color: colors.textOnPrimary,
      fontSize: 15,
      fontWeight: 'bold',
    },
    erro: {
      color: colors.danger,
      fontSize: 12,
      width: '88%',
      marginTop: 4,
    },
  });

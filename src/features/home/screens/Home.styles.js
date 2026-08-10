import { StyleSheet } from 'react-native';
import { spacing, typography } from '../../../theme';

export const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.xl,
    },
    img: {
      width: 220,
      height: 120,
      alignSelf: 'center',
      resizeMode: 'contain',
      marginBottom: spacing.xs,
    },
    titulo: {
      ...typography.title1,
      color: '#000000', // SÓ FUNCIONA SE FICAR DEPOIS DO ...typography
      textAlign: 'center',
      marginTop: -5, // Empurra para fora da área transparente da imagem
    },
    subtitulo: {
      ...typography.body,
      color: '#000000', // SÓ FUNCIONA SE FICAR DEPOIS DO ...typography
      fontWeight: '600',
      textAlign: 'center',
      marginTop: spacing.xs,
    },
    buttonContainer: {
      width: '100%',
      marginTop: spacing.xl,
    },
    ctaCriarConta: {},
    ctaEntrar: {},
  });
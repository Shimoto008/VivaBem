import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme';

export const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    conteudo: {
      flexGrow: 1,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xxxl,
    },
    img: {
      width: 150,
      height: 100,
      resizeMode: 'contain',
      alignSelf: 'center',
      marginBottom: spacing.xl,
    },
    botaoCadastrar: { marginTop: spacing.lg },
  });

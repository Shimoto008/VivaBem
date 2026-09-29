import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme';

export const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
      paddingBottom: 60,
    },
    img: {
      width: 220,
      height: 120,
      alignSelf: 'center',
      resizeMode: 'contain',
      marginBottom: spacing.xs,
    },
    buttonContainer: {
      width: '100%',
      gap: spacing.md,
      marginTop: spacing.xl,
    },
  });

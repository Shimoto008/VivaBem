import { StyleSheet } from 'react-native';

export const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

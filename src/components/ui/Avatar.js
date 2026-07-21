import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export function Avatar({ uri, icon, size = 56 }) {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  const dimensoes = { width: size, height: size, borderRadius: size / 2 };
  return (
    <View style={[styles.base, dimensoes]}>
      {uri ? <Image source={{ uri }} style={dimensoes} /> : icon}
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    base: {
      backgroundColor: colors.primarySoft,
      borderWidth: 2,
      borderColor: colors.primaryBorder,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
  });

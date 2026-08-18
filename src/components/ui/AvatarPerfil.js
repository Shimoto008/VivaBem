import React from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const FAMILIAS = {
  MaterialIcons,
  FontAwesome5,
};

/**
 * Avatar circular: foto remota, ícone de fallback e toque opcional para alterar.
 */
export function AvatarPerfil({
  uri,
  size = 60,
  onPress,
  iconName = 'person',
  iconFamily = 'MaterialIcons',
  iconSize,
  backgroundColor,
  iconColor,
  carregando = false,
  accessibilityLabel = 'Foto de perfil',
}) {
  const { themeColors, primaryColor } = useTheme();
  const Icone = FAMILIAS[iconFamily] ?? MaterialIcons;
  const fundo = backgroundColor ?? primaryColor;
  const corIcone = iconColor ?? themeColors.white;
  const tamanhoIcone = iconSize ?? Math.round(size * 0.46);

  const conteudo = uri ? (
    <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
  ) : (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: fundo,
        },
      ]}
    >
      <Icone name={iconName} size={tamanhoIcone} color={corIcone} />
    </View>
  );

  const overlay = carregando ? (
    <View style={[styles.overlay, { borderRadius: size / 2 }]}>
      <ActivityIndicator color={themeColors.white} />
    </View>
  ) : null;

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={carregando}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={{ width: size, height: size }}
      >
        {conteudo}
        {overlay}
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ width: size, height: size }}>
      {conteudo}
      {overlay}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

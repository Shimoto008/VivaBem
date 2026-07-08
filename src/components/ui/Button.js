import React, { useRef } from 'react';
import { Animated, Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

const VARIANTES = {
  primary: { backgroundColor: colors.primary, textColor: colors.textOnPrimary },
  secondary: { backgroundColor: colors.primarySoft, textColor: colors.primary },
  danger: { backgroundColor: colors.danger, textColor: colors.textOnPrimary },
  outline: { backgroundColor: 'transparent', textColor: colors.primary, borderColor: colors.primary },
};

/**
 * Botão padrão do app — estados de pressionado (animação de escala),
 * loading (spinner substitui o texto) e desabilitado, conforme pedido
 * no Design System. Usado em todas as telas, em vez de TouchableOpacity
 * + estilo duplicado em cada Style.js.
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
}) {
  const escala = useRef(new Animated.Value(1)).current;
  const aparenciaVariante = VARIANTES[variant] ?? VARIANTES.primary;
  const estaDesabilitado = disabled || loading;

  const animarPara = (valor) => {
    Animated.spring(escala, { toValue: valor, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: escala }] }}>
      <Pressable
        onPress={onPress}
        disabled={estaDesabilitado}
        onPressIn={() => !estaDesabilitado && animarPara(0.96)}
        onPressOut={() => !estaDesabilitado && animarPara(1)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityState={{ disabled: estaDesabilitado, busy: loading }}
        style={[
          styles.base,
          { backgroundColor: aparenciaVariante.backgroundColor },
          aparenciaVariante.borderColor && { borderWidth: 1.5, borderColor: aparenciaVariante.borderColor },
          estaDesabilitado && styles.desabilitado,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={aparenciaVariante.textColor} />
        ) : (
          <Text style={[styles.texto, { color: aparenciaVariante.textColor }]}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  desabilitado: {
    opacity: 0.5,
  },
  texto: {
    ...typography.bodyBold,
  },
});

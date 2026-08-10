import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const SPRING = { damping: 18, stiffness: 180, mass: 0.8 };

/**
 * Zoom tátil por pinça (2 dedos) + pan quando ampliado.
 * Pensado para baixa visão; não interfere no scroll/toque de 1 dedo.
 */
export function PinchZoomView({
  children,
  minScale = 1,
  maxScale = 3,
  enabled = true,
  style,
}) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .enabled(enabled)
    .onUpdate((e) => {
      'worklet';
      const next = savedScale.value * e.scale;
      scale.value = Math.min(maxScale, Math.max(minScale, next));
    })
    .onEnd(() => {
      'worklet';
      if (scale.value < 1.05) {
        scale.value = withSpring(1, SPRING);
        savedScale.value = 1;
        translateX.value = withSpring(0, SPRING);
        translateY.value = withSpring(0, SPRING);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
        return;
      }
      const clamped = Math.min(maxScale, Math.max(minScale, scale.value));
      scale.value = withSpring(clamped, SPRING);
      savedScale.value = clamped;
    });

  const pan = Gesture.Pan()
    .enabled(enabled)
    .minPointers(2)
    .onUpdate((e) => {
      'worklet';
      if (savedScale.value <= 1.01) return;
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      'worklet';
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Só gestos de 2 dedos — evita atrasar toques simples em botões do app.
  const composed = Gesture.Simultaneous(pinch, pan);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  if (!enabled) {
    return <View style={[styles.fill, style]}>{children}</View>;
  }

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.fill, style, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});

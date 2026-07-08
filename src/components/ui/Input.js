import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

/**
 * Input padrão: foco elegante (borda muda de cor suavemente), mensagem de
 * erro e contorno de validação visual. Substitui os estilos de input
 * duplicados em cada tela.
 */
export function Input({ label, error, value, onChangeText, style, ...rest }) {
  const [focado, setFocado] = useState(false);

  const corDaBorda = error ? colors.danger : focado ? colors.primary : colors.border;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
        placeholderTextColor={colors.placeholder}
        style={[
          styles.input,
          { borderColor: corDaBorda, borderWidth: focado || error ? 1.5 : 1 },
          style,
        ]}
        accessibilityLabel={label}
        {...rest}
      />
      {error ? <Text style={styles.erro}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginBottom: spacing.md },
  label: { ...typography.bodyBold, color: colors.textPrimary, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  erro: { ...typography.caption, color: colors.danger, marginTop: spacing.xs },
});

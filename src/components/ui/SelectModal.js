import React from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { radius, spacing, typography, shadows } from '../../theme';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Modal de seleção genérico (lista de opções). Substitui o Modal+FlatList
 * que estava reimplementado dentro da tela de cadastro do Cuidador.
 */
export function SelectModal({ visible, title, options, onSelect, onClose }) {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              <Text style={styles.title}>{title}</Text>
              <FlatList
                data={options}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => onSelect(item)}
                    accessibilityRole="button"
                    accessibilityLabel={item}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.overlay },
    content: {
      width: '85%',
      maxHeight: '60%',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.xl,
      ...shadows.floating,
    },
    title: { ...typography.title3, color: colors.textPrimary, marginBottom: spacing.lg, textAlign: 'center' },
    option: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
    optionText: { ...typography.body, color: colors.textPrimary },
  });

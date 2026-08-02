import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles } from '../screens/HomeFamiliar.styles';
import { Button } from '../../../components/ui';
import { useTheme } from '../../../contexts/ThemeContext';
import { useConexaoFamiliarContext } from '../../../contexts/ConexaoFamiliarContext';

const TAMANHO_CODIGO = 6;

/**
 * Modal de conexão com um cuidador via código de 6 caracteres.
 */
export function ConectarCuidadorModal({ visible, onClose }) {
  const { conectarPorCodigo, processando } = useConexaoFamiliarContext();
  const { themeColors, primaryColor } = useTheme();
  const styles = getStyles(themeColors);
  const [codigo, setCodigo] = useState('');
  const [erroLocal, setErroLocal] = useState(null);

  async function confirmar() {
    Keyboard.dismiss();

    if (!codigo.trim() || codigo.trim().length < TAMANHO_CODIGO) {
      setErroLocal(`Digite o código completo de ${TAMANHO_CODIGO} caracteres.`);
      return;
    }

    setErroLocal(null);

    try {
      await conectarPorCodigo(codigo.trim());
      setCodigo('');
      onClose();
    } catch (erro) {
      setErroLocal(erro.message ?? 'Não foi possível conectar. Tente novamente.');
    }
  }

  function fechar() {
    setCodigo('');
    setErroLocal(null);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={fechar}>
      <KeyboardAvoidingView
        style={styles.modalKav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <SafeAreaView edges={['bottom']} style={styles.modalSafe}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitulo}>Conectar a um Cuidador</Text>
                <Text style={styles.modalSubtitulo}>
                  Peça ao cuidador o código gerado no aplicativo dele.
                </Text>

                <Text style={styles.codigoLabel}>Código do Cuidador</Text>
                <TextInput
                  style={[
                    styles.codigoInput,
                    {
                      borderColor: erroLocal ? themeColors.danger : primaryColor,
                    },
                  ]}
                  placeholder="A3F9K2"
                  placeholderTextColor={themeColors.placeholder}
                  value={codigo}
                  onChangeText={(texto) => {
                    setCodigo(texto.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, TAMANHO_CODIGO));
                    if (erroLocal) setErroLocal(null);
                  }}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={TAMANHO_CODIGO}
                  textAlign="center"
                  accessibilityLabel="Código do cuidador"
                />

                {erroLocal ? <Text style={styles.modalErro}>{erroLocal}</Text> : null}

                <View style={styles.modalAcoes}>
                  <View style={styles.modalBotaoWrap}>
                    <Button title="Cancelar" variant="outline" onPress={fechar} />
                  </View>
                  <View style={styles.modalBotaoWrap}>
                    <Button title="Vincular" onPress={confirmar} loading={processando} />
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

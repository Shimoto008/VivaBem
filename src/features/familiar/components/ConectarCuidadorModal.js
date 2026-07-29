import React, { useState } from 'react';
import { Modal, View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { getStyles } from '../screens/HomeFamiliar.styles';
import { Input, Button } from '../../../components/ui';
import { useTheme } from '../../../contexts/ThemeContext';
import { useConexaoFamiliarContext } from '../../../contexts/ConexaoFamiliarContext';

const TAMANHO_CODIGO = 6;

/**
 * Modal de conexão com um cuidador via código.
 */
export function ConectarCuidadorModal({ visible, onClose }) {
  const { conectarPorCodigo, processando } = useConexaoFamiliarContext();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  const [codigo, setCodigo] = useState('');
  const [erroLocal, setErroLocal] = useState(null);

  async function confirmar() {
    Keyboard.dismiss();

    if (!codigo.trim()) {
      setErroLocal('Digite o código do cuidador.');
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Conectar a um Cuidador</Text>
            <Text style={styles.modalSubtitulo}>
              Peça ao cuidador o código gerado no aplicativo dele.
            </Text>

            <Input
              label="Código do Cuidador"
              placeholder="Ex.: A3F9K2"
              value={codigo}
              onChangeText={(texto) => setCodigo(texto.toUpperCase())}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={TAMANHO_CODIGO}
            />

            {erroLocal ? <Text style={styles.modalErro}>{erroLocal}</Text> : null}

            <View style={styles.modalAcoes}>
              <Button title="Cancelar" variant="outline" onPress={fechar} style={styles.modalBotao} />
              <Button
                title="Conectar"
                onPress={confirmar}
                loading={processando}
                style={styles.modalBotao}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
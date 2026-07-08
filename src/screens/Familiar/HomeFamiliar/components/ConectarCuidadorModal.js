import React, { useState } from 'react';
import { Modal, View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { styles } from '../HomeFamiliar.styles';
import { Input, Button } from '../../../../components/ui';
import { useConexaoFamiliarContext } from '../../../../contexts/ConexaoFamiliarContext';

/**
 * Modal de conexão com um cuidador via código. A regra "só pode haver UMA
 * conexão ativa por vez" não é decidida aqui — este componente só chama
 * `conectarPorCodigo` e exibe a mensagem que vier (DomainError ou erro de
 * rede), como pedido: a lógica fica fora da interface.
 */
export function ConectarCuidadorModal({ visible, onClose }) {
  const { conectarPorCodigo, processando } = useConexaoFamiliarContext();
  const [codigo, setCodigo] = useState('');
  const [erroLocal, setErroLocal] = useState(null);

  async function confirmar() {
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
            <Text style={styles.modalSubtitulo}>Peça ao cuidador o código de 6 caracteres gerado no cadastro dele.</Text>

            <Input
              label="Código do Cuidador"
              placeholder="Ex.: A3F9K2"
              value={codigo}
              onChangeText={(texto) => setCodigo(texto.toUpperCase())}
              autoCapitalize="characters"
              maxLength={6}
            />

            {erroLocal ? <Text style={styles.modalErro}>{erroLocal}</Text> : null}

            <View style={styles.modalAcoes}>
              <Button title="Cancelar" variant="outline" onPress={fechar} style={{ flex: 1 }} />
              <Button title="Conectar" onPress={confirmar} loading={processando} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

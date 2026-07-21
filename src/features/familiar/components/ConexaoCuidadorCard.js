import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../screens/HomeFamiliar.styles';
import { Card, Badge, Button } from '../../../components/ui';
import { colors } from '../../../theme';
import { useConexaoFamiliarContext } from '../../../contexts/ConexaoFamiliarContext';
import { ConectarCuidadorModal } from './ConectarCuidadorModal';

/**
 * Mostra claramente qual Cuidador está conectado agora (regra de negócio:
 * "a interface deve informar claramente qual Cuidador está conectado").
 * Toda a lógica de conectar/desconectar vem do ConexaoFamiliarContext —
 * este componente só chama as funções e mostra o resultado.
 */
export function ConexaoCuidadorCard() {
  const { conexao, carregando, processando, desconectar } = useConexaoFamiliarContext();
  const [modalVisivel, setModalVisivel] = useState(false);

  function confirmarDesconexao() {
    Alert.alert(
      'Desconectar cuidador',
      `Tem certeza que deseja se desconectar de ${conexao.cuidadores.nome}? Você perderá acesso às atividades publicadas por ele.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Desconectar', style: 'destructive', onPress: () => desconectar() },
      ]
    );
  }

  if (carregando) {
    return (
      <Card style={styles.conexaoCard}>
        <ActivityIndicator color={colors.primary} />
      </Card>
    );
  }

  if (!conexao) {
    return (
      <>
        <Card style={styles.conexaoCard}>
          <View style={{ alignItems: 'center' }}>
            <MaterialIcons name="link-off" size={32} color={colors.textTertiary} />
            <Text style={styles.conexaoVazioTitulo}>Nenhum cuidador conectado</Text>
            <Text style={styles.conexaoVazioTexto}>
              Conecte-se a um cuidador usando o código de 6 caracteres que ele recebeu no cadastro.
            </Text>
            <Button title="Conectar a um Cuidador" onPress={() => setModalVisivel(true)} />
          </View>
        </Card>
        <ConectarCuidadorModal visible={modalVisivel} onClose={() => setModalVisivel(false)} />
      </>
    );
  }

  return (
    <Card style={styles.conexaoCard}>
      <View style={styles.conexaoConectadaTopo}>
        <View style={styles.conexaoIconWrap}>
          <MaterialIcons name="how-to-reg" size={24} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.conexaoNome}>{conexao.cuidadores.nome}</Text>
          <Text style={styles.conexaoEspecialidade}>{conexao.cuidadores.especialidade}</Text>
        </View>
        <Badge label="Conectado" tone="success" />
      </View>
      <Button
        title="Desconectar"
        variant="outline"
        onPress={confirmarDesconexao}
        loading={processando}
        style={{ marginTop: 16 }}
      />
    </Card>
  );
}

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import {
  Input,
  Button,
  PreferenciasAparencia,
  SecaoInstitucional,
  BotaoLogout,
  BotaoExcluirConta,
  AvatarPerfil,
} from '../../../components/ui';
import { getStyles } from '../screens/IdosoAutonomo.styles';
import { useTheme } from '../../../contexts/ThemeContext';
import { useSession } from '../../../contexts/SessionContext';
import { atualizarPerfilIdoso } from '../../../services/idosoService';
import { aplicarMascaraCPF, aplicarMascaraTelefone, somenteDigitos } from '../../../utils/masks';
import { useFotoPerfil } from '../../../hooks/useFotoPerfil';

export function PerfilIdosoTab() {
  const { perfil: idoso, atualizarPerfilLocal, carregando } = useSession();
  const { themeColors, primaryColor } = useTheme();
  const styles = getStyles(themeColors);

  const persistirFoto = useCallback(
    (fotoUrl) => atualizarPerfilIdoso(idoso?.id, { foto_url: fotoUrl }),
    [idoso?.id]
  );
  const { enviando: enviandoFoto, selecionarEEnviar } = useFotoPerfil({
    userId: idoso?.id,
    persistirUrl: persistirFoto,
    atualizarPerfilLocal,
  });

  const [editando, setEditando] = useState(false);
  const [telefoneEdicao, setTelefoneEdicao] = useState('');
  const [contatoEdicao, setContatoEdicao] = useState('');
  const [preferenciasEdicao, setPreferenciasEdicao] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [modalConfiguracoesVisivel, setModalConfiguracoesVisivel] = useState(false);

  useEffect(() => {
    setTelefoneEdicao(aplicarMascaraTelefone(idoso?.telefone ?? ''));
    setContatoEdicao(aplicarMascaraTelefone(idoso?.contato_emergencia ?? ''));
    setPreferenciasEdicao(idoso?.preferencias ?? '');
  }, [idoso?.telefone, idoso?.contato_emergencia, idoso?.preferencias]);

  async function salvarEdicao() {
    if (!idoso?.id) return;
    setSalvando(true);
    try {
      const atualizado = await atualizarPerfilIdoso(idoso.id, {
        telefone: somenteDigitos(telefoneEdicao),
        contato_emergencia: somenteDigitos(contatoEdicao) || null,
        preferencias: preferenciasEdicao.trim() || null,
      });
      atualizarPerfilLocal(atualizado);
      setEditando(false);
      Alert.alert('Sucesso', 'Perfil atualizado.');
    } catch (erro) {
      Alert.alert('Erro ao salvar', erro.message || 'Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando || !idoso) {
    return (
      <View style={styles.containerCarregando}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={styles.textoSecundario}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.containerAbas}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerTopo}>
        <Text style={styles.tituloPagina}>Perfil</Text>
        <TouchableOpacity
          style={styles.botaoConfiguracoes}
          onPress={() => setModalConfiguracoesVisivel(true)}
          accessibilityRole="button"
          accessibilityLabel="Abrir configurações"
        >
          <MaterialIcons name="settings" size={28} color={themeColors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.linhaCentralizada}>
          <AvatarPerfil
            uri={idoso.foto_url}
            size={64}
            onPress={selecionarEEnviar}
            carregando={enviandoFoto}
            iconName="person"
            iconSize={36}
            backgroundColor={`${primaryColor}22`}
            iconColor={primaryColor}
            accessibilityLabel="Alterar foto de perfil"
          />
          <View style={styles.infoPerfil}>
            <Text style={styles.nome}>{idoso.nome}</Text>
            <Text style={styles.textoSecundario}>
              CPF {aplicarMascaraCPF(idoso.cpf ?? '')}
            </Text>
            <Text style={styles.textoSecundario}>
              {aplicarMascaraTelefone(idoso.telefone ?? '') || 'Telefone não informado'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.botaoEditar, { backgroundColor: `${primaryColor}18` }]}
            onPress={() => setEditando((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={editando ? 'Cancelar edição' : 'Editar perfil'}
          >
            <MaterialIcons
              name={editando ? 'close' : 'edit'}
              size={20}
              color={primaryColor}
            />
          </TouchableOpacity>
        </View>

        {editando ? (
          <View style={styles.formEdicao}>
            <Input
              label="Telefone"
              value={telefoneEdicao}
              onChangeText={(t) => setTelefoneEdicao(aplicarMascaraTelefone(t))}
              keyboardType="phone-pad"
              maxLength={15}
            />
            <Input
              label="Contato de emergência"
              value={contatoEdicao}
              onChangeText={(t) => setContatoEdicao(aplicarMascaraTelefone(t))}
              keyboardType="phone-pad"
              maxLength={15}
              placeholder="(11) 90000-0000"
            />
            <Input
              label="Preferências e observações"
              value={preferenciasEdicao}
              onChangeText={setPreferenciasEdicao}
              autoCapitalize="sentences"
              multiline
              numberOfLines={3}
              placeholder="Ex.: prefiro letras grandes, remédios pela manhã..."
              style={{ minHeight: 80, textAlignVertical: 'top' }}
            />
            <Button title="Salvar alterações" onPress={salvarEdicao} loading={salvando} />
          </View>
        ) : null}
      </View>

      {!editando ? (
        <View style={styles.card}>
          <Text style={styles.secaoSubtitulo}>Contato de emergência</Text>
          <Text style={styles.textoDetalhe}>
            {idoso.contato_emergencia
              ? aplicarMascaraTelefone(idoso.contato_emergencia)
              : 'Nenhum contato cadastrado. Toque em editar para adicionar.'}
          </Text>
          <View style={styles.divisor} />
          <Text style={styles.secaoSubtitulo}>Preferências</Text>
          <Text style={styles.textoDetalhe}>
            {idoso.preferencias ||
              'Nenhuma preferência registrada ainda. Você pode anotar o que facilita o seu dia a dia.'}
          </Text>
        </View>
      ) : null}

      <Modal
        visible={modalConfiguracoesVisivel}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalConfiguracoesVisivel(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitulo}>Configurações</Text>
            <TouchableOpacity onPress={() => setModalConfiguracoesVisivel(false)}>
              <MaterialIcons name="close" size={28} color={themeColors.textPrimary} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalConteudo} showsVerticalScrollIndicator={false}>
            <Text style={styles.secaoTitulo}>Aparência</Text>
            <PreferenciasAparencia />
            <SecaoInstitucional />
            <View style={styles.divisorLogout} />
            <BotaoLogout />
            <BotaoExcluirConta />
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

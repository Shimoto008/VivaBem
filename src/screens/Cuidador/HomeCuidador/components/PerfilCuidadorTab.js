import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { styles } from '../HomeCuidador.styles';
import { Input, Button } from '../../../../components/ui';
import { colors } from '../../../../theme';
import { useSession } from '../../../../contexts/SessionContext';
import { atualizarPerfilCuidador } from '../../../../services/cuidadorService';

/**
 * Antes "RenderPerfilCuidador.js": usava um nome fixo no código
 * ("Carlos Alberto Silva") em vez do cuidador realmente logado, e o botão
 * "Editar Perfil" não salvava nada. Agora lê do SessionContext (o cuidador
 * que de fato se cadastrou) e persiste a edição via cuidadorService.
 *
 * A foto de perfil ainda fica só em memória (useState) — persistir uma
 * imagem exige Supabase Storage, o que depende de configuração no backend
 * (ver relatório final).
 */
export function PerfilCuidadorTab() {
  const { cuidador, setCuidador } = useSession();
  const [foto, setFoto] = useState(null);
  const [editando, setEditando] = useState(false);
  const [telefoneEdicao, setTelefoneEdicao] = useState(cuidador?.telefone ?? '');
  const [especialidadeEdicao, setEspecialidadeEdicao] = useState(cuidador?.especialidade ?? '');
  const [salvando, setSalvando] = useState(false);

  async function selecionarFoto() {
    try {
      const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissao.granted) {
        Alert.alert('Permissão necessária', 'Autorize o acesso à galeria para escolher uma foto.');
        return;
      }
      const resultado = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
      if (!resultado.canceled) setFoto(resultado.assets[0].uri);
    } catch (erro) {
      Alert.alert('Não foi possível abrir a galeria', 'Tente novamente em alguns instantes.');
    }
  }

  async function salvarEdicao() {
    setSalvando(true);
    try {
      const atualizado = await atualizarPerfilCuidador(cuidador.id, {
        telefone: telefoneEdicao,
        especialidade: especialidadeEdicao,
      });
      setCuidador(atualizado);
      setEditando(false);
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setSalvando(false);
    }
  }

  if (!cuidador) {
    return (
      <View style={styles.containerAbas}>
        <Text>Nenhum cuidador logado nesta sessão.</Text>
      </View>
    );
  }

  return (
    <View style={styles.containerAbas}>
      <View style={styles.headerPerfil}>
        <TouchableOpacity onPress={selecionarFoto} accessibilityLabel="Alterar foto de perfil">
          {foto ? (
            <Image source={{ uri: foto }} style={{ width: 70, height: 70, borderRadius: 35 }} />
          ) : (
            <FontAwesome5 name="user-circle" size={70} color={colors.primary} />
          )}
        </TouchableOpacity>
        <View style={styles.infoDireitaPerfil}>
          <Text style={styles.nomeCuidador}>{cuidador.nome}</Text>
          <Text style={styles.subtituloCuidador}>{cuidador.especialidade}</Text>
          <TouchableOpacity style={styles.btnEditarPerfil} onPress={() => setEditando((atual) => !atual)} accessibilityLabel="Editar perfil">
            <MaterialIcons name="edit" size={14} color={colors.white} />
            <Text style={styles.txtBtnEditarPerfil}>{editando ? 'Cancelar' : 'Editar Perfil'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {editando && (
        <View style={styles.cardSecaoPerfil}>
          <Input label="Telefone" value={telefoneEdicao} onChangeText={setTelefoneEdicao} keyboardType="numeric" />
          <Input label="Especialidade" value={especialidadeEdicao} onChangeText={setEspecialidadeEdicao} />
          <Button title="Salvar Alterações" onPress={salvarEdicao} loading={salvando} />
        </View>
      )}

      <View style={styles.cardSecaoPerfil}>
        <View style={styles.tituloSecaoPerfilContainer}>
          <MaterialIcons name="info-outline" size={18} color={colors.primary} />
          <Text style={styles.tituloSecaoPerfil}>Sobre</Text>
        </View>
        <Text style={styles.conteudoTextoPerfil}>
          Cuidador(a) cadastrado(a) no VivaBem, responsável pelo acompanhamento diário dos idosos sob seus cuidados.
        </Text>
      </View>

      <View style={styles.cardSecaoPerfil}>
        <View style={styles.tituloSecaoPerfilContainer}>
          <MaterialIcons name="work-outline" size={18} color={colors.primary} />
          <Text style={styles.tituloSecaoPerfil}>Experiência</Text>
        </View>
        <View style={styles.itemExperiencia}>
          <Text style={styles.cargoExperiencia}>{cuidador.especialidade}</Text>
          <Text style={styles.detalheExperiencia}>
            Cadastre relatórios, medicações e observações pela aba “Pacientes” para começar a montar seu histórico de atendimentos.
          </Text>
        </View>
      </View>
    </View>
  );
}

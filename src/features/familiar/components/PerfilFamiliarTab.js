import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import {
  PreferenciasAparencia,
  SecaoInstitucional,
  BotaoLogout,
  BotaoExcluirConta,
  Input,
  Button,
  AvatarPerfil,
} from '../../../components/ui';
import { radius, spacing, typography } from '../../../theme';
import { useSession } from '../../../contexts/SessionContext';
import { useConexaoFamiliarContext } from '../../../contexts/ConexaoFamiliarContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { atualizarPerfilFamiliar } from '../../../services/familiarService';
import { aplicarMascaraTelefone, somenteDigitos } from '../../../utils/masks';
import { validarNomeCompleto, validarTelefoneObrigatorio } from '../../../utils/validators';
import { useFotoPerfil } from '../../../hooks/useFotoPerfil';

import MapaCuidador from '../screens/MapaCuidador';

export default function PerfilFamiliarTab() {
  const { perfil, carregando, atualizarPerfilLocal } = useSession();
  const { conexao, carregando: carregandoConexao } = useConexaoFamiliarContext();
  const { primaryColor, themeColors } = useTheme();
  const styles = getStyles(themeColors);

  const persistirFoto = useCallback(
    (fotoUrl) => atualizarPerfilFamiliar(perfil?.id, { foto_url: fotoUrl }),
    [perfil?.id]
  );
  const { enviando: enviandoFoto, selecionarEEnviar } = useFotoPerfil({
    userId: perfil?.id,
    persistirUrl: persistirFoto,
    atualizarPerfilLocal,
  });

  const [modalMapaVisivel, setModalMapaVisivel] = useState(false);
  const [modalConfigVisivel, setModalConfigVisivel] = useState(false);
  const [nomeEdicao, setNomeEdicao] = useState('');
  const [telefoneEdicao, setTelefoneEdicao] = useState('');
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setNomeEdicao(perfil?.nome ?? '');
    setTelefoneEdicao(aplicarMascaraTelefone(perfil?.telefone ?? ''));
  }, [perfil?.nome, perfil?.telefone, modalConfigVisivel]);

  const conectado = !!conexao;
  const cuidador = conexao?.cuidadores ?? null;

  async function salvarPerfil() {
    const novosErros = {
      nome: validarNomeCompleto(nomeEdicao),
      telefone: validarTelefoneObrigatorio(telefoneEdicao),
    };
    setErros(novosErros);
    if (Object.values(novosErros).some(Boolean)) return;

    setSalvando(true);
    try {
      const atualizado = await atualizarPerfilFamiliar(perfil.id, {
        nome: nomeEdicao.trim(),
        telefone: somenteDigitos(telefoneEdicao),
      });
      atualizarPerfilLocal(atualizado);
      Alert.alert('Sucesso', 'Dados atualizados.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.containerCarregando}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerTopo}>
        <Text style={styles.tituloPagina}>Meu Perfil</Text>
        <TouchableOpacity
          onPress={() => setModalConfigVisivel(true)}
          style={styles.botaoConfiguracoes}
          accessibilityRole="button"
          accessibilityLabel="Abrir configurações"
        >
          <MaterialIcons name="settings" size={26} color={themeColors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.linhaCentralizada}>
          <AvatarPerfil
            uri={perfil?.foto_url}
            size={60}
            onPress={selecionarEEnviar}
            carregando={enviandoFoto}
            iconName="user"
            iconFamily="FontAwesome5"
            iconSize={28}
            accessibilityLabel="Alterar foto de perfil"
          />
          <View style={styles.infoPerfil}>
            <Text style={styles.nome}>{perfil?.nome || 'Nome do Familiar'}</Text>
            <Text style={styles.textoSecundario}>Familiar cadastrado</Text>
            <Text style={styles.textoSecundario}>
              {aplicarMascaraTelefone(perfil?.telefone ?? '') || 'Telefone não informado'}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.secaoTitulo}>Cuidador Vinculado</Text>
      <View style={styles.card}>
        {carregandoConexao ? (
          <ActivityIndicator color={primaryColor} />
        ) : (
          <View style={styles.linhaCentralizada}>
            <MaterialIcons
              name={conectado ? 'verified-user' : 'link-off'}
              size={28}
              color={conectado ? themeColors.success : themeColors.danger}
            />
            <View style={styles.infoConexao}>
              <Text style={styles.cardTitulo}>
                {conectado ? cuidador?.nome || 'Cuidador Conectado' : 'Sem Conexão'}
              </Text>
              <Text style={styles.textoSecundario}>
                {conectado
                  ? `Ativo • ${cuidador?.especialidade || 'Sem especialidade informada'}`
                  : 'Vincule um cuidador usando o código de 6 caracteres'}
              </Text>
            </View>
          </View>
        )}
      </View>

      <Text style={styles.secaoTitulo}>Rede de Apoio</Text>
      <TouchableOpacity
        style={styles.cardAcao}
        onPress={() => setModalMapaVisivel(true)}
        activeOpacity={0.7}
      >
        <View style={styles.linhaCentralizada}>
          <View style={[styles.iconeAcao, { backgroundColor: `${primaryColor}15` }]}>
            <MaterialIcons name="map" size={24} color={primaryColor} />
          </View>
          <View style={styles.infoConexao}>
            <Text style={styles.cardTitulo}>Buscar Cuidadores Próximos</Text>
            <Text style={styles.textoSecundario}>
              Encontre cuidadores disponíveis na sua região pelo mapa
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={themeColors.textSecondary} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalConfigVisivel}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalConfigVisivel(false)}
      >
        <View style={[styles.modalConfigContainer, { backgroundColor: themeColors.background }]}>
          <View style={styles.modalConfigHeader}>
            <Text style={styles.modalConfigTitulo}>Configurações</Text>
            <TouchableOpacity onPress={() => setModalConfigVisivel(false)}>
              <MaterialIcons name="close" size={28} color={themeColors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.secaoTitulo}>Editar Perfil</Text>
            <Input
              label="Nome"
              value={nomeEdicao}
              onChangeText={setNomeEdicao}
              autoCapitalize="words"
              error={erros.nome}
            />
            <Input
              label="Telefone"
              value={telefoneEdicao}
              onChangeText={(texto) => setTelefoneEdicao(aplicarMascaraTelefone(texto))}
              keyboardType="numeric"
              maxLength={15}
              error={erros.telefone}
            />
            <Button title="Salvar alterações" onPress={salvarPerfil} loading={salvando} />

            <Text style={[styles.secaoTitulo, { marginTop: spacing.xl }]}>
              Aparência e Preferências
            </Text>
            <PreferenciasAparencia />

            <SecaoInstitucional />

            <View style={styles.divisorLogout} />
            <BotaoLogout />
            <BotaoExcluirConta />
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={modalMapaVisivel}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setModalMapaVisivel(false)}
      >
        <View style={styles.containerModal}>
          <View style={styles.headerModal}>
            <TouchableOpacity
              style={styles.botaoFechar}
              onPress={() => setModalMapaVisivel(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="close" size={26} color={themeColors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.tituloModal}>Cuidadores na Região</Text>
            <View style={{ width: 26 }} />
          </View>
          <MapaCuidador />
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, paddingBottom: spacing.lg },
    containerCarregando: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    headerTopo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
      paddingHorizontal: spacing.xs,
    },
    tituloPagina: {
      ...typography.title1,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    botaoConfiguracoes: { padding: spacing.xs },
    card: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: radius.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardAcao: {
      backgroundColor: colors.surface,
      padding: spacing.md,
      borderRadius: radius.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    iconeAcao: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    linhaCentralizada: { flexDirection: 'row', alignItems: 'center' },
    infoPerfil: { flex: 1, marginLeft: spacing.lg },
    infoConexao: { flex: 1, marginLeft: spacing.md },
    nome: { ...typography.title2, color: colors.textPrimary },
    cardTitulo: { ...typography.title3, color: colors.textPrimary },
    textoSecundario: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
    secaoTitulo: {
      ...typography.caption,
      fontWeight: '700',
      textTransform: 'uppercase',
      color: colors.textSecondary,
      marginBottom: spacing.sm,
      marginLeft: spacing.xs,
    },
    modalConfigContainer: {
      flex: 1,
      padding: spacing.lg,
      paddingTop: spacing.xl * 1.5,
    },
    modalConfigHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    modalConfigTitulo: {
      ...typography.title2,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    divisorLogout: { marginVertical: spacing.xl },
    containerModal: { flex: 1, backgroundColor: colors.background },
    headerModal: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tituloModal: { ...typography.title3, color: colors.textPrimary, fontWeight: 'bold' },
    botaoFechar: { padding: spacing.xs },
  });

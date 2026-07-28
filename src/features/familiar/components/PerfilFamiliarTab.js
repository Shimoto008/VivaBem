import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo-vector-icons/material-icons';

import { PreferenciasAparencia, BotaoLogout } from '../../../components/ui';
import { radius, spacing, typography } from '../../../theme';
import { useSession } from '../../../contexts/SessionContext';
import { useConexaoFamiliarContext } from '../../../contexts/ConexaoFamiliarContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { aplicarMascaraTelefone } from '../../../utils/masks';

// Import da tela do mapa do módulo do familiar
import MapaCuidador from '../screens/MapaCuidador';

export default function PerfilFamiliarTab() {
  const { perfil, carregando } = useSession();
  const { conexao, carregando: carregandoConexao } = useConexaoFamiliarContext();
  const { primaryColor, themeColors } = useTheme();
  const styles = getStyles(themeColors);

  const [modalMapaVisivel, setModalMapaVisivel] = useState(false);

  const conectado = !!conexao;
  const cuidador = conexao?.cuidadores ?? null;

  if (carregando) {
    return (
      <View style={styles.containerCarregando}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* CARD DE PERFIL DO FAMILIAR */}
      <View style={styles.card}>
        <View style={styles.linhaCentralizada}>
          <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
            <FontAwesome5 name="user" size={28} color={themeColors.white} />
          </View>
          <View style={styles.infoPerfil}>
            <Text style={styles.nome}>{perfil?.nome || 'Nome do Familiar'}</Text>
            <Text style={styles.textoSecundario}>Familiar cadastrado</Text>
            <Text style={styles.textoSecundario}>
              {aplicarMascaraTelefone(perfil?.telefone ?? '') || 'Telefone não informado'}
            </Text>
          </View>
        </View>
      </View>

      {/* CUIDADOR VINCULADO */}
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

      {/* AÇÕES E LOCALIZAÇÃO */}
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

      {/* APARÊNCIA E PREFERÊNCIAS */}
      <Text style={styles.secaoTitulo}>Aparência e Preferências</Text>
      <PreferenciasAparencia />

      <BotaoLogout />

      {/* MODAL DO MAPA DE CUIDADORES */}
      <Modal
        visible={modalMapaVisivel}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setModalMapaVisivel(false)}
      >
        <View style={styles.containerModal}>
          {/* Cabeçalho para fechar o Modal */}
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

          {/* Renderiza a Tela do Mapa */}
          <MapaCuidador />
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, paddingBottom: spacing.lg },
    containerCarregando: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
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
      justify: 'center',
    },
    linhaCentralizada: { flexDirection: 'row', alignItems: 'center' },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
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
    // Estilos do Modal
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
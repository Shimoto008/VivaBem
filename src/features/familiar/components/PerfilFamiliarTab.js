import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

import { PreferenciasAparencia, BotaoLogout } from '../../../components/ui';
import { radius, spacing, typography } from '../../../theme';
import { useSession } from '../../../contexts/SessionContext';
import { useConexaoFamiliarContext } from '../../../contexts/ConexaoFamiliarContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { aplicarMascaraTelefone } from '../../../utils/masks';

export default function PerfilFamiliarTab() {
  const { perfil, carregando } = useSession();
  const { conexao, carregando: carregandoConexao } = useConexaoFamiliarContext();
  const { primaryColor, themeColors } = useTheme();
  const styles = getStyles(themeColors);

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

      <Text style={styles.secaoTitulo}>Aparência e Preferências</Text>
      <PreferenciasAparencia />

      <BotaoLogout />
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
  });

import React from 'react';
import { View, Text, TouchableOpacity, Switch, Alert, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useSession } from '../../../contexts/SessionContext';
import { useConexaoFamiliarContext } from '../../../contexts/ConexaoFamiliarContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { ROUTES } from '../../../constants/routeNames';

/** Cores disponíveis para personalização da cor de destaque do app. */
const OPCOES_CORES = [
  { id: 'blue', hex: '#3B82F6', nome: 'Azul' },
  { id: 'emerald', hex: '#10B981', nome: 'Verde' },
  { id: 'purple', hex: '#8B5CF6', nome: 'Roxo' },
  { id: 'rose', hex: '#F43F5E', nome: 'Rosa' },
];

/**
 * Antes usava dados de conexão fixos (`conectado = false`, `cuidador = null`)
 * e um `logout` que não existe no SessionContext — nunca refletia a conexão
 * real do familiar. Agora lê o estado real do ConexaoFamiliarContext (o
 * mesmo usado pelo card da Home) e implementa "sair" limpando a sessão.
 *
 * O Switch de "Modo Escuro" e as bolinhas de cor eram estado local (fake) —
 * agora ficam ligados ao `ThemeContext` global, então a preferência vale
 * para o app inteiro e é persistida entre sessões.
 */
export default function PerfilFamiliarTab() {
  const navigation = useNavigation();
  const { familiar, setFamiliar } = useSession();
  const { conexao } = useConexaoFamiliarContext();
  const { isDarkMode, toggleDarkMode, primaryColor, setPrimaryColor, themeColors } = useTheme();
  const conectado = !!conexao;
  const cuidador = conexao?.cuidadores ?? null;

  const styles = getStyles(themeColors);

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            setFamiliar(null);
            navigation.reset({ index: 0, routes: [{ name: ROUTES.HOME }] });
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { padding: 20 }]}>
      {/* 1. CABEÇALHO DO PERFIL */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
            <FontAwesome5 name="user" size={30} color="#FFF" />
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={styles.nome}>{familiar?.nome || 'Nome do Familiar'}</Text>
            <Text style={styles.textoSecundario}>{familiar?.email || 'email@exemplo.com'}</Text>
            <Text style={[styles.textoSecundario, { marginTop: 1 }]}>
              {familiar?.telefone || 'Telefone não informado'}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. CARD DE STATUS DA CONEXÃO */}
      <Text style={styles.secaoTitulo}>Cuidador Vinculado</Text>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <MaterialIcons
              name={conectado ? 'verified-user' : 'link-off'}
              size={28}
              color={conectado ? themeColors.success : themeColors.danger}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.cardTitulo}>
                {conectado ? cuidador?.nome || 'Cuidador Conectado' : 'Sem Conexão'}
              </Text>
              <Text style={styles.textoSecundario}>
                {conectado
                  ? `Ativo • ${cuidador?.especialidade || 'Sem especialidade informada'}`
                  : 'Vincule um cuidador usando o código de 6 dígitos'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. OPÇÕES DE PERSONALIZAÇÃO E ACESSIBILIDADE */}
      <Text style={styles.secaoTitulo}>Aparência e Preferências</Text>
      <View style={styles.card}>

        {/* Alternar Modo Escuro */}
        <View style={styles.linhaOpcao}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="moon-outline" size={22} color={themeColors.textPrimary} />
            <Text style={styles.opcaoTexto}>Modo Escuro</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: primaryColor }}
          />
        </View>

        <View style={styles.divisor} />

        {/* Escolha da Cor de Destaque */}
        <Text style={styles.subtemaTexto}>Cor do Aplicativo</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
          {OPCOES_CORES.map((cor) => (
            <TouchableOpacity
              key={cor.id}
              onPress={() => setPrimaryColor(cor.hex)}
              accessibilityRole="button"
              accessibilityLabel={`Cor ${cor.nome}`}
              style={[
                styles.bolaCor,
                { backgroundColor: cor.hex },
                primaryColor === cor.hex && styles.bolaCorSelecionada,
              ]}
            >
              {primaryColor === cor.hex && <MaterialIcons name="check" size={16} color="#FFF" />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 4. BOTÃO DE SAIR */}
      <TouchableOpacity onPress={handleLogout} activeOpacity={0.8} style={styles.botaoLogout}>
        <MaterialIcons name="logout" size={20} color={themeColors.danger} />
        <Text style={[styles.textoLogout, { color: themeColors.danger }]}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    card: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 15,
      marginBottom: 15,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    nome: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
    textoSecundario: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
    secaoTitulo: {
      fontSize: 14,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginBottom: 8,
      marginTop: 10,
      marginLeft: 4,
      color: colors.textSecondary,
    },
    cardTitulo: { fontSize: 15, fontWeight: 'bold', color: colors.textPrimary },
    linhaOpcao: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    opcaoTexto: { fontSize: 15, fontWeight: '500', marginLeft: 12, color: colors.textPrimary },
    subtemaTexto: { fontSize: 13, fontWeight: '600', marginTop: 4, color: colors.textSecondary },
    divisor: { height: 1, backgroundColor: colors.divider, marginVertical: 12 },
    bolaCor: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bolaCorSelecionada: {
      borderWidth: 3,
      borderColor: colors.surface,
      elevation: 4,
    },
    botaoLogout: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
      marginTop: 15,
      marginBottom: 30,
      backgroundColor: `${colors.danger}18`,
    },
    textoLogout: { fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
  });

import React from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { getStyles } from '../screens/HomeCuidador.styles';
import { PainelPaciente } from './PainelPaciente/PainelPaciente';
import { useTheme } from '../../../contexts/ThemeContext';
import { EmptyState } from '../../../components/ui';
import { ROUTES } from '../../../constants/routeNames';

const CARDS_ATALHO = [
  {
    rota: ROUTES.MEDICACAO,
    badge: 'Medicações',
    titulo: 'Medicações',
    Icon: MaterialIcons,
    iconName: 'add-box',
    iconSize: 50,
  },
  {
    rota: ROUTES.RELATORIO,
    badge: 'Relatorios',
    titulo: 'Relatorios',
    Icon: FontAwesome5,
    iconName: 'file-medical',
    iconSize: 45,
  },
  {
    rota: ROUTES.CALENDARIO,
    badge: 'Calendário',
    titulo: 'Calendário',
    Icon: MaterialIcons,
    iconName: 'calendar-month',
    iconSize: 50,
  },
  {
    rota: ROUTES.OBSERVACOES,
    badge: 'Observações',
    titulo: 'Observações',
    Icon: MaterialIcons,
    iconName: 'note-alt',
    iconSize: 50,
  },
];

export function ResumoTab({ controlador }) {
  const navigation = useNavigation();
  const { themeColors: colors } = useTheme();
  const styles = getStyles(colors);
  const {
    pacientes,
    carregandoPacientes,
    pacienteSelecionado,
    selecionarPaciente,
    limparPacienteSelecionado,
    cuidadorId,
  } = controlador;

  function navegarPara(rota) {
    if (!pacienteSelecionado) {
      Alert.alert('Atenção', 'Selecione um idoso primeiro.');
      return;
    }

    navigation.navigate(rota, {
      idoso: pacienteSelecionado,
      cuidadorId,
    });
  }

  function abrirConversas() {
    navigation.navigate(ROUTES.CONVERSAS);
  }

  return (
    <View style={styles.containerAbas}>
      {/* 1. CABEÇALHO SUPERIOR DA TELA COM O ÍCONE DE CHAT NO CANTO DIREITO */}
      <View style={localStyles.headerTopo}>
        <Text style={[styles.secaoTitulo, { marginBottom: 0 }]}>Início</Text>

        <TouchableOpacity
          style={[localStyles.btnChatTopo, { backgroundColor: `${colors.primary}15` }]}
          onPress={abrirConversas}
          activeOpacity={0.7}
        >
          <MaterialIcons name="chat" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* 2. GRID DE ATALHOS */}
      <View style={styles.grid}>
        {CARDS_ATALHO.map(({ rota, badge, titulo, Icon, iconName, iconSize }) => (
          <TouchableOpacity key={rota} style={styles.card} onPress={() => navegarPara(rota)}>
            <View style={styles.cardTop}>
              <Text style={styles.statusBadge}>{badge}</Text>
            </View>
            <View style={styles.iconContainer}>
              <Icon name={iconName} size={iconSize} color={colors.primary} />
            </View>
            <Text style={styles.cardTitle}>{titulo}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 3. LISTA DE IDOSOS ATIVOS */}
      <Text style={styles.secaoTitulo}>Idosos Ativos</Text>

      {carregandoPacientes ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.carregando} />
      ) : pacientes.length === 0 ? (
        <EmptyState
          icon="elderly"
          title="Nenhum idoso vinculado ainda."
          description="Peça para um familiar cadastrar o idoso e conectar-se ao seu código para que ele apareça aqui."
        />
      ) : (
        pacientes.map((idoso) => (
          <View key={idoso.id} style={styles.wrapperPaciente}>
            <TouchableOpacity
              style={styles.cardPacienteHome}
              onPress={() => selecionarPaciente(idoso)}
              accessibilityRole="button"
              accessibilityLabel={`Abrir painel de ${idoso.nome}`}
            >
              <FontAwesome5 name="user-circle" size={40} color={colors.primary} />
              
              <View style={styles.infoPacienteHome}>
                <Text style={styles.nomePacienteHome}>{idoso.nome}</Text>
                <Text style={styles.detalhesPacienteHome}>
                  {idoso.idade ? `${idoso.idade} anos` : 'Idade não informada'}
                </Text>
              </View>

              <MaterialIcons
                name={pacienteSelecionado?.id === idoso.id ? 'expand-less' : 'expand-more'}
                size={28}
                color={colors.primary}
              />
            </TouchableOpacity>

            {pacienteSelecionado?.id === idoso.id && (
              <PainelPaciente
                idoso={pacienteSelecionado}
                cuidadorId={cuidadorId}
                onFechar={limparPacienteSelecionado}
              />
            )}
          </View>
        ))
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  headerTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  btnChatTopo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
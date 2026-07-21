import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { styles } from '../HomeCuidador.styles';
import { PainelPaciente } from './PainelPaciente/PainelPaciente';
import { colors } from '../../../../theme';
import { EmptyState } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routeNames';

const PACIENTE_DEV = {
  id: '787d17a0-e5e1-4c1d-bee7-0239aa6ade37',
  nome: 'neymar',
  idade: 85,
};

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
  const {
    pacientes,
    pacienteSelecionado,
    selecionarPaciente,
    limparPacienteSelecionado,
    cuidadorId,
  } = controlador;

  const pacientesExibidos = __DEV__ && pacientes.length === 0 ? [PACIENTE_DEV] : pacientes;

  const idosoAtual =
    pacienteSelecionado ?? (__DEV__ && pacientesExibidos.length > 0 ? pacientesExibidos[0] : null);

  function navegarPara(rota) {
    if (!idosoAtual) {
      Alert.alert('Atenção', 'Selecione um idoso primeiro.');
      return;
    }

    navigation.navigate(rota, {
      idoso: idosoAtual,
      cuidadorId,
    });
  }

  return (
    <View style={styles.containerAbas}>
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

      <Text style={styles.secaoTitulo}>Idosos Ativos</Text>

      {pacientesExibidos.length === 0 ? (
        <EmptyState
          icon="elderly"
          title="Nenhum idoso cadastrado."
          description="Cadastre na aba “Idoso(a)”."
        />
      ) : (
        pacientesExibidos.map((idoso) => (
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
                <Text style={styles.detalhesPacienteHome}>{idoso.idade} anos</Text>
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

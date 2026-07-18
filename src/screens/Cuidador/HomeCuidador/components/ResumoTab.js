import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { styles } from '../HomeCuidador.styles';
import { PainelPaciente } from './PainelPaciente/PainelPaciente';
import { colors } from '../../../../theme';
import { useNavigation } from '@react-navigation/native';
import { EmptyState } from '../../../../components/ui';
import { ROUTES } from '../../../../constants/routeNames';

/**
 * Antes "renderHome.js" — renomeado para refletir o que de fato exibe
 * (resumo + lista de idosos), com imports não usados removidos
 * (TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform, Linking
 * estavam importados sem nenhum uso no arquivo original).
 */
export function ResumoTab({ controlador }) {
  const navigation = useNavigation();
  const {
    pacientes,
    pacienteSelecionado,
    selecionarPaciente,
    limparPacienteSelecionado,
    cuidadorId,
  } = controlador;

  console.log("cuidador da home:", cuidadorId);
  
  const pacienteDev = {
    id: '787d17a0-e5e1-4c1d-bee7-0239aa6ade37',
    nome: 'neymar',
    idade: 85,
  };

  const pacientesExibidos = __DEV__ && pacientes.length === 0 ? [pacienteDev] : pacientes;

  const idosoAtual =
    pacienteSelecionado ?? (__DEV__ && pacientesExibidos.length > 0 ? pacientesExibidos[0] : null);

  return (
    <View style={styles.containerAbas}>
      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            if (!idosoAtual) {
              alert('Selecione um idoso primeiro.');
              return;
            }

            navigation.navigate(ROUTES.MEDICACAO, {
              idoso: idosoAtual,
              cuidadorId: cuidadorId,
            });
          }}
        >
          <View style={styles.cardTop}>
            <Text style={styles.statusBadge}>Medicações</Text>
          </View>
          <View style={styles.iconContainer}>
            <MaterialIcons name="add-box" size={50} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>Medicações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          style={styles.card}
          onPress={() => {
            if (!idosoAtual) {
              alert('Selecione um idoso primeiro.');
              return;
            }

            navigation.navigate(ROUTES.RELATORIO, {
                idoso: idosoAtual,
                cuidadorId: cuidadorId,
            });
          }}
        >
          <View style={styles.cardTop}>
            <Text style={styles.statusBadge}>Relatorios</Text>
          </View>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="file-medical" size={45} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>Relatorios</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
  style={styles.card}
  onPress={() => {
    if (!idosoAtual) {
      alert('Selecione um idoso primeiro.');
      return;
    }

    navigation.navigate(ROUTES.CALENDARIO, {
      idoso: idosoAtual,
      cuidadorId: cuidadorId,
    });
  }}
>
  <View style={styles.cardTop}>
    <Text style={styles.statusBadge}>
      Calendário
    </Text>
  </View>

  <View style={styles.iconContainer}>
    <MaterialIcons
      name="calendar-month"
      size={50}
      color={colors.primary}
    />
  </View>

  <Text style={styles.cardTitle}>
    Calendário
  </Text>

</TouchableOpacity>

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

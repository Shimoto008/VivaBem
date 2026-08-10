import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { getStyles } from '../../idoso/components/DiaADiatab.styles';
import { useTheme } from '../../../contexts/ThemeContext';
import { useSession } from '../../../contexts/SessionContext';
import { ROUTES } from '../../../constants/routeNames';
import { aplicarMascaraTelefone } from '../../../utils/masks';

const ATALHOS = [
  {
    rota: ROUTES.MEDICACAO,
    titulo: 'Medicações',
    iconName: 'medication',
  },
  {
    rota: ROUTES.CALENDARIO,
    titulo: 'Tarefas',
    iconName: 'event-note',
  },
  {
    rota: ROUTES.EXERCICIOS || 'Exercicios',
    titulo: 'Exercícios',
    iconName: 'fitness-center',
  },
  {
    rota: ROUTES.OBSERVACOES,
    titulo: 'Saúde',
    iconName: 'monitor-heart',
  },
];

function obterSaudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function DiaADiaTab() {
  const navigation = useNavigation();
  const { perfil: idoso } = useSession();
  const { themeColors, primaryColor } = useTheme();
  const styles = getStyles(themeColors);

  const primeiroNome = (idoso?.nome ?? 'você').split(' ')[0];
  const contatoEmergencia = idoso?.contato_emergencia;

  function navegarPara(rota) {
    navigation.navigate(rota, {
      idoso: idoso,
      cuidadorId: null,
    });
  }

  async function ligarEmergencia() {
    if (!contatoEmergencia) {
      Alert.alert(
        'Contato não cadastrado',
        'Cadastre um telefone de emergência na aba Perfil.'
      );
      return;
    }
    const url = `tel:${contatoEmergencia}`;
    try {
      const suportado = await Linking.canOpenURL(url);
      if (!suportado) {
        Alert.alert('Não foi possível ligar', 'Este dispositivo não permite chamadas.');
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert('Erro', 'Não foi possível iniciar a chamada.');
    }
  }

  function pedirAjuda() {
    Alert.alert(
      'Pedir ajuda',
      contatoEmergencia
        ? `Deseja ligar para ${aplicarMascaraTelefone(contatoEmergencia)}?`
        : 'Cadastre um contato de emergência no Perfil para pedir ajuda rapidamente.',
      contatoEmergencia
        ? [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Ligar agora', onPress: ligarEmergencia },
          ]
        : [{ text: 'OK' }]
    );
  }

  return (
    <View style={styles.containerAbas}>
      {/* CARD DE BOAS-VINDAS MAIOR */}
      <View style={styles.boasVindasCard}>
        <Text style={styles.saudacao}>{obterSaudacao()},</Text>
        <Text style={styles.nomeDestaque}>{primeiroNome}</Text>
        <Text style={styles.subtituloBoasVindas}>
          Acompanhe suas rotinas, faça seus exercícios e acione a emergência quando precisar.
        </Text>
      </View>

      {/* GRID DE ATALHOS AMPLIADO (SEM O TÍTULO "DIA A DIA") */}
      <View style={styles.grid}>
        {ATALHOS.map((item) => (
          <TouchableOpacity
            key={item.rota}
            style={styles.cardAtalho}
            onPress={() => navegarPara(item.rota)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={item.titulo}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name={item.iconName} size={48} color={primaryColor} />
            </View>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ÁREA DE EMERGÊNCIA */}
      <View style={styles.headerEmergenciaRow}>
        <MaterialIcons name="warning" size={28} color={themeColors?.danger || '#DC3545'} />
        <Text style={styles.tituloEmergenciaDestaque}>Emergência</Text>
      </View>
      
      <View style={styles.cardEmergenciaContainer}>
        <View style={styles.emergenciaRow}>
          <TouchableOpacity
            style={styles.botaoEmergenciaPrincipal}
            onPress={ligarEmergencia}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Ligar agora para emergência"
          >
            <MaterialIcons name="phone-in-talk" size={36} color="#FFFFFF" />
            <Text style={styles.textoEmergenciaBranco}>Ligar agora</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoEmergenciaSecundarioCard}
            onPress={pedirAjuda}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Pedir ajuda"
          >
            <MaterialIcons name="sos" size={38} color={primaryColor} />
            <Text style={[styles.textoEmergencia, { color: primaryColor }]}>
              Pedir ajuda
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
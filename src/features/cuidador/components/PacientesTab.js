import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { getStyles } from '../screens/HomeCuidador.styles';
import { PainelPaciente } from './PainelPaciente/PainelPaciente';
import { useTheme } from '../../../contexts/ThemeContext';

/**
 * Aba de Pacientes do Cuidador.
 * Exibe a lista de idosos vinculados para acompanhamento e monitoramento.
 */
export function PacientesTab({ controlador }) {
  const { themeColors: colors } = useTheme();
  const styles = getStyles(colors);
  const {
    pacientes,
    pacienteSelecionado,
    selecionarPaciente,
    limparPacienteSelecionado,
    cuidadorId,
  } = controlador;

  return (
    <View style={styles.containerAbas}>
      {/* Lista de Idosos Vinculados */}
      {pacientes && pacientes.length > 0 ? (
        pacientes.map((idoso) => (
          <View key={idoso.id} style={styles.wrapperPaciente}>
            <TouchableOpacity
              style={styles.itemListaPaciente}
              onPress={() => selecionarPaciente(idoso)}
              accessibilityRole="button"
              accessibilityLabel={`Abrir painel de ${idoso.nome}`}
            >
              <FontAwesome5 name="user-injured" size={24} color={colors.primary} />
              <View style={{ marginLeft: 15, flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{idoso.nome}</Text>
              </View>
              <MaterialIcons
                name={pacienteSelecionado?.id === idoso.id ? 'expand-less' : 'expand-more'}
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>

            {/* Painel de detalhes do paciente quando expandido */}
            {pacienteSelecionado?.id === idoso.id && (
              <PainelPaciente
                idoso={pacienteSelecionado}
                cuidadorId={cuidadorId}
                onFechar={limparPacienteSelecionado}
              />
            )}
          </View>
        ))
      ) : (
        /* O cuidador não cadastra pacientes — eles aparecem aqui somente
           depois que um familiar os cadastra e se conecta a este cuidador. */
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
            Nenhum paciente vinculado no momento. Assim que um familiar cadastrar um idoso
            e se conectar ao seu código, ele aparecerá aqui.
          </Text>
        </View>
      )}
    </View>
  );
}
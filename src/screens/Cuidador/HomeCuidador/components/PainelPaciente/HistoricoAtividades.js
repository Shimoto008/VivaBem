import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../HomeCuidador.styles';
import { ATIVIDADE_TIPOS, ATIVIDADE_CONFIG } from '../../../../../constants/atividadeTipos';
import { formatarDataPtBR } from '../../../../../utils/dateUtils';

const ROTULO_TIPO = {
  [ATIVIDADE_TIPOS.AGENDA]: 'Agenda',
  [ATIVIDADE_TIPOS.RELATORIO]: 'Relatório',
  [ATIVIDADE_TIPOS.MEDICACAO]: 'Medicação',
  [ATIVIDADE_TIPOS.OBSERVACAO]: 'Observação',
};

function dataExibida(atividade) {
  if (atividade.tipo === ATIVIDADE_TIPOS.AGENDA && atividade.data_referencia) {
    const [ano, mes, dia] = atividade.data_referencia.split('-');
    return `${dia}/${mes}/${ano}`;
  }
  return formatarDataPtBR(new Date(atividade.created_at));
}

/** Extraído de PainelPaciente.js ("renderHistoricoLabels"). */
export function HistoricoAtividades({ atividades, onEditar }) {
  if (atividades.length === 0) return null;

  return (
    <View style={styles.containerHistoricoLabels}>
      <Text style={styles.tituloLinhaTempo}>Atividades Cadastradas</Text>
      {atividades.map((atividade) => {
        const config = ATIVIDADE_CONFIG[atividade.tipo];
        return (
          <View key={atividade.id} style={[styles.cardLabelHistorico, { borderLeftColor: config.cor }]}>
            <View style={styles.labelHeaderHistorico}>
              <View style={styles.labelTagIcon}>
                <MaterialIcons name={config.icone} size={16} color={config.cor} />
                <Text style={[styles.txtTagLabel, { color: config.cor }]}>
                  {ROTULO_TIPO[atividade.tipo]} ({dataExibida(atividade)})
                </Text>
              </View>
              <TouchableOpacity style={styles.btnEditarLabel} onPress={() => onEditar(atividade)} accessibilityLabel="Editar registro">
                <MaterialIcons name="edit" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.txtConteudoLabel}>{atividade.conteudo}</Text>
          </View>
        );
      })}
    </View>
  );
}

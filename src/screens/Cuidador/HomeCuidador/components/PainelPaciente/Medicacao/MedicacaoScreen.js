import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { styles } from '../../../HomeCuidador.styles';
import { PainelPaciente } from '../PainelPaciente';
import { colors } from '../../../../../../theme';
import { EmptyState } from '../../../../../../components/ui';

export default function MedicacaoScreen({ route }) {

  const idoso = route?.params?.idoso;

  if (!idoso) {
    return (
      <View>
        <Text>
          Nenhum paciente selecionado.aaaaaaaaaaaaaaaaaaaa
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Text>
        Medicações de {idoso.nome}
      </Text>
    </View>
  );
}
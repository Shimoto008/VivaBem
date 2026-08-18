import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AtividadesFamiliarList } from '../../familiar/components/AtividadesFamiliarList';
import { useTheme } from '../../../contexts/ThemeContext';
import { useSession } from '../../../contexts/SessionContext';
import { getStyles } from '../screens/IdosoAutonomo.styles';
import { ATIVIDADE_TIPOS } from '../../../constants/atividadeTipos';
import { ROUTES } from '../../../constants/routeNames';

const ROTAS_POR_TIPO = {
  [ATIVIDADE_TIPOS.MEDICACAO]: ROUTES.MEDICACAO,
  [ATIVIDADE_TIPOS.AGENDA]: ROUTES.CALENDARIO,
  [ATIVIDADE_TIPOS.RELATORIO]: ROUTES.RELATORIO,
  [ATIVIDADE_TIPOS.OBSERVACAO]: ROUTES.OBSERVACOES,
};

/**
 * Aba Rotina: lista o que o idoso autônomo cadastrou.
 * O cadastro em si fica nos atalhos da Home.
 */
export function AtividadesIdosoTab({ atividades, carregando, erro }) {
  const navigation = useNavigation();
  const { perfil: idoso } = useSession();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  function abrirCategoria(tipo) {
    const rota = ROTAS_POR_TIPO[tipo];
    if (!rota || !idoso) return;
    navigation.navigate(rota, { idoso, cuidadorId: null });
  }

  return (
    <View>
      <Text style={styles.nomeDestaque}>Sua rotina</Text>
      <Text style={styles.subtituloRotina}>
        Medicações, agenda, relatórios e observações que você registrou
      </Text>

      <AtividadesFamiliarList
        vinculado
        atividades={atividades}
        carregando={carregando}
        erro={erro}
        tituloSecao=""
        esconderNomePaciente
        sempreMostrarCategorias
        onPressAtividade={(atividade) => abrirCategoria(atividade.tipo)}
      />
    </View>
  );
}

import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles } from './HomeCuidador.styles';
import { ResumoTab } from '../components/ResumoTab';
import { PacientesTab } from '../components/PacientesTab';
import { PerfilCuidadorTab } from '../components/PerfilCuidadorTab';
import { BottomTabBar, SwipeableTabs } from '../../../components/ui';
import { useHomeCuidador } from '../hooks/useHomeCuidador';
import { useSession } from '../../../contexts/SessionContext';
import { useTheme } from '../../../contexts/ThemeContext';

const ABAS = [
  { key: 'home', label: 'Início', icon: 'home', iconFamily: 'MaterialIcons' },
  { key: 'pacientes', label: 'Pacientes', icon: 'people-alt', iconFamily: 'MaterialIcons' },
  { key: 'perfil', label: 'Perfil', icon: 'person', iconFamily: 'MaterialIcons' },
];

/**
 * Tela "burra": só decide QUAL aba mostrar. Todo o resto (dados de
 * pacientes, estado de seleção, cadastro) vive em useHomeCuidador.
 *
 * A troca de aba funciona tanto pelo toque nos ícones da BottomTabBar
 * quanto por swipe (SwipeableTabs) — os dois ficam sincronizados pelo
 * mesmo estado `abaAtiva`. O `edges` do SafeAreaView ignora a borda
 * inferior porque a BottomTabBar já soma o inset de baixo sozinha.
 */
export default function HomeCuidadorScreen() {
  const { cuidador } = useSession();
  const controlador = useHomeCuidador(cuidador?.id);
  const { abaAtiva, setAbaAtiva } = controlador;
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <SwipeableTabs
          tabs={ABAS}
          abaAtiva={abaAtiva}
          onChangeAba={setAbaAtiva}
          contentContainerStyle={styles.scrollContent}
        >
          <ResumoTab controlador={controlador} />
          <PacientesTab controlador={controlador} />
          <PerfilCuidadorTab />
        </SwipeableTabs>

        <BottomTabBar tabs={ABAS} abaAtiva={abaAtiva} onSelect={setAbaAtiva} />
      </View>
    </SafeAreaView>
  );
}

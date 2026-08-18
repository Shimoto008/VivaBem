import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getStyles } from './IdosoAutonomo.styles';
import { DiaADiaTab } from '../components/DiaADiaTab';
import { AtividadesIdosoTab } from '../components/AtividadesIdosoTab';
import { PerfilIdosoTab } from '../components/PerfilIdosoTab';
import { BottomTabBar, SwipeableTabs } from '../../../components/ui';
import { useHomeIdoso } from '../hooks/useHomeIdoso';
import { useTheme } from '../../../contexts/ThemeContext';
import { useSession } from '../../../contexts/SessionContext';
import { useAtividadesDoIdoso } from '../hooks/useAtividadesDoIdoso';

const ABAS = [
  { key: 'home', label: 'Home', icon: 'home', iconFamily: 'MaterialIcons' },
  { key: 'atividades', label: 'Rotina', icon: 'event-note', iconFamily: 'MaterialIcons' },
  { key: 'perfil', label: 'Perfil', icon: 'person', iconFamily: 'MaterialIcons' },
];

/**
 * Home do idoso autônomo: dia a dia, rotina (cadastrada por ele) e perfil.
 */
export default function IdosoAutonomoScreen() {
  const { abaAtiva, setAbaAtiva } = useHomeIdoso();
  const { perfil: idoso } = useSession();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  const { atividades, carregando, atualizando, erro, recarregar } =
    useAtividadesDoIdoso(idoso?.id);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <SwipeableTabs
          tabs={ABAS}
          abaAtiva={abaAtiva}
          onChangeAba={setAbaAtiva}
          contentContainerStyle={styles.scrollContent}
          refreshByTab={{
            atividades: {
              refreshing: atualizando,
              onRefresh: recarregar,
              tintColor: themeColors.primary,
            },
          }}
        >
          <DiaADiaTab />
          <AtividadesIdosoTab
            atividades={atividades}
            carregando={carregando}
            erro={erro}
          />
          <PerfilIdosoTab />
        </SwipeableTabs>

        <BottomTabBar tabs={ABAS} abaAtiva={abaAtiva} onSelect={setAbaAtiva} />
      </View>
    </SafeAreaView>
  );
}

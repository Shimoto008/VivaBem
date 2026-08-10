import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getStyles } from './IdosoAutonomo.styles';
import { DiaADiaTab } from '../components/DiaADiaTab';
import { PerfilIdosoTab } from '../components/PerfilIdosoTab';
import { BottomTabBar, SwipeableTabs } from '../../../components/ui';
import { useHomeIdoso } from '../hooks/useHomeIdoso';
import { useTheme } from '../../../contexts/ThemeContext';

const ABAS = [
  { key: 'home', label: 'Home', icon: 'home', iconFamily: 'MaterialIcons' },
  { key: 'perfil', label: 'Perfil', icon: 'person', iconFamily: 'MaterialIcons' },
];

/**
 * Home do idoso autônomo: boas-vindas, painel do dia a dia e perfil.
 * Zoom por pinça fica no App (PinchZoomView global).
 */
export default function IdosoAutonomoScreen() {
  const { abaAtiva, setAbaAtiva } = useHomeIdoso();
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
          <DiaADiaTab />
          <PerfilIdosoTab />
        </SwipeableTabs>

        <BottomTabBar tabs={ABAS} abaAtiva={abaAtiva} onSelect={setAbaAtiva} />
      </View>
    </SafeAreaView>
  );
}

import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles } from './HomeFamiliar.styles';

import { ConexaoCuidadorCard } from '../components/ConexaoCuidadorCard';
import { AtividadesFamiliarList } from '../components/AtividadesFamiliarList';
import IdososScreen from './IdososScreen';
import PerfilFamiliarTab from '../components/PerfilFamiliarTab';

import { BottomTabBar, ScreenHeader, SwipeableTabs } from '../../../components/ui';
import { useSession } from '../../../contexts/SessionContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { ConexaoFamiliarProvider } from '../../../contexts/ConexaoFamiliarContext';

const ABAS = [
  { key: 'home', label: 'Início', icon: 'home', iconFamily: 'MaterialIcons' },
  { key: 'idosos', label: 'Pacientes', icon: 'people-alt', iconFamily: 'MaterialIcons' },
  { key: 'perfil', label: 'Perfil', icon: 'person', iconFamily: 'MaterialIcons' },
];

/**
 * A troca de aba funciona tanto pelo toque nos ícones da BottomTabBar
 * quanto por swipe (SwipeableTabs) — os dois ficam sincronizados pelo
 * mesmo estado `abaAtiva`. O `edges` do SafeAreaView ignora a borda
 * inferior porque a BottomTabBar já soma o inset de baixo sozinha.
 */
export default function HomeFamiliarScreen() {
  const { perfil: familiar } = useSession();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  const [abaAtiva, setAbaAtiva] = useState('home');

  const primeiroNome = familiar?.nome ? familiar.nome.split(' ')[0] : 'Familiar';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ConexaoFamiliarProvider familiarId={familiar?.id}>
        <View style={styles.conteudo}>
          <SwipeableTabs
            tabs={ABAS}
            abaAtiva={abaAtiva}
            onChangeAba={setAbaAtiva}
            contentContainerStyle={styles.scrollContent}
          >
            <View>
              <ScreenHeader
                title={`Olá, ${primeiroNome}`}
                subtitle="Acompanhe a rotina de quem você ama"
              />
              <View style={styles.blocoConexao}>
                <ConexaoCuidadorCard />
              </View>
              <AtividadesFamiliarList />
            </View>

            <IdososScreen />

            <PerfilFamiliarTab />
          </SwipeableTabs>

          <BottomTabBar tabs={ABAS} abaAtiva={abaAtiva} onSelect={setAbaAtiva} />
        </View>
      </ConexaoFamiliarProvider>
    </SafeAreaView>
  );
}

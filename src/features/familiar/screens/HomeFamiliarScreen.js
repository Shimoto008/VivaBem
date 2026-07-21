import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles } from './HomeFamiliar.styles';

// 1. IMPORT DOS COMPONENTES LOCAIS DA HOME
import { ConexaoCuidadorCard } from '../components/ConexaoCuidadorCard';
import { AtividadesFamiliarList } from '../components/AtividadesFamiliarList';

// 2. IMPORT DAS OUTRAS ABAS (Idosos e Perfil)
import IdososScreen from './IdososScreen';
import PerfilFamiliarTab from '../components/PerfilFamiliarTab';

// 3. COMPONENTES UI E CONTEXTO
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
  const { familiar } = useSession();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  const [abaAtiva, setAbaAtiva] = useState('home');

  const primeiroNome = familiar?.nome ? familiar.nome.split(' ')[0] : 'Familiar';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ConexaoFamiliarProvider familiarId={familiar?.id}>
        <View style={{ flex: 1 }}>
          <SwipeableTabs
            tabs={ABAS}
            abaAtiva={abaAtiva}
            onChangeAba={setAbaAtiva}
            contentContainerStyle={styles.scrollContent}
          >
            {/* ABA 1: INÍCIO (Header + Card de Conexão + Atividades) */}
            <View>
              <ScreenHeader title={`Olá, ${primeiroNome}`} subtitle="Acompanhe a rotina de quem você ama" />
              <View style={{ marginVertical: 15 }}>
                <ConexaoCuidadorCard />
              </View>
              <AtividadesFamiliarList />
            </View>

            {/* ABA 2: PACIENTES / IDOSOS (A tela com o Formulário e Lista) */}
            <IdososScreen />

            {/* ABA 3: PERFIL DO FAMILIAR */}
            <PerfilFamiliarTab />
          </SwipeableTabs>

          {/* NAVEGAÇÃO INFERIOR */}
          <BottomTabBar tabs={ABAS} abaAtiva={abaAtiva} onSelect={setAbaAtiva} />
        </View>
      </ConexaoFamiliarProvider>
    </SafeAreaView>
  );
}

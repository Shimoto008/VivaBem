import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { getStyles } from './HomeFamiliar.styles';

import { ConexaoCuidadorCard } from '../components/ConexaoCuidadorCard';
import { AtividadesFamiliarList } from '../components/AtividadesFamiliarList';
import IdososScreen from './IdososScreen';
import PerfilFamiliarTab from '../components/PerfilFamiliarTab';

import { BottomTabBar, ScreenHeader, SwipeableTabs } from '../../../components/ui';
import { useSession } from '../../../contexts/SessionContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { ConexaoFamiliarProvider } from '../../../contexts/ConexaoFamiliarContext';
import { ROUTES } from '../../../constants/routeNames';
import { spacing } from '../../../theme';

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
  const navigation = useNavigation();
  const { perfil: familiar } = useSession();
  const { themeColors, primaryColor } = useTheme();
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
              <View style={localStyles.headerComChat}>
                <View style={localStyles.headerTexto}>
                  <ScreenHeader
                    title={`Olá, ${primeiroNome}`}
                    subtitle="Acompanhe a rotina de quem você ama"
                  />
                </View>
                <TouchableOpacity
                  style={[localStyles.btnChat, { backgroundColor: `${primaryColor}15` }]}
                  onPress={() => navigation.navigate(ROUTES.CONVERSAS)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Abrir conversas"
                >
                  <MaterialIcons name="chat" size={22} color={primaryColor} />
                </TouchableOpacity>
              </View>
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

const localStyles = StyleSheet.create({
  headerComChat: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: spacing.lg,
  },
  headerTexto: { flex: 1 },
  btnChat: {
    marginTop: spacing.lg + 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { styles } from './HomeFamiliar.styles';

// 1. IMPORT DOS COMPONENTES LOCAIS DA HOME
import { ConexaoCuidadorCard } from '../components/ConexaoCuidadorCard';
import { AtividadesFamiliarList } from '../components/AtividadesFamiliarList';

// 2. IMPORT DAS OUTRAS ABAS (Idosos e Perfil)
import IdososScreen from './IdososScreen';
import PerfilFamiliarTab from '../components/PerfilFamiliarTab';

// 3. COMPONENTES UI E CONTEXTO
import { BottomTabBar, ScreenHeader } from '../../../components/ui';
import { useSession } from '../../../contexts/SessionContext';
import { ConexaoFamiliarProvider } from '../../../contexts/ConexaoFamiliarContext';

const ABAS = [
  { key: 'home', label: 'Início', icon: 'home', iconFamily: 'MaterialIcons' },
  { key: 'idosos', label: 'Pacientes', icon: 'people-alt', iconFamily: 'MaterialIcons' },
  { key: 'perfil', label: 'Perfil', icon: 'person', iconFamily: 'MaterialIcons' },
];

export default function HomeFamiliarScreen() {
  const { familiar } = useSession();
  const [abaAtiva, setAbaAtiva] = useState('home');

  const primeiroNome = familiar?.nome ? familiar.nome.split(' ')[0] : 'Familiar';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ConexaoFamiliarProvider familiarId={familiar?.id}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* ABA 1: INÍCIO (Header + Card de Conexão + Atividades) */}
            {abaAtiva === 'home' && (
              <View>
                <ScreenHeader
                  title={`Olá, ${primeiroNome}`}
                  subtitle="Acompanhe a rotina de quem você ama"
                />
                <View style={{ marginVertical: 15 }}>
                  <ConexaoCuidadorCard />
                </View>
                <AtividadesFamiliarList />
              </View>
            )}

            {/* ABA 2: PACIENTES / IDOSOS (A tela com o Formulário e Lista) */}
            {abaAtiva === 'idosos' && <IdososScreen />}

            {/* ABA 3: PERFIL DO FAMILIAR */}
            {abaAtiva === 'perfil' && <PerfilFamiliarTab />}

          </ScrollView>

          {/* NAVEGAÇÃO INFERIOR */}
          <BottomTabBar tabs={ABAS} abaAtiva={abaAtiva} onSelect={setAbaAtiva} />
        </View>
      </ConexaoFamiliarProvider>
    </SafeAreaView>
  );
}
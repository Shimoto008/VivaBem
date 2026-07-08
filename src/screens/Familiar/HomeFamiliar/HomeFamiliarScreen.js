import React from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { styles } from './HomeFamiliar.styles';
import { ConexaoCuidadorCard } from './components/ConexaoCuidadorCard';
import { AtividadesFamiliarList } from './components/AtividadesFamiliarList';
import { ScreenHeader } from '../../../components/ui';
import { ConexaoFamiliarProvider } from '../../../contexts/ConexaoFamiliarContext';
import { useSession } from '../../../contexts/SessionContext';

/**
 * O Provider fica aqui, no topo da árvore desta tela: tanto o card de
 * conexão quanto a lista de atividades (e o modal de conectar) precisam
 * do mesmo estado, sem precisar repassar props manualmente.
 */
export default function HomeFamiliarScreen() {
  const { familiar } = useSession();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ConexaoFamiliarProvider familiarId={familiar?.id}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ScreenHeader title={`Olá, ${familiar?.nome?.split(' ')[0] ?? ''}`} subtitle="Acompanhe a rotina de quem você ama" />

          <ConexaoCuidadorCard />

          <Text style={styles.secaoTitulo}>Atividades Recentes</Text>
          <AtividadesFamiliarList />
        </ScrollView>
      </ConexaoFamiliarProvider>
    </SafeAreaView>
  );
}

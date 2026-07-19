import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { styles } from './HomeCuidador.styles';
import { ResumoTab } from './components/ResumoTab';
import { PacientesTab } from './components/PacientesTab';
import { PerfilCuidadorTab } from './components/PerfilCuidadorTab';
import { BottomTabBar } from '../../../components/ui';
import { useHomeCuidador } from '../../../hooks/useHomeCuidador';
import { useSession } from '../../../contexts/SessionContext';

const ABAS = [
  { key: 'home', label: 'Início', icon: 'home', iconFamily: 'MaterialIcons' },
  { key: 'pacientes', label: 'Pacientes', icon: 'people-alt', iconFamily: 'MaterialIcons' },
  { key: 'perfil', label: 'Perfil', icon: 'person', iconFamily: 'MaterialIcons' },
];

/**
 * Tela "burra": só decide QUAL aba mostrar. Todo o resto (dados de
 * pacientes, estado de seleção, cadastro) vive em useHomeCuidador.
 */
export default function HomeCuidadorScreen() {
  const { cuidador } = useSession();
  const controlador = useHomeCuidador(cuidador?.id);
  const { abaAtiva, setAbaAtiva } = controlador;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {abaAtiva === 'home' && <ResumoTab controlador={controlador} />}
          {abaAtiva === 'pacientes' && <PacientesTab controlador={controlador} />}
          {abaAtiva === 'perfil' && <PerfilCuidadorTab />}
        </ScrollView>

        <BottomTabBar tabs={ABAS} abaAtiva={abaAtiva} onSelect={setAbaAtiva} />
      </View>
    </SafeAreaView>
  );
}

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useAtividadesPaciente } from '../../../hooks/useAtividadesPaciente';
import { useLembretesMedicacao } from '../../../hooks/useLembretesMedicacao';
import { ATIVIDADE_TIPOS } from '../../../../../constants/atividadeTipos';
import { interpretarMedicacao } from '../../../../../utils/MedicacaoUtils';
import { useTheme } from '../../../../../contexts/ThemeContext';
import { EmptyState, ScreenHeader } from '../../../../../components/ui';
import { radius, spacing, typography } from '../../../../../theme';
import { MedicacaoForm } from './MedicacaoForm/MedicacaoForm';
import { MedicacaoCard } from './MedicacaoCard/MedicacaoCard';
import { EmptyPacienteMessage } from '../EmptyPacienteMessage';

export default function MedicacaoScreen({ route }) {
  const idoso = route?.params?.idoso;
  const cuidadorId = route?.params?.cuidadorId;
  const navigation = useNavigation();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  const [novaMedicacao, setNovaMedicacao] = useState(false);
  const [nomeMedicacao, setNomeMedicacao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [horario, setHorario] = useState('');

  const {
    atividades,
    carregando,
    processando,
    salvar,
    iniciarEdicao,
    itemEmEdicao,
    cancelarEdicao,
    excluir,
  } = useAtividadesPaciente(idoso?.id, cuidadorId);

  const { temLembrete, alternarLembrete, removerLembrete, reagendarSeAtivo } =
    useLembretesMedicacao();

  const medicacoes = useMemo(() => {
    return atividades
      .filter((atividade) => atividade.tipo === ATIVIDADE_TIPOS.MEDICACAO)
      .map(interpretarMedicacao);
  }, [atividades]);

  if (!idoso) {
    return <EmptyPacienteMessage />;
  }

  function editarMedicacao(item) {
    setNomeMedicacao(item.nome);
    setQuantidade(item.quantidade);
    setHorario(item.horario);
    iniciarEdicao(item.original);
    setNovaMedicacao(true);
  }

  function excluirMedicacao(item) {
    Alert.alert('Excluir medicação', `Deseja excluir ${item.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await excluir(item.original.id);
          await removerLembrete(item.id);
        },
      },
    ]);
  }

  async function handleSalvarMedicacao() {
    if (!nomeMedicacao.trim() || !quantidade.trim() || !horario.trim()) {
      return;
    }

    const idEmEdicao = itemEmEdicao?.id;

    const medicacao = JSON.stringify({
      nome: nomeMedicacao,
      quantidade,
      horario,
    });

    await salvar(ATIVIDADE_TIPOS.MEDICACAO, medicacao, null);

    if (idEmEdicao) {
      await reagendarSeAtivo({
        id: idEmEdicao,
        nome: nomeMedicacao,
        quantidade,
        horario,
      });
    }

    cancelarEdicao();
    setNomeMedicacao('');
    setQuantidade('');
    setHorario('');
    setNovaMedicacao(false);
  }

  function cancelarFormulario() {
    cancelarEdicao();
    setNovaMedicacao(false);
    setNomeMedicacao('');
    setQuantidade('');
    setHorario('');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.fluxo}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScreenHeader
          title="Medicações"
          subtitle={`Paciente: ${idoso.nome}`}
          onBack={() => navigation.goBack()}
        />

        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            onPress={() => setNovaMedicacao(true)}
            accessibilityRole="button"
            accessibilityLabel="Adicionar nova medicação"
            style={styles.botaoNova}
          >
            <Text style={styles.textoBotaoNova}>+ Nova Medicação</Text>
          </TouchableOpacity>

          {novaMedicacao && (
            <MedicacaoForm
              titulo={itemEmEdicao ? 'Editar Medicação' : 'Nova Medicação'}
              textoBotao={itemEmEdicao ? 'Salvar Alterações' : 'Salvar Medicação'}
              nome={nomeMedicacao}
              quantidade={quantidade}
              horario={horario}
              setNome={setNomeMedicacao}
              setQuantidade={setQuantidade}
              setHorario={setHorario}
              onSalvar={handleSalvarMedicacao}
              onCancelar={cancelarFormulario}
              processando={processando}
            />
          )}

          <Text style={styles.tituloSecao}>Medicações cadastradas</Text>

          {carregando ? (
            <View style={styles.areaCarregando}>
              <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
          ) : medicacoes.length === 0 ? (
            <EmptyState
              icon="medication"
              title="Nenhuma medicação cadastrada"
              description="Toque em “+ Nova Medicação” para registrar a primeira medicação do paciente."
            />
          ) : (
            medicacoes.map((medicacao) => (
              <MedicacaoCard
                key={medicacao.id}
                medicacao={medicacao}
                lembreteAtivo={temLembrete(medicacao.id)}
                onLembrete={() => alternarLembrete(medicacao)}
                onEditar={() => editarMedicacao(medicacao)}
                onExcluir={() => excluirMedicacao(medicacao)}
              />
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    fluxo: { flex: 1 },
    conteudo: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
    botaoNova: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.lg,
      borderRadius: radius.md,
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    textoBotaoNova: { ...typography.bodyBold, color: colors.textOnPrimary },
    tituloSecao: { ...typography.title3, color: colors.textPrimary, marginBottom: spacing.md },
    areaCarregando: { paddingVertical: spacing.xxxl },
  });

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

import { CalendarioAgenda } from './CalendarioAgenda';
import { AgendaForm } from './AgendaForm/AgendaForm';
import { AgendaCard } from './AgendaCard/AgendaCard';
import { useAtividadesPaciente } from '../../../hooks/useAtividadesPaciente';
import { ATIVIDADE_TIPOS } from '../../../../../constants/atividadeTipos';
import { useTheme } from '../../../../../contexts/ThemeContext';
import { ScreenHeader } from '../../../../../components/ui';
import { radius, spacing, typography } from '../../../../../theme';
import {
  NOMES_DOS_MESES,
  diasNoMes,
  formatarISODatePtBR,
  paraISODate,
} from '../../../../../utils/dateUtils';
import { EmptyPacienteMessage } from '../EmptyPacienteMessage';

export default function CalendarioScreen({ route }) {
  const idoso = route?.params?.idoso;
  const cuidadorId = route?.params?.cuidadorId;
  const navigation = useNavigation();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  const hoje = new Date();
  const dataHoje = paraISODate(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [dataSelecionada, setDataSelecionada] = useState(dataHoje);
  const [diaSelecionado, setDiaSelecionado] = useState(hoje.getDate());
  const [novaAtividade, setNovaAtividade] = useState(false);
  const [conteudo, setConteudo] = useState('');

  const {
    atividades,
    carregando,
    salvar,
    excluir,
    iniciarEdicao,
    cancelarEdicao,
    itemEmEdicao,
    processando,
  } = useAtividadesPaciente(idoso?.id, cuidadorId);

  const agenda = useMemo(() => {
    return atividades.filter((item) => item.tipo === ATIVIDADE_TIPOS.AGENDA);
  }, [atividades]);

  const quantidadeDiasNoMes = diasNoMes(anoAtual, mesAtual);

  const diasComAtividade = useMemo(() => {
    return new Set(
      agenda
        .filter((item) => item.data_referencia)
        .filter((item) => {
          const data = item.data_referencia.split('-');
          return Number(data[0]) === anoAtual && Number(data[1]) === mesAtual + 1;
        })
        .map((item) => Number(item.data_referencia.split('-')[2]))
    );
  }, [agenda, anoAtual, mesAtual]);

  const atividadesDoDia = useMemo(() => {
    return agenda.filter((item) => item.data_referencia === dataSelecionada);
  }, [agenda, dataSelecionada]);

  if (!idoso) {
    return <EmptyPacienteMessage />;
  }

  function selecionarDia(dia) {
    setDiaSelecionado(dia);
    setDataSelecionada(paraISODate(anoAtual, mesAtual, dia));
  }

  function irParaMesAnterior() {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual((valor) => valor - 1);
    } else {
      setMesAtual((valor) => valor - 1);
    }
  }

  function irParaMesSeguinte() {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual((valor) => valor + 1);
    } else {
      setMesAtual((valor) => valor + 1);
    }
  }

  function abrirNovaAtividade() {
    cancelarEdicao();
    setConteudo('');
    setNovaAtividade(true);
  }

  function editarAtividade(item) {
    iniciarEdicao(item);
    setConteudo(item.conteudo);
    setDataSelecionada(item.data_referencia);
    setNovaAtividade(true);
  }

  function excluirAtividade(item) {
    Alert.alert('Excluir atividade', 'Deseja realmente excluir esta atividade?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await excluir(item.id);
        },
      },
    ]);
  }

  async function salvarAtividade() {
    if (!conteudo.trim()) {
      return;
    }

    await salvar(ATIVIDADE_TIPOS.AGENDA, conteudo.trim(), dataSelecionada);

    cancelarEdicao();
    setConteudo('');
    setNovaAtividade(false);
  }

  function cancelarFormulario() {
    cancelarEdicao();
    setConteudo('');
    setNovaAtividade(false);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.fluxo}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScreenHeader
          title="Calendário"
          subtitle={`Paciente: ${idoso.nome}`}
          onBack={() => navigation.goBack()}
        />

        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <Text style={styles.dataSelecionada}>
            Data selecionada: {formatarISODatePtBR(dataSelecionada)}
          </Text>

          <TouchableOpacity
            onPress={abrirNovaAtividade}
            accessibilityRole="button"
            accessibilityLabel="Adicionar nova atividade"
            style={styles.botaoNova}
          >
            <Text style={styles.textoBotaoNova}>+ Nova Atividade</Text>
          </TouchableOpacity>

          {carregando ? (
            <View style={styles.areaCarregando}>
              <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
          ) : (
            <>
              <CalendarioAgenda
                mesAtual={mesAtual}
                anoAtual={anoAtual}
                diaSelecionado={diaSelecionado}
                nomesDosMeses={NOMES_DOS_MESES}
                quantidadeDiasNoMes={quantidadeDiasNoMes}
                irParaMesAnterior={irParaMesAnterior}
                irParaMesSeguinte={irParaMesSeguinte}
                onSelecionarDia={selecionarDia}
                diasComAtividade={diasComAtividade}
              />

              {novaAtividade && (
                <AgendaForm
                  titulo={itemEmEdicao ? 'Editar Atividade' : 'Nova Atividade'}
                  textoBotao={itemEmEdicao ? 'Salvar Alterações' : 'Salvar Atividade'}
                  conteudo={conteudo}
                  setConteudo={setConteudo}
                  data={dataSelecionada}
                  processando={processando}
                  onSalvar={salvarAtividade}
                  onCancelar={cancelarFormulario}
                />
              )}

              <Text style={styles.tituloSecao}>Atividades do dia</Text>

              {atividadesDoDia.length === 0 ? (
                <Text style={styles.textoVazio}>Nenhuma atividade cadastrada para este dia.</Text>
              ) : (
                atividadesDoDia.map((item) => (
                  <AgendaCard
                    key={item.id}
                    atividade={item}
                    onEditar={() => editarAtividade(item)}
                    onExcluir={() => excluirAtividade(item)}
                  />
                ))
              )}
            </>
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
    dataSelecionada: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
    botaoNova: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.lg,
      borderRadius: radius.md,
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    textoBotaoNova: { ...typography.bodyBold, color: colors.textOnPrimary },
    tituloSecao: {
      ...typography.title2,
      color: colors.textPrimary,
      marginTop: spacing.xxl,
      marginBottom: spacing.md,
    },
    textoVazio: { ...typography.body, color: colors.textTertiary },
    areaCarregando: { paddingVertical: spacing.xxxl },
  });

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

import { RelatorioCard } from './RelatorioCard/RelatorioCard';
import { RelatorioForm } from './RelatorioForm/RelatorioForm';
import { useAtividadesPaciente } from '../../../hooks/useAtividadesPaciente';
import { ATIVIDADE_TIPOS } from '../../../../../constants/atividadeTipos';
import { useTheme } from '../../../../../contexts/ThemeContext';
import { EmptyState, ScreenHeader } from '../../../../../components/ui';
import { radius, spacing, typography } from '../../../../../theme';
import { EmptyPacienteMessage } from '../EmptyPacienteMessage';

export default function RelatorioScreen({ route }) {
  const idoso = route?.params?.idoso;
  const cuidadorId = route?.params?.cuidadorId;

  const navigation = useNavigation();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  const [novoRelatorio, setNovoRelatorio] = useState(false);
  const [conteudo, setConteudo] = useState('');

  const { atividades, carregando, salvar, processando, excluir, iniciarEdicao, cancelarEdicao } =
    useAtividadesPaciente(idoso?.id, cuidadorId);

  const relatorios = useMemo(() => {
    return atividades.filter((atividade) => atividade.tipo === ATIVIDADE_TIPOS.RELATORIO);
  }, [atividades]);

  if (!idoso) {
    return <EmptyPacienteMessage />;
  }

  async function salvarRelatorio() {
    if (!conteudo.trim()) {
      return;
    }

    await salvar(ATIVIDADE_TIPOS.RELATORIO, conteudo.trim(), null);

    setConteudo('');
    setNovoRelatorio(false);
  }

  function excluirRelatorio(relatorio) {
    Alert.alert('Excluir relatório', 'Deseja realmente excluir este relatório?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await excluir(relatorio.id);
        },
      },
    ]);
  }

  function editarRelatorio(relatorio) {
    iniciarEdicao(relatorio);
    setConteudo(relatorio.conteudo);
    setNovoRelatorio(true);
  }

  function cancelarFormulario() {
    setNovoRelatorio(false);
    setConteudo('');
    cancelarEdicao();
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.preenchimento}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.conteudoScroll}
        >
          <ScreenHeader
            title="Relatórios"
            subtitle={`Paciente: ${idoso.nome}`}
            onBack={() => navigation.goBack()}
          />

          <View style={styles.corpo}>
            <TouchableOpacity
              onPress={() => setNovoRelatorio(true)}
              accessibilityRole="button"
              accessibilityLabel="Adicionar novo relatório"
              style={styles.botaoNovo}
            >
              <Text style={styles.textoBotaoNovo}>+ Novo Relatório</Text>
            </TouchableOpacity>

            {novoRelatorio && (
              <RelatorioForm
                conteudo={conteudo}
                setConteudo={setConteudo}
                onSalvar={salvarRelatorio}
                onCancelar={cancelarFormulario}
                processando={processando}
              />
            )}

            <Text style={styles.tituloLista}>Relatórios cadastrados</Text>

            {carregando ? (
              <ActivityIndicator size="large" color={themeColors.primary} style={styles.carregando} />
            ) : relatorios.length === 0 ? (
              <EmptyState
                icon="description"
                title="Nenhum relatório cadastrado"
                description="Toque em “+ Novo Relatório” para registrar o primeiro."
              />
            ) : (
              relatorios.map((relatorio) => (
                <RelatorioCard
                  key={relatorio.id}
                  relatorio={relatorio}
                  onEditar={() => editarRelatorio(relatorio)}
                  onExcluir={() => excluirRelatorio(relatorio)}
                />
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    preenchimento: { flex: 1 },
    conteudoScroll: { paddingBottom: spacing.xxl },
    corpo: { paddingHorizontal: spacing.xl },
    botaoNovo: {
      backgroundColor: colors.primary,
      padding: spacing.lg,
      borderRadius: radius.md,
      marginTop: spacing.sm,
    },
    textoBotaoNovo: { ...typography.bodyBold, color: colors.textOnPrimary, textAlign: 'center' },
    tituloLista: { ...typography.title3, color: colors.textPrimary, marginTop: spacing.xl },
    carregando: { marginTop: spacing.xl },
  });

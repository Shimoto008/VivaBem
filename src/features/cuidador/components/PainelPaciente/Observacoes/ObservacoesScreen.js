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
import { ATIVIDADE_TIPOS } from '../../../../../constants/atividadeTipos';
import { useTheme } from '../../../../../contexts/ThemeContext';
import { EmptyState, ScreenHeader } from '../../../../../components/ui';
import { radius, spacing, typography } from '../../../../../theme';
import { ObservacaoForm } from './ObservacoesForm/ObservacoesForm';
import { ObservacaoCard } from './ObservacoesCard/ObservacoesCard';
import { EmptyPacienteMessage } from '../EmptyPacienteMessage';

export default function ObservacoesScreen({ route }) {
  const idoso = route?.params?.idoso;
  const cuidadorId = route?.params?.cuidadorId;

  const navigation = useNavigation();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  const [novaObservacao, setNovaObservacao] = useState(false);
  const [categoria, setCategoria] = useState('');
  const [texto, setTexto] = useState('');

  const { atividades, carregando, salvar, excluir, iniciarEdicao, cancelarEdicao, processando } =
    useAtividadesPaciente(idoso?.id, cuidadorId);

  const observacoes = useMemo(() => {
    return atividades
      .filter((item) => item.tipo === ATIVIDADE_TIPOS.OBSERVACAO)
      .map((item) => {
        const dados = JSON.parse(item.conteudo);

        return {
          id: item.id,
          categoria: dados.categoria,
          texto: dados.texto,
          data: item.created_at,
          original: item,
        };
      });
  }, [atividades]);

  if (!idoso) {
    return <EmptyPacienteMessage />;
  }

  function editarObservacao(item) {
    setCategoria(item.categoria);
    setTexto(item.texto);
    iniciarEdicao(item.original);
    setNovaObservacao(true);
  }

  async function salvarObservacao() {
    if (!categoria || !texto.trim()) {
      Alert.alert('Atenção', 'Preencha categoria e observação.');
      return;
    }

    const observacao = JSON.stringify({
      categoria,
      texto: texto.trim(),
    });

    await salvar(ATIVIDADE_TIPOS.OBSERVACAO, observacao, null);

    cancelarEdicao();
    setCategoria('');
    setTexto('');
    setNovaObservacao(false);
  }

  function excluirObservacao(item) {
    Alert.alert('Excluir observação', 'Deseja realmente excluir esta observação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => excluir(item.original.id),
      },
    ]);
  }

  function cancelarFormulario() {
    cancelarEdicao();
    setCategoria('');
    setTexto('');
    setNovaObservacao(false);
  }

  function abrirNovaObservacao() {
    setCategoria('');
    setTexto('');
    setNovaObservacao(true);
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
            title="Observações"
            subtitle={`Paciente: ${idoso.nome}`}
            onBack={() => navigation.goBack()}
          />

          <View style={styles.corpo}>
            <TouchableOpacity
              onPress={abrirNovaObservacao}
              accessibilityRole="button"
              accessibilityLabel="Adicionar nova observação"
              style={styles.botaoNovo}
            >
              <Text style={styles.textoBotaoNovo}>+ Nova Observação</Text>
            </TouchableOpacity>

            {novaObservacao && (
              <ObservacaoForm
                categoria={categoria}
                texto={texto}
                setCategoria={setCategoria}
                setTexto={setTexto}
                onSalvar={salvarObservacao}
                onCancelar={cancelarFormulario}
                processando={processando}
              />
            )}

            <Text style={styles.tituloLista}>Histórico de observações</Text>

            {carregando ? (
              <ActivityIndicator size="large" color={themeColors.primary} style={styles.carregando} />
            ) : observacoes.length === 0 ? (
              <EmptyState
                icon="event-note"
                title="Nenhuma observação cadastrada"
                description="Toque em “+ Nova Observação” para registrar a primeira."
              />
            ) : (
              observacoes.map((item) => (
                <ObservacaoCard
                  key={item.id}
                  observacao={item}
                  onEditar={() => editarObservacao(item)}
                  onExcluir={() => excluirObservacao(item)}
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
      alignItems: 'center',
      marginTop: spacing.sm,
      marginBottom: spacing.xl,
    },
    textoBotaoNovo: { ...typography.bodyBold, color: colors.textOnPrimary },
    tituloLista: { ...typography.title2, color: colors.textPrimary, marginBottom: spacing.sm },
    carregando: { marginTop: spacing.xl },
  });

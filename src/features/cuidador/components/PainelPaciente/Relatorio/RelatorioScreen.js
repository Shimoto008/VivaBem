import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

import { RelatorioCard } from './RelatorioCard/RelatorioCard';
import { RelatorioForm } from './RelatorioForm/RelatorioForm';
import { useAtividadesPaciente } from '../../../hooks/useAtividadesPaciente';
import { ATIVIDADE_TIPOS } from '../../../../../constants/atividadeTipos';
import { useTheme } from '../../../../../contexts/ThemeContext';
import { EmptyPacienteMessage } from '../EmptyPacienteMessage';

export default function RelatorioScreen({ route }) {
  const idoso = route?.params?.idoso;
  const cuidadorId = route?.params?.cuidadorId;
  const { themeColors } = useTheme();

  const [novoRelatorio, setNovoRelatorio] = useState(false);
  const [conteudo, setConteudo] = useState('');

  const { atividades, salvar, processando, excluir, iniciarEdicao, cancelarEdicao } =
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
    <View style={{ flex: 1, padding: 20, backgroundColor: themeColors.background }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: themeColors.textPrimary }}>Relatórios</Text>

      <Text style={{ color: themeColors.textSecondary }}>Paciente: {idoso.nome}</Text>

      <TouchableOpacity
        onPress={() => setNovoRelatorio(true)}
        style={{
          backgroundColor: themeColors.primary,
          padding: 15,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <Text style={{ color: themeColors.textOnPrimary, textAlign: 'center', fontWeight: 'bold' }}>
          + Novo Relatório
        </Text>
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

      <Text style={{ marginTop: 20, fontWeight: 'bold', color: themeColors.textPrimary }}>Relatórios cadastrados</Text>

      {relatorios.map((relatorio) => (
        <RelatorioCard
          key={relatorio.id}
          relatorio={relatorio}
          onEditar={() => editarRelatorio(relatorio)}
          onExcluir={() => excluirRelatorio(relatorio)}
        />
      ))}
    </View>
  );
}

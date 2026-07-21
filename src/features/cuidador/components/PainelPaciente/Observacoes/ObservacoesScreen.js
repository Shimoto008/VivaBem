import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

import { useAtividadesPaciente } from '../../../hooks/useAtividadesPaciente';
import { ATIVIDADE_TIPOS } from '../../../../../constants/atividadeTipos';
import { useTheme } from '../../../../../contexts/ThemeContext';
import { ObservacaoForm } from './ObservacoesForm/ObservacoesForm';
import { ObservacaoCard } from './ObservacoesCard/ObservacoesCard';
import { EmptyPacienteMessage } from '../EmptyPacienteMessage';

export default function ObservacoesScreen({ route }) {
  const idoso = route?.params?.idoso;
  const cuidadorId = route?.params?.cuidadorId;
  const { themeColors } = useTheme();

  const [novaObservacao, setNovaObservacao] = useState(false);
  const [categoria, setCategoria] = useState('');
  const [texto, setTexto] = useState('');

  const { atividades, salvar, excluir, iniciarEdicao, cancelarEdicao, processando } =
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
    <View style={{ flex: 1, padding: 20, backgroundColor: themeColors.background }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: themeColors.textPrimary }}>Observações</Text>

      <Text style={{ marginTop: 5, marginBottom: 20, color: themeColors.textSecondary }}>
        Paciente: {idoso.nome}
      </Text>

      <TouchableOpacity
        onPress={abrirNovaObservacao}
        style={{
          backgroundColor: themeColors.primary,
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text style={{ color: themeColors.textOnPrimary, fontWeight: 'bold' }}>+ Nova Observação</Text>
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

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: themeColors.textPrimary }}>
        Histórico de observações
      </Text>

      {observacoes.length === 0 ? (
        <Text style={{ color: themeColors.textTertiary }}>Nenhuma observação cadastrada.</Text>
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
  );
}

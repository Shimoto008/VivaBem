import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

import { useAtividadesPaciente } from '../../../hooks/useAtividadesPaciente';
import { ATIVIDADE_TIPOS } from '../../../../../constants/atividadeTipos';
import { interpretarMedicacao } from '../../../../../utils/MedicacaoUtils';
import { useTheme } from '../../../../../contexts/ThemeContext';
import { MedicacaoForm } from './MedicacaoForm/MedicacaoForm';
import { MedicacaoCard } from './MedicacaoCard/MedicacaoCard';
import { EmptyPacienteMessage } from '../EmptyPacienteMessage';

export default function MedicacaoScreen({ route }) {
  const idoso = route?.params?.idoso;
  const cuidadorId = route?.params?.cuidadorId;
  const { themeColors } = useTheme();

  const [novaMedicacao, setNovaMedicacao] = useState(false);
  const [nomeMedicacao, setNomeMedicacao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [horario, setHorario] = useState('');

  const { atividades, processando, salvar, iniciarEdicao, itemEmEdicao, cancelarEdicao, excluir } =
    useAtividadesPaciente(idoso?.id, cuidadorId);

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
        },
      },
    ]);
  }

  async function handleSalvarMedicacao() {
    if (!nomeMedicacao.trim() || !quantidade.trim() || !horario.trim()) {
      return;
    }

    const medicacao = JSON.stringify({
      nome: nomeMedicacao,
      quantidade,
      horario,
    });

    await salvar(ATIVIDADE_TIPOS.MEDICACAO, medicacao, null);

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
    <View style={{ flex: 1, padding: 20, backgroundColor: themeColors.background }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: themeColors.textPrimary }}>Medicações</Text>

      <Text style={{ fontSize: 16, color: themeColors.textSecondary, marginTop: 4, marginBottom: 20 }}>
        Paciente: {idoso.nome}
      </Text>

      <TouchableOpacity
        onPress={() => setNovaMedicacao(true)}
        style={{
          backgroundColor: themeColors.primary,
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text style={{ color: themeColors.textOnPrimary, fontWeight: 'bold' }}>+ Nova Medicação</Text>
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

      <Text style={{ fontWeight: 'bold', marginBottom: 10, color: themeColors.textPrimary }}>Medicações cadastradas</Text>

      {medicacoes.map((medicacao) => (
        <MedicacaoCard
          key={medicacao.id}
          medicacao={medicacao}
          onLembrete={() => {}}
          onEditar={() => editarMedicacao(medicacao)}
          onExcluir={() => excluirMedicacao(medicacao)}
        />
      ))}
    </View>
  );
}

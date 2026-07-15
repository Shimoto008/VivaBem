import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FormularioAtividade } from '../../../components/PainelPaciente/FormularioAtividade';
import { useAtividadesPaciente } from '../../../../../../hooks/useAtividadesPaciente';
import { ATIVIDADE_TIPOS } from '../../../../../../constants/atividadeTipos';
import { MedicacaoForm } from './MedicacaoForm/MedicacaoForm';
import { interpretarMedicacao } from '../../../../../../utils/MedicacaoUtils';
import { MedicacaoCard } from './MedicacaoCard/MedicacaoCard';

export default function MedicacaoScreen({ route }) {
  const idoso = route?.params?.idoso;
  const cuidadorId = route?.params?.cuidadorId;

  const [novaMedicacao, setNovaMedicacao] = useState(false);
  const [nomeMedicacao, setNomeMedicacao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [horario, setHorario] = useState('');

  if (!idoso) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Nenhum paciente selecionado.</Text>
      </View>
    );
  }

  const { atividades, processando, salvar, iniciarEdicao } = useAtividadesPaciente(
    idoso.id,
    cuidadorId
  );

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

    setNomeMedicacao('');
    setQuantidade('');
    setHorario('');

    setNovaMedicacao(false);
  }

  const medicacoes = useMemo(() => {
    return atividades
      .filter((atividade) => atividade.tipo === ATIVIDADE_TIPOS.MEDICACAO)
      .map(interpretarMedicacao);
  }, [atividades]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
        }}
      >
        Medicações
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: '#666',
          marginTop: 4,
          marginBottom: 20,
        }}
      >
        Paciente: {idoso.nome}
      </Text>

      <TouchableOpacity
        onPress={() => setNovaMedicacao(true)}
        style={{
          backgroundColor: '#0e40ca',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          + Nova Medicação
        </Text>
      </TouchableOpacity>
      {novaMedicacao && (
        <MedicacaoForm
          nome={nomeMedicacao}
          quantidade={quantidade}
          horario={horario}
          setNome={setNomeMedicacao}
          setQuantidade={setQuantidade}
          setHorario={setHorario}
          onSalvar={handleSalvarMedicacao}
          onCancelar={() => {
            setNovaMedicacao(false);
            setNomeMedicacao('');
            setQuantidade('');
            setHorario('');
          }}
          processando={processando}
        />
      )}

      <Text
        style={{
          fontWeight: 'bold',
          marginBottom: 10,
        }}
      >
        Medicações cadastradas
      </Text>

      {medicacoes.map((medicacao) => (
        <MedicacaoCard
          key={medicacao.id}
          medicacao={medicacao}
          onLembrete={() => {
            console.log('Abrir lembrete', medicacao);
          }}
          onEditar={() => {
            console.log('Editar', medicacao);
          }}
        />
      ))}
    </View>
  );
}

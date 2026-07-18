import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

import { CalendarioAgenda } from './CalendarioAgenda';

import { useAtividadesPaciente } from '../../../../../../hooks/useAtividadesPaciente';

import { ATIVIDADE_TIPOS } from '../../../../../../constants/atividadeTipos';

export default function CalendarioScreen({ route }) {
  const idoso = route?.params?.idoso;
  const cuidadorId = route?.params?.cuidadorId;

  const hoje = new Date();

  const [mesAtual, setMesAtual] = useState(hoje.getMonth());

  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());

  const dataHoje = hoje.toISOString().split('T')[0];

  const [dataSelecionada, setDataSelecionada] = useState(dataHoje);

  const [diaSelecionado, setDiaSelecionado] = useState(hoje.getDate());

  const [novaAtividade, setNovaAtividade] = useState(false);

  const [conteudo, setConteudo] = useState('');

  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  if (!idoso) {
    return (
      <View>
        <Text>Nenhum paciente selecionado.</Text>
      </View>
    );
  }

  const { atividades, salvar } = useAtividadesPaciente(idoso.id, cuidadorId);

  const agenda = useMemo(() => {
    return atividades.filter((item) => item.tipo === ATIVIDADE_TIPOS.AGENDA);
  }, [atividades]);

  const quantidadeDiasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

  function selecionarDia(dia) {
    setDiaSelecionado(dia);

    const novaData = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    setDataSelecionada(novaData);
  }

  function irParaMesAnterior() {
    if (mesAtual === 0) {
      setMesAtual(11);

      setAnoAtual(anoAtual - 1);
    } else {
      setMesAtual(mesAtual - 1);
    }
  }

  function irParaMesSeguinte() {
    if (mesAtual === 11) {
      setMesAtual(0);

      setAnoAtual(anoAtual + 1);
    } else {
      setMesAtual(mesAtual + 1);
    }
  }

  async function salvarAtividade() {
    if (!conteudo.trim()) {
      return;
    }

    await salvar(ATIVIDADE_TIPOS.AGENDA, conteudo.trim(), dataSelecionada);

    setConteudo('');

    setNovaAtividade(false);
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
        }}
      >
        Calendário
      </Text>

      <Text>Paciente: {idoso.nome}</Text>

      <Text
        style={{
          marginTop: 10,
          color: '#666',
        }}
      >
        Data selecionada: {dataSelecionada}
      </Text>

      <TouchableOpacity
        onPress={() => setNovaAtividade(true)}
        style={{
          backgroundColor: '#0e40ca',
          padding: 15,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          + Nova Atividade
        </Text>
      </TouchableOpacity>

      <CalendarioAgenda
        mesAtual={mesAtual}
        anoAtual={anoAtual}
        diaSelecionado={diaSelecionado}
        nomesDosMeses={meses}
        quantidadeDiasNoMes={quantidadeDiasNoMes}
        irParaMesAnterior={irParaMesAnterior}
        irParaMesSeguinte={irParaMesSeguinte}
        onSelecionarDia={selecionarDia}
        diasComAtividade={
          new Set(
            agenda
              .filter((item) => item.data_referencia)
              .filter((item) => {
                const data = item.data_referencia.split('-');

                return Number(data[0]) === anoAtual && Number(data[1]) === mesAtual + 1;
              })
              .map((item) => Number(item.data_referencia.split('-')[2]))
          )
        }
      />

      {novaAtividade && (
        <View
          style={{
            marginTop: 20,
          }}
        >
          <Text>Criar atividade para:</Text>

          <Text
            style={{
              fontWeight: 'bold',
            }}
          >
            {dataSelecionada}
          </Text>

          <TextInput
            placeholder="Descrição da atividade"
            value={conteudo}
            onChangeText={setConteudo}
            style={{
              borderWidth: 1,

              borderColor: '#ccc',

              borderRadius: 10,

              padding: 12,

              marginTop: 10,
            }}
          />

          <TouchableOpacity
            onPress={salvarAtividade}
            style={{
              backgroundColor: '#0e40ca',

              padding: 15,

              borderRadius: 10,

              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
              }}
            >
              Salvar
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Text
        style={{
          marginTop: 25,
          fontWeight: 'bold',
          fontSize: 18,
        }}
      >
        Atividades do dia
      </Text>

      {agenda.filter((item) => item.data_referencia === dataSelecionada).length === 0 ? (
        <Text
          style={{
            marginTop: 10,
            color: '#777',
          }}
        >
          Nenhuma atividade cadastrada para este dia.
        </Text>
      ) : (
        agenda
          .filter((item) => item.data_referencia === dataSelecionada)
          .map((item) => (
            <View
              key={item.id}
              style={{
                backgroundColor: '#fff',

                padding: 15,

                marginTop: 10,

                borderRadius: 12,

                elevation: 3,

                shadowColor: '#000',

                shadowOpacity: 0.1,

                shadowRadius: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                📅 Atividade
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  color: '#555',
                }}
              >
                {item.conteudo}
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: '#888',
                }}
              >
                {item.data_referencia}
              </Text>
            </View>
          ))
      )}
    </View>
  );
}

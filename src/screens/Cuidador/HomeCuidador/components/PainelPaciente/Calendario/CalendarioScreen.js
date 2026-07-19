import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

import { CalendarioAgenda } from './CalendarioAgenda';
import { AgendaForm } from './AgendaForm/AgendaForm';
import { AgendaCard } from './AgendaCard/AgendaCard';

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

  const {
    atividades,
    salvar,
    excluir,
    iniciarEdicao,
    cancelarEdicao,
    itemEmEdicao,
    processando,
  } = useAtividadesPaciente(idoso.id, cuidadorId);

  const agenda = useMemo(() => {
    return atividades.filter(
      (item) => item.tipo === ATIVIDADE_TIPOS.AGENDA
    );
  }, [atividades]);

  const quantidadeDiasNoMes = new Date(
    anoAtual,
    mesAtual + 1,
    0
  ).getDate();

  function selecionarDia(dia) {
    setDiaSelecionado(dia);

    const novaData = `${anoAtual}-${String(
      mesAtual + 1
    ).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    setDataSelecionada(novaData);
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

  async function excluirAtividade(item) {
    Alert.alert(
      'Excluir atividade',
      'Deseja realmente excluir esta atividade?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await excluir(item.id);
          },
        },
      ]
    );
  }

  async function salvarAtividade() {
    if (!conteudo.trim()) {
      return;
    }

    await salvar(
      ATIVIDADE_TIPOS.AGENDA,
      conteudo.trim(),
      dataSelecionada
    );

    cancelarEdicao();

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

      <Text
        style={{
          color: '#666',
          marginBottom: 15,
        }}
      >
        Data selecionada: {dataSelecionada}
      </Text>

      <TouchableOpacity
        onPress={abrirNovaAtividade}
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

                return (
                  Number(data[0]) === anoAtual &&
                  Number(data[1]) === mesAtual + 1
                );
              })
              .map((item) =>
                Number(item.data_referencia.split('-')[2])
              )
          )
        }
      />

      {novaAtividade && (
        <AgendaForm
          titulo={
            itemEmEdicao
              ? 'Editar Atividade'
              : 'Nova Atividade'
          }
          textoBotao={
            itemEmEdicao
              ? 'Salvar Alterações'
              : 'Salvar Atividade'
          }
          conteudo={conteudo}
          setConteudo={setConteudo}
          data={dataSelecionada}
          processando={processando}
          onSalvar={salvarAtividade}
          onCancelar={() => {
            cancelarEdicao();

            setConteudo('');

            setNovaAtividade(false);
          }}
        />
      )}

      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 18,
          marginTop: 25,
          marginBottom: 10,
        }}
      >
        Atividades do dia
      </Text>

      {agenda.filter(
        (item) => item.data_referencia === dataSelecionada
      ).length === 0 ? (
        <Text
          style={{
            color: '#777',
          }}
        >
          Nenhuma atividade cadastrada para este dia.
        </Text>
      ) : (
        agenda
          .filter(
            (item) =>
              item.data_referencia === dataSelecionada
          )
          .map((item) => (
            <AgendaCard
              key={item.id}
              atividade={item}
              onEditar={() => editarAtividade(item)}
              onExcluir={() => excluirAtividade(item)}
            />
          ))
      )}
    </View>
  );
}
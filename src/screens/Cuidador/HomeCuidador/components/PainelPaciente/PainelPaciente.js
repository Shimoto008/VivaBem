import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../HomeCuidador.styles';
import { CalendarioAgenda } from './CalendarioAgenda';
import { FormularioAtividade } from './FormularioAtividade';
import { HistoricoAtividades } from './HistoricoAtividades';
import { useAtividadesPaciente } from '../../../../../hooks/useAtividadesPaciente';
import { useCalendarioAgenda } from '../../../../../hooks/useCalendarioAgenda';
import { ATIVIDADE_TIPOS, ATIVIDADE_CONFIG } from '../../../../../constants/atividadeTipos';
import { paraISODate } from '../../../../../utils/dateUtils';
import { abrirDespertadorNativo } from '../../../../../utils/nativeAlarm';
import { colors } from '../../../../../theme';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../../../../constants/routeNames';

/**
 * Orquestrador do painel de um paciente. Antes era um único arquivo de
 * ~250 linhas (calendário + 4 formulários + histórico, tudo junto).
 * Agora só compõe CalendarioAgenda + FormularioAtividade +
 * HistoricoAtividades, e usa dois hooks para os dados (useAtividadesPaciente)
 * e a navegação do calendário (useCalendarioAgenda) — nenhuma chamada de
 * API acontece diretamente aqui.
 */
export function PainelPaciente({ idoso, cuidadorId, onFechar }) {
  const {
    atividades,
    carregando,
    processando,
    erro,
    itemEmEdicao,
    iniciarEdicao,
    cancelarEdicao,
    buscarAgendaPorData,
    salvar,
  } = useAtividadesPaciente(idoso.id, cuidadorId);
  const navigation = useNavigation();
  const calendario = useCalendarioAgenda();
  const [subAtividadeAtiva, setSubAtividadeAtiva] = useState(null);
  const [conteudo, setConteudo] = useState('');

  const dataReferenciaSelecionada = paraISODate(
    calendario.anoAtual,
    calendario.mesAtual,
    calendario.diaSelecionado
  );

  const diasComAtividade = useMemo(() => {
    const dias = new Set();
    atividades
      .filter((a) => a.tipo === ATIVIDADE_TIPOS.AGENDA && a.data_referencia)
      .forEach((a) => {
        const [ano, mes, dia] = a.data_referencia.split('-').map(Number);
        if (ano === calendario.anoAtual && mes === calendario.mesAtual + 1) dias.add(dia);
      });
    return dias;
  }, [atividades, calendario.anoAtual, calendario.mesAtual]);

  function abrirFormulario(tipo) {
    if (subAtividadeAtiva === tipo) {
      fecharFormulario();
      return;
    }
    setSubAtividadeAtiva(tipo);
    cancelarEdicao();

    if (tipo === ATIVIDADE_TIPOS.AGENDA) {
      const agendaDoDia = buscarAgendaPorData(dataReferenciaSelecionada);
      setConteudo(agendaDoDia?.conteudo ?? '');
    } else {
      setConteudo('');
    }
  }

  function fecharFormulario() {
    setSubAtividadeAtiva(null);
    setConteudo('');
    cancelarEdicao();
  }

  function selecionarDiaNoCalendario(dia) {
    calendario.setDiaSelecionado(dia);
    if (subAtividadeAtiva === ATIVIDADE_TIPOS.AGENDA) {
      const novaData = paraISODate(calendario.anoAtual, calendario.mesAtual, dia);
      const agendaDoDia = buscarAgendaPorData(novaData);
      setConteudo(agendaDoDia?.conteudo ?? '');
      cancelarEdicao();
    }
  }

  function editarItemDoHistorico(atividade) {
    iniciarEdicao(atividade);
    setSubAtividadeAtiva(atividade.tipo);
    setConteudo(atividade.conteudo);
    if (atividade.tipo === ATIVIDADE_TIPOS.AGENDA && atividade.data_referencia) {
      const [ano, mes, dia] = atividade.data_referencia.split('-').map(Number);
      calendario.setDiaSelecionado(dia);
      // mês/ano do calendário só mudam se o usuário navegar; aqui mantemos o
      // dia em destaque já é suficiente para o caso comum (edição no mesmo mês).
      void ano;
      void mes;
    }
  }

  async function handleSalvar() {
    if (!conteudo.trim()) return;
    await salvar(
      subAtividadeAtiva,
      conteudo.trim(),
      subAtividadeAtiva === ATIVIDADE_TIPOS.AGENDA ? dataReferenciaSelecionada : null
    );
    fecharFormulario();
  }

  return (
    <View style={styles.containerAcoes}>
      <View style={styles.topoAcoes}>
        <Text style={styles.tituloAcoes}>AÇÕES RÁPIDAS</Text>
        <TouchableOpacity onPress={onFechar} accessibilityLabel="Fechar painel">
          <MaterialIcons name="close" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.gridAcoes}>
        {Object.values(ATIVIDADE_TIPOS).map((tipo) => {
          const config = ATIVIDADE_CONFIG[tipo];
          const ativo = subAtividadeAtiva === tipo;
          return (
            <TouchableOpacity
              key={tipo}
              style={[styles.btnAcaoCard, ativo && styles.btnAtivo]}
              onPress={() => {
                if (tipo === ATIVIDADE_TIPOS.MEDICACAO) {
                  navigation.navigate(ROUTES.MEDICACAO, {
                    idoso: idoso,
                  });

                  return;
                }

                abrirFormulario(tipo);
              }}
            >
              <MaterialIcons
                name={config.icone}
                size={22}
                color={ativo ? colors.primary : '#555'}
              />
              <Text style={styles.txtAcaoCard}>{config.titulo}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {erro ? (
        <Text style={{ color: colors.danger, marginTop: 8 }}>
          Não foi possível carregar as atividades.
        </Text>
      ) : null}

      {subAtividadeAtiva === ATIVIDADE_TIPOS.AGENDA && (
        <FormularioAtividade
          titulo={itemEmEdicao ? 'Editar Agenda' : ATIVIDADE_CONFIG.agenda.titulo}
          placeholder="Compromissos do dia..."
          conteudo={conteudo}
          onChangeConteudo={setConteudo}
          onSalvar={handleSalvar}
          onCancelar={fecharFormulario}
          processando={processando}
          extraAntes={
            <CalendarioAgenda
              {...calendario}
              onSelecionarDia={selecionarDiaNoCalendario}
              diasComAtividade={diasComAtividade}
            />
          }
        />
      )}

      {subAtividadeAtiva === ATIVIDADE_TIPOS.RELATORIO && (
        <FormularioAtividade
          titulo={itemEmEdicao ? 'Editar Relatório' : ATIVIDADE_CONFIG.relatorio.titulo}
          placeholder={ATIVIDADE_CONFIG.relatorio.placeholder}
          conteudo={conteudo}
          onChangeConteudo={setConteudo}
          onSalvar={handleSalvar}
          onCancelar={fecharFormulario}
          processando={processando}
        />
      )}

      {subAtividadeAtiva === ATIVIDADE_TIPOS.MEDICACAO && (
        <FormularioAtividade
          titulo={itemEmEdicao ? 'Editar Medicação' : ATIVIDADE_CONFIG.medicacao.titulo}
          placeholder={ATIVIDADE_CONFIG.medicacao.placeholder}
          conteudo={conteudo}
          onChangeConteudo={setConteudo}
          onSalvar={handleSalvar}
          onCancelar={fecharFormulario}
          processando={processando}
          textoBotaoSalvar="Salvar Medicação"
          extraDepois={
            <TouchableOpacity
              style={[
                styles.btnSalvarNota,
                {
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.primary,
                  marginTop: 8,
                },
              ]}
              onPress={abrirDespertadorNativo}
              accessibilityLabel="Configurar despertador para a medicação"
            >
              <Text style={[styles.btnSalvarNotaTexto, { color: colors.primary }]}>
                Configurar Despertador
              </Text>
            </TouchableOpacity>
          }
        />
      )}

      {subAtividadeAtiva === ATIVIDADE_TIPOS.OBSERVACAO && (
        <FormularioAtividade
          titulo={itemEmEdicao ? 'Editar Observação' : ATIVIDADE_CONFIG.observacao.titulo}
          placeholder={ATIVIDADE_CONFIG.observacao.placeholder}
          conteudo={conteudo}
          onChangeConteudo={setConteudo}
          onSalvar={handleSalvar}
          onCancelar={fecharFormulario}
          processando={processando}
        />
      )}

      {carregando ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 16 }} />
      ) : (
        <HistoricoAtividades atividades={atividades} onEditar={editarItemDoHistorico} />
      )}
    </View>
  );
}

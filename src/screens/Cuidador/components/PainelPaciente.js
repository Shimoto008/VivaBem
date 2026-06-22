import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as IntentLauncher from 'expo-intent-launcher'; 
import styles from "../HomeCuidador/Style";

export function PainelPaciente({ idoso, controlador }) {
  const {
    setPacienteSelecionado,
    subAtividadeAtiva, setSubAtividadeAtiva,
    handleAbrirSubAtividade,
    handleSalvarAtividade,
    handleEditarItem,
    textoAgenda, setTextoAgenda,
    textoRelatorio, setTextoRelatorio,
    textoMedicao, setTextoMedicao,
    textoObservacao, setTextoObservacao,
    nomesDosMeses, mesAtual, diaSelecionado,
    alternarDiaCalendario, anoAtual
  } = controlador;

  const abrirDespertadorNativo = async () => {
    try {
      if (Platform.OS === 'android') {
        await IntentLauncher.startActivityAsync('android.intent.action.SHOW_ALARMS');
      } else if (Platform.OS === 'ios') {
        await Linking.openURL('clock-alarm://');
      }
    } catch (error) {
      Alert.alert(
        'Aviso', 
        'Não foi possível abrir o despertador automaticamente. Por favor, abra o aplicativo de Relógio do seu celular manualmente.'
      );
    }
  };

  // --- SUB-COMPONENTE INTERNO: CALENDÁRIO ---
  const renderCalendario = () => {
    const quantidadeDias = new Date(anoAtual, mesAtual + 1, 0).getDate();
    const diasDoMes = Array.from({ length: quantidadeDias }, (_, i) => i + 1);

    return (
      <View style={styles.calendarioContainer}>
        <View style={styles.calendarioHeaderNavegacao}>
          <TouchableOpacity onPress={controlador.handleMesAnterior} style={styles.btnSetas}>
            <MaterialIcons name="chevron-left" size={28} color="#4169E1" />
          </TouchableOpacity>
          <Text style={styles.mesTitulo}>{nomesDosMeses[mesAtual]} {anoAtual}</Text>
          <TouchableOpacity onPress={controlador.handleMesSeguinte} style={styles.btnSetas}>
            <MaterialIcons name="chevron-right" size={28} color="#4169E1" />
          </TouchableOpacity>
        </View>

        <View style={styles.diasGrid}>
          {diasDoMes.map((dia) => {
            const chaveData = `${anoAtual}-${mesAtual}-${dia}`;
            const temCompromisso = idoso.historicoAgenda[chaveData];
            const isSelected = dia === diaSelecionado;

            return (
              <TouchableOpacity 
                key={dia} 
                style={[
                  styles.diaBotao, 
                  isSelected && styles.diaSelecionado,
                  temCompromisso && !isSelected && styles.diaComInfo
                ]}
                onPress={() => alternarDiaCalendario(dia, idoso)}
              >
                <Text style={[styles.diaTexto, isSelected && styles.diaTextoSelecionado]}>{dia}</Text>
                {temCompromisso && <View style={styles.pontoIndicador} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  // --- SUB-COMPONENTE INTERNO: FORMULÁRIOS DAS SUB-ABAS ---
  const renderFormAtividade = () => {
    if (!subAtividadeAtiva) return null;

    if (subAtividadeAtiva === 'agenda') {
      return (
        <View style={styles.subAbaAtividade}>
          <View style={styles.subAbaHeader}>
            <Text style={styles.subAbaTitulo}>Calendário de Atividades</Text>
            <TouchableOpacity onPress={() => setSubAtividadeAtiva(null)}>
              <MaterialIcons name="cancel" size={22} color="#FF6347" />
            </TouchableOpacity>
          </View>
          {renderCalendario()}
          <Text style={styles.legendaInputTitulo}>Legenda para o dia {diaSelecionado} de {nomesDosMeses[mesAtual]}:</Text>
          <TextInput style={styles.textArea} placeholder="Digite compromissos..." multiline value={textoAgenda} onChangeText={setTextoAgenda} />
          <TouchableOpacity style={styles.btnSalvarNota} onPress={() => handleSalvarAtividade('agenda', textoAgenda)}>
            <Text style={styles.btnSalvarNotaTexto}>Salvar na Agenda do Dia</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (subAtividadeAtiva === 'medicaçao') {
      return (
        <View style={styles.subAbaAtividade}>
          <View style={styles.subAbaHeader}>
            <Text style={styles.subAbaTitulo}>Nova Medicação</Text>
            <TouchableOpacity onPress={() => setSubAtividadeAtiva(null)}>
              <MaterialIcons name="cancel" size={22} color="#FF6347" />
            </TouchableOpacity>
          </View>
          
          <TextInput 
            style={styles.textArea} 
            placeholder="Nome do remédio, dosagem e instruções..." 
            multiline 
            value={textoMedicao} 
            onChangeText={setTextoMedicao} 
          />

          <View style={{ marginTop: 14, marginBottom: 6 }}>
            <Text style={[styles.legendaInputTitulo, { marginBottom: 6 }]}>Precisa programar um alarme?</Text>
            <TouchableOpacity 
              style={[styles.btnSalvarNota, { backgroundColor: '#4169E1', height: 46, justifyContent: 'center', marginTop: 0 }]} 
              onPress={abrirDespertadorNativo}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="alarm" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.btnSalvarNotaTexto}>Configurar no meu Celular</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.btnSalvarNota, { marginTop: 12 }]} 
            onPress={async () => {
              await handleSalvarAtividade('medicaçao', textoMedicao);
              Alert.alert('Sucesso', 'Medicação registrada no histórico!');
            }}
          >
            <Text style={styles.btnSalvarNotaTexto}>Salvar Registro no Histórico</Text>
          </TouchableOpacity>
        </View>
      );
    }

    let config = { titulo: '', placeholder: '', valor: '', setValor: () => {} };
    if (subAtividadeAtiva === 'relatorios') config = { titulo: 'Relatório Diário', placeholder: 'Evolução...', valor: textoRelatorio, setValor: setTextoRelatorio };
    if (subAtividadeAtiva === 'observaçao') config = { titulo: 'Observação', placeholder: 'Avisos...', valor: textoObservacao, setValor: setTextoObservacao };

    return (
      <View style={styles.subAbaAtividade}>
        <View style={styles.subAbaHeader}>
          <Text style={styles.subAbaTitulo}>{config.titulo}</Text>
          <TouchableOpacity onPress={() => setSubAtividadeAtiva(null)}>
            <MaterialIcons name="cancel" size={22} color="#FF6347" />
          </TouchableOpacity>
        </View>
        <TextInput style={styles.textArea} placeholder={config.placeholder} multiline value={config.valor} onChangeText={config.setValor} />
        <TouchableOpacity style={styles.btnSalvarNota} onPress={() => handleSalvarAtividade(subAtividadeAtiva, config.valor)}>
          <Text style={styles.btnSalvarNotaTexto}>Salvar Registro</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // --- SUB-COMPONENTE INTERNO: HISTÓRICO CARD ---
  const renderHistoricoLabels = () => {
    const chavesAgenda = Object.keys(idoso.historicoAgenda).filter(key => idoso.historicoAgenda[key]);
    const possuiDados = chavesAgenda.length > 0 || idoso.historicoRelatorios.length > 0 || idoso.historicoMedicacao.length > 0 || idoso.historicoObservacoes.length > 0;
    if (!possuiDados) return null;

    return (
      <View style={styles.containerHistoricoLabels}>
        <Text style={styles.tituloLinhaTempo}>Atividades Cadastradas</Text>
        {chavesAgenda.map((chave) => {
          const [ano, mes, dia] = chave.split('-');
          return (
            <View key={chave} style={[styles.cardLabelHistorico, { borderLeftColor: '#4169E1' }]}>
              <View style={styles.labelHeaderHistorico}>
                <View style={styles.labelTagIcon}><MaterialIcons name="event" size={16} color="#4169E1" /><Text style={[styles.txtTagLabel, { color: '#4169E1' }]}>Agenda ({dia}/{parseInt(mes) + 1}/{ano})</Text></View>
                <TouchableOpacity style={styles.btnEditarLabel} onPress={() => handleEditarItem('agenda', null, chave)}><MaterialIcons name="edit" size={16} color="#666" /></TouchableOpacity>
              </View>
              <Text style={styles.txtConteudoLabel}>{idoso.historicoAgenda[chave]}</Text>
            </View>
          );
        })}
        {/* Relatórios */}
        {idoso.historicoRelatorios.map((item) => (
          <View key={item.id} style={[styles.cardLabelHistorico, { borderLeftColor: '#20B2AA' }]}>
            <View style={styles.labelHeaderHistorico}>
              <View style={styles.labelTagIcon}><MaterialIcons name="assessment" size={16} color="#20B2AA" /><Text style={[styles.txtTagLabel, { color: '#20B2AA' }]}>Relatório ({item.data})</Text></View>
              <TouchableOpacity style={styles.btnEditarLabel} onPress={() => handleEditarItem('relatorios', item)}><MaterialIcons name="edit" size={16} color="#666" /></TouchableOpacity>
            </View>
            <Text style={styles.txtConteudoLabel}>{item.conteudo}</Text>
          </View>
        ))}
        {/* Medicações */}
        {idoso.historicoMedicacao.map((item) => (
          <View key={item.id} style={[styles.cardLabelHistorico, { borderLeftColor: '#9370DB' }]}>
            <View style={styles.labelHeaderHistorico}>
              <View style={styles.labelTagIcon}><MaterialIcons name="healing" size={16} color="#9370DB" /><Text style={[styles.txtTagLabel, { color: '#9370DB' }]}>Medicação ({item.data})</Text></View>
              <TouchableOpacity style={styles.btnEditarLabel} onPress={() => handleEditarItem('medicaçao', item)}><MaterialIcons name="edit" size={16} color="#666" /></TouchableOpacity>
            </View>
            <Text style={styles.txtConteudoLabel}>{item.conteudo}</Text>
          </View>
        ))}
        {/* Observações */}
        {idoso.historicoObservacoes.map((item) => (
          <View key={item.id} style={[styles.cardLabelHistorico, { borderLeftColor: '#FF6347' }]}>
            <View style={styles.labelHeaderHistorico}>
              <View style={styles.labelTagIcon}><MaterialIcons name="notification-important" size={16} color="#FF6347" /><Text style={[styles.txtTagLabel, { color: '#FF6347' }]}>Observação ({item.data})</Text></View>
              <TouchableOpacity style={styles.btnEditarLabel} onPress={() => handleEditarItem('observaçao', item)}><MaterialIcons name="edit" size={16} color="#666" /></TouchableOpacity>
            </View>
            <Text style={styles.txtConteudoLabel}>{item.conteudo}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} // Desativa o comportamento de ajuste no Android para evitar o "quique"
    >
      <ScrollView 
        style={styles.containerAcoes}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // Permite clicar nos botões de primeira sem travar a rolagem
      >
        <View style={styles.topoAcoes}>
          <Text style={styles.tituloAcoes}>Painel do Assistido - {idoso.nome}</Text>
          <TouchableOpacity onPress={() => { setPacienteSelecionado(null); setSubAtividadeAtiva(null); }}>
            <MaterialIcons name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <View style={styles.gridAcoes}>
          <TouchableOpacity style={[styles.btnAcaoCard, subAtividadeAtiva === 'agenda' && styles.btnAtivo]} onPress={() => handleAbrirSubAtividade('agenda', idoso)}><MaterialIcons name="event" size={24} color="#4169E1" /><Text style={styles.txtAcaoCard}>Agenda</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.btnAcaoCard, subAtividadeAtiva === 'relatorios' && styles.btnAtivo]} onPress={() => handleAbrirSubAtividade('relatorios', idoso)}><MaterialIcons name="assessment" size={24} color="#4169E1" /><Text style={styles.txtAcaoCard}>Relatórios</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.btnAcaoCard, subAtividadeAtiva === 'medicaçao' && styles.btnAtivo]} onPress={() => handleAbrirSubAtividade('medicaçao', idoso)}><MaterialIcons name="healing" size={24} color="#4169E1" /><Text style={styles.txtAcaoCard}>Medicação</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.btnAcaoCard, subAtividadeAtiva === 'observaçao' && styles.btnAtivo]} onPress={() => handleAbrirSubAtividade('observaçao', idoso)}><MaterialIcons name="notification-important" size={24} color="#FF6347" /><Text style={styles.txtAcaoCard}>Observação</Text></TouchableOpacity>
        </View>
        {renderFormAtividade()}
        {renderHistoricoLabels()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
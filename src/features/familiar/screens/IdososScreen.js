import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

import { radius, spacing, typography } from '../../../theme';
import { useTheme } from '../../../contexts/ThemeContext';
import { useSession } from '../../../contexts/SessionContext';
import { Input, Button, ScreenHeader } from '../../../components/ui';
import { aplicarMascaraTelefone } from '../../../utils/masks';

import { CadastroIdosoForm } from '../components/CadastroIdosoForm';
import { useCadastroPacienteForm } from '../hooks/useCadastroPacienteForm';
import {
  criarPaciente,
  listarPacientesPorFamiliar,
  atualizarSaudePaciente,
} from '../../../services/pacienteService';

/**
 * Tela de cadastro e acompanhamento dos idosos (pacientes) do Familiar.
 * Todo o acesso ao Supabase passa por `pacienteService` — a tela não faz
 * chamadas diretas ao banco.
 *
 * Sem ScrollView próprio: esta tela é sempre renderizada como uma página do
 * `SwipeableTabs` em HomeFamiliarScreen, que já provê a rolagem vertical.
 */
export default function IdososScreen() {
  const { perfil: familiar } = useSession();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  const [idosos, setIdosos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [idosoSelecionado, setIdosoSelecionado] = useState(null);
  const [formularioAberto, setFormularioAberto] = useState(false);

  const [editandoSaude, setEditandoSaude] = useState(false);
  const [alergias, setAlergias] = useState('');
  const [tipoSanguineo, setTipoSanguineo] = useState('');
  const [contatoEmergencia, setContatoEmergencia] = useState('');
  const [observacoesMedicas, setObservacoesMedicas] = useState('');
  const [salvandoDetalhes, setSalvandoDetalhes] = useState(false);

  const buscarIdososDoBanco = useCallback(async () => {
    if (!familiar?.id) {
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      const lista = await listarPacientesPorFamiliar(familiar.id);
      setIdosos(lista ?? []);
    } catch (erro) {
      console.error('Erro ao buscar idosos:', erro.message);
    } finally {
      setCarregando(false);
    }
  }, [familiar?.id]);

  useEffect(() => {
    buscarIdososDoBanco();
  }, [buscarIdososDoBanco]);

  const selecionarPaciente = (idoso) => {
    if (idosoSelecionado?.id === idoso.id) {
      setIdosoSelecionado(null);
      setEditandoSaude(false);
      return;
    }

    setIdosoSelecionado(idoso);
    setAlergias(idoso.alergias || '');
    setTipoSanguineo(idoso.tipo_sanguineo || '');
    setContatoEmergencia(aplicarMascaraTelefone(idoso.contato_emergencia || ''));
    setObservacoesMedicas(idoso.observacoes_medicas || '');
    setEditandoSaude(false);
  };

  const salvarDetalhesSaude = async () => {
    if (!idosoSelecionado?.id) return;

    try {
      setSalvandoDetalhes(true);
      await atualizarSaudePaciente(idosoSelecionado.id, {
        alergias,
        tipoSanguineo,
        contatoEmergencia,
        observacoesMedicas,
      });

      Alert.alert('Sucesso', 'Informações de saúde atualizadas!');
      setEditandoSaude(false);
      await buscarIdososDoBanco();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar as informações de saúde.');
    } finally {
      setSalvandoDetalhes(false);
    }
  };

  // Erros são propagados de propósito: useCadastroPacienteForm.salvar() já
  // trata sucesso/erro (Alert + limpeza do form) — duplicar isso aqui geraria
  // alertas contraditórios.
  const cadastrarIdoso = async (dadosIdoso) => {
    if (!familiar?.id) {
      throw new Error('Sessão do familiar não encontrada.');
    }

    await criarPaciente({
      familiarId: familiar.id,
      nome: dadosIdoso.nome,
      idade: dadosIdoso.idade,
      cpf: dadosIdoso.cpf,
    });

    await buscarIdososDoBanco();
    setFormularioAberto(false);
  };

  const { nome, setNome, idade, setIdade, cpf, alterarCpf, erros, enviando, salvar } =
    useCadastroPacienteForm(cadastrarIdoso);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Gestão de Idosos"
        subtitle="Acompanhe e gerencie os idosos cadastrados"
      />

      <TouchableOpacity
        onPress={() => setFormularioAberto((aberto) => !aberto)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={formularioAberto ? 'Fechar cadastro' : 'Cadastrar novo idoso'}
        style={[styles.botaoCadastro, formularioAberto && styles.botaoCadastroAberto]}
      >
        <MaterialIcons
          name={formularioAberto ? 'remove-circle-outline' : 'add-circle-outline'}
          size={26}
          color={themeColors.primary}
        />
        <Text style={styles.textoBotaoCadastro}>
          {formularioAberto ? 'Fechar Cadastro' : 'Cadastrar Novo Idoso'}
        </Text>
      </TouchableOpacity>

      {formularioAberto ? (
        <View style={styles.blocoFormulario}>
          <CadastroIdosoForm
            nome={nome}
            setNome={setNome}
            idade={idade}
            setIdade={setIdade}
            cpf={cpf}
            alterarCpf={alterarCpf}
            erros={erros}
            enviando={enviando}
            onSalvar={salvar}
          />
        </View>
      ) : null}

      <Text style={styles.tituloLista}>Idosos Ativos ({idosos.length})</Text>

      {carregando ? (
        <ActivityIndicator size="large" color={themeColors.primary} style={styles.carregando} />
      ) : idosos.length === 0 ? (
        <View style={styles.cardVazio}>
          <Text style={styles.textoVazio}>Nenhum idoso cadastrado ainda.</Text>
        </View>
      ) : (
        idosos.map((idoso) => {
          const estaExpandido = idosoSelecionado?.id === idoso.id;

          return (
            <View key={idoso.id} style={styles.cardIdoso}>
              <TouchableOpacity
                style={styles.cabecalhoCard}
                onPress={() => selecionarPaciente(idoso)}
                accessibilityRole="button"
                accessibilityLabel={`Abrir ficha de ${idoso.nome}`}
                accessibilityState={{ expanded: estaExpandido }}
              >
                <View style={styles.linhaIdoso}>
                  <FontAwesome5 name="user-circle" size={32} color={themeColors.primary} />
                  <View style={styles.infoIdoso}>
                    <Text style={styles.nomeIdoso}>{idoso.nome}</Text>
                    <Text style={styles.textoSecundario}>
                      {idoso.idade ? `${idoso.idade} anos` : 'Idade não informada'}
                    </Text>
                  </View>
                </View>

                <MaterialIcons
                  name={estaExpandido ? 'expand-less' : 'expand-more'}
                  size={26}
                  color={themeColors.primary}
                />
              </TouchableOpacity>

              {estaExpandido ? (
                <View style={styles.detalhes}>
                  <View style={styles.cabecalhoDetalhes}>
                    <Text style={styles.tituloDetalhes}>Ficha do Paciente</Text>
                    <TouchableOpacity
                      onPress={() => setEditandoSaude((editando) => !editando)}
                      accessibilityRole="button"
                      accessibilityLabel={
                        editandoSaude ? 'Cancelar edição da ficha' : 'Editar ficha do paciente'
                      }
                      style={styles.botaoEditar}
                    >
                      <Ionicons
                        name={editandoSaude ? 'close' : 'pencil'}
                        size={16}
                        color={themeColors.primary}
                      />
                      <Text style={styles.textoBotaoEditar}>
                        {editandoSaude ? 'Cancelar' : 'Editar'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.textoFicha}>
                    <Text style={styles.rotuloFicha}>CPF:</Text> {idoso.cpf || 'Não informado'}
                  </Text>

                  {editandoSaude ? (
                    <View style={styles.formularioSaude}>
                      <Input
                        label="Alergias"
                        value={alergias}
                        onChangeText={setAlergias}
                        placeholder="Ex.: Dipirona, Penicilina"
                      />
                      <Input
                        label="Tipo Sanguíneo"
                        value={tipoSanguineo}
                        onChangeText={setTipoSanguineo}
                        placeholder="Ex.: O+, A-"
                        autoCapitalize="characters"
                        maxLength={3}
                      />
                      <Input
                        label="Contato de Emergência"
                        value={contatoEmergencia}
                        onChangeText={(texto) => setContatoEmergencia(aplicarMascaraTelefone(texto))}
                        placeholder="(11) 99999-9999"
                        keyboardType="numeric"
                        maxLength={15}
                      />
                      <Input
                        label="Observações Médicas"
                        value={observacoesMedicas}
                        onChangeText={setObservacoesMedicas}
                        placeholder="Ex.: Diabético, hipertensão..."
                        multiline
                        numberOfLines={3}
                        style={styles.campoMultilinha}
                      />
                      <Button
                        title="Salvar Informações"
                        onPress={salvarDetalhesSaude}
                        loading={salvandoDetalhes}
                      />
                    </View>
                  ) : (
                    <View style={styles.blocoFicha}>
                      <Text style={styles.textoFicha}>
                        <Text style={styles.rotuloFicha}>Alergias:</Text>{' '}
                        {idoso.alergias || 'Nenhuma informada'}
                      </Text>
                      <Text style={styles.textoFicha}>
                        <Text style={styles.rotuloFicha}>Tipo Sanguíneo:</Text>{' '}
                        {idoso.tipo_sanguineo || 'Não informado'}
                      </Text>
                      <Text style={styles.textoFicha}>
                        <Text style={styles.rotuloFicha}>Contato de Emergência:</Text>{' '}
                        {idoso.contato_emergencia || 'Não informado'}
                      </Text>
                      <Text style={styles.textoFicha}>
                        <Text style={styles.rotuloFicha}>Obs. Médicas:</Text>{' '}
                        {idoso.observacoes_medicas || 'Nenhuma'}
                      </Text>
                    </View>
                  )}
                </View>
              ) : null}
            </View>
          );
        })
      )}
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    botaoCadastro: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.primary,
      borderRadius: radius.lg,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
      marginTop: spacing.lg,
      marginBottom: spacing.xl,
    },
    botaoCadastroAberto: { marginBottom: spacing.sm },
    textoBotaoCadastro: { ...typography.title3, color: colors.primary, marginLeft: spacing.md },
    blocoFormulario: { marginBottom: spacing.xl },
    tituloLista: { ...typography.title2, color: colors.textPrimary, marginBottom: spacing.md },
    carregando: { marginTop: spacing.xl },
    cardVazio: {
      padding: spacing.xl,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    textoVazio: { ...typography.caption, color: colors.textTertiary },
    cardIdoso: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      marginBottom: spacing.md,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    cabecalhoCard: {
      padding: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    linhaIdoso: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    infoIdoso: { marginLeft: spacing.lg, flex: 1 },
    nomeIdoso: { ...typography.title3, color: colors.textPrimary },
    textoSecundario: { ...typography.caption, color: colors.textSecondary },
    detalhes: {
      padding: spacing.lg,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    cabecalhoDetalhes: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    tituloDetalhes: { ...typography.bodyBold, color: colors.textPrimary },
    botaoEditar: { flexDirection: 'row', alignItems: 'center' },
    textoBotaoEditar: {
      ...typography.caption,
      fontWeight: '700',
      color: colors.primary,
      marginLeft: spacing.xs,
    },
    blocoFicha: { marginTop: spacing.xs },
    textoFicha: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs },
    rotuloFicha: { fontWeight: '700' },
    formularioSaude: { marginTop: spacing.md },
    campoMultilinha: { minHeight: 80, textAlignVertical: 'top' },
  });

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../contexts/ThemeContext';
import { ScreenHeader } from '../../../components/ui';

import { CadastroIdosoForm } from '../components/CadastroIdosoForm';
import { useCadastroPacienteForm } from '../hooks/useCadastroPacienteForm';
import { useSession } from '../../../contexts/SessionContext';
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
  const { familiar } = useSession();
  const { themeColors: colors } = useTheme();

  const [idosos, setIdosos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [idosoSelecionado, setIdosoSelecionado] = useState(null);
  const [formularioAberto, setFormularioAberto] = useState(false);

  // Estados para edição/detalhes de saúde do idoso selecionado
  const [editandoSaude, setEditandoSaude] = useState(false);
  const [alergias, setAlergias] = useState('');
  const [tipoSanguineo, setTipoSanguineo] = useState('');
  const [contatoEmergencia, setContatoEmergencia] = useState('');
  const [observacoesMedicas, setObservacoesMedicas] = useState('');
  const [salvandoDetalhes, setSalvandoDetalhes] = useState(false);

  // 1. BUSCAR IDOSOS CADASTRADOS POR ESTE FAMILIAR
  const buscarIdososDoBanco = useCallback(async () => {
    if (!familiar?.id) return;

    try {
      setCarregando(true);
      const lista = await listarPacientesPorFamiliar(familiar.id);
      setIdosos(lista ?? []);
    } catch (err) {
      console.error('Erro ao buscar idosos:', err.message);
    } finally {
      setCarregando(false);
    }
  }, [familiar?.id]);

  useEffect(() => {
    buscarIdososDoBanco();
  }, [buscarIdososDoBanco]);

  // Carrega as informações adicionais de saúde ao selecionar o idoso
  const selecionarPaciente = (idoso) => {
    if (idosoSelecionado?.id === idoso.id) {
      setIdosoSelecionado(null);
      setEditandoSaude(false);
    } else {
      setIdosoSelecionado(idoso);
      setAlergias(idoso.alergias || '');
      setTipoSanguineo(idoso.tipo_sanguineo || '');
      setContatoEmergencia(idoso.contato_emergencia || '');
      setObservacoesMedicas(idoso.observacoes_medicas || '');
      setEditandoSaude(false);
    }
  };

  // 2. SALVAR INFORMAÇÕES ADICIONAIS DE SAÚDE
  const handleSalvarDetalhesSaude = async () => {
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

  // 3. CADASTRAR NOVO IDOSO (paciente) — regra de negócio: só o Familiar cadastra.
  // Erros são propagados de propósito: useCadastroPacienteForm.salvar() já
  // trata sucesso/erro (Alert + limpeza do form) — duplicar isso aqui geraria
  // alertas contraditórios.
  const handleCadastrarIdoso = async (dadosIdoso) => {
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

  const {
    nome,
    setNome,
    idade,
    setIdade,
    cpf,
    alterarCpf,
    erros,
    enviando,
    salvar,
  } = useCadastroPacienteForm(handleCadastrarIdoso);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        title="Gestão de Idosos"
        subtitle="Acompanhe e gerencie os idosos cadastrados"
      />

      {/* BOTÃO EXPANSÍVEL (TRANCEJADO) DE CADASTRO */}
      <TouchableOpacity
        onPress={() => setFormularioAberto(!formularioAberto)}
        activeOpacity={0.7}
        style={{
          borderWidth: 1.5,
          borderStyle: 'dashed',
          borderColor: colors.primary,
          borderRadius: 15,
          paddingVertical: 18,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          marginTop: 15,
          marginBottom: formularioAberto ? 10 : 20,
        }}
      >
        <MaterialIcons
          name={formularioAberto ? 'remove-circle-outline' : 'add-circle-outline'}
          size={26}
          color={colors.primary}
        />
        <Text
          style={{
            marginLeft: 12,
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.primary,
          }}
        >
          {formularioAberto ? 'Fechar Cadastro' : 'Cadastrar Novo Idoso'}
        </Text>
      </TouchableOpacity>

      {/* FORMULÁRIO DE CADASTRO */}
      {formularioAberto && (
        <View style={{ marginBottom: 20 }}>
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
      )}

      {/* LISTA DE IDOSOS ATIVOS */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: colors.textPrimary }}>
        Idosos Ativos ({idosos.length})
      </Text>

      {carregando ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : idosos.length > 0 ? (
        idosos.map((idoso) => {
          const estaExpandido = idosoSelecionado?.id === idoso.id;

          return (
            <View
              key={idoso.id}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 15,
                marginBottom: 12,
                overflow: 'hidden',
                elevation: 2,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {/* CABEÇALHO DO CARD */}
              <TouchableOpacity
                style={{
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => selecionarPaciente(idoso)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <FontAwesome5 name="user-circle" size={32} color={colors.primary} />
                  <View style={{ marginLeft: 15 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.textPrimary }}>{idoso.nome}</Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                      {idoso.idade ? `${idoso.idade} anos` : 'Idade não informada'}
                    </Text>
                  </View>
                </View>

                <MaterialIcons
                  name={estaExpandido ? 'expand-less' : 'expand-more'}
                  size={26}
                  color={colors.primary}
                />
              </TouchableOpacity>

              {/* CONTEÚDO EXPANDIDO - DETALHES DE SAÚDE E CUIDADOS */}
              {estaExpandido && (
                <View
                  style={{
                    padding: 16,
                    backgroundColor: colors.background,
                    borderTopWidth: 1,
                    borderTopColor: colors.divider,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: colors.textPrimary }}>
                      Ficha do Paciente
                    </Text>
                    <TouchableOpacity
                      onPress={() => setEditandoSaude(!editandoSaude)}
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Ionicons name={editandoSaude ? 'close' : 'pencil'} size={16} color={colors.primary} />
                      <Text style={{ color: colors.primary, fontWeight: 'bold', marginLeft: 4, fontSize: 13 }}>
                        {editandoSaude ? 'Cancelar' : 'Editar'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 8 }}>
                    <Text style={{ fontWeight: 'bold' }}>CPF:</Text> {idoso.cpf || 'Não informado'}
                  </Text>

                  {/* MODO VISUALIZAÇÃO OU MODO EDIÇÃO DAS INFORMAÇÕES DE SAÚDE */}
                  {!editandoSaude ? (
                    <View style={{ marginTop: 5 }}>
                      <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>
                        <Text style={{ fontWeight: 'bold' }}>Alergias:</Text> {idoso.alergias || 'Nenhuma informada'}
                      </Text>
                      <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>
                        <Text style={{ fontWeight: 'bold' }}>Tipo Sanguíneo:</Text> {idoso.tipo_sanguineo || 'Não informado'}
                      </Text>
                      <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>
                        <Text style={{ fontWeight: 'bold' }}>Contato de Emergência:</Text> {idoso.contato_emergencia || 'Não informado'}
                      </Text>
                      <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                        <Text style={{ fontWeight: 'bold' }}>Obs. Médicas:</Text> {idoso.observacoes_medicas || 'Nenhuma'}
                      </Text>
                    </View>
                  ) : (
                    <View style={{ marginTop: 10 }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 2 }}>Alergias</Text>
                      <TextInput
                        value={alergias}
                        onChangeText={setAlergias}
                        placeholder="Ex: Dipirona, Penicilina"
                        placeholderTextColor={colors.placeholder}
                        style={{ backgroundColor: colors.surface, borderRadius: 8, padding: 8, borderWidth: 1, borderColor: colors.border, marginBottom: 10, color: colors.textPrimary }}
                      />

                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 2 }}>Tipo Sanguíneo</Text>
                      <TextInput
                        value={tipoSanguineo}
                        onChangeText={setTipoSanguineo}
                        placeholder="Ex: O+, A-"
                        placeholderTextColor={colors.placeholder}
                        style={{ backgroundColor: colors.surface, borderRadius: 8, padding: 8, borderWidth: 1, borderColor: colors.border, marginBottom: 10, color: colors.textPrimary }}
                      />

                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 2 }}>Contato de Emergência</Text>
                      <TextInput
                        value={contatoEmergencia}
                        onChangeText={setContatoEmergencia}
                        placeholder="(11) 99999-9999"
                        placeholderTextColor={colors.placeholder}
                        keyboardType="phone-pad"
                        style={{ backgroundColor: colors.surface, borderRadius: 8, padding: 8, borderWidth: 1, borderColor: colors.border, marginBottom: 10, color: colors.textPrimary }}
                      />

                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.textSecondary, marginBottom: 2 }}>Observações Médicas</Text>
                      <TextInput
                        value={observacoesMedicas}
                        onChangeText={setObservacoesMedicas}
                        placeholder="Ex: Diabético, hipertensão..."
                        placeholderTextColor={colors.placeholder}
                        multiline
                        numberOfLines={3}
                        style={{ backgroundColor: colors.surface, borderRadius: 8, padding: 8, borderWidth: 1, borderColor: colors.border, marginBottom: 12, textAlignVertical: 'top', color: colors.textPrimary }}
                      />

                      <TouchableOpacity
                        onPress={handleSalvarDetalhesSaude}
                        disabled={salvandoDetalhes}
                        style={{
                          backgroundColor: colors.primary,
                          padding: 12,
                          borderRadius: 8,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ color: colors.textOnPrimary, fontWeight: 'bold' }}>
                          {salvandoDetalhes ? 'Salvando...' : 'Salvar Informações'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })
      ) : (
        <View style={{ padding: 20, backgroundColor: colors.surface, borderRadius: 12, alignItems: 'center' }}>
          <Text style={{ color: colors.textTertiary }}>Nenhum idoso cadastrado ainda.</Text>
        </View>
      )}
    </View>
  );
}

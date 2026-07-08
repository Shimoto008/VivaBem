import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { styles } from '../HomeCuidador.styles';
import { PainelPaciente } from './PainelPaciente/PainelPaciente';
import { Input, Button } from '../../../../components/ui';
import { colors } from '../../../../theme';
import { useCadastroPacienteForm } from '../../../../hooks/useCadastroPacienteForm';

/** Antes "RenderPaciente.js". Agora com validação real no cadastro de idoso. */
export function PacientesTab({ controlador }) {
  const {
    pacientes,
    pacienteSelecionado, selecionarPaciente, limparPacienteSelecionado,
    exibirFormCadastro, setExibirFormCadastro,
    cadastrarPaciente, cuidadorId,
  } = controlador;

  const { nome, setNome, idade, setIdade, cpf, alterarCpf, erros, enviando, salvar } =
    useCadastroPacienteForm(cadastrarPaciente);

  return (
    <View style={styles.containerAbas}>
      <TouchableOpacity
        style={styles.btnToggleCadastro}
        onPress={() => setExibirFormCadastro(!exibirFormCadastro)}
        accessibilityRole="button"
        accessibilityLabel="Cadastrar novo idoso"
      >
        <MaterialIcons name={exibirFormCadastro ? 'remove-circle-outline' : 'add-circle-outline'} size={28} color={colors.primary} />
        <Text style={styles.txtToggleCadastro}>Cadastrar Novo Idoso</Text>
      </TouchableOpacity>

      {exibirFormCadastro && (
        <View style={styles.formulario}>
          <Input placeholder="Nome Completo" value={nome} onChangeText={setNome} error={erros.nome} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '30%' }}>
              <Input placeholder="Idade" keyboardType="numeric" value={idade} onChangeText={setIdade} error={erros.idade} />
            </View>
            <View style={{ width: '65%' }}>
              <Input placeholder="CPF" keyboardType="numeric" maxLength={14} value={cpf} onChangeText={alterarCpf} error={erros.cpf} />
            </View>
          </View>
          <Button title="Finalizar Cadastro" onPress={salvar} loading={enviando} style={{ width: '100%' }} />
        </View>
      )}

      {pacientes.map((idoso) => (
        <View key={idoso.id} style={styles.wrapperPaciente}>
          <TouchableOpacity
            style={styles.itemListaPaciente}
            onPress={() => selecionarPaciente(idoso)}
            accessibilityRole="button"
            accessibilityLabel={`Abrir painel de ${idoso.nome}`}
          >
            <FontAwesome5 name="user-injured" size={24} color={colors.primary} />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{idoso.nome}</Text>
            </View>
            <MaterialIcons name={pacienteSelecionado?.id === idoso.id ? 'expand-less' : 'expand-more'} size={24} color={colors.primary} />
          </TouchableOpacity>

          {pacienteSelecionado?.id === idoso.id && (
            <PainelPaciente idoso={pacienteSelecionado} cuidadorId={cuidadorId} onFechar={limparPacienteSelecionado} />
          )}
        </View>
      ))}
    </View>
  );
}

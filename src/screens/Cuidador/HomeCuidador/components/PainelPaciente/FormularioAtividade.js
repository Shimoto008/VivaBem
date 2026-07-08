import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../HomeCuidador.styles';
import { colors } from '../../../../../theme';

/**
 * Formulário genérico de uma atividade (agenda/relatório/medicação/
 * observação). `extraAntes`/`extraDepois` permitem compor conteúdo
 * específico de um tipo (ex.: calendário antes, botão de despertador
 * depois) sem duplicar o cabeçalho/rodapé em cada tipo.
 */
export function FormularioAtividade({
  titulo, placeholder, conteudo, onChangeConteudo, onSalvar, onCancelar, processando,
  extraAntes, extraDepois, textoBotaoSalvar = 'Salvar Registro',
}) {
  return (
    <View style={styles.subAbaAtividade}>
      <View style={styles.subAbaHeader}>
        <Text style={styles.subAbaTitulo}>{titulo}</Text>
        <TouchableOpacity onPress={onCancelar} accessibilityLabel="Fechar formulário">
          <MaterialIcons name="cancel" size={22} color={colors.warning} />
        </TouchableOpacity>
      </View>

      {extraAntes}

      <TextInput
        style={styles.textArea}
        placeholder={placeholder}
        multiline
        value={conteudo}
        onChangeText={onChangeConteudo}
      />

      {extraDepois}

      <TouchableOpacity style={styles.btnSalvarNota} onPress={onSalvar} disabled={processando} accessibilityLabel={textoBotaoSalvar}>
        <Text style={styles.btnSalvarNotaTexto}>{processando ? 'Salvando...' : textoBotaoSalvar}</Text>
      </TouchableOpacity>
    </View>
  );
}

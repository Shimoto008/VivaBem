import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../../HomeCuidador.styles';
import { colors } from '../../../../../../theme';

/**
 * Extraído de PainelPaciente.js (estava como função interna "renderCalendario").
 * Recebe tudo via props — não conhece Supabase nem regras de negócio.
 */
export function CalendarioAgenda({
  mesAtual, anoAtual, diaSelecionado, nomesDosMeses, quantidadeDiasNoMes,
  irParaMesAnterior, irParaMesSeguinte, onSelecionarDia, diasComAtividade,
}) {
  const dias = Array.from({ length: quantidadeDiasNoMes }, (_, i) => i + 1);

  return (
    <View style={styles.calendarioContainer}>
      <View style={styles.calendarioHeaderNavegacao}>
        <TouchableOpacity onPress={irParaMesAnterior} style={styles.btnSetas} accessibilityLabel="Mês anterior">
          <MaterialIcons name="chevron-left" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.mesTitulo}>{nomesDosMeses[mesAtual]} {anoAtual}</Text>
        <TouchableOpacity onPress={irParaMesSeguinte} style={styles.btnSetas} accessibilityLabel="Próximo mês">
          <MaterialIcons name="chevron-right" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.diasGrid}>
        {dias.map((dia) => {
          const temCompromisso = diasComAtividade.has(dia);
          const isSelected = dia === diaSelecionado;
          return (
            <TouchableOpacity
              key={dia}
              style={[styles.diaBotao, isSelected && styles.diaSelecionado, temCompromisso && !isSelected && styles.diaComInfo]}
              onPress={() => onSelecionarDia(dia)}
              accessibilityLabel={`Dia ${dia}${temCompromisso ? ', com compromisso' : ''}`}
            >
              <Text style={[styles.diaTexto, isSelected && styles.diaTextoSelecionado]}>{dia}</Text>
              {temCompromisso && <View style={styles.pontoIndicador} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

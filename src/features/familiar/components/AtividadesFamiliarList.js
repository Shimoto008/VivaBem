import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getStyles } from '../screens/HomeFamiliar.styles';
import { EmptyState } from '../../../components/ui';
import { useTheme } from '../../../contexts/ThemeContext';
import { FAMILIAR_CATEGORIAS, FILTRO_TODAS } from '../../../constants/atividadeTipos';
import { AtividadeFamiliarCard } from './AtividadeFamiliarCard';
import { AtividadesCategoriaSecao } from './AtividadesCategoriaSecao';

const ABERTAS_INICIAL = FAMILIAR_CATEGORIAS.reduce((acc, categoria) => {
  acc[categoria.tipo] = true;
  return acc;
}, {});

function ChipFiltro({ rotulo, icone, cor, selecionado, onPress, styles, themeColors }) {
  const corAcento = cor ?? themeColors.primary;
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: selecionado }}
      accessibilityLabel={rotulo}
      style={[
        styles.chip,
        selecionado
          ? { backgroundColor: `${corAcento}22`, borderColor: `${corAcento}66` }
          : { backgroundColor: themeColors.background, borderColor: themeColors.border },
      ]}
    >
      {icone ? (
        <MaterialIcons name={icone} size={18} color={selecionado ? corAcento : themeColors.textSecondary} />
      ) : null}
      <Text
        style={[
          styles.chipTexto,
          { color: selecionado ? corAcento : themeColors.textPrimary },
        ]}
      >
        {rotulo}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * Lista as atividades da tabela `atividades`, agrupadas por categoria.
 * Os dados vêm da tela (para o pull-to-refresh viver no ScrollView pai).
 */
export function AtividadesFamiliarList({
  conexao,
  vinculado,
  atividades,
  carregando,
  erro,
  tituloSecao = 'Atividades',
  esconderNomePaciente = false,
  sempreMostrarCategorias = false,
  emptySemVinculo,
  emptySemAtividades,
  onPressAtividade,
}) {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  const [filtro, setFiltro] = useState(FILTRO_TODAS);
  const [abertas, setAbertas] = useState(ABERTAS_INICIAL);
  const temVinculo = vinculado ?? !!conexao;

  const porTipo = useMemo(() => {
    const grupos = FAMILIAR_CATEGORIAS.reduce((acc, categoria) => {
      acc[categoria.tipo] = [];
      return acc;
    }, {});
    for (const atividade of atividades ?? []) {
      if (grupos[atividade.tipo]) grupos[atividade.tipo].push(atividade);
    }
    return grupos;
  }, [atividades]);

  function alternarSecao(tipo) {
    setAbertas((atual) => ({ ...atual, [tipo]: !atual[tipo] }));
  }

  function renderCard(atividade) {
    const card = (
      <AtividadeFamiliarCard
        atividade={atividade}
        styles={styles}
        esconderNomePaciente={esconderNomePaciente}
      />
    );
    if (!onPressAtividade) return <View key={atividade.id}>{card}</View>;
    return (
      <TouchableOpacity
        key={atividade.id}
        onPress={() => onPressAtividade(atividade)}
        accessibilityRole="button"
        accessibilityLabel="Abrir atividade"
        activeOpacity={0.85}
      >
        {card}
      </TouchableOpacity>
    );
  }

  if (carregando) {
    return <ActivityIndicator size="large" color={themeColors.primary} style={styles.carregando} />;
  }

  if (erro) {
    return (
      <EmptyState
        icon="error-outline"
        title="Não foi possível carregar as atividades"
        description="Tente novamente em alguns instantes."
      />
    );
  }

  if (!temVinculo) {
    return (
      <EmptyState
        icon={emptySemVinculo?.icon ?? 'event-busy'}
        title={emptySemVinculo?.title ?? 'Conecte-se a um cuidador'}
        description={
          emptySemVinculo?.description ??
          'As atividades publicadas pelo cuidador aparecerão aqui depois que você se conectar.'
        }
      />
    );
  }

  if (!atividades?.length && !sempreMostrarCategorias) {
    return (
      <EmptyState
        icon={emptySemAtividades?.icon ?? 'inbox'}
        title={emptySemAtividades?.title ?? 'Nenhuma atividade publicada ainda'}
        description={
          emptySemAtividades?.description ??
          `${conexao?.cuidadores?.nome ?? 'O cuidador'} ainda não registrou nada.`
        }
      />
    );
  }

  const categoriaFiltrada = FAMILIAR_CATEGORIAS.find((categoria) => categoria.tipo === filtro);
  const listaFiltrada = categoriaFiltrada ? porTipo[categoriaFiltrada.tipo] ?? [] : [];

  return (
    <View>
      {tituloSecao ? <Text style={styles.secaoTitulo}>{tituloSecao}</Text> : null}
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsLinha}
      >
        <ChipFiltro
          rotulo="Todas"
          icone="apps"
          selecionado={filtro === FILTRO_TODAS}
          onPress={() => setFiltro(FILTRO_TODAS)}
          styles={styles}
          themeColors={themeColors}
        />
        {FAMILIAR_CATEGORIAS.map((categoria) => (
          <ChipFiltro
            key={categoria.tipo}
            rotulo={categoria.rotulo}
            icone={categoria.icone}
            cor={categoria.cor}
            selecionado={filtro === categoria.tipo}
            onPress={() => setFiltro(categoria.tipo)}
            styles={styles}
            themeColors={themeColors}
          />
        ))}
      </ScrollView>

      {filtro === FILTRO_TODAS
        ? FAMILIAR_CATEGORIAS.map((categoria) => {
            const itens = porTipo[categoria.tipo] ?? [];
            return (
              <AtividadesCategoriaSecao
                key={categoria.tipo}
                categoria={categoria}
                quantidade={itens.length}
                expandida={!!abertas[categoria.tipo]}
                onToggle={() => alternarSecao(categoria.tipo)}
                styles={styles}
                themeColors={themeColors}
              >
                {itens.length === 0 ? (
                  <Text style={styles.categoriaVazio}>Nenhum registro nesta categoria.</Text>
                ) : (
                  itens.map(renderCard)
                )}
              </AtividadesCategoriaSecao>
            );
          })
        : listaFiltrada.length === 0
          ? (
            <EmptyState
              icon={categoriaFiltrada?.icone ?? 'inbox'}
              title={`Nenhuma ${categoriaFiltrada?.rotulo?.toLowerCase() ?? 'atividade'}`}
              description={
                sempreMostrarCategorias
                  ? 'Toque na categoria acima para adicionar.'
                  : 'Quando o cuidador registrar algo nesta categoria, aparecerá aqui.'
              }
            />
            )
          : (
            listaFiltrada.map(renderCard)
            )}
    </View>
  );
}

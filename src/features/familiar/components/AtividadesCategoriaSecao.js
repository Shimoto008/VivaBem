import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function AtividadesCategoriaSecao({
  categoria,
  quantidade,
  expandida,
  onToggle,
  children,
  styles,
  themeColors,
}) {
  return (
    <View style={styles.categoriaSecao}>
      <TouchableOpacity
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: expandida }}
        accessibilityLabel={`${categoria.rotulo}, ${quantidade} ${quantidade === 1 ? 'item' : 'itens'}`}
        style={[
          styles.categoriaCabecalho,
          { backgroundColor: `${categoria.cor}18`, borderColor: `${categoria.cor}44` },
        ]}
      >
        <View style={[styles.categoriaIconeWrap, { backgroundColor: `${categoria.cor}22` }]}>
          <MaterialIcons name={categoria.icone} size={22} color={categoria.cor} />
        </View>
        <Text style={[styles.categoriaTitulo, { color: themeColors.textPrimary }]} numberOfLines={1}>
          {categoria.rotulo}
        </Text>
        <View style={[styles.categoriaContagemWrap, { backgroundColor: `${categoria.cor}22` }]}>
          <Text style={[styles.categoriaContagem, { color: categoria.cor }]}>{quantidade}</Text>
        </View>
        <MaterialIcons
          name={expandida ? 'expand-less' : 'expand-more'}
          size={26}
          color={themeColors.textSecondary}
        />
      </TouchableOpacity>
      {expandida ? <View style={styles.categoriaCorpo}>{children}</View> : null}
    </View>
  );
}

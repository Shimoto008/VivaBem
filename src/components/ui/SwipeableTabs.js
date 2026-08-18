import React, { useCallback, useEffect, useRef } from 'react';
import { RefreshControl, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';

/**
 * Permite trocar de aba deslizando o dedo (swipe) para os lados, além de
 * tocar nos ícones da BottomTabBar — as duas formas de navegação ficam
 * sincronizadas pelo mesmo estado `abaAtiva`, controlado por quem usa este
 * componente (ex.: HomeCuidadorScreen, HomeFamiliarScreen).
 *
 * Implementado com um ScrollView horizontal paginado (sem dependências
 * nativas novas) contendo um ScrollView vertical por aba, para que cada
 * aba role de forma independente como antes.
 *
 * `tabs`: [{ key, ... }] na MESMA ORDEM dos `children`.
 * `refreshByTab`: { [tabKey]: { refreshing, onRefresh, tintColor? } }
 */
export function SwipeableTabs({
  tabs,
  abaAtiva,
  onChangeAba,
  children,
  contentContainerStyle,
  refreshByTab,
}) {
  const scrollRef = useRef(null);
  const { width } = useWindowDimensions();
  const paginas = React.Children.toArray(children);
  const indiceAtivo = Math.max(0, tabs.findIndex((tab) => tab.key === abaAtiva));

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: indiceAtivo * width, animated: true });
  }, [indiceAtivo, width]);

  const aoTerminarGesto = useCallback(
    (evento) => {
      const novoIndice = Math.round(evento.nativeEvent.contentOffset.x / width);
      const novaAba = tabs[novoIndice];
      if (novaAba && novaAba.key !== abaAtiva) {
        onChangeAba(novaAba.key);
      }
    },
    [tabs, abaAtiva, onChangeAba, width]
  );

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={aoTerminarGesto}
      style={styles.pager}
    >
      {paginas.map((pagina, indice) => {
        const tabKey = tabs[indice]?.key;
        const refresh = tabKey ? refreshByTab?.[tabKey] : null;
        return (
          <ScrollView
            key={tabKey ?? indice}
            style={{ width }}
            contentContainerStyle={contentContainerStyle}
            showsVerticalScrollIndicator={false}
            refreshControl={
              refresh ? (
                <RefreshControl
                  refreshing={!!refresh.refreshing}
                  onRefresh={refresh.onRefresh}
                  tintColor={refresh.tintColor}
                  colors={refresh.tintColor ? [refresh.tintColor] : undefined}
                />
              ) : undefined
            }
          >
            {pagina}
          </ScrollView>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pager: { flex: 1 },
});

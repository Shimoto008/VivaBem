import React, { useCallback, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';

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
 */
export function SwipeableTabs({ tabs, abaAtiva, onChangeAba, children, contentContainerStyle }) {
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
      {paginas.map((pagina, indice) => (
        <ScrollView
          key={tabs[indice]?.key ?? indice}
          style={{ width }}
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
        >
          {pagina}
        </ScrollView>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pager: { flex: 1 },
});

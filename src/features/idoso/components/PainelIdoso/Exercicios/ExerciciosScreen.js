import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../contexts/ThemeContext';

const CATEGORIAS = ['Todos', 'Alongamento', 'Pernas', 'Braços', 'Cadeira'];

const EXERCICIOS_DATA = [
  {
    id: '1',
    titulo: 'Alongamento Matinal',
    categoria: 'Alongamento',
    duracao: '5 min',
    nivel: 'Leve',
    incentivo: 'Perfeito para acordar o corpo!',
    descricao: 'Movimentos suaves para soltar os braços e o pescoço sem fazer esforço pesado.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: '2',
    titulo: 'Fortalecimento de Pernas',
    categoria: 'Pernas',
    duracao: '8 min',
    nivel: 'Fácil',
    incentivo: 'Ajuda a dar mais firmeza ao andar!',
    descricao: 'Exercícios práticos que podem ser feitos com o apoio de uma cadeira firme.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
];

export default function ExerciciosScreen() {
  const { themeColors, primaryColor } = useTheme();
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');

  const exerciciosFiltrados = categoriaAtiva === 'Todos'
    ? EXERCICIOS_DATA
    : EXERCICIOS_DATA.filter((item) => item.categoria === categoriaAtiva);

  return (
    <View style={[styles.container, { backgroundColor: themeColors?.background || '#F8F9FA' }]}>
      
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <Text style={[styles.tituloHeader, { color: themeColors?.textPrimary || '#1A1D20' }]}>
          Exercícios 🏋️‍♂️
        </Text>
        <Text style={[styles.subtituloHeader, { color: themeColors?.textSecondary || '#6C757D' }]}>
          Escolha um vídeo e comece no seu ritmo.
        </Text>
      </View>

      {/* FILTRO DE CATEGORIAS */}
      <View style={styles.categoriasContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollCategorias}>
          {CATEGORIAS.map((cat) => {
            const selecionado = categoriaAtiva === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.btnCategoria,
                  selecionado && { backgroundColor: primaryColor },
                ]}
                onPress={() => setCategoriaAtiva(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.txtCategoria, selecionado && { color: '#FFFFFF' }]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* LISTA DE VÍDEOS */}
      <FlatList
        data={exerciciosFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaPadding}
        renderItem={({ item }) => (
          <View style={[styles.cardExercicio, { backgroundColor: themeColors?.surface || '#FFFFFF' }]}>
            
            {/* VÍDEO EM DESTAQUE NO TOPO */}
            <Video
              style={styles.videoPlayer}
              source={{ uri: item.videoUrl }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
            />

            {/* TEXTOS E LABELS INTERATIVAS MAIS PARA BAIXO */}
            <View style={styles.infoContainer}>
              
              {/* TITULO */}
              <Text style={styles.tituloExercicio}>{item.titulo}</Text>

              {/* LABELS INTERATIVAS (DURAÇÃO, NÍVEL E CATEGORIA) */}
              <View style={styles.labelsRow}>
                <View style={[styles.labelBadge, { backgroundColor: `${primaryColor}15` }]}>
                  <MaterialIcons name="schedule" size={18} color={primaryColor} />
                  <Text style={[styles.labelTexto, { color: primaryColor }]}>{item.duracao}</Text>
                </View>

                <View style={styles.labelBadgeCinza}>
                  <MaterialIcons name="fitness-center" size={18} color="#495057" />
                  <Text style={styles.labelTextoCinza}>{item.categoria}</Text>
                </View>

                <View style={styles.labelBadgeVerde}>
                  <MaterialIcons name="sentiment-very-satisfied" size={18} color="#2E7D32" />
                  <Text style={styles.labelTextoVerde}>{item.nivel}</Text>
                </View>
              </View>

              {/* MENSAGEM DE INCENTIVO EM DESTAQUE */}
              <View style={styles.cardIncentivo}>
                <MaterialIcons name="thumb-up" size={20} color="#0D6EFD" />
                <Text style={styles.textoIncentivo}>{item.incentivo}</Text>
              </View>

              {/* DESCRIÇÃO MAIS COMPLETA */}
              <Text style={styles.descricaoExercicio}>{item.descricao}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  tituloHeader: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtituloHeader: {
    fontSize: 16,
    marginTop: 4,
  },
  categoriasContainer: {
    marginVertical: 12,
  },
  scrollCategorias: {
    paddingHorizontal: 20,
    gap: 10,
  },
  btnCategoria: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#E9ECEF',
  },
  txtCategoria: {
    fontSize: 16,
    fontWeight: '700',
    color: '#495057',
  },
  listaPadding: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  cardExercicio: {
    borderRadius: 22,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  videoPlayer: {
    width: '100%',
    height: 220,
    backgroundColor: '#000000',
  },
  infoContainer: {
    padding: 20,
  },
  tituloExercicio: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1D20',
    marginBottom: 12,
  },

  /* ESTILOS DAS LABELS INTERATIVAS */
  labelsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  labelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  labelTexto: {
    fontSize: 15,
    fontWeight: '700',
  },
  labelBadgeCinza: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F3F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  labelTextoCinza: {
    fontSize: 15,
    fontWeight: '700',
    color: '#495057',
  },
  labelBadgeVerde: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  labelTextoVerde: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2E7D32',
  },

  /* BOX DE INCENTIVO */
  cardIncentivo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E7F1FF',
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  textoIncentivo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D6EFD',
    flex: 1,
  },
  descricaoExercicio: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6C757D',
  },
});
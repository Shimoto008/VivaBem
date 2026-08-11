import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../../contexts/ThemeContext';
import { getStyles } from '../Exercicios/Exerecicios.Styles';

// CATEGORIAS
const CATEGORIAS = ['Todos', 'Alongamento', 'Pernas', 'Braços', 'Dança'];

const EXERCICIOS_DATA = [
  // --- ALONGAMENTO ---
  {
    id: 'along-1',
    titulo: 'Alongamento Matinal Suave',
    categoria: 'Alongamento',
    duracao: '5 min',
    nivel: 'Fácil',
    incentivo: 'Ótimo para despertar o corpo ao acordar!',
    descricao: 'Movimentos suaves para soltar os braços, pescoço e coluna sem nenhum esforço pesado.',
    youtubeId: 'F1iejoRbRts',
  },
  {
    id: 'along-2',
    titulo: 'Alongamento para Costas e Pescoço',
    categoria: 'Alongamento',
    duracao: '7 min',
    nivel: 'Leve',
    incentivo: 'Alivia dores e tensões do dia a dia!',
    descricao: 'Exercícios focados em destravar a região dos ombros e cervical de forma relaxante.',
    youtubeId: '9zNY-Z-VIH0',
  },
  {
    id: 'along-3',
    titulo: 'Relaxamento de Corpo Inteiro',
    categoria: 'Alongamento',
    duracao: '10 min',
    nivel: 'Leve',
    incentivo: 'Ideal para fazer antes de dormir!',
    descricao: 'Posturas bem tranquilas para respirar fundo e relaxar a musculatura.',
    youtubeId: 'We44qc_6Gj4',
  },

  // --- PERNAS ---
  {
    id: 'pernas-1',
    titulo: 'Fortalecimento de Pernas',
    categoria: 'Pernas',
    duracao: '8 min',
    nivel: 'Fácil',
    incentivo: 'Ajuda a dar mais firmeza e equilíbrio ao andar!',
    descricao: 'Exercícios práticos usando o apoio de uma cadeira firme para garantir a sua segurança.',
    youtubeId: 'dfE5IVudz24',
  },
  {
    id: 'pernas-2',
    titulo: 'Exercícios para Joelhos e Coxas',
    categoria: 'Pernas',
    duracao: '6 min',
    nivel: 'Leve',
    incentivo: 'Fortalece as articulações com segurança!',
    descricao: 'Movimentos leves de elevação de pernas para manter as articulações saudáveis.',
    youtubeId: 'sbIXSdAUUGM',
  },
  {
    id: 'pernas-3',
    titulo: 'Circulação e Tornozelos',
    categoria: 'Pernas',
    duracao: '5 min',
    nivel: 'Fácil',
    incentivo: 'Excelente para diminuir o inchaço dos pés!',
    descricao: 'Movimentos circulares com os pés e pontas dos pés para ativar a circulação sanguínea.',
    youtubeId: 'Cc5Z1Fun5nc',
  },

  // --- BRAÇOS ---
  {
    id: 'bracos-1',
    titulo: 'Fortalecimento de Braços e Ombros',
    categoria: 'Braços',
    duracao: '6 min',
    nivel: 'Fácil',
    incentivo: 'Garante mais autonomia nas tarefas de casa!',
    descricao: 'Exercícios sem peso para melhorar a mobilidade dos ombros e a força das mãos.',
    youtubeId: '-EvsDX_8afI',
  },
  {
    id: 'bracos-2',
    titulo: 'Mobilidade de Mãos e Punhos',
    categoria: 'Braços',
    duracao: '4 min',
    nivel: 'Leve',
    incentivo: 'Facilita segurar objetos e copos no dia a dia!',
    descricao: 'Abre e fecha de dedos, rotação de punhos para manter a agilidade das articulações.',
    youtubeId: 'EDjVfL4SU-E',
  },
  {
    id: 'bracos-3',
    titulo: 'Postura e Postura Escapular',
    categoria: 'Braços',
    duracao: '7 min',
    nivel: 'Leve',
    incentivo: 'Mantenha as costas eretas com conforto!',
    descricao: 'Movimentos com a parte superior do tronco para evitar a curvatura das costas.',
    youtubeId: 'RNw0Mr2Z0gw',
  },

  // --- DANÇA ---
  {
    id: 'danca-1',
    titulo: 'Dança para Exercitar o Corpo',
    categoria: 'Dança',
    duracao: '10 min',
    nivel: 'Fácil',
    incentivo: 'Movimente todo o corpo com música e alegria!',
    descricao: 'Passos bem tranquilos e ritmo leve para trabalhar o corpo todo de forma divertida.',
    youtubeId: 'LorT81Ufwbo',
  },
  {
    id: 'danca-2',
    titulo: 'Cardio Dançante Sentado',
    categoria: 'Dança',
    duracao: '8 min',
    nivel: 'Fácil',
    incentivo: 'Ativa o coração e a disposição de forma segura!',
    descricao: 'Marcha ritmada e movimentos de braços 100% sentados na cadeira para aquecer o corpo.',
    youtubeId: '-rYZ1Vtybb8',
  },
  {
    id: 'danca-3',
    titulo: 'Coordenação e Ritmo Motora',
    categoria: 'Dança',
    duracao: '6 min',
    nivel: 'Leve',
    incentivo: 'Exercite o corpo e a mente ao mesmo tempo!',
    descricao: 'Sequências simples acompanhando a música, alternando braços e pernas.',
    youtubeId: 'MJ7cobB7CwM',
  },
];

export default function ExerciciosScreen() {
  const { themeColors, primaryColor } = useTheme();
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  
  const styles = getStyles(themeColors, primaryColor);

  const exerciciosFiltrados = categoriaAtiva === 'Todos'
    ? EXERCICIOS_DATA
    : EXERCICIOS_DATA.filter((item) => item.categoria === categoriaAtiva);

  return (
    <View style={[styles.container, { backgroundColor: themeColors?.background || '#F8F9FA' }]}>
      
      {/* CABEÇALHO MOTIVACIONAL PROFISSIONAL */}
      <View style={styles.header}>
        <View style={styles.tagMotivacional}>
          <MaterialIcons name="local-fire-department" size={16} color="#4169E1" />
          <Text style={styles.textoTagMotivacional}>Sua saúde em 1º lugar</Text>
        </View>
        
        <View style={styles.headerTituloRow}>
          <Text style={[styles.tituloHeader, { color: themeColors?.textPrimary || '#1A1D20' }]}>
            Mova-se no seu ritmo
          </Text>
          <MaterialIcons name="favorite" size={26} color="#4169E1" />
        </View>

        <Text style={[styles.subtituloHeader, { color: themeColors?.textSecondary || '#6C757D' }]}>
          Assista aos vídeos explicativos e faça os exercícios no conforto da sua casa.
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
                  selecionado && { backgroundColor: primaryColor || '#4169E1' },
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
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.cardExercicio, { backgroundColor: themeColors?.surface || '#FFFFFF' }]}>
            
            {/* PLAYER DE VÍDEO DO YOUTUBE (Altura ajustada para eliminar bordas pretas) */}
            <View style={styles.videoWrapper}>
              <YoutubePlayer
                height={190}
                play={false}
                videoId={item.youtubeId}
              />
            </View>

            {/* INFORMAÇÕES E LABELS ABAIXO DO VÍDEO */}
            <View style={styles.infoContainer}>
              
              {/* TÍTULO DO EXERCÍCIO */}
              <Text style={styles.tituloExercicio}>{item.titulo}</Text>

              {/* LABELS INTERATIVAS */}
              <View style={styles.labelsRow}>
                <View style={styles.labelBadge}>
                  <MaterialIcons name="schedule" size={18} color={primaryColor || '#4169E1'} />
                  <Text style={styles.labelTexto}>{item.duracao}</Text>
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

              {/* BOX DE INCENTIVO COM BORDA DE DESTAQUE */}
              <View style={styles.cardIncentivo}>
                <MaterialIcons name="thumb-up" size={20} color="#4169E1" />
                <Text style={styles.textoIncentivo}>{item.incentivo}</Text>
              </View>

              {/* DESCRIÇÃO COMPLETA */}
              <Text style={styles.descricaoExercicio}>{item.descricao}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
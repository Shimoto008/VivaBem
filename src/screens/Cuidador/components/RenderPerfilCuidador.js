import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import styles from "../HomeCuidador/Style"; // Aponta para o seu arquivo de estilos principal

export function RenderPerfilCuidador() {
  return (
    <View style={styles.containerAbas}>
      <View style={styles.headerPerfil}>
        <View style={styles.avatarEsquerda}>
          <FontAwesome5 name="user-md" size={42} color="#4169E1" />
        </View>
        <View style={styles.infoDireitaPerfil}>
          <Text style={styles.nomeCuidador}>Carlos Alberto Silva</Text>
          <Text style={styles.subtituloCuidador}>Cuidador de Idosos Particular</Text>
          <TouchableOpacity style={styles.btnEditarPerfil} onPress={() => Alert.alert('Aviso', 'Edição de perfil será implementada em breve!')}>
            <MaterialIcons name="edit" size={14} color="#FFF" />
            <Text style={styles.txtBtnEditarPerfil}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardSecaoPerfil}>
        <View style={styles.tituloSecaoPerfilContainer}>
          <MaterialIcons name="description" size={20} color="#4169E1" />
          <Text style={styles.tituloSecaoPerfil}>Biografia & Filosofia de Trabalho</Text>
        </View>
        <Text style={styles.conteudoTextoPerfil}>
          Profissional dedicado ao bem-estar e saúde na terceira idade com mais de 5 anos de experiência.
        </Text>
      </View>

      <View style={styles.cardSecaoPerfil}>
        <View style={styles.tituloSecaoPerfilContainer}>
          <MaterialIcons name="work" size={20} color="#4169E1" />
          <Text style={styles.tituloSecaoPerfil}>Experiências Profissionais</Text>
        </View>
        <View style={styles.itemExperiencia}>
          <Text style={styles.cargoExperiencia}>Cuidador Home Care - Lar Doce Lar</Text>
          <Text style={styles.periodoExperiencia}>Jan 2023 - Presente (3 anos)</Text>
        </View>
      </View>
    </View>
  );
}
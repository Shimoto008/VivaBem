import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, Image } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import styles from "../HomeCuidador/Style"; // Seu arquivo de estilos

export function RenderPerfilCuidador() {
  // Estados para controlar o modo de edição e os dados do cuidador
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState('Carlos Alberto Silva');
  const [subtitulo, setSubtitulo] = useState('Cuidador de Idosos Particular');
  const [biografia, setBiografia] = useState('Profissional dedicado ao bem-estar e saúde na terceira idade com mais de 5 anos de experiência.');
  const [experiencia, setExperiencia] = useState('Cuidador Home Care - Lar Doce Lar (Jan 2023 - Presente)');
  const [foto, setFoto] = useState(null); // Armazena o URI da foto escolhida

  // Função para pedir permissão e abrir a galeria
  const selecionarFoto = async () => {
    // 1. Pede permissão para acessar a galeria
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos para você mudar a foto de perfil.');
      return;
    }

    // 2. Abre a galeria se a permissão foi aceita
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Permite cortar a imagem em quadrado
      aspect: [1, 1], // Força um corte 1:1 (quadrado perfeito para avatar)
      quality: 1,
    });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };

  // Função para salvar as alterações
  const salvarAlteracoes = () => {
    setIsEditing(false);
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    // Aqui no futuro você pode enviar esses estados (nome, subtitulo, biografia, foto...) para o seu banco de dados!
  };

  return (
    <View style={styles.containerAbas}>
      {/* HEADER DO PERFIL */}
      <View style={styles.headerPerfil}>
        <TouchableOpacity 
          style={styles.avatarEsquerda} 
          onPress={selecionarFoto}
          activeOpacity={0.7}
        >
          {foto ? (
            <Image source={{ uri: foto }} style={{ width: 80, height: 80, borderRadius: 40 }} />
          ) : (
            <FontAwesome5 name="user-md" size={42} color="#4169E1" />
          )}
          {/* Um pequeno ícone indicando que a foto é clicável para trocar */}
          <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#4169E1', borderRadius: 10, padding: 2 }}>
            <MaterialIcons name="photo-camera" size={12} color="#FFF" />
          </View>
        </TouchableOpacity>

        <View style={styles.infoDireitaPerfil}>
          {isEditing ? (
            <>
              <TextInput 
                style={[styles.nomeCuidador, { borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 2 }]}
                value={nome}
                onChangeText={setNome}
                placeholder="Nome"
              />
              <TextInput 
                style={[styles.subtituloCuidador, { borderBottomWidth: 1, borderColor: '#ccc', marginTop: 5 }]}
                value={subtitulo}
                onChangeText={setSubtitulo}
                placeholder="Profissão/Subtítulo"
              />
            </>
          ) : (
            <>
              <Text style={styles.nomeCuidador}>{nome}</Text>
              <Text style={styles.subtituloCuidador}>{subtitulo}</Text>
            </>
          )}

          {/* Botão Alternável (Editar / Salvar) */}
          <TouchableOpacity 
            style={[styles.btnEditarPerfil, { backgroundColor: isEditing ? '#228B22' : '#4169E1', marginTop: 10 }]} 
            onPress={isEditing ? salvarAlteracoes : () => setIsEditing(true)}
          >
            <MaterialIcons name={isEditing ? "save" : "edit"} size={14} color="#FFF" />
            <Text style={styles.txtBtnEditarPerfil}>
              {isEditing ? ' Salvar Perfil' : ' Editar Perfil'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SEÇÃO: BIOGRAFIA */}
      <View style={styles.cardSecaoPerfil}>
        <View style={styles.tituloSecaoPerfilContainer}>
          <MaterialIcons name="description" size={20} color="#4169E1" />
          <Text style={styles.tituloSecaoPerfil}>Biografia & Filosofia de Trabalho</Text>
        </View>
        {isEditing ? (
          <TextInput
            style={[styles.conteudoTextoPerfil, { borderBottomWidth: 1, borderColor: '#ccc' }]}
            value={biografia}
            onChangeText={setBiografia}
            multiline
          />
        ) : (
          <Text style={styles.conteudoTextoPerfil}>{biografia}</Text>
        )}
      </View>

      {/* SEÇÃO: EXPERIÊNCIAS */}
      <View style={styles.cardSecaoPerfil}>
        <View style={styles.tituloSecaoPerfilContainer}>
          <MaterialIcons name="work" size={20} color="#4169E1" />
          <Text style={styles.tituloSecaoPerfil}>Experiências Profissionais</Text>
        </View>
        <View style={styles.itemExperiencia}>
          {isEditing ? (
            <TextInput
              style={[styles.cargoExperiencia, { borderBottomWidth: 1, borderColor: '#ccc' }]}
              value={experiencia}
              onChangeText={setExperiencia}
              multiline
            />
          ) : (
            <Text style={styles.cargoExperiencia}>{experiencia}</Text>
          )}
        </View>
      </View>
    </View>
  );
}
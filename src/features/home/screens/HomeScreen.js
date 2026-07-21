import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from './Home.styles';
import { PERFIL_OPTIONS } from './perfilOptions';
import { Card } from '../../components/ui';

const FAMILIAS_DE_ICONE = { MaterialIcons, FontAwesome5 };

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Image style={styles.img} source={require('../../../assets/VivaBem.png')} />
      <Text style={styles.titulo}>Área de Login</Text>
      <Text style={styles.subtitulo}>Auxiliar cuidadores de idoso</Text>
      <Text style={styles.selecionar}>Selecione seu perfil</Text>

      <View style={styles.lista}>
        {PERFIL_OPTIONS.map((opcao) => {
          const IconeComponente = FAMILIAS_DE_ICONE[opcao.iconFamily];
          return (
            <TouchableOpacity
              key={opcao.key}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(opcao.route)}
              accessibilityRole="button"
              accessibilityLabel={`Selecionar perfil ${opcao.title}`}
            >
              <Card style={styles.cardPerfil}>
                <View style={styles.iconContainer}>
                  <IconeComponente name={opcao.icon} size={26} color={opcao.iconColor} />
                </View>
                <View style={styles.textoContainer}>
                  <Text style={styles.escolha}>{opcao.title}</Text>
                  <Text style={styles.desc}>{opcao.description}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={opcao.iconColor} />
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

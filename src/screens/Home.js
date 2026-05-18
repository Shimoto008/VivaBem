import { StatusBar } from "expo-status-bar";
import {StyleSheet, Text, View, TouchableOpacity, Image} from "react-native";
import styles from "../styles/HomeStyle"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
    <Image style={styles.img}
  source={require('../../assets/VivaBem.png')}
    /> 

      <Text style={styles.titulo}>ÁREA DE LOGIN</Text>
      <Text style={styles.app}>Auxiliar cuidadores de idoso</Text>

      <Text style={styles.selecionar}>Selecione seu perfil </Text>

      <TouchableOpacity style={styles.botaoC} onPress={() => navigation.navigate('Cuidador')}>
        <MaterialIcons name="health-and-safety" size={30} color="#ecdd0afb" />
        <Text style={styles.escolha}>Cuidador</Text>
        <Text style={styles.desc}>
          Gerenciar e cuidar na rotina dos idosos e suas atividades diarias
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoF} onPress={() => navigation.navigate('Familiar')}>
        <MaterialIcons name="family-restroom" size={30} color="#12d60bfb" />
        <Text style={styles.escolha}>Familiar</Text>
        <Text style={styles.desc}>
          Acompanhar o perfil do idoso e ajudar na descrição
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoI} onPress={() => navigation.navigate('Idoso')}>
        <FontAwesome5 name="heartbeat" size={30} color="#0b63d6fb" />
        <Text style={styles.escolha}>Idoso</Text>
        <Text style={styles.desc}>Jogos, alertas e atividades</Text>
      </TouchableOpacity>


      <StatusBar style="auto" />
    </View>
  );
}


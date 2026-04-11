import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from "react-native";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function Cuidador() {
  return (
    <View style={styles.container}>
    <Image style={styles.img}
  source={require('../assets/VivaBem.png')}
    /> 

      <Text style={styles.titulo}>ÁREA DE CADASTRO</Text>
      

      <Text style={styles.login}>Cuidar do seu idoso hoje é cuidar de você amanhã</Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  titulo: {
    color: "#3f3f3f",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  app: {
    color: "#3f3f3f",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },

  selecionar: {
    color: "#3f3f3f",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 15,
  },

  fixToButton: {
    flexDirection: "column",
    marginBottom: 20,
  },

  botaoC: {
    flexDirection: "column",
    alignItems: "left",
    backgroundColor: "#fffcfc",
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
    marginLeft: 10,
    width: "90%",
    boxShadow: "5px px px 0px #ecdd0afb",
  },

  botaoF: {
    flexDirection: "column",
    alignItems: "left",
    backgroundColor: "#fffcfc",
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
    marginLeft: 10,
    width: "90%",
    boxShadow: "5px px px 0px #12d60bfb",
  },

  botaoI: {
    flexDirection: "column",
    alignItems: "left",
    backgroundColor: "#fffcfc",
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
    marginLeft: 10,
    width: "90%",
    boxShadow: "5px px px 0px #0b63d6fb",
  },

  escolha: {
    color: "#000000",
    fontSize: 17,
    fontWeight: "bold",
  },

  desc: {
    color: "#585858",
    fontSize: 14,
  },

  login: {
    textAlign: "center",
    color: "#3f3f3f",
    fontSize: 14,
    marginBottom: 10,
    marginTop: 14,
  },

  link: {
    color: "#0000FF",
    textAlign: "center",
    fontSize: 14,
  },

  icon:{
    fontSize: 40,
    alignSelf: 'center',
  },

  img: {
    width: 150,
    height: 100,
    alignSelf: 'center'
  },
});
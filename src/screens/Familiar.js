import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput
} from "react-native";
import styles from "../styles/FamiliarStyle";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useState } from "react";

export default function Familiar() {
  
  const [name, setName] = useState(''); 
  const [cpf, setCPF] = useState('');
  const [fone, setFone] = useState('');

  return (
    <View style={styles.container}>
    <Image style={styles.img}
  source={require('../../assets/VivaBem.png')}
    /> 
      <Text style={styles.titulo}>ÁREA DE CADASTRO</Text>
      
    <Text style = {styles.txt}>
      Nome Completo
    </Text>

      <TextInput style = {styles.input}
        placeholder="Digite seu nome completo"
        onChangeText={setName} value={name}
      />
       
       
    <Text style = {styles.txt}>
      CPF
    </Text>
    <TextInput style = {styles.input}
        onChangeText={setCPF} value={cpf}
        placeholder="000.000.000-00"
        keyboardType="numeric"
      />
    

    
    <Text style = {styles.txt}>
      Telefone
    </Text>
    <TextInput style = {styles.input}
        onChangeText={setFone} value={fone}
        placeholder="(11) 00000-0000"
        keyboardType="numeric"
      />

      <TouchableOpacity></TouchableOpacity>
  
      <StatusBar style="auto" />
    </View>
  );
}


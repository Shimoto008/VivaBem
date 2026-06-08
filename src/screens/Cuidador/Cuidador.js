import { StatusBar } from "expo-status-bar";
import { 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  Alert, 
  KeyboardAvoidingView, 
  ScrollView, 
  TouchableWithoutFeedback, 
  Keyboard, 
  Platform 
} from "react-native";
import styles from "../Cuidador/CuidadorStyle";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { supabase } from "../../services/supabase";

export default function Cuidador() {

  
    const [name, setName] = useState('');
    const [fone, setFone] = useState('');
    const [cpf, setCPF] = useState('');
    const [especialidade, setEspecialidade] = useState('');
  
    const testarConexao = async () => {
  const { data, error } = await supabase
    .from('cuidadores')
    .select('*');

  console.log('DATA:', data);
  console.log('ERROR:', error);
};

 const salvarCuidador = async () => {
    const { data, error } = await supabase
      .from('cuidadores')
      .insert([
        {
          nome: name,
          cpf: cpf,
          telefone: fone,
          especialidade: especialidade
        }
      ]);

    console.log('DATA:', data);
    console.log('ERROR:', error);

    if (!error) {
      Alert.alert('Sucesso', 'Cuidador cadastrado!');

      setName('');
      setCPF('');
      setFone('');
      setEspecialidade('');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior="padding" // Força o preenchimento sutil em ambas as plataformas sem deformar os elementos
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.container} 
          bounces={true} // Permite o efeito elástico profissional ao scrollar
          showsVerticalScrollIndicator={true} // Deixa a barra visível para o usuário saber que a página pode rolar
          keyboardShouldPersistTaps="handled" // Permite clicar em botões mesmo com o teclado aberto sem travar a rolagem
        >
          <Image 
            style={styles.img}
            source={require('../../../assets/VivaBem.png')}
          /> 
          
          <Text style={styles.titulo}>ÁREA DE CADASTRO</Text>
          
          <Text style={styles.txt}>
            Nome Completo
          </Text>
          <TextInput 
            style={styles.input}
            placeholder="Digite seu nome completo"
            onChangeText={setName} 
            value={name}
          />
           
          <Text style={styles.txt}>
            CPF
          </Text>
          <TextInput 
            style={styles.input}
            onChangeText={setCPF} 
            value={cpf}
            placeholder="000.000.000-00"
            keyboardType="numeric"
          />
        
          <Text style={styles.txt}>
            Telefone
          </Text>
          <TextInput 
            style={styles.input}
            onChangeText={setFone} 
            value={fone}
            placeholder="(11) 00000-0000"
            keyboardType="numeric"
          />

          <Text style={styles.txt}>
            Digite sua especialidade
          </Text>
          <TextInput 
            style={styles.input}
            onChangeText={setEspecialidade} 
            value={especialidade}
            placeholder="Especialidade"
          />

          {/* Botão de cadastro normal (que envia pro banco) */}
<TouchableOpacity style={styles.cadastro} onPress={salvarCuidador}>
  <Text style={styles.txt_cad}>CADASTRAR</Text>
</TouchableOpacity>

{/* BOTÃO TEMPORÁRIO: Navega direto sem passar pelo banco */}
<TouchableOpacity 
  style={[styles.cadastro, { backgroundColor: '#333', marginTop: 10 }]} 
  onPress={() => navigation.navigate('home_Cuidador', { nomeUsuario: 'Cuidador Teste' })}
>
  <Text style={styles.txt_cad}>TESTAR HOME (SEM BANCO)</Text>
</TouchableOpacity>
      
          <StatusBar style="auto" />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
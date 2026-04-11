import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>ÁREA DE LOGIN</Text>
        <Text style={styles.app}>Auxiliar cuidadores de idoso</Text>

        <Text style={styles.selecionar}>Selecione seu peril </Text>
      
        <TouchableOpacity style={styles.botaoC}>
          <Text style={styles.escolha}>Cuidador</Text>
          <Text style={styles.desc}>Gerenciar e cuidar na rotina dos idosos e suas atividades diarias</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoF}>
          <Text style={styles.escolha}>Familiar</Text>
          <Text style={styles.desc}>Acompanhar o perfil do idoso e ajudar na descrição</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoI}>
          <Text style={styles.escolha}>idoso</Text>
          <Text style={styles.desc}>Jogos, alertas e atividades</Text>
        </TouchableOpacity>


        <Text style={styles.login}>Já tem uma conta?</Text>
        <Text style={styles.link}>Fazer Login</Text>

      
      
      
      <StatusBar style="auto" />


      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center'
    
  },
  titulo:{
    color: '#3f3f3f',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  app:{
    color: '#3f3f3f',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },

   selecionar:{
    color: '#3f3f3f',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 40,
    marginLeft: 20,
    marginBottom: 15,
  },

  fixToButton:{
    flexDirection: 'column',
    marginBottom: 20,
  },

  botaoC: {
    flexDirection: 'column', 
    alignItems: 'left',
    backgroundColor: '#fffcfc',
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
    marginLeft: 10,
    width: '90%',
    boxShadow: '5px px px 0px #ecdd0afb', 
  },

  botaoF: {
    flexDirection: 'column', 
    alignItems: 'left',
    backgroundColor: '#fffcfc',
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
    marginLeft: 10,
    width: '90%',
    boxShadow: '5px px px 0px #12d60bfb', 
  },

  botaoI: {
    flexDirection: 'column', 
    alignItems: 'left',
    backgroundColor: '#fffcfc',
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
    marginLeft: 10,
    width: '90%',
    boxShadow: '5px px px 0px #0b63d6fb', 
  },

  escolha:{
    color: '#000000',
    fontSize: 17,
    fontWeight: 'bold',
  },

  desc:{
    color: '#585858',
    fontSize: 14,
  },

  login:{
    textAlign: 'center',
    color: '#3f3f3f',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 14,
  },

  link:{
    color: '#0000FF',
    textAlign: 'center',
    fontSize: 14,
  },
});

import { StatusBar } from "expo-status-bar";
import { 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  Alert, 
  TouchableWithoutFeedback, 
  Keyboard, 
  Platform,
  Modal,
  FlatList
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from "../Cuidador/CuidadorStyle";
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { supabase } from "../../services/supabase";

function validarCPF(rawCpf) {
  const cpf = rawCpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  let cpfs = cpf.split('').map(el => +el);
  const rest = (count) => (cpfs.slice(0, count-12).reduce((soma, el, i) => soma + el * (count - i), 0) * 10) % 11 % 10;
  return rest(10) === cpfs[9] && rest(11) === cpfs[10];
}

const LISTA_ESPECIALIDADES = [
  "Cuidador de Idosos Particular",
  "Técnico em Enfermagem",
  "Enfermeiro(a)",
  "Fisioterapeuta",
  "Nutricionista",
  "Terapeuta Ocupacional",
  "Médico(a) Geriatra",
  "Acompanhante Hospitalar",
  "Outros"
];

export default function Cuidador() {
  const navigation = useNavigation();
  
  const [name, setName] = useState('');
  const [fone, setFone] = useState('');
  const [cpf, setCPF] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [outraEspecialidade, setOutraEspecialidade] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [erros, setErros] = useState({});

  const lidarComCPF = (texto) => {
    let num = texto.replace(/\D/g, "");
    if (num.length > 11) num = num.slice(0, 11);
    
    if (num.length > 9) {
      num = num.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
    } else if (num.length > 6) {
      num = num.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");
    } else if (num.length > 3) {
      num = num.replace(/^(\d{3})(\d{1,3})$/, "$1.$2");
    }
    setCPF(num);
    setErros(prev => ({ ...prev, cpf: null }));
  };

  const lidarComTelefone = (texto) => {
    let num = texto.replace(/\D/g, "");
    if (num.length > 11) num = num.slice(0, 11);

    if (num.length > 6) {
      num = num.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (num.length > 2) {
      num = num.replace(/^(\d{2})(\d{1,5})$/, "($1) $2");
    } else if (num.length > 0) {
      num = num.replace(/^(\d{1,2})$/, "($1");
    }
    setFone(num);
    setErros(prev => ({ ...prev, fone: null }));
  };

  const lidarComNome = (texto) => {
    setName(texto);
    setErros(prev => ({ ...prev, name: null }));
  };

  const validarFormulario = () => {
    let errosAtuais = {};
    const nomeLimpo = name.trim();

    // Validação do Nome simplificada a seu pedido
    if (!nomeLimpo) {
      errosAtuais.name = "Campo obrigatório";
    } else if (nomeLimpo.length < 3) {
      errosAtuais.name = "O nome está muito curto";
    }

    const cpfLimpo = cpf.replace(/\D/g, "");
    if (!cpfLimpo) {
      errosAtuais.cpf = "Campo obrigatório";
    } else if (cpfLimpo.length !== 11) {
      errosAtuais.cpf = "O CPF deve ter 11 dígitos";
    } else if (!validarCPF(cpfLimpo)) {
      errosAtuais.cpf = "CPF inválido. Digite um CPF verdadeiro";
    }

    const foneLimpo = fone.replace(/\D/g, "");
    if (!foneLimpo) {
      errosAtuais.fone = "Campo obrigatório";
    } else if (foneLimpo.length < 10 || foneLimpo.length > 11) {
      errosAtuais.fone = "Telefone inválido (deve conter DDD + número)";
    }

    if (!especialidade) {
      errosAtuais.especialidade = "Campo obrigatório";
    } else if (especialidade === "Outros" && !outraEspecialidade.trim()) {
      errosAtuais.especialidade = "Por favor, digite sua especialidade";
    }

    setErros(errosAtuais);
    return Object.keys(errosAtuais).length === 0;
  };

  const salvarCuidador = async () => {
    if (!validarFormulario()) {
      Alert.alert('Erro no formulário', 'Por favor, corrija os erros indicados na tela.');
      return;
    }

    const especialidadeFinal = especialidade === "Outros" ? outraEspecialidade.trim() : especialidade;

    const { data, error } = await supabase
      .from('cuidadores')
      .insert([
        {
          nome: name.trim(),
          cpf: cpf.replace(/\D/g, ""), 
          telefone: fone.replace(/\D/g, ""),
          especialidade: especialidadeFinal
        }
      ]);

    if (error) {
      Alert.alert('Erro', error.message);
      console.log(error);
      return;
    }

    Alert.alert('Sucesso', 'Cuidador cadastrado!');

    setName('');
    setCPF('');
    setFone('');
    setEspecialidade('');
    setOutraEspecialidade('');

    navigation.navigate('home_Cuidador', {
      nomeUsuario: name
    });
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      contentContainerStyle={{ flexGrow: 1, backgroundColor: '#ffffff' }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
      enableOnAndroid={true}
      extraScrollHeight={100} 
      keyboardShouldPersistTaps="handled"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: "#ffffff", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40, alignItems: 'center' }}>
          
          <Image 
            style={styles.img}
            source={require('../../../assets/VivaBem.png')}
          /> 
          
          <Text style={styles.titulo}>ÁREA DE CADASTRO</Text>
          
          {/* Nome Completo */}
          <Text style={styles.txt}>Nome Completo</Text>
          <TextInput 
            style={[styles.input, erros.name && styles.inputErro]}
            placeholder="Digite seu nome completo"
            onChangeText={lidarComNome} 
            value={name}
          />
          {erros.name && <Text style={styles.txtErro}>{erros.name}</Text>}
            
          {/* CPF */}
          <Text style={styles.txt}>CPF</Text>
          <TextInput 
            style={[styles.input, erros.cpf && styles.inputErro]}
            onChangeText={lidarComCPF} 
            value={cpf}
            placeholder="000.000.000-00"
            keyboardType="numeric"
            maxLength={14}
          />
          {erros.cpf && <Text style={styles.txtErro}>{erros.cpf}</Text>}
        
          {/* Telefone */}
          <Text style={styles.txt}>Telefone</Text>
          <TextInput 
            style={[styles.input, erros.fone && styles.inputErro]}
            onChangeText={lidarComTelefone} 
            value={fone}
            placeholder="(11) 00000-0000"
            keyboardType="numeric"
            maxLength={15}
          />
          {erros.fone && <Text style={styles.txtErro}>{erros.fone}</Text>}

          {/* Selecionar Especialidade Dinâmica */}
          <Text style={styles.txt}>Digite sua especialidade</Text>
          
          {especialidade !== "Outros" ? (
            <TouchableOpacity 
              style={[styles.inputSeletor, erros.especialidade && styles.inputErro]} 
              onPress={() => setMostrarModal(true)}
            >
              <Text style={especialidade ? styles.txtSeletorAtivo : styles.txtSeletorPlaceholder}>
                {especialidade || "Selecione uma opção..."}
              </Text>
            </TouchableOpacity>
          ) : (
            <TextInput 
              style={[styles.input, erros.especialidade && styles.inputErro]}
              onChangeText={(text) => {
                setOutraEspecialidade(text);
                setErros(prev => ({ ...prev, especialidade: null }));
              }}
              value={outraEspecialidade}
              placeholder="Escreva sua especialidade aqui..."
              autoFocus={true}
                />
          )}
          {erros.especialidade && <Text style={styles.txtErro}>{erros.especialidade}</Text>}

          {/* Botão de cadastro */}
          <TouchableOpacity style={styles.cadastro} onPress={salvarCuidador}>
            <Text style={styles.txt_cad}>CADASTRAR</Text>
          </TouchableOpacity>

        </View>
      </TouchableWithoutFeedback>
    
      <StatusBar style="auto" />

      {/* Modal de Opções */}
      <Modal visible={mostrarModal} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setMostrarModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalConteudo}>
              <Text style={styles.modalTitulo}>Selecione a Especialidade</Text>
              <FlatList
                data={LISTA_ESPECIALIDADES}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.modalOpcao} 
                    onPress={() => {
                      setEspecialidade(item);
                      setMostrarModal(false);
                      setErros(prev => ({ ...prev, especialidade: null }));
                    }}
                  >
                    <Text style={styles.modalOpcaoTxt}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAwareScrollView>
  );
}
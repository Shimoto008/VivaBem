import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { styles } from './Idoso.styles';
import { useIdosoCadastro } from '../../hooks/useIdosoCadastro';

/**
 * Visual 100% preservado por instrução explícita (mesma estrutura, mesmos
 * estilos, mesmo texto). A única mudança de tela é interna: antes o botão
 * "CADASTRAR" não tinha onPress (bug real, identificado na Fase 1) — agora
 * chama useIdosoCadastro, que valida e persiste o cadastro.
 */
export default function IdosoScreen() {
  const { nome, cpf, telefone, erros, enviando, alterarNome, alterarCpf, alterarTelefone, salvar } = useIdosoCadastro();

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require('../../../assets/VivaBem.png')} />
      <Text style={styles.titulo}>ÁREA DE CADASTRO</Text>

      <Text style={styles.txt}>Nome Completo</Text>
      <TextInput style={styles.input} placeholder="Digite seu nome completo" onChangeText={alterarNome} value={nome} />
      {erros.nome ? <Text style={styles.erro}>{erros.nome}</Text> : null}

      <Text style={styles.txt}>CPF</Text>
      <TextInput style={styles.input} onChangeText={alterarCpf} value={cpf} placeholder="000.000.000-00" keyboardType="numeric" maxLength={14} />
      {erros.cpf ? <Text style={styles.erro}>{erros.cpf}</Text> : null}

      <Text style={styles.txt}>Telefone</Text>
      <TextInput style={styles.input} onChangeText={alterarTelefone} value={telefone} placeholder="(11) 00000-0000" keyboardType="numeric" maxLength={15} />
      {erros.telefone ? <Text style={styles.erro}>{erros.telefone}</Text> : null}

      <TouchableOpacity style={styles.cadastro} onPress={salvar} disabled={enviando} accessibilityRole="button" accessibilityLabel="Cadastrar">
        {enviando ? <ActivityIndicator color="#fff" /> : <Text style={styles.txt_cad}>CADASTRAR</Text>}
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles } from './Idoso.styles';
import { useIdosoCadastro } from '../hooks/useIdosoCadastro';
import { useTheme } from '../../../contexts/ThemeContext';

/**
 * Estrutura e textos preservados por instrução explícita anterior — a única
 * diferença visual agora é reagir ao tema global (modo claro/escuro + cor
 * de destaque), como pedido para todas as telas do app.
 */
export default function IdosoScreen() {
  const { nome, cpf, telefone, erros, enviando, alterarNome, alterarCpf, alterarTelefone, salvar } = useIdosoCadastro();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.img} source={require('../../../../assets/VivaBem.png')} />
      <Text style={styles.titulo}>ÁREA DE CADASTRO</Text>

      <Text style={styles.txt}>Nome Completo</Text>
      <TextInput style={styles.input} placeholderTextColor={themeColors.placeholder} placeholder="Digite seu nome completo" onChangeText={alterarNome} value={nome} />
      {erros.nome ? <Text style={styles.erro}>{erros.nome}</Text> : null}

      <Text style={styles.txt}>CPF</Text>
      <TextInput style={styles.input} placeholderTextColor={themeColors.placeholder} onChangeText={alterarCpf} value={cpf} placeholder="000.000.000-00" keyboardType="numeric" maxLength={14} />
      {erros.cpf ? <Text style={styles.erro}>{erros.cpf}</Text> : null}

      <Text style={styles.txt}>Telefone</Text>
      <TextInput style={styles.input} placeholderTextColor={themeColors.placeholder} onChangeText={alterarTelefone} value={telefone} placeholder="(11) 00000-0000" keyboardType="numeric" maxLength={15} />
      {erros.telefone ? <Text style={styles.erro}>{erros.telefone}</Text> : null}

      <TouchableOpacity style={styles.cadastro} onPress={salvar} disabled={enviando} accessibilityRole="button" accessibilityLabel="Cadastrar">
        {enviando ? <ActivityIndicator color={themeColors.textOnPrimary} /> : <Text style={styles.txt_cad}>CADASTRAR</Text>}
      </TouchableOpacity>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

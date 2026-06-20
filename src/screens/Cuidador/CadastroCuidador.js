import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { supabase } from "../../services/supabase";
import { validarCPF } from "../../services/validation";

export function CadastroCuidador() {
  const navigation = useNavigation();

  // 1. Estados
  const [name, setName] = useState('');
  const [fone, setFone] = useState('');
  const [cpf, setCPF] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [outraEspecialidade, setOutraEspecialidade] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [erros, setErros] = useState({});

  // 2. Manipuladores de Input (Formatadores)
  const lidarComCPF = (texto) => {
    let num = texto.replace(/\D/g, "");
    if (num.length > 11) num = num.slice(0, 11);
    
    if (num.length > 9) num = num.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
    else if (num.length > 6) num = num.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");
    else if (num.length > 3) num = num.replace(/^(\d{3})(\d{1,3})$/, "$1.$2");
    
    setCPF(num);
    setErros(prev => ({ ...prev, cpf: null }));
  };

  const lidarComTelefone = (texto) => {
    let num = texto.replace(/\D/g, "");
    if (num.length > 11) num = num.slice(0, 11);

    if (num.length > 6) num = num.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    else if (num.length > 2) num = num.replace(/^(\d{2})(\d{1,5})$/, "($1) $2");
    else if (num.length > 0) num = num.replace(/^(\d{1,2})$/, "($1");
    
    setFone(num);
    setErros(prev => ({ ...prev, fone: null }));
  };

  const limparErroDoCampo = (campo, valor) => {
    if (campo === "name") setName(valor);
    if (campo === "especialidade") setOutraEspecialidade(valor);
    setErros(prev => ({ ...prev, [campo]: null }));
  };

  // 3. Validação do Formulário
  const validarFormulario = () => {
    let errosAtuais = {};
    const nomeLimpo = name.trim();
    const cpfLimpo = cpf.replace(/\D/g, "");
    const foneLimpo = fone.replace(/\D/g, "");

    if (!nomeLimpo) errosAtuais.name = "Campo obrigatório";
    else if (nomeLimpo.length < 3) errosAtuais.name = "O nome está muito curto";

    if (!cpfLimpo) errosAtuais.cpf = "Campo obrigatório";
    else if (cpfLimpo.length !== 11) errosAtuais.cpf = "O CPF deve ter 11 dígitos";
    else if (!validarCPF(cpfLimpo)) errosAtuais.cpf = "CPF inválido. Digite um CPF verdadeiro";

    if (!foneLimpo) errosAtuais.fone = "Campo obrigatório";
    else if (foneLimpo.length < 10 || foneLimpo.length > 11) errosAtuais.fone = "Telefone inválido (deve conter DDD + número)";

    if (!especialidade) errosAtuais.especialidade = "Campo obrigatório";
    else if (especialidade === "Outros" && !outraEspecialidade.trim()) errosAtuais.especialidade = "Por favor, digite sua especialidade";

    setErros(errosAtuais);
    return Object.keys(errosAtuais).length === 0;
  };

  // 4. Envio dos Dados para a API
  const salvarCuidador = async () => {
    if (!validarFormulario()) {
      Alert.alert('Erro no formulário', 'Por favor, corrija os erros indicados na tela.');
      return;
    }

    const especialidadeFinal = especialidade === "Outros" ? outraEspecialidade.trim() : especialidade;

    const { error } = await supabase
      .from('cuidadores')
      .insert([{
        nome: name.trim(),
        cpf: cpf.replace(/\D/g, ""), 
        telefone: fone.replace(/\D/g, ""),
        especialidade: especialidadeFinal
      }]);

    if (error) {
      Alert.alert('Erro', error.message);
      return;
    }

    Alert.alert('Sucesso', 'Cuidador cadastrado!');
    
    // Reset States
    setName(''); setCPF(''); setFone(''); setEspecialidade(''); setOutraEspecialidade('');

    navigation.navigate('HomeCuidador', { nomeUsuario: name });
  };

  // Retorna tudo que o componente visual precisa ler ou alterar
  return {
    name, fone, cpf, especialidade, outraEspecialidade, mostrarModal, erros,
    setEspecialidade, setMostrarModal, setErros,
    lidarComCPF, lidarComTelefone, limparErroDoCampo, salvarCuidador
  };
}
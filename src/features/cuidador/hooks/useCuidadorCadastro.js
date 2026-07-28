import { useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location'; // 👈 1. Importação do Expo Location
import { cadastrarEConectarCuidador } from '../../../services/authService';
import { useSession } from '../../../contexts/SessionContext';
import { aplicarMascaraCPF, aplicarMascaraTelefone } from '../../../utils/masks';
import {
  validarCPFObrigatorio,
  validarNomeCompleto,
  validarTelefoneObrigatorio,
} from '../../../utils/validators';

const TAMANHO_MINIMO_SENHA = 6;
const OPCAO_OUTRA_ESPECIALIDADE = 'Outros';

export function useCuidadorCadastro() {
  const { recarregarPerfil } = useSession();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [outraEspecialidade, setOutraEspecialidade] = useState('');
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [modalEspecialidadeVisivel, setModalEspecialidadeVisivel] = useState(false);

  const alterarCpf = (texto) => setCpf(aplicarMascaraCPF(texto));
  const alterarTelefone = (texto) => setTelefone(aplicarMascaraTelefone(texto));

  const especialidadeFinal = () =>
    (especialidade === OPCAO_OUTRA_ESPECIALIDADE ? outraEspecialidade : especialidade).trim();

  const validar = () => {
    const novosErros = {};

    const erroNome = validarNomeCompleto(nome);
    if (erroNome) novosErros.nome = erroNome;

    const erroCpf = validarCPFObrigatorio(cpf);
    if (erroCpf) novosErros.cpf = erroCpf;

    const erroTelefone = validarTelefoneObrigatorio(telefone);
    if (erroTelefone) novosErros.telefone = erroTelefone;

    if (!senha || senha.length < TAMANHO_MINIMO_SENHA) {
      novosErros.senha = `A senha deve ter no mínimo ${TAMANHO_MINIMO_SENHA} caracteres.`;
    }

    if (!especialidadeFinal()) {
      novosErros.especialidade = 'Selecione ou digite sua especialidade.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;

    setEnviando(true);
    try {
      // 👈 2. Captura a localização via GPS no momento do cadastro
      let latitude = null;
      let longitude = null;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          latitude = loc.coords.latitude;
          longitude = loc.coords.longitude;
        }
      } catch (e) {
        console.warn('Não foi possível obter o GPS durante o cadastro:', e);
      }

      // 👈 3. Envia latitude e longitude para o authService salvar no Supabase
      await cadastrarEConectarCuidador({
        nome,
        cpf,
        telefone,
        senha,
        especialidade: especialidadeFinal(),
        latitude,
        longitude,
      });

      // A sessão nasce no signUp, mas o perfil só existe após o insert acima:
      // recarregar aqui garante que a navegação já saiba que é um cuidador.
      await recarregarPerfil();
    } catch (erro) {
      Alert.alert('Erro ao cadastrar', erro.message || 'Não foi possível concluir o cadastro.');
    } finally {
      setEnviando(false);
    }
  };

  return {
    nome,
    cpf,
    telefone,
    senha,
    especialidade,
    outraEspecialidade,
    erros,
    enviando,
    modalEspecialidadeVisivel,
    setModalEspecialidadeVisivel,
    alterarNome: setNome,
    alterarCpf,
    alterarTelefone,
    alterarSenha: setSenha,
    alterarOutraEspecialidade: setOutraEspecialidade,
    selecionarEspecialidade: (esp) => {
      setEspecialidade(esp);
      setModalEspecialidadeVisivel(false);
    },
    salvar,
  };
}
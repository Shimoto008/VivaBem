import { useState } from 'react';
import { Alert } from 'react-native';

export function useHomeCuidador() {
  // --- ESTADOS PRINCIPAIS ---
  const [abaAtiva, setAbaAtiva] = useState('home'); 
  const [listaPacientes, setListaPacientes] = useState([]); 
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null); 
  const [exibirFormCadastro, setExibirFormCadastro] = useState(false); 
  const [subAtividadeAtiva, setSubAtividadeAtiva] = useState(null);

  // --- ESTADOS DO CADASTRO DO IDOSO ---
  const [nomeIdoso, setNomeIdoso] = useState('');
  const [idadeIdoso, setIdadeIdoso] = useState('');
  const [cpfIdoso, setCpfIdoso] = useState('');

  // --- ESTADOS DO CALENDÁRIO DINÂMICO ---
  const dataAtual = new Date();
  const [mesAtual, setMesAtual] = useState(dataAtual.getMonth()); 
  const [anoAtual, setAnoAtual] = useState(dataAtual.getFullYear());
  const [diaSelecionado, setDiaSelecionado] = useState(dataAtual.getDate());

  // --- ESTADOS DAS NOTAS ---
  const [textoAgenda, setTextoAgenda] = useState('');
  const [textoRelatorio, setTextoRelatorio] = useState('');
  const [textoMedicao, setTextoMedicao] = useState('');
  const [textoObservacao, setTextoObservacao] = useState('');

  const nomesDosMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // --- FUNÇÃO DE CADASTRO ---
  const handleCadastrarIdoso = () => {
    if (!nomeIdoso.trim() || !idadeIdoso.trim() || !cpfIdoso.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    const novoIdoso = {
      id: Date.now().toString(),
      nome: nomeIdoso,
      idade: idadeIdoso,
      cpf: cpfIdoso,
      historicoAgenda: {}, 
      historicoRelatorios: [],
      historicoMedicacao: [],
      historicoObservacoes: []
    };

    setListaPacientes([...listaPacientes, novoIdoso]);
    setNomeIdoso(''); setIdadeIdoso(''); setCpfIdoso('');
    setExibirFormCadastro(false);
    Alert.alert('Sucesso', `${nomeIdoso} foi cadastrado com sucesso!`);
  };

  // --- CARREGAR DADOS AO ABRIR A FERRAMENTA ---
  const handleAbrirSubAtividade = (tipo, idoso) => {
    setSubAtividadeAtiva(tipo);
    if (tipo === 'agenda') {
      const chaveData = `${anoAtual}-${mesAtual}-${diaSelecionado}`;
      setTextoAgenda(idoso.historicoAgenda[chaveData] || '');
    }
    if (tipo === 'relatorios') setTextoRelatorio('');
    if (tipo === 'medicaçao') setTextoMedicao('');
    if (tipo === 'observaçao') setTextoObservacao('');
  };

  // --- FUNÇÃO DE SALVAR COMPROMISSO / NOTA ---
  const handleSalvarAtividade = (tipo, texto) => {
    if (!texto.trim()) {
      Alert.alert('Erro', 'O texto não pode estar vazio!');
      return;
    }

    const dataRegistro = new Date().toLocaleDateString('pt-BR');

    const listaAtualizada = listaPacientes.map(idoso => {
      if (idoso.id === pacienteSelecionado.id) {
        if (tipo === 'agenda') {
          const chaveData = `${anoAtual}-${mesAtual}-${diaSelecionado}`;
          idoso.historicoAgenda[chaveData] = texto;
        } else {
          const novoItem = { id: Date.now().toString(), data: dataRegistro, conteudo: texto };
          if (tipo === 'relatorios') idoso.historicoRelatorios.unshift(novoItem); 
          if (tipo === 'medicaçao') idoso.historicoMedicacao.unshift(novoItem);
          if (tipo === 'observaçao') idoso.historicoObservacoes.unshift(novoItem);
        }
      }
      return idoso;
    });

    setListaPacientes(listaAtualizada);
    const pacienteAtualizado = listaAtualizada.find(p => p.id === pacienteSelecionado.id);
    setPacienteSelecionado(pacienteAtualizado);
    setSubAtividadeAtiva(null); 
    Alert.alert('Sucesso', 'Registro adicionado com sucesso!');
  };

  // --- FUNÇÃO DE EDITAR DADO JÁ INSERIDO ---
  const handleEditarItem = (tipo, item, chaveAgenda = null) => {
    setSubAtividadeAtiva(tipo);

    if (tipo === 'agenda' && chaveAgenda) {
      setTextoAgenda(pacienteSelecionado.historicoAgenda[chaveAgenda]);
      const [ano, mes, dia] = chaveAgenda.split('-');
      setAnoAtual(parseInt(ano)); setMesAtual(parseInt(mes)); setDiaSelecionado(parseInt(dia));
    } else {
      if (tipo === 'relatorios') setTextoRelatorio(item.conteudo);
      if (tipo === 'medicaçao') setTextoMedicao(item.conteudo);
      if (tipo === 'observaçao') setTextoObservacao(item.conteudo);

      const listaLimpa = listaPacientes.map(idoso => {
        if (idoso.id === pacienteSelecionado.id) {
          if (tipo === 'relatorios') idoso.historicoRelatorios = idoso.historicoRelatorios.filter(i => i.id !== item.id);
          if (tipo === 'medicaçao') idoso.historicoMedicacao = idoso.historicoMedicacao.filter(i => i.id !== item.id);
          if (tipo === 'observaçao') idoso.historicoObservacoes = idoso.historicoObservacoes.filter(i => i.id !== item.id);
        }
        return idoso;
      });
      setListaPacientes(listaLimpa);
    }
  };

  // --- NAVEGAÇÃO DO CALENDÁRIO ---
  const alternarDiaCalendario = (dia, idoso) => {
    setDiaSelecionado(dia);
    const chaveData = `${anoAtual}-${mesAtual}-${dia}`;
    setTextoAgenda(idoso.historicoAgenda[chaveData] || '');
  };

  const handleMesAnterior = () => {
    if (mesAtual === 0) { setMesAtual(11); setAnoAtual(anoAtual - 1); } else { setMesAtual(mesAtual - 1); }
  };

  const handleMesSeguinte = () => {
    if (mesAtual === 11) { setMesAtual(0); setAnoAtual(anoAtual + 1); } else { setMesAtual(mesAtual + 1); }
  };

  return {
    abaAtiva, setAbaAtiva,
    listaPacientes, setListaPacientes,
    pacienteSelecionado, setPacienteSelecionado,
    exibirFormCadastro, setExibirFormCadastro,
    subAtividadeAtiva, setSubAtividadeAtiva,
    nomeIdoso, setNomeIdoso,
    idadeIdoso, setIdadeIdoso,
    cpfIdoso, setCpfIdoso,
    mesAtual, anoAtual, diaSelecionado,
    textoAgenda, setTextoAgenda,
    textoRelatorio, setTextoRelatorio,
    textoMedicao, setTextoMedicao,
    textoObservacao, setTextoObservacao,
    nomesDosMeses,
    handleCadastrarIdoso,
    handleAbrirSubAtividade,
    handleSalvarAtividade,
    handleEditarItem,
    alternarDiaCalendario,
    handleMesAnterior,
    handleMesSeguinte
  };
}
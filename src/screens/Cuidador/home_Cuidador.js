import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  TextInput, 
  Alert 
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function HomeCuidador() {
  // --- ESTADOS PRINCIPAIS ---
  const [abaAtiva, setAbaAtiva] = useState('home'); 
  const [listaPacientes, setListaPacientes] = useState([]); 
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null); 
  const [exibirFormCadastro, setExibirFormCadastro] = useState(false); 
  
  // --- ESTADO DE SUB-TELAS DE ATIVIDADES ---
  // Controla qual bloco/atividade está aberto para digitação ('agenda', 'relatorios', 'medicaçao', 'observaçao' ou null)
  const [subAtividadeAtiva, setSubAtividadeAtiva] = useState(null);

  // --- ESTADOS DOS FORMULÁRIOS DE CADASTRO DO IDOSO ---
  const [nomeIdoso, setNomeIdoso] = useState('');
  const [idadeIdoso, setIdadeIdoso] = useState('');
  const [cpfIdoso, setCpfIdoso] = useState('');

  // --- ESTADOS DOS BLOCOS DE NOTAS / AGENDAS ---
  const [textoAgenda, setTextoAgenda] = useState('');
  const [textoRelatorio, setTextoRelatorio] = useState('');
  const [textoMedicao, setTextoMedicao] = useState('');
  const [textoObservacao, setTextoObservacao] = useState('');

  // --- FUNÇÃO: CADASTRAR IDOSO ---
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
      // Criamos arrays vazios para guardar o histórico de cada atividade desse idoso
      historicoAgenda: [],
      historicoRelatorios: [],
      historicoMedicacao: [],
      historicoObservacoes: []
    };

    setListaPacientes([...listaPacientes, novoIdoso]);
    setNomeIdoso(''); setIdadeIdoso(''); setCpfIdoso('');
    setExibirFormCadastro(false);
    Alert.alert('Sucesso', `${nomeIdoso} foi cadastrado com sucesso!`);
  };

  // --- FUNÇÃO: SALVAR ATIVIDADE NO IDOSO SELECIONADO ---
  const handleSalvarAtividade = (tipo, texto, setTexto) => {
    if (!texto.trim()) {
      Alert.alert('Erro', 'O campo de texto não pode estar vazio!');
      return;
    }

    // Mapeia e atualiza o idoso específico dentro do array principal
    const listaAtualizada = listaPacientes.map(idoso => {
      if (idoso.id === pacienteSelecionado.id) {
        const novaNota = {
          id: Date.now().toString(),
          data: new Date().toLocaleDateString('pt-BR'),
          conteudo: texto
        };

        if (tipo === 'agenda') idoso.historicoAgenda.push(novaNota);
        if (tipo === 'relatorios') idoso.historicoRelatorios.push(novaNota);
        if (tipo === 'medicaçao') idoso.historicoMedicacao.push(novaNota);
        if (tipo === 'observaçao') idoso.historicoObservacoes.push(novaNota);
      }
      return idoso;
    });

    setListaPacientes(listaAtualizada);
    setTexto(''); // Limpa o bloco de notas
    setSubAtividadeAtiva(null); // Fecha a mini aba
    Alert.alert('Sucesso', 'Informações salvas com sucesso!');
  };

  // --- SUB-TELA DINÂMICA (BLOCO DE NOTAS / AGENDA) ---
  const renderFormAtividade = (idoso) => {
    if (!subAtividadeAtiva) return null;

    let titulo = '';
    let placeholder = '';
    let valorTexto = '';
    let setValorTexto = () => {};

    // Define os textos de acordo com o botão clicado
    switch(subAtividadeAtiva) {
      case 'agenda':
        titulo = 'Agendar Compromisso / Calendário';
        placeholder = 'Ex: 15/06 às 14:00 - Consulta com Cardiologista...';
        valorTexto = textoAgenda; setValorTexto = setTextoAgenda;
        break;
      case 'relatorios':
        titulo = 'Bloco de Relatório Diário';
        placeholder = 'Digite a evolução do paciente no dia de hoje...';
        valorTexto = textoRelatorio; setValorTexto = setTextoRelatorio;
        break;
      case 'medicaçao':
        titulo = 'Bloco de Medicação';
        placeholder = 'Ex: Dipirona 500mg de 6h em 6h...';
        valorTexto = textoMedicao; setValorTexto = setTextoMedicao;
        break;
      case 'observaçao':
        titulo = 'Aviso / Observação para o Familiar';
        placeholder = 'Ex: O idoso está precisando que compre mais fraldas...';
        valorTexto = textoObservacao; setValorTexto = setTextoObservacao;
        break;
    }

    return (
      <View style={styles.subAbaAtividade}>
        <View style={styles.subAbaHeader}>
          <Text style={styles.subAbaTitulo}>{titulo}</Text>
          <TouchableOpacity onPress={() => setSubAtividadeAtiva(null)}>
            <MaterialIcons name="cancel" size={22} color="#FF6347" />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.textArea}
          placeholder={placeholder}
          multiline={true}
          numberOfLines={4}
          value={valorTexto}
          onChangeText={setValorTexto}
        />

        <TouchableOpacity 
          style={styles.btnSalvarNota}
          onPress={() => handleSalvarAtividade(subAtividadeAtiva, valorTexto, setValorTexto)}
        >
          <Text style={styles.btnSalvarNotaTexto}>Salvar Informação</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // --- COMPONENTE DE MENU DE ATIVIDADES ---
  const renderAcoesPaciente = (idoso) => (
    <View style={styles.containerAcoes}>
      <View style={styles.topoAcoes}>
        <Text style={styles.tituloAcoes}>Gerenciar Atividades</Text>
        <TouchableOpacity onPress={() => { setPacienteSelecionado(null); setSubAtividadeAtiva(null); }}>
          <MaterialIcons name="close" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.gridAcoes}>
        <TouchableOpacity style={[styles.btnAcaoCard, subAtividadeAtiva === 'agenda' && styles.btnAtivo]} onPress={() => setSubAtividadeAtiva('agenda')}>
          <MaterialIcons name="event" size={24} color="#4169E1" />
          <Text style={styles.txtAcaoCard}>Agenda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnAcaoCard, subAtividadeAtiva === 'relatorios' && styles.btnAtivo]} onPress={() => setSubAtividadeAtiva('relatorios')}>
          <MaterialIcons name="assessment" size={24} color="#4169E1" />
          <Text style={styles.txtAcaoCard}>Relatórios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnAcaoCard, subAtividadeAtiva === 'medicaçao' && styles.btnAtivo]} onPress={() => setSubAtividadeAtiva('medicaçao')}>
          <MaterialIcons name="healing" size={24} color="#4169E1" />
          <Text style={styles.txtAcaoCard}>Medicação</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnAcaoCard, subAtividadeAtiva === 'observaçao' && styles.btnAtivo]} onPress={() => setSubAtividadeAtiva('observaçao')}>
          <MaterialIcons name="notification-important" size={24} color="#FF6347" />
          <Text style={styles.txtAcaoCard}>Observação</Text>
        </TouchableOpacity>
      </View>

      {/* Renderiza o Bloco de Notas selecionado logo abaixo dos botões */}
      {renderFormAtividade(idoso)}
    </View>
  );

  // --- ABAS PRINCIPAIS ---

  // 1. HOME
  const renderHome = () => (
    <View style={styles.containerAbas}>
      <View style={styles.grid}>
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardTop}>
            <MaterialIcons name="star-outline" size={24} color="#4169E1" />
            <Text style={styles.statusBadge}>Avisos</Text>
          </View>
          <View style={styles.iconContainer}>
            <MaterialIcons name="add-box" size={50} color="#4169E1" />
          </View>
          <Text style={styles.cardTitle}>Medicação</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <View style={styles.cardTop}>
            <MaterialIcons name="star-outline" size={24} color="#4169E1" />
            <Text style={styles.statusBadge}>Avisos</Text>
          </View>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="accessible-icon" size={45} color="#4169E1" />
          </View>
          <Text style={styles.cardTitle}>Risco de Engasgo</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.secaoTitulo}>Idosos Sob Seus Cuidados</Text>
      
      {listaPacientes.length === 0 ? (
        <View style={styles.cardVazio}>
          <Text style={styles.txtVazio}>Nenhum idoso cadastrado.</Text>
          <Text style={styles.txtSubVazio}>Use a aba "Paciente" para adicionar.</Text>
        </View>
      ) : (
        listaPacientes.map((idoso) => (
          <View key={idoso.id} style={styles.wrapperPaciente}>
            <TouchableOpacity 
              style={styles.cardPacienteHome}
              onPress={() => {
                setPacienteSelecionado(pacienteSelecionado?.id === idoso.id ? null : idoso);
                setSubAtividadeAtiva(null);
              }}
            >
              <FontAwesome5 name="user-circle" size={40} color="#4169E1" />
              <View style={styles.infoPacienteHome}>
                <Text style={styles.nomePacienteHome}>{idoso.nome}</Text>
                <Text style={styles.detalhesPacienteHome}>{idoso.idade} anos | CPF: {idoso.cpf}</Text>
              </View>
              <MaterialIcons name={pacienteSelecionado?.id === idoso.id ? "expand-less" : "expand-more"} size={28} color="#4169E1" />
            </TouchableOpacity>
            {pacienteSelecionado?.id === idoso.id && renderAcoesPaciente(idoso)}
          </View>
        ))
      )}
    </View>
  );

  // 2. PACIENTE
  const renderPaciente = () => (
    <View style={styles.containerAbas}>
      <TouchableOpacity style={styles.btnToggleCadastro} onPress={() => setExibirFormCadastro(!exibirFormCadastro)}>
        <MaterialIcons name={exibirFormCadastro ? "remove-circle-outline" : "add-circle-outline"} size={28} color="#4169E1" />
        <Text style={styles.txtToggleCadastro}>Cadastrar Idoso</Text>
      </TouchableOpacity>
      
      {exibirFormCadastro && (
        <View style={styles.formulario}>
          <TextInput style={styles.input} placeholder="Nome Completo do Idoso" value={nomeIdoso} onChangeText={setNomeIdoso} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextInput style={[styles.input, { width: '30%' }]} placeholder="Idade" keyboardType="numeric" value={idadeIdoso} onChangeText={setIdadeIdoso} />
            <TextInput style={[styles.input, { width: '65%' }]} placeholder="CPF" keyboardType="numeric" maxLength={14} value={cpfIdoso} onChangeText={setCpfIdoso} />
          </View>
          <TouchableOpacity style={styles.btnSalvar} onPress={handleCadastrarIdoso}>
            <Text style={styles.btnSalvarTexto}>Finalizar Cadastro</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ marginTop: 10 }}>
        {listaPacientes.map((idoso) => (
          <View key={idoso.id} style={styles.wrapperPaciente}>
            <TouchableOpacity 
              style={styles.itemListaPaciente}
              onPress={() => {
                setPacienteSelecionado(pacienteSelecionado?.id === idoso.id ? null : idoso);
                setSubAtividadeAtiva(null);
              }}
            >
              <FontAwesome5 name="user-injured" size={24} color="#4169E1" />
              <View style={{ marginLeft: 15, flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{idoso.nome}</Text>
                <Text style={{ color: '#666', fontSize: 13 }}>CPF: {idoso.cpf}</Text>
              </View>
              <MaterialIcons name={pacienteSelecionado?.id === idoso.id ? "expand-less" : "expand-more"} size={24} color="#4169E1" />
            </TouchableOpacity>
            {pacienteSelecionado?.id === idoso.id && renderAcoesPaciente(idoso)}
          </View>
        ))}
      </View>
    </View>
  );

  // 3. RELATÓRIOS
  const renderRelatorios = () => (
    <View style={styles.telaPlaceholder}>
      <MaterialIcons name="assessment" size={55} color="#4169E1" />
      <Text style={styles.tituloPlaceholder}>Histórico Geral</Text>
      <Text style={styles.subtituloPlaceholder}>
        Aqui você verá métricas compiladas no futuro. Gerencie dados individuais clicando em cima dos idosos nas outras abas.
      </Text>
    </View>
  );

  const renderConteudo = () => {
    switch (abaAtiva) {
      case 'home': return renderHome();
      case 'paciente': return renderPaciente();
      case 'relatorios': return renderRelatorios();
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderConteudo()}
        </ScrollView>

        <View style={styles.bottomTab}>
          <TouchableOpacity style={styles.tabItem} onPress={() => { setAbaAtiva('home'); setPacienteSelecionado(null); setSubAtividadeAtiva(null); }}>
            <MaterialIcons name="home" size={28} color={abaAtiva === 'home' ? '#4169E1' : '#000'} />
            <Text style={[styles.tabText, abaAtiva === 'home' && styles.tabTextAtivo]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => { setAbaAtiva('paciente'); setPacienteSelecionado(null); setSubAtividadeAtiva(null); }}>
            <FontAwesome5 name="user-injured" size={22} color={abaAtiva === 'paciente' ? '#4169E1' : '#000'} />
            <Text style={[styles.tabText, abaAtiva === 'paciente' && styles.tabTextAtivo]}>Paciente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => { setAbaAtiva('relatorios'); setPacienteSelecionado(null); setSubAtividadeAtiva(null); }}>
            <MaterialIcons name="assessment" size={28} color={abaAtiva === 'relatorios' ? '#4169E1' : '#000'} />
            <Text style={[styles.tabText, abaAtiva === 'relatorios' && styles.tabTextAtivo]}>Relatórios</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  containerAbas: { flex: 1 },
  scrollContent: { padding: 15, flexGrow: 1, paddingTop: 50 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  card: { backgroundColor: '#FFF', width: '48%', borderRadius: 15, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E1E8ED' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { backgroundColor: '#4169E122', color: '#4169E1', fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, fontWeight: '600' },
  iconContainer: { alignItems: 'center', justifyContent: 'center', height: 60, marginTop: 10 },
  cardTitle: { color: '#000', fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  
  secaoTitulo: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 10 },
  cardVazio: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E1E8ED' },
  txtVazio: { color: '#666', fontWeight: 'bold' },
  txtSubVazio: { color: '#999', fontSize: 12, marginTop: 5 },

  btnToggleCadastro: { flexDirection: 'row', backgroundColor: '#FFF', padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#4169E155', borderStyle: 'dashed' },
  txtToggleCadastro: { fontSize: 16, fontWeight: 'bold', color: '#4169E1', marginLeft: 10 },

  formulario: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E1E8ED', marginBottom: 15 },
  input: { backgroundColor: '#F1F3F5', padding: 12, borderRadius: 8, marginBottom: 10, fontSize: 14, color: '#000' },
  btnSalvar: { backgroundColor: '#4169E1', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnSalvarTexto: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },

  wrapperPaciente: { marginBottom: 10 },
  cardPacienteHome: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E1E8ED' },
  infoPacienteHome: { marginLeft: 15, flex: 1 },
  nomePacienteHome: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  detalhesPacienteHome: { color: '#666', fontSize: 12 },

  // --- MENU DE AÇÕES ---
  containerAcoes: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#4169E122', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, padding: 15, marginTop: -4 },
  topoAcoes: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  tituloAcoes: { fontSize: 13, fontWeight: 'bold', color: '#666' },
  gridAcoes: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  btnAcaoCard: { backgroundColor: '#F8F9FA', width: '48%', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#E1E8ED' },
  btnAtivo: { borderColor: '#4169E1', backgroundColor: '#4169E111' }, // Estilo quando a atividade está ativa
  txtAcaoCard: { fontSize: 11, fontWeight: 'bold', color: '#333', marginTop: 5 },

  // --- COMPONENTES DA MINI ABA DE BLOCO DE NOTAS ---
  subAbaAtividade: { marginTop: 10, backgroundColor: '#F8F9FA', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#E1E8ED' },
  subAbaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  subAbaTitulo: { fontSize: 13, fontWeight: 'bold', color: '#4169E1' },
  textArea: { backgroundColor: '#FFF', padding: 10, borderRadius: 6, fontSize: 13, textAlignVertical: 'top', borderWidth: 1, borderColor: '#E1E8ED', color: '#000', minHeight: 80 },
  btnSalvarNota: { backgroundColor: '#4169E1', padding: 10, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  btnSalvarNotaTexto: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },

  itemListaPaciente: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E1E8ED' },

  telaPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, marginTop: 50 },
  tituloPlaceholder: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  subtituloPlaceholder: { fontSize: 14, color: '#666', textAlign: 'center' },

  bottomTab: { flexDirection: 'row', backgroundColor: '#FFF', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#E1E8ED', justifyContent: 'space-around' },
  tabItem: { alignItems: 'center', flex: 1 },
  tabText: { fontSize: 11, color: '#000', marginTop: 4 },
  tabTextAtivo: { color: '#4169E1', fontWeight: 'bold' }
});
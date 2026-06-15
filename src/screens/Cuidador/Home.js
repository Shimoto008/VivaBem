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
  const [subAtividadeAtiva, setSubAtividadeAtiva] = useState(null);

  // --- ESTADOS DO CADASTRO DO IDOSO ---
  const [nomeIdoso, setNomeIdoso] = useState('');
  const [idadeIdoso, setIdadeIdoso] = useState('');
  const [cpfIdoso, setCpfIdoso] = useState('');

  // --- ESTADOS DO CALENDÁRIO DINÂMICO ---
  const dataAtual = new Date();
  const [mesAtual, setMesAtual] = useState(dataAtual.getMonth()); // 0 = Janeiro, 11 = Dezembro
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
      historicoAgenda: {}, // Guardará como { "ano-mes-dia": "legenda" }
      historicoRelatorios: [],
      historicoMedicacao: [],
      historicoObservacoes: []
    };

    setListaPacientes([...listaPacientes, novoIdoso]);
    setNomeIdoso(''); setIdadeIdoso(''); setCpfIdoso('');
    setExibirFormCadastro(false);
    Alert.alert('Sucesso', `${nomeIdoso} foi cadastrado com sucesso!`);
  };

  // --- FUNÇÃO DE SALVAR COMPROMISSO ---
  const handleSalvarAtividade = (tipo, texto, setTexto) => {
    if (!texto.trim()) {
      Alert.alert('Erro', 'O texto não pode estar vazio!');
      return;
    }

    const listaAtualizada = listaPacientes.map(idoso => {
      if (idoso.id === pacienteSelecionado.id) {
        if (tipo === 'agenda') {
          // Chave única baseada na data para não misturar os meses
          const chaveData = `${anoAtual}-${mesAtual}-${diaSelecionado}`;
          idoso.historicoAgenda[chaveData] = texto;
        } else {
          const novaNota = { id: Date.now().toString(), data: new Date().toLocaleDateString('pt-BR'), conteudo: texto };
          if (tipo === 'relatorios') idoso.historicoRelatorios.push(novaNota);
          if (tipo === 'medicaçao') idoso.historicoMedicacao.push(novaNota);
          if (tipo === 'observaçao') idoso.historicoObservacoes.push(novaNota);
        }
      }
      return idoso;
    });

    setListaPacientes(listaAtualizada);
    setTexto(''); 
    setSubAtividadeAtiva(null); 
    Alert.alert('Sucesso', 'Informações atualizadas!');
  };

  // --- NAVEGAÇÃO DO CALENDÁRIO ---
  const handleMesAnterior = () => {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual(anoAtual - 1);
    } else {
      setMesAtual(mesAtual - 1);
    }
  };

  const handleMesSeguinte = () => {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual(anoAtual + 1);
    } else {
      setMesAtual(mesAtual + 1);
    }
  };

  // --- GERADOR DE CALENDÁRIO VISUAL ---
  const renderCalendario = (idoso) => {
    // Truque JS: O "dia 0" do mês seguinte nos dá a quantidade exata de dias do mês atual
    const quantidadeDias = new Date(anoAtual, mesAtual + 1, 0).getDate();
    const diasDoMes = Array.from({ length: quantidadeDias }, (_, i) => i + 1);

    return (
      <View style={styles.calendarioContainer}>
        {/* Header de Navegação do Mês */}
        <View style={styles.calendarioHeaderNavegacao}>
          <TouchableOpacity onPress={handleMesAnterior} style={styles.btnSetas}>
            <MaterialIcons name="chevron-left" size={28} color="#4169E1" />
          </TouchableOpacity>
          
          <Text style={styles.mesTitulo}>{nomesDosMeses[mesAtual]} {anoAtual}</Text>
          
          <TouchableOpacity onPress={handleMesSeguinte} style={styles.btnSetas}>
            <MaterialIcons name="chevron-right" size={28} color="#4169E1" />
          </TouchableOpacity>
        </View>

        {/* Grid de Dias */}
        <View style={styles.diasGrid}>
          {diasDoMes.map((dia) => {
            const chaveData = `${anoAtual}-${mesAtual}-${dia}`;
            const temCompromisso = idoso.historicoAgenda[chaveData];
            const isSelected = dia === diaSelecionado;

            return (
              <TouchableOpacity 
                key={dia} 
                style={[
                  styles.diaBotao, 
                  isSelected && styles.diaSelecionado,
                  temCompromisso && !isSelected && styles.diaComInfo
                ]}
                onPress={() => {
                  setDiaSelecionado(dia);
                  setTextoAgenda(idoso.historicoAgenda[chaveData] || '');
                }}
              >
                <Text style={[styles.diaTexto, isSelected && styles.diaTextoSelecionado]}>{dia}</Text>
                {temCompromisso && <View style={styles.pontoIndicador} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  // --- CONTAINER DINÂMICO DAS SUB-TELAS ---
  const renderFormAtividade = (idoso) => {
    if (!subAtividadeAtiva) return null;

    if (subAtividadeAtiva === 'agenda') {
      return (
        <View style={styles.subAbaAtividade}>
          <View style={styles.subAbaHeader}>
            <Text style={styles.subAbaTitulo}>Calendário de Atividades</Text>
            <TouchableOpacity onPress={() => setSubAtividadeAtiva(null)}>
              <MaterialIcons name="cancel" size={22} color="#FF6347" />
            </TouchableOpacity>
          </View>

          {renderCalendario(idoso)}

          <Text style={styles.legendaInputTitulo}>
            Legenda para o dia {diaSelecionado} de {nomesDosMeses[mesAtual]}:
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Digite compromissos, banhos ou rotinas agendadas..."
            multiline={true}
            value={textoAgenda}
            onChangeText={setTextoAgenda}
          />

          <TouchableOpacity 
            style={styles.btnSalvarNota}
            onPress={() => handleSalvarAtividade('agenda', textoAgenda, setTextoAgenda)}
          >
            <Text style={styles.btnSalvarNotaTexto}>Salvar na Agenda do Dia</Text>
          </TouchableOpacity>
        </View>
      );
    }

    let titulo = ''; let placeholder = ''; let valorTexto = ''; let setValorTexto = () => {};
    if (subAtividadeAtiva === 'relatorios') { titulo = 'Relatório Diário'; placeholder = 'Evolução do paciente...'; valorTexto = textoRelatorio; setValorTexto = setTextoRelatorio; }
    if (subAtividadeAtiva === 'medicaçao') { titulo = 'Nova Medicação'; placeholder = 'Remédios e horários...'; valorTexto = textoMedicao; setValorTexto = setTextoMedicao; }
    if (subAtividadeAtiva === 'observaçao') { titulo = 'Observação (Aviso Familiar)'; placeholder = 'Falta de insumos, recados...'; valorTexto = textoObservacao; setValorTexto = setTextoObservacao; }

    return (
      <View style={styles.subAbaAtividade}>
        <View style={styles.subAbaHeader}>
          <Text style={styles.subAbaTitulo}>{titulo}</Text>
          <TouchableOpacity onPress={() => setSubAtividadeAtiva(null)}>
            <MaterialIcons name="cancel" size={22} color="#FF6347" />
          </TouchableOpacity>
        </View>
        <TextInput style={styles.textArea} placeholder={placeholder} multiline={true} value={valorTexto} onChangeText={setValorTexto} />
        <TouchableOpacity style={styles.btnSalvarNota} onPress={() => handleSalvarAtividade(subAtividadeAtiva, valorTexto, setValorTexto)}>
          <Text style={styles.btnSalvarNotaTexto}>Salvar Registro</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // --- COMPONENTE DE SELEÇÃO DE AÇÕES ---
  const renderAcoesPaciente = (idoso) => (
    <View style={styles.containerAcoes}>
      <View style={styles.topoAcoes}>
        <Text style={styles.tituloAcoes}>Painel do Paciente</Text>
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

      {renderFormAtividade(idoso)}
    </View>
  );

  // --- RENDERIZAÇÃO DAS TELAS ---
  const renderHome = () => (
    <View style={styles.containerAbas}>
      <View style={styles.grid}>
        <View style={styles.card}>
          <View style={styles.cardTop}><MaterialIcons name="star-outline" size={24} color="#4169E1" /><Text style={styles.statusBadge}>Painel</Text></View>
          <View style={styles.iconContainer}><MaterialIcons name="add-box" size={50} color="#4169E1" /></View>
          <Text style={styles.cardTitle}>Medicações</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardTop}><MaterialIcons name="star-outline" size={24} color="#4169E1" /><Text style={styles.statusBadge}>Segurança</Text></View>
          <View style={styles.iconContainer}><FontAwesome5 name="accessible-icon" size={45} color="#4169E1" /></View>
          <Text style={styles.cardTitle}>Risco Engasgo</Text>
        </View>
      </View>

      <Text style={styles.secaoTitulo}>Idosos Ativos</Text>
      {listaPacientes.length === 0 ? (
        <View style={styles.cardVazio}><Text style={styles.txtVazio}>Nenhum idoso cadastrado.</Text></View>
      ) : (
        listaPacientes.map((idoso) => (
          <View key={idoso.id} style={styles.wrapperPaciente}>
            <TouchableOpacity style={styles.cardPacienteHome} onPress={() => { setPacienteSelecionado(pacienteSelecionado?.id === idoso.id ? null : idoso); setSubAtividadeAtiva(null); }}>
              <FontAwesome5 name="user-circle" size={40} color="#4169E1" />
              <View style={styles.infoPacienteHome}><Text style={styles.nomePacienteHome}>{idoso.nome}</Text><Text style={styles.detalhesPacienteHome}>{idoso.idade} anos</Text></View>
              <MaterialIcons name={pacienteSelecionado?.id === idoso.id ? "expand-less" : "expand-more"} size={28} color="#4169E1" />
            </TouchableOpacity>
            {pacienteSelecionado?.id === idoso.id && renderAcoesPaciente(idoso)}
          </View>
        ))
      )}
    </View>
  );

  const renderPaciente = () => (
    <View style={styles.containerAbas}>
      <TouchableOpacity style={styles.btnToggleCadastro} onPress={() => setExibirFormCadastro(!exibirFormCadastro)}>
        <MaterialIcons name={exibirFormCadastro ? "remove-circle-outline" : "add-circle-outline"} size={28} color="#4169E1" />
        <Text style={styles.txtToggleCadastro}>Cadastrar Novo Idoso</Text>
      </TouchableOpacity>
      
      {exibirFormCadastro && (
        <View style={styles.formulario}>
          <TextInput style={styles.input} placeholder="Nome Completo" value={nomeIdoso} onChangeText={setNomeIdoso} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextInput style={[styles.input, { width: '30%' }]} placeholder="Idade" keyboardType="numeric" value={idadeIdoso} onChangeText={setIdadeIdoso} />
            <TextInput style={[styles.input, { width: '65%' }]} placeholder="CPF" keyboardType="numeric" maxLength={14} value={cpfIdoso} onChangeText={setCpfIdoso} />
          </View>
          <TouchableOpacity style={styles.btnSalvar} onPress={handleCadastrarIdoso}><Text style={styles.btnSalvarTexto}>Finalizar Cadastro</Text></TouchableOpacity>
        </View>
      )}

      {listaPacientes.map((idoso) => (
        <View key={idoso.id} style={styles.wrapperPaciente}>
          <TouchableOpacity style={styles.itemListaPaciente} onPress={() => { setPacienteSelecionado(pacienteSelecionado?.id === idoso.id ? null : idoso); setSubAtividadeAtiva(null); }}>
            <FontAwesome5 name="user-injured" size={24} color="#4169E1" />
            <View style={{ marginLeft: 15, flex: 1 }}><Text style={{ fontWeight: 'bold', fontSize: 16 }}>{idoso.nome}</Text></View>
            <MaterialIcons name={pacienteSelecionado?.id === idoso.id ? "expand-less" : "expand-more"} size={24} color="#4169E1" />
          </TouchableOpacity>
          {pacienteSelecionado?.id === idoso.id && renderAcoesPaciente(idoso)}
        </View>
      ))}
    </View>
  );

  const renderConteudo = () => {
    if (abaAtiva === 'home') return renderHome();
    if (abaAtiva === 'paciente') return renderPaciente();
    return <View style={styles.telaPlaceholder}><Text>Área de Histórico</Text></View>;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>{renderConteudo()}</ScrollView>
        <View style={styles.bottomTab}>
          <TouchableOpacity style={styles.tabItem} onPress={() => setAbaAtiva('home')}><MaterialIcons name="home" size={28} color={abaAtiva === 'home' ? '#4169E1' : '#000'} /><Text style={styles.tabText}>Home</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => setAbaAtiva('paciente')}><FontAwesome5 name="user-injured" size={22} color={abaAtiva === 'paciente' ? '#4169E1' : '#000'} /><Text style={styles.tabText}>Paciente</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => setAbaAtiva('relatorios')}><MaterialIcons name="assessment" size={28} color={abaAtiva === 'relatorios' ? '#4169E1' : '#000'} /><Text style={styles.tabText}>Relatórios</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// --- ESTILOS VISUAIS PROFISSIONAIS ---
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
  containerAcoes: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#4169E122', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, padding: 15, marginTop: -4 },
  topoAcoes: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  tituloAcoes: { fontSize: 13, fontWeight: 'bold', color: '#666' },
  gridAcoes: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  btnAcaoCard: { backgroundColor: '#F8F9FA', width: '48%', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#E1E8ED' },
  btnAtivo: { borderColor: '#4169E1', backgroundColor: '#4169E111' },
  txtAcaoCard: { fontSize: 11, fontWeight: 'bold', color: '#333', marginTop: 5 },
  itemListaPaciente: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E1E8ED' },
  telaPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 },

  // --- ESTILOS DO CALENDÁRIO DINÂMICO ---
  subAbaAtividade: { marginTop: 10, backgroundColor: '#F8F9FA', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#E1E8ED' },
  subAbaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  subAbaTitulo: { fontSize: 14, fontWeight: 'bold', color: '#4169E1' },
  calendarioContainer: { backgroundColor: '#FFF', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#E1E8ED', marginBottom: 12 },
  calendarioHeaderNavegacao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingHorizontal: 10 },
  btnSetas: { padding: 5, justifyContent: 'center', alignItems: 'center' },
  mesTitulo: { fontWeight: 'bold', color: '#333', fontSize: 16 },
  diasGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  diaBotao: { width: '13.5%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', margin: '0.7%', borderRadius: 6, backgroundColor: '#F1F3F5', position: 'relative' },
  diaSelecionado: { backgroundColor: '#4169E1' },
  diaComInfo: { backgroundColor: '#4169E122', borderWidth: 1, borderColor: '#4169E155' },
  diaTexto: { fontSize: 12, fontWeight: '500', color: '#333' },
  diaTextoSelecionado: { color: '#FFF', fontWeight: 'bold' },
  pontoIndicador: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FF6347', position: 'absolute', bottom: 3 },
  legendaInputTitulo: { fontSize: 13, fontWeight: 'bold', color: '#555', marginBottom: 6, marginTop: 4 },
  textArea: { backgroundColor: '#FFF', padding: 10, borderRadius: 6, fontSize: 13, textAlignVertical: 'top', borderWidth: 1, borderColor: '#E1E8ED', color: '#000', minHeight: 70 },
  btnSalvarNota: { backgroundColor: '#4169E1', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  btnSalvarNotaTexto: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },

  bottomTab: { flexDirection: 'row', backgroundColor: '#FFF', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#E1E8ED', justifyContent: 'space-around' },
  tabItem: { alignItems: 'center', flex: 1 },
  tabText: { fontSize: 11, color: '#000', marginTop: 4 }
});
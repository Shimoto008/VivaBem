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

  // --- GERADOR DE CALENDÁRIO VISUAL ---
  const renderCalendario = (idoso) => {
    const quantidadeDias = new Date(anoAtual, mesAtual + 1, 0).getDate();
    const diasDoMes = Array.from({ length: quantidadeDias }, (_, i) => i + 1);

    return (
      <View style={styles.calendarioContainer}>
        <View style={styles.calendarioHeaderNavegacao}>
          <TouchableOpacity onPress={handleMesAnterior} style={styles.btnSetas}>
            <MaterialIcons name="chevron-left" size={28} color="#4169E1" />
          </TouchableOpacity>
          <Text style={styles.mesTitulo}>{nomesDosMeses[mesAtual]} {anoAtual}</Text>
          <TouchableOpacity onPress={handleMesSeguinte} style={styles.btnSetas}>
            <MaterialIcons name="chevron-right" size={28} color="#4169E1" />
          </TouchableOpacity>
        </View>

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
                onPress={() => alternarDiaCalendario(dia, idoso)}
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
          <Text style={styles.legendaInputTitulo}>Legenda para o dia {diaSelecionado} de {nomesDosMeses[mesAtual]}:</Text>
          <TextInput style={styles.textArea} placeholder="Digite compromissos..." multiline={true} value={textoAgenda} onChangeText={setTextoAgenda} />
          <TouchableOpacity style={styles.btnSalvarNota} onPress={() => handleSalvarAtividade('agenda', textoAgenda)}><Text style={styles.btnSalvarNotaTexto}>Salvar na Agenda do Dia</Text></TouchableOpacity>
        </View>
      );
    }

    let titulo = ''; let placeholder = ''; let valorTexto = ''; let setValorTexto = () => {};
    if (subAtividadeAtiva === 'relatorios') { titulo = 'Relatório Diário'; placeholder = 'Evolução...'; valorTexto = textoRelatorio; setValorTexto = setTextoRelatorio; }
    if (subAtividadeAtiva === 'medicaçao') { titulo = 'Nova Medicação'; placeholder = 'Remédios...'; valorTexto = textoMedicao; setValorTexto = setTextoMedicao; }
    if (subAtividadeAtiva === 'observaçao') { titulo = 'Observação'; placeholder = 'Avisos...'; valorTexto = textoObservacao; setValorTexto = setTextoObservacao; }

    return (
      <View style={styles.subAbaAtividade}>
        <View style={styles.subAbaHeader}><Text style={styles.subAbaTitulo}>{titulo}</Text><TouchableOpacity onPress={() => setSubAtividadeAtiva(null)}><MaterialIcons name="cancel" size={22} color="#FF6347" /></TouchableOpacity></View>
        <TextInput style={styles.textArea} placeholder={placeholder} multiline={true} value={valorTexto} onChangeText={setValorTexto} />
        <TouchableOpacity style={styles.btnSalvarNota} onPress={() => handleSalvarAtividade(subAtividadeAtiva, valorTexto)}><Text style={styles.btnSalvarNotaTexto}>Salvar Registro</Text></TouchableOpacity>
      </View>
    );
  };

  // --- SEÇÃO DE HISTÓRICO VISUAL ---
  const renderHistoricoLabels = (idoso) => {
    const chavesAgenda = Object.keys(idoso.historicoAgenda).filter(key => idoso.historicoAgenda[key]);
    const possuiDados = chavesAgenda.length > 0 || idoso.historicoRelatorios.length > 0 || idoso.historicoMedicacao.length > 0 || idoso.historicoObservacoes.length > 0;
    if (!possuiDados) return null;

    return (
      <View style={styles.containerHistoricoLabels}>
        <Text style={styles.tituloLinhaTempo}>Atividades Cadastradas</Text>
        {chavesAgenda.map((chave) => {
          const [ano, mes, dia] = chave.split('-');
          return (
            <View key={chave} style={[styles.cardLabelHistorico, { borderLeftColor: '#4169E1' }]}>
              <View style={styles.labelHeaderHistorico}>
                <View style={styles.labelTagIcon}><MaterialIcons name="event" size={16} color="#4169E1" /><Text style={[styles.txtTagLabel, { color: '#4169E1' }]}>Agenda ({dia}/{parseInt(mes) + 1}/{ano})</Text></View>
                <TouchableOpacity style={styles.btnEditarLabel} onPress={() => handleEditarItem('agenda', null, chave)}><MaterialIcons name="edit" size={16} color="#666" /></TouchableOpacity>
              </View>
              <Text style={styles.txtConteudoLabel}>{idoso.historicoAgenda[chave]}</Text>
            </View>
          );
        })}
        {/* Relatórios */}
        {idoso.historicoRelatorios.map((item) => (
          <View key={item.id} style={[styles.cardLabelHistorico, { borderLeftColor: '#20B2AA' }]}>
            <View style={styles.labelHeaderHistorico}>
              <View style={styles.labelTagIcon}><MaterialIcons name="assessment" size={16} color="#20B2AA" /><Text style={[styles.txtTagLabel, { color: '#20B2AA' }]}>Relatório ({item.data})</Text></View>
              <TouchableOpacity style={styles.btnEditarLabel} onPress={() => handleEditarItem('relatorios', item)}><MaterialIcons name="edit" size={16} color="#666" /></TouchableOpacity>
            </View>
            <Text style={styles.txtConteudoLabel}>{item.conteudo}</Text>
          </View>
        ))}
        {/* Medicações */}
        {idoso.historicoMedicacao.map((item) => (
          <View key={item.id} style={[styles.cardLabelHistorico, { borderLeftColor: '#9370DB' }]}>
            <View style={styles.labelHeaderHistorico}>
              <View style={styles.labelTagIcon}><MaterialIcons name="healing" size={16} color="#9370DB" /><Text style={[styles.txtTagLabel, { color: '#9370DB' }]}>Medicação ({item.data})</Text></View>
              <TouchableOpacity style={styles.btnEditarLabel} onPress={() => handleEditarItem('medicaçao', item)}><MaterialIcons name="edit" size={16} color="#666" /></TouchableOpacity>
            </View>
            <Text style={styles.txtConteudoLabel}>{item.conteudo}</Text>
          </View>
        ))}
        {/* Observações */}
        {idoso.historicoObservacoes.map((item) => (
          <View key={item.id} style={[styles.cardLabelHistorico, { borderLeftColor: '#FF6347' }]}>
            <View style={styles.labelHeaderHistorico}>
              <View style={styles.labelTagIcon}><MaterialIcons name="notification-important" size={16} color="#FF6347" /><Text style={[styles.txtTagLabel, { color: '#FF6347' }]}>Observação ({item.data})</Text></View>
              <TouchableOpacity style={styles.btnEditarLabel} onPress={() => handleEditarItem('observaçao', item)}><MaterialIcons name="edit" size={16} color="#666" /></TouchableOpacity>
            </View>
            <Text style={styles.txtConteudoLabel}>{item.conteudo}</Text>
          </View>
        ))}
      </View>
    );
  };

  // --- COMPONENTE DE SELEÇÃO DE AÇÕES ---
  const renderAcoesPaciente = (idoso) => (
    <View style={styles.containerAcoes}>
      <View style={styles.topoAcoes}>
        <Text style={styles.tituloAcoes}>Painel do Paciente - {idoso.nome}</Text>
        <TouchableOpacity onPress={() => { setPacienteSelecionado(null); setSubAtividadeAtiva(null); }}><MaterialIcons name="close" size={20} color="#666" /></TouchableOpacity>
      </View>
      <View style={styles.gridAcoes}>
        <TouchableOpacity style={[styles.btnAcaoCard, subAtividadeAtiva === 'agenda' && styles.btnAtivo]} onPress={() => handleAbrirSubAtividade('agenda', idoso)}><MaterialIcons name="event" size={24} color="#4169E1" /><Text style={styles.txtAcaoCard}>Agenda</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.btnAcaoCard, subAtividadeAtiva === 'relatorios' && styles.btnAtivo]} onPress={() => handleAbrirSubAtividade('relatorios', idoso)}><MaterialIcons name="assessment" size={24} color="#4169E1" /><Text style={styles.txtAcaoCard}>Relatórios</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.btnAcaoCard, subAtividadeAtiva === 'medicaçao' && styles.btnAtivo]} onPress={() => handleAbrirSubAtividade('medicaçao', idoso)}><MaterialIcons name="healing" size={24} color="#4169E1" /><Text style={styles.txtAcaoCard}>Medicação</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.btnAcaoCard, subAtividadeAtiva === 'observaçao' && styles.btnAtivo]} onPress={() => handleAbrirSubAtividade('observaçao', idoso)}><MaterialIcons name="notification-important" size={24} color="#FF6347" /><Text style={styles.txtAcaoCard}>Observação</Text></TouchableOpacity>
      </View>
      {renderFormAtividade(idoso)}
      {renderHistoricoLabels(idoso)}
    </View>
  );

  // --- RENDERS DAS TELAS PRINCIPAIS ---
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
            {pacienteSelecionado?.id === idoso.id && renderAcoesPaciente(pacienteSelecionado)}
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
          {pacienteSelecionado?.id === idoso.id && renderAcoesPaciente(pacienteSelecionado)}
        </View>
      ))}
    </View>
  );

  // --- NOVA TELA: ÁREA DO CUIDADOR (PERFIL PROFISSIONAL) ---
  const renderPerfilCuidador = () => (
    <View style={styles.containerAbas}>
      {/* Header do Perfil */}
      <View style={styles.headerPerfil}>
        <View style={styles.avatarEsquerda}>
          <FontAwesome5 name="user-md" size={42} color="#4169E1" />
        </View>
        <View style={styles.infoDireitaPerfil}>
          <Text style={styles.nomeCuidador}>Carlos Alberto Silva</Text>
          <Text style={styles.subtituloCuidador}>Cuidador de Idosos Particular</Text>
          <TouchableOpacity style={styles.btnEditarPerfil} onPress={() => Alert.alert('Aviso', 'Edição de perfil será implementada em breve!')}>
            <MaterialIcons name="edit" size={14} color="#FFF" />
            <Text style={styles.txtBtnEditarPerfil}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Seção: Biografia / Bibliografia */}
      <View style={styles.cardSecaoPerfil}>
        <View style={styles.tituloSecaoPerfilContainer}>
          <MaterialIcons name="description" size={20} color="#4169E1" />
          <Text style={styles.tituloSecaoPerfil}>Biografia & Filosofia de Trabalho</Text>
        </View>
        <Text style={styles.conteudoTextoPerfil}>
          Profissional dedicado ao bem-estar e saúde na terceira idade com mais de 5 anos de experiência. Focado em atendimento humanizado, controle rigoroso de medicações e estímulo a atividades cognitivas e motoras para manutenção da autonomia do idoso.
        </Text>
      </View>

      {/* Seção: Experiências */}
      <View style={styles.cardSecaoPerfil}>
        <View style={styles.tituloSecaoPerfilContainer}>
          <MaterialIcons name="work" size={20} color="#4169E1" />
          <Text style={styles.tituloSecaoPerfil}>Experiências Profissionais</Text>
        </View>
        <View style={styles.itemExperiencia}>
          <Text style={styles.cargoExperiencia}>Cuidador Home Care - Lar Doce Lar</Text>
          <Text style={styles.periodoExperiencia}>Jan 2023 - Presente (3 anos)</Text>
          <Text style={styles.detalheExperiencia}>Acompanhamento integral de idosos pós-cirúrgicos, gerenciamento de rotinas diárias e suporte em reabilitação física.</Text>
        </View>
        <View style={styles.itemExperiencia}>
          <Text style={styles.cargoExperiencia}>Acompanhante de Idosos - Particular</Text>
          <Text style={styles.periodoExperiencia}>Mar 2021 - Dez 2022</Text>
          <Text style={styles.detalheExperiencia}>Cuidados gerais, preparação de alimentação balanceada conforme orientação médica e acompanhamento em consultas.</Text>
        </View>
      </View>

      {/* Seção: Formação / Certificações */}
      <View style={styles.cardSecaoPerfil}>
        <View style={styles.tituloSecaoPerfilContainer}>
          <MaterialIcons name="verified" size={20} color="#4169E1" />
          <Text style={styles.tituloSecaoPerfil}>Formação e Certificados</Text>
        </View>
        <Text style={styles.conteudoTextoPerfil}>• Curso Profissionalizante de Cuidador de Idosos - SENAC (180h)</Text>
        <Text style={styles.conteudoTextoPerfil}>• Especialização em Primeiros Socorros na Terceira Idade - Cruz Vermelha</Text>
        <Text style={styles.conteudoTextoPerfil}>• Workshop de Introdução aos Cuidados de Pacientes com Alzheimer</Text>
      </View>
    </View>
  );

  const renderConteudo = () => {
    if (abaAtiva === 'home') return renderHome();
    if (abaAtiva === 'paciente') return renderPaciente();
    if (abaAtiva === 'perfil') return renderPerfilCuidador();
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>{renderConteudo()}</ScrollView>
        <View style={styles.bottomTab}>
          <TouchableOpacity style={styles.tabItem} onPress={() => setAbaAtiva('home')}><MaterialIcons name="home" size={28} color={abaAtiva === 'home' ? '#4169E1' : '#000'} /><Text style={styles.tabText}>Home</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => setAbaAtiva('paciente')}><FontAwesome5 name="user-injured" size={22} color={abaAtiva === 'paciente' ? '#4169E1' : '#000'} /><Text style={styles.tabText}>Paciente</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => setAbaAtiva('perfil')}><MaterialIcons name="account-circle" size={28} color={abaAtiva === 'perfil' ? '#4169E1' : '#000'} /><Text style={styles.tabText}>Perfil</Text></TouchableOpacity>
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
  tabText: { fontSize: 11, color: '#000', marginTop: 4 },
  containerHistoricoLabels: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#E1E8ED', paddingTop: 15 },
  tituloLinhaTempo: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  cardLabelHistorico: { backgroundColor: '#F8F9FA', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E1E8ED', borderLeftWidth: 4, marginBottom: 10 },
  labelHeaderHistorico: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  labelTagIcon: { flexDirection: 'row', alignItems: 'center' },
  txtTagLabel: { fontSize: 11, fontWeight: 'bold', marginLeft: 6 },
  btnEditarLabel: { padding: 4 },
  txtConteudoLabel: { fontSize: 13, color: '#222', lineHeight: 18 },

  // --- NOVOS ESTILOS EXCLUSIVOS DA TELA DE PERFIL ---
  headerPerfil: { flexDirection: 'row', backgroundColor: '#FFF', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#E1E8ED', alignItems: 'center', marginBottom: 15 },
  avatarEsquerda: { width: 75, height: 75, borderRadius: 37.5, backgroundColor: '#4169E115', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#4169E133' },
  infoDireitaPerfil: { marginLeft: 20, flex: 1 },
  nomeCuidador: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  subtituloCuidador: { fontSize: 13, color: '#666', marginTop: 2, marginBottom: 8 },
  btnEditarPerfil: { flexDirection: 'row', backgroundColor: '#4169E1', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, alignItems: 'center', alignSelf: 'flex-start' },
  txtBtnEditarPerfil: { color: '#FFF', fontSize: 11, fontWeight: 'bold', marginLeft: 4 },
  cardSecaoPerfil: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E1E8ED', marginBottom: 15 },
  tituloSecaoPerfilContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F1F3F5', paddingBottom: 6 },
  tituloSecaoPerfil: { fontSize: 14, fontWeight: 'bold', color: '#333', marginLeft: 8 },
  conteudoTextoPerfil: { fontSize: 13, color: '#555', lineHeight: 20, marginBottom: 4 },
  itemExperiencia: { marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F8F9FA', paddingBottom: 8 },
  cargoExperiencia: { fontSize: 13, fontWeight: 'bold', color: '#4169E1' },
  periodoExperiencia: { fontSize: 11, color: '#999', marginVertical: 2 },
  detalheExperiencia: { fontSize: 12, color: '#555', lineHeight: 16 }
});
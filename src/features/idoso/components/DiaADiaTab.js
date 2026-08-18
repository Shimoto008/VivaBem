import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { getStyles } from '../../idoso/components/DiaADiatab.styles';
import { useTheme } from '../../../contexts/ThemeContext';
import { useSession } from '../../../contexts/SessionContext';
import { ROUTES } from '../../../constants/routeNames';
import { aplicarMascaraTelefone } from '../../../utils/masks';
import { AvatarPerfil } from '../../../components/ui';

const CHAVE_PERMISSAO_WHATSAPP = '@permissao_whatsapp_emergencia';

const ATALHOS = [
  {
    rota: ROUTES.MEDICACAO,
    titulo: 'Medicações',
    iconName: 'medication',
  },
  {
    rota: ROUTES.CALENDARIO,
    titulo: 'Tarefas',
    iconName: 'event-note',
  },
  {
    rota: ROUTES.EXERCICIOS || 'Exercicios',
    titulo: 'Exercícios',
    iconName: 'fitness-center',
  },
  {
    rota: ROUTES.OBSERVACOES,
    titulo: 'Saúde',
    iconName: 'monitor-heart',
  },
];

function obterSaudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function DiaADiaTab() {
  const navigation = useNavigation();
  const { perfil: idoso } = useSession();
  const { themeColors, primaryColor } = useTheme();
  const styles = getStyles(themeColors);

  const [modalWhatsappVisivel, setModalWhatsappVisivel] = useState(false);
  const [modalSosVisivel, setModalSosVisivel] = useState(false);

  const primeiroNome = (idoso?.nome ?? 'você').split(' ')[0];
  const contatoEmergencia = idoso?.contato_emergencia;

  function navegarPara(rota) {
    navigation.navigate(rota, {
      idoso: idoso,
      cuidadorId: null,
    });
  }

  // Abre o aplicativo nativo do Telefone direto no discador
  async function fazerChamada(numero) {
    setModalSosVisivel(false);
    setModalWhatsappVisivel(false);

    if (!numero) {
      Alert.alert('Erro', 'Número de telefone não informado.');
      return;
    }

    // Garante que só existam números na string
    const numeroLimpo = String(numero).replace(/\D/g, '');
    const url = `tel:${numeroLimpo}`;

    try {
      // Dispara direto para o app de telefone do celular
      await Linking.openURL(url);
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir o aplicativo de telefone.');
    }
  }

  // Enviar mensagem via WhatsApp
  async function enviarMensagemWhatsApp() {
    setModalWhatsappVisivel(false);
    
    if (!contatoEmergencia) {
      Alert.alert('Erro', 'Contato de emergência não encontrado.');
      return;
    }

    const numeroLimpo = contatoEmergencia.replace(/\D/g, '');
    const numeroComDDI = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`;
    const mensagem = encodeURIComponent(`Olá! Sou ${primeiroNome} e preciso de ajuda urgente!`);

    const urlWhatsapp = `whatsapp://send?phone=${numeroComDDI}&text=${mensagem}`;
    const urlWeb = `https://wa.me/${numeroComDDI}?text=${mensagem}`;

    try {
      const suportado = await Linking.canOpenURL(urlWhatsapp);
      if (suportado) {
        await Linking.openURL(urlWhatsapp);
      } else {
        await Linking.openURL(urlWeb);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
    }
  }

  // Abrir modal de opções de contato pessoal
  async function abrirOpcoesEmergenciaPessoal() {
    if (!contatoEmergencia) {
      Alert.alert(
        'Contato não cadastrado',
        'Cadastre um telefone de emergência no perfil para usar esta função.'
      );
      return;
    }

    try {
      const jaPermitiu = await AsyncStorage.getItem(CHAVE_PERMISSAO_WHATSAPP);

      if (jaPermitiu === 'true') {
        setModalWhatsappVisivel(true);
      } else {
        Alert.alert(
          'Permissão de Acesso',
          'Deseja permitir que o aplicativo abra seu Telefone ou WhatsApp para acionar seu contato?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Permitir',
              onPress: async () => {
                await AsyncStorage.setItem(CHAVE_PERMISSAO_WHATSAPP, 'true');
                setModalWhatsappVisivel(true);
              },
            },
          ]
        );
      }
    } catch {
      setModalWhatsappVisivel(true);
    }
  }

  return (
    <View style={styles.containerAbas}>
      {/* CARD DE BOAS-VINDAS */}
      <View style={styles.boasVindasCard}>
        <View style={styles.boasVindasTopo}>
          <View style={{ flex: 1 }}>
            <Text style={styles.saudacao}>{obterSaudacao()},</Text>
            <Text style={styles.nomeDestaque}>{primeiroNome}</Text>
          </View>
          <AvatarPerfil
            uri={idoso?.foto_url}
            size={56}
            iconName="person"
            iconSize={28}
            backgroundColor={`${primaryColor}22`}
            iconColor={primaryColor}
          />
        </View>
        <Text style={styles.subtituloBoasVindas}>
          Acompanhe suas rotinas, faça seus exercícios e acione a emergência quando precisar.
        </Text>
      </View>

      {/* GRID DE ATALHOS */}
      <View style={styles.grid}>
        {ATALHOS.map((item) => (
          <TouchableOpacity
            key={item.rota}
            style={styles.cardAtalho}
            onPress={() => navegarPara(item.rota)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={item.titulo}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name={item.iconName} size={48} color={primaryColor} />
            </View>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ÁREA DE EMERGÊNCIA */}
      <View style={styles.cardEmergenciaContainer}>
        <View style={styles.emergenciaRow}>
          {/* BOTÃO VERMELHO "EMERGÊNCIA" */}
          <TouchableOpacity
            style={styles.botaoEmergenciaPrincipal}
            onPress={abrirOpcoesEmergenciaPessoal}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Abrir opções de emergência pessoal"
          >
            <MaterialIcons name="phone-in-talk" size={34} color="#FFFFFF" />
            <Text style={styles.textoEmergenciaBranco}>Emergência</Text>
          </TouchableOpacity>

          {/* BOTÃO "SOS" */}
          <TouchableOpacity
            style={styles.botaoEmergenciaSecundarioCard}
            onPress={() => setModalSosVisivel(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Abrir opções de SOS"
          >
            <MaterialIcons name="sos" size={38} color={primaryColor} />
            <Text style={[styles.textoEmergencia, { color: primaryColor }]}>
              SOS
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MINI ABA DO BOTÃO EMERGÊNCIA (CONTATO PESSOAL) */}
      <Modal
        visible={modalWhatsappVisivel}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalWhatsappVisivel(false)}
      >
        <TouchableOpacity 
          style={styles.fundoEscuroModal} 
          activeOpacity={1} 
          onPress={() => setModalWhatsappVisivel(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.miniAbaModal}>
            <View style={styles.barraHeaderModal} />
            <Text style={styles.tituloModal}>Contato de Emergência</Text>

            {/* OPÇÃO 1: MENSAGEM NO WHATSAPP */}
            <TouchableOpacity 
              style={[styles.opcaoBotaoModal, { backgroundColor: '#E8F5E9' }]} 
              onPress={enviarMensagemWhatsApp}
            >
              <MaterialIcons name="message" size={26} color="#25D366" />
              <View style={styles.textoContainerModal}>
                <Text style={styles.tituloOpcaoModal}>Enviar WhatsApp</Text>
                <Text style={styles.subtituloOpcaoModal}>Manda mensagem de socorro no WhatsApp</Text>
              </View>
            </TouchableOpacity>

            {/* OPÇÃO 2: LIGAÇÃO DIRETA VIA TELEFONE DO CELULAR */}
            <TouchableOpacity 
              style={[styles.opcaoBotaoModal, { backgroundColor: '#FFEBEE' }]} 
              onPress={() => fazerChamada(contatoEmergencia)}
            >
              <MaterialIcons name="phone" size={26} color="#D32F2F" />
              <View style={styles.textoContainerModal}>
                <Text style={styles.tituloOpcaoModal}>Ligar pelo Celular</Text>
                <Text style={styles.subtituloOpcaoModal}>
                  {contatoEmergencia ? aplicarMascaraTelefone(contatoEmergencia) : 'Discar para o contato'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.botaoCancelarModal} 
              onPress={() => setModalWhatsappVisivel(false)}
            >
              <Text style={styles.textoCancelarModal}>Cancelar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* MINI ABA DO BOTÃO SOS (SERVIÇOS PÚBLICOS DE EMERGÊNCIA) */}
      <Modal
        visible={modalSosVisivel}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalSosVisivel(false)}
      >
        <TouchableOpacity 
          style={styles.fundoEscuroModal} 
          activeOpacity={1} 
          onPress={() => setModalSosVisivel(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.miniAbaModal}>
            <View style={styles.barraHeaderModal} />
            <Text style={styles.tituloModal}>Ligar para Emergência</Text>

            <TouchableOpacity 
              style={styles.opcaoBotaoModal} 
              onPress={() => fazerChamada('192')}
            >
              <MaterialIcons name="local-hospital" size={26} color="#D32F2F" />
              <View style={styles.textoContainerModal}>
                <Text style={styles.tituloOpcaoModal}>SAMU</Text>
                <Text style={styles.subtituloOpcaoModal}>Discar 192</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.opcaoBotaoModal} 
              onPress={() => fazerChamada('190')}
            >
              <MaterialIcons name="local-police" size={26} color="#0D47A1" />
              <View style={styles.textoContainerModal}>
                <Text style={styles.tituloOpcaoModal}>Polícia Militar</Text>
                <Text style={styles.subtituloOpcaoModal}>Discar 190</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.opcaoBotaoModal} 
              onPress={() => fazerChamada('193')}
            >
              <MaterialIcons name="local-fire-department" size={26} color="#E65100" />
              <View style={styles.textoContainerModal}>
                <Text style={styles.tituloOpcaoModal}>Bombeiros</Text>
                <Text style={styles.subtituloOpcaoModal}>Discar 193</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.opcaoBotaoModal} 
              onPress={() => fazerChamada('100')}
            >
              <MaterialIcons name="security" size={26} color="#2E7D32" />
              <View style={styles.textoContainerModal}>
                <Text style={styles.tituloOpcaoModal}>Disque 100</Text>
                <Text style={styles.subtituloOpcaoModal}>Violência contra o Idoso</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.botaoCancelarModal} 
              onPress={() => setModalSosVisivel(false)}
            >
              <Text style={styles.textoCancelarModal}>Cancelar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
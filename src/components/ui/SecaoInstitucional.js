import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../../contexts/ThemeContext';
import { radius, spacing, typography } from '../../theme';

const VERSAO_APP = '1.0.0';

const TEXTO_TERMOS = `Bem-vindo ao VivaBem. Ao utilizar este aplicativo, você concorda com os termos abaixo.

1. Uso do aplicativo
O VivaBem destina-se a facilitar a comunicação e o acompanhamento entre cuidadores e familiares no cuidado de idosos. O uso deve ser feito de forma responsável, ética e em conformidade com a legislação vigente.

2. Conta e responsabilidade
Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta. Informações cadastrais devem ser verdadeiras e atualizadas.

3. Conteúdo e comunicação
Mensagens, relatórios e demais informações compartilhadas no app devem respeitar a privacidade das pessoas envolvidas. É proibido o uso do aplicativo para assédio, fraude, divulgação de dados de terceiros sem autorização ou qualquer atividade ilícita.

4. Privacidade e dados
Tratamos dados pessoais necessários ao funcionamento do serviço (cadastro, vínculo cuidador–familiar e comunicação). Não vendemos seus dados. Você pode solicitar a atualização ou exclusão de informações conforme as funcionalidades disponíveis e a legislação aplicável (incluindo a LGPD).

5. Limitação
O VivaBem é uma ferramenta de apoio e não substitui orientação médica, diagnósticos ou atendimentos de emergência. Em situações de urgência, procure os serviços de saúde competentes.

6. Alterações
Estes termos podem ser atualizados periodicamente. O uso contínuo do aplicativo após alterações constitui aceite das novas condições.

Em caso de dúvidas, entre em contato com a equipe responsável pelo VivaBem.`;

const TEXTO_SOBRE = `O VivaBem é um aplicativo criado para aproximar cuidadores e familiares, organizando o dia a dia do cuidado com mais clareza, segurança e carinho.

Nossa missão é apoiar quem cuida e quem ama, oferecendo vínculo, comunicação e acompanhamento de forma simples e acessível.

Versão atual: ${VERSAO_APP}

Créditos
Desenvolvido pela equipe VivaBem.
Tecnologias: React Native (Expo) e Supabase.`;

/**
 * Seção "Institucional" das Configurações: Termos de Uso e Sobre o App.
 */
export function SecaoInstitucional() {
  const { themeColors, primaryColor } = useTheme();
  const styles = getStyles(themeColors);
  const [modalAtivo, setModalAtivo] = useState(null);

  const conteudo =
    modalAtivo === 'termos'
      ? { titulo: 'Termos de Uso', texto: TEXTO_TERMOS }
      : modalAtivo === 'sobre'
        ? { titulo: 'Sobre o App', texto: TEXTO_SOBRE }
        : null;

  return (
    <>
      <Text style={styles.secaoTitulo}>Institucional</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.linhaOpcao}
          onPress={() => setModalAtivo('termos')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Abrir Termos de Uso"
        >
          <View style={styles.linhaEsquerda}>
            <View style={[styles.iconeAcao, { backgroundColor: `${primaryColor}15` }]}>
              <MaterialIcons name="description" size={22} color={primaryColor} />
            </View>
            <Text style={styles.opcaoTexto}>Termos de Uso</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={themeColors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.divisor} />

        <TouchableOpacity
          style={styles.linhaOpcao}
          onPress={() => setModalAtivo('sobre')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Abrir Sobre o App"
        >
          <View style={styles.linhaEsquerda}>
            <View style={[styles.iconeAcao, { backgroundColor: `${primaryColor}15` }]}>
              <MaterialIcons name="info-outline" size={22} color={primaryColor} />
            </View>
            <Text style={styles.opcaoTexto}>Sobre o App</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={themeColors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={!!modalAtivo}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalAtivo(null)}
      >
        <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitulo}>{conteudo?.titulo}</Text>
            <TouchableOpacity
              onPress={() => setModalAtivo(null)}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
            >
              <MaterialIcons name="close" size={28} color={themeColors.textPrimary} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.modalConteudo}
            contentContainerStyle={styles.modalConteudoPadding}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.textoConteudo}>{conteudo?.texto}</Text>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    secaoTitulo: {
      ...typography.caption,
      fontWeight: '700',
      textTransform: 'uppercase',
      color: colors.textSecondary,
      marginBottom: spacing.sm,
      marginLeft: spacing.xs,
    },
    card: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radius.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    linhaOpcao: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
    },
    linhaEsquerda: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconeAcao: {
      width: 40,
      height: 40,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    opcaoTexto: {
      ...typography.bodyBold,
      color: colors.textPrimary,
      marginLeft: spacing.md,
    },
    divisor: { height: 1, backgroundColor: colors.divider },
    modalContainer: { flex: 1, padding: spacing.lg, paddingTop: spacing.xl * 1.5 },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    modalTitulo: {
      ...typography.title2,
      fontWeight: 'bold',
      color: colors.textPrimary,
      flex: 1,
      marginRight: spacing.md,
    },
    modalConteudo: { flex: 1 },
    modalConteudoPadding: { paddingBottom: spacing.xl * 2 },
    textoConteudo: {
      ...typography.body,
      color: colors.textPrimary,
      lineHeight: 24,
    },
  });

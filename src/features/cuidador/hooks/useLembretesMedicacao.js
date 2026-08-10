import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import {
  agendarLembreteMedicacao,
  cancelarLembreteMedicacao,
  listarMedicacoesComLembrete,
} from '../../../services/lembreteService';
import { abrirDespertadorNativo } from '../../../utils/nativeAlarm';

/**
 * Controla os lembretes diários de medicação. O estado real mora no
 * agendador do sistema operacional, então a lista é relida do próprio
 * `expo-notifications` em vez de duplicada em outro lugar.
 */
export function useLembretesMedicacao() {
  const [idsComLembrete, setIdsComLembrete] = useState([]);

  const recarregar = useCallback(async () => {
    try {
      setIdsComLembrete(await listarMedicacoesComLembrete());
    } catch {
      // Em ambientes sem suporte a notificações o resto da tela deve continuar funcionando.
      setIdsComLembrete([]);
    }
  }, []);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  const temLembrete = useCallback(
    (medicacaoId) => idsComLembrete.includes(medicacaoId),
    [idsComLembrete]
  );

  const alternarLembrete = useCallback(
    async (medicacao) => {
      if (temLembrete(medicacao.id)) {
        await cancelarLembreteMedicacao(medicacao.id);
        await recarregar();
        Alert.alert('Lembrete desativado', `O aviso diário de ${medicacao.nome} foi removido.`);
        return;
      }

      try {
        await agendarLembreteMedicacao(medicacao);
        await recarregar();
        Alert.alert(
          'Lembrete ativado',
          `Você será avisado todos os dias às ${medicacao.horario} sobre ${medicacao.nome}.`
        );
      } catch (erro) {
        // O despertador do próprio aparelho é a alternativa quando o app não
        // consegue agendar (permissão negada, medicação sem horário).
        Alert.alert(
          'Não foi possível criar o lembrete',
          erro.message ?? 'Tente novamente em alguns instantes.',
          [
            { text: 'Fechar', style: 'cancel' },
            { text: 'Abrir despertador', onPress: abrirDespertadorNativo },
          ]
        );
      }
    },
    [temLembrete, recarregar]
  );

  /** Usado ao excluir a medicação: o lembrete não pode sobreviver ao registro. */
  const removerLembrete = useCallback(
    async (medicacaoId) => {
      try {
        await cancelarLembreteMedicacao(medicacaoId);
        await recarregar();
      } catch {
        // Nada a fazer: o lembrete simplesmente não existia.
      }
    },
    [recarregar]
  );

  /** Usado ao editar: mantém o aviso em dia quando o horário ou a dose mudam. */
  const reagendarSeAtivo = useCallback(
    async (medicacao) => {
      if (!temLembrete(medicacao.id)) return;

      try {
        await agendarLembreteMedicacao(medicacao);
        await recarregar();
      } catch {
        // Se o reagendamento falhar, o lembrete antigo já foi cancelado e o
        // cuidador vê o botão voltar para "Configurar lembrete".
        await recarregar();
      }
    },
    [temLembrete, recarregar]
  );

  return { temLembrete, alternarLembrete, removerLembrete, reagendarSeAtivo };
}

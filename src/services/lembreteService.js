import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { DomainError } from './errors';

const CANAL_ANDROID = 'lembretes-medicacao';
const PREFIXO_IDENTIFICADOR = 'medicacao-';
const PADRAO_VIBRACAO = [0, 250, 250, 250];

// Sem handler, uma notificação que chega com o app aberto é descartada em vez
// de aparecer para o cuidador.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** O identificador determinístico permite cancelar/reagendar sem guardar nada localmente. */
function identificadorDe(medicacaoId) {
  return `${PREFIXO_IDENTIFICADOR}${medicacaoId}`;
}

function interpretarHorario(horario) {
  const [hora, minuto] = String(horario ?? '')
    .split(':')
    .map((parte) => Number(parte));

  const valido =
    Number.isInteger(hora) && Number.isInteger(minuto) &&
    hora >= 0 && hora <= 23 && minuto >= 0 && minuto <= 59;

  return valido ? { hora, minuto } : null;
}

async function prepararCanalAndroid() {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(CANAL_ANDROID, {
    name: 'Lembretes de medicação',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: PADRAO_VIBRACAO,
    sound: 'default',
  });
}

async function garantirPermissao() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return;

  const { status: statusSolicitado } = await Notifications.requestPermissionsAsync();
  if (statusSolicitado !== 'granted') {
    throw new DomainError(
      'As notificações estão bloqueadas para o VivaBem. Libere-as nas configurações do aparelho para receber os lembretes.'
    );
  }
}

/** IDs das medicações que já têm lembrete diário agendado neste aparelho. */
export async function listarMedicacoesComLembrete() {
  const agendadas = await Notifications.getAllScheduledNotificationsAsync();

  return agendadas
    .map((notificacao) => notificacao.identifier ?? '')
    .filter((identificador) => identificador.startsWith(PREFIXO_IDENTIFICADOR))
    .map((identificador) => identificador.slice(PREFIXO_IDENTIFICADOR.length));
}

export async function cancelarLembreteMedicacao(medicacaoId) {
  await Notifications.cancelScheduledNotificationAsync(identificadorDe(medicacaoId));
}

/**
 * Agenda (ou reagenda) uma notificação diária no horário da medicação. Os
 * lembretes vivem no aparelho, não no Supabase: quem recebe é o cuidador que
 * configurou, no dispositivo dele.
 */
export async function agendarLembreteMedicacao({ id, nome, quantidade, horario }) {
  const momento = interpretarHorario(horario);
  if (!momento) {
    throw new DomainError(
      'Esta medicação está sem horário. Edite a medicação e escolha um horário para ativar o lembrete.'
    );
  }

  await garantirPermissao();
  await prepararCanalAndroid();

  // Cancelar antes evita duplicar quando o horário é alterado.
  await cancelarLembreteMedicacao(id);

  await Notifications.scheduleNotificationAsync({
    identifier: identificadorDe(id),
    content: {
      title: `Hora do remédio: ${nome}`,
      body: quantidade ? `Administrar ${quantidade}.` : 'Toque para abrir o VivaBem.',
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: momento.hora,
      minute: momento.minuto,
      channelId: CANAL_ANDROID,
    },
  });

  return { hora: momento.hora, minuto: momento.minuto };
}

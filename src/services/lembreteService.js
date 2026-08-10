import { Platform } from 'react-native';
import Constants from 'expo-constants';

import { DomainError } from './errors';

const CANAL_ANDROID = 'lembretes-medicacao';
const PREFIXO_IDENTIFICADOR = 'medicacao-';
const PADRAO_VIBRACAO = [0, 250, 250, 250];

/**
 * No Expo Go (SDK 53+), push remoto via expo-notifications foi removido.
 * Lembretes locais continuam disponíveis em development builds (`expo run:*` / EAS).
 */
const isExpoGo = Constants.appOwnership === 'expo';
let avisoExpoGoExibido = false;
let Notifications = null;

function avisosExpoGoSeNecessario() {
  if (!isExpoGo || !__DEV__ || avisoExpoGoExibido) return;
  avisoExpoGoExibido = true;
  console.warn(
    '[VivaBem] Notificações remotas não estão disponíveis no Expo Go (SDK 53+). ' +
      'Use uma development build (`npx expo run:android` / EAS) para testar lembretes.'
  );
}

function garantirNotificacoesDisponiveis() {
  if (!isExpoGo) return;
  avisosExpoGoSeNecessario();
  throw new DomainError(
    'Lembretes de notificação não funcionam no Expo Go. Gere uma development build para ativá-los neste aparelho.'
  );
}

function obterNotifications() {
  if (isExpoGo) {
    avisosExpoGoSeNecessario();
    return null;
  }
  if (!Notifications) {
    // Require sob demanda evita o aviso nativo do Expo Go ao carregar o módulo.
    // eslint-disable-next-line global-require
    Notifications = require('expo-notifications');
    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    } catch (erro) {
      if (__DEV__) {
        console.warn('[VivaBem] Falha ao configurar o handler de notificações:', erro?.message ?? erro);
      }
    }
  }
  return Notifications;
}

if (isExpoGo) {
  avisosExpoGoSeNecessario();
}

/** O identificador determinístico permite cancelar/reagendar sem guardar nada localmente. */
function identificadorDe(medicacaoId) {
  return `${PREFIXO_IDENTIFICADOR}${medicacaoId}`;
}

function interpretarHorario(horario) {
  const [hora, minuto] = String(horario ?? '')
    .split(':')
    .map((parte) => Number(parte));

  const valido =
    Number.isInteger(hora) &&
    Number.isInteger(minuto) &&
    hora >= 0 &&
    hora <= 23 &&
    minuto >= 0 &&
    minuto <= 59;

  return valido ? { hora, minuto } : null;
}

async function prepararCanalAndroid(api) {
  if (Platform.OS !== 'android') return;

  await api.setNotificationChannelAsync(CANAL_ANDROID, {
    name: 'Lembretes de medicação',
    importance: api.AndroidImportance.HIGH,
    vibrationPattern: PADRAO_VIBRACAO,
    sound: 'default',
  });
}

async function garantirPermissao(api) {
  const { status } = await api.getPermissionsAsync();
  if (status === 'granted') return;

  const { status: statusSolicitado } = await api.requestPermissionsAsync();
  if (statusSolicitado !== 'granted') {
    throw new DomainError(
      'As notificações estão bloqueadas para o VivaBem. Libere-as nas configurações do aparelho para receber os lembretes.'
    );
  }
}

/** IDs das medicações que já têm lembrete diário agendado neste aparelho. */
export async function listarMedicacoesComLembrete() {
  const api = obterNotifications();
  if (!api) return [];

  try {
    const agendadas = await api.getAllScheduledNotificationsAsync();
    return agendadas
      .map((notificacao) => notificacao.identifier ?? '')
      .filter((identificador) => identificador.startsWith(PREFIXO_IDENTIFICADOR))
      .map((identificador) => identificador.slice(PREFIXO_IDENTIFICADOR.length));
  } catch (erro) {
    if (__DEV__) {
      console.warn('[VivaBem] Não foi possível listar lembretes:', erro?.message ?? erro);
    }
    return [];
  }
}

export async function cancelarLembreteMedicacao(medicacaoId) {
  const api = obterNotifications();
  if (!api) return;

  try {
    await api.cancelScheduledNotificationAsync(identificadorDe(medicacaoId));
  } catch (erro) {
    if (__DEV__) {
      console.warn('[VivaBem] Não foi possível cancelar o lembrete:', erro?.message ?? erro);
    }
  }
}

/**
 * Agenda (ou reagenda) uma notificação diária no horário da medicação. Os
 * lembretes vivem no aparelho, não no Supabase: quem recebe é o cuidador que
 * configurou, no dispositivo dele.
 */
export async function agendarLembreteMedicacao({ id, nome, quantidade, horario }) {
  garantirNotificacoesDisponiveis();

  const momento = interpretarHorario(horario);
  if (!momento) {
    throw new DomainError(
      'Esta medicação está sem horário. Edite a medicação e escolha um horário para ativar o lembrete.'
    );
  }

  const api = obterNotifications();
  if (!api) {
    garantirNotificacoesDisponiveis();
  }

  try {
    await garantirPermissao(api);
    await prepararCanalAndroid(api);

    // Cancelar antes evita duplicar quando o horário é alterado.
    await cancelarLembreteMedicacao(id);

    await api.scheduleNotificationAsync({
      identifier: identificadorDe(id),
      content: {
        title: `Hora do remédio: ${nome}`,
        body: quantidade ? `Administrar ${quantidade}.` : 'Toque para abrir o VivaBem.',
        sound: 'default',
      },
      trigger: {
        type: api.SchedulableTriggerInputTypes.DAILY,
        hour: momento.hora,
        minute: momento.minuto,
        channelId: CANAL_ANDROID,
      },
    });
  } catch (erro) {
    if (erro instanceof DomainError) throw erro;
    if (__DEV__) {
      console.warn('[VivaBem] Falha ao agendar lembrete:', erro?.message ?? erro);
    }
    throw new DomainError(
      erro?.message ?? 'Não foi possível agendar o lembrete neste dispositivo.'
    );
  }

  return { hora: momento.hora, minuto: momento.minuto };
}

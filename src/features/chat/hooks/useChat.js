import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import {
  buscarMensagens,
  enviarMensagem,
  escutarNovasMensagens,
} from '../../../services/ChatServices';

/**
 * Toda a conversa de uma tela de chat: histórico, escuta em tempo real e envio.
 * A tela cuida só da apresentação (teclado, rolagem e render dos balões).
 */
export function useChat({ euId, destinatarioId }) {
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensagemTexto, setMensagemTexto] = useState('');
  const [erro, setErro] = useState(null);
  const erroAlertadoRef = useRef(null);

  const adicionarSemDuplicar = useCallback((nova) => {
    setMensagens((anteriores) => {
      if (anteriores.some((m) => m.id === nova.id)) return anteriores;
      return [...anteriores, nova];
    });
  }, []);

  useEffect(() => {
    if (!euId || !destinatarioId) {
      setCarregando(false);
      return undefined;
    }

    let ativo = true;
    setCarregando(true);
    setErro(null);

    async function carregarHistorico() {
      try {
        const dados = await buscarMensagens({ euId, outroId: destinatarioId });
        if (ativo) setMensagens(dados);
      } catch (err) {
        if (ativo) setErro(err.message || 'Erro ao carregar mensagens.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarHistorico();

    const cancelarEscuta = escutarNovasMensagens({ euId, outroId: destinatarioId }, (nova) => {
      if (ativo) adicionarSemDuplicar(nova);
    });

    return () => {
      ativo = false;
      cancelarEscuta();
    };
  }, [euId, destinatarioId, adicionarSemDuplicar]);

  // Um alerta por erro: sem o ref, cada re-render repetiria o mesmo aviso.
  useEffect(() => {
    if (!erro || erroAlertadoRef.current === erro) return;
    erroAlertadoRef.current = erro;
    Alert.alert('Chat', erro);
  }, [erro]);

  const podeEnviar = !!mensagemTexto.trim() && !enviando && !!euId && !!destinatarioId;

  const enviar = useCallback(async () => {
    if (!podeEnviar) return;

    const texto = mensagemTexto.trim();
    setMensagemTexto('');
    setEnviando(true);
    setErro(null);

    // Mensagem otimista: aparece na hora e é substituída pela linha do banco
    // (ou removida, se o envio falhar).
    const tempId = `temp_${Date.now()}`;
    setMensagens((anteriores) => [
      ...anteriores,
      {
        id: tempId,
        remetente_id: euId,
        destinatario_id: destinatarioId,
        conteudo: texto,
        created_at: new Date().toISOString(),
      },
    ]);

    try {
      const salva = await enviarMensagem({ destinatarioId, conteudo: texto });
      setMensagens((anteriores) => {
        const semTemporaria = anteriores.filter((m) => m.id !== tempId);
        if (salva?.id && !semTemporaria.some((m) => m.id === salva.id)) {
          return [...semTemporaria, salva];
        }
        return semTemporaria;
      });
    } catch (err) {
      setMensagens((anteriores) => anteriores.filter((m) => m.id !== tempId));
      setErro(err.message || 'Não foi possível enviar a mensagem.');
    } finally {
      setEnviando(false);
    }
  }, [podeEnviar, mensagemTexto, euId, destinatarioId]);

  return {
    mensagens,
    carregando,
    enviando,
    mensagemTexto,
    setMensagemTexto,
    podeEnviar,
    enviar,
  };
}

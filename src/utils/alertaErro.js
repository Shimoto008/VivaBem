// @ts-check
import { Alert } from 'react-native';
import { mensagemErroAmigavel } from '../services/errors';

/**
 * Exibe um alerta com mensagem em português para qualquer erro capturado.
 * @param {unknown} erro
 * @param {string} [fallback]
 * @param {string} [titulo]
 */
export function mostrarErro(erro, fallback = 'Algo deu errado. Tente novamente.', titulo = 'Erro') {
  Alert.alert(titulo, mensagemErroAmigavel(erro, fallback));
}

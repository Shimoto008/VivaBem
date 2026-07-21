import { useCallback, useEffect, useState } from 'react';
import {
  buscarConexaoAtivaDoFamiliar,
  conectarComCuidador,
  desconectarDoCuidador,
} from '../services/conexaoService';
import { buscarCuidadorPorCodigo } from '../services/cuidadorService';
import { DomainError } from '../services/errors';

/**
 * Toda a regra de "Familiar só pode estar conectado a um Cuidador por vez"
 * fica nesta camada (hook + services), nunca dentro de uma tela.
 * A tela só chama `conectarPorCodigo` / `desconectar` e lê `conexao`/`erro`.
 */
export function useConexaoFamiliar(familiarId) {
  const [conexao, setConexao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState(null);

  const recarregar = useCallback(async () => {
    if (!familiarId) return;
    setCarregando(true);
    setErro(null);
    try {
      const conexaoAtiva = await buscarConexaoAtivaDoFamiliar(familiarId);
      setConexao(conexaoAtiva);
    } catch (err) {
      setErro(err);
    } finally {
      setCarregando(false);
    }
  }, [familiarId]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  const conectarPorCodigo = useCallback(async (codigo) => {
    setProcessando(true);
    setErro(null);
    try {
      const cuidadorEncontrado = await buscarCuidadorPorCodigo(codigo);
      if (!cuidadorEncontrado) {
        throw new DomainError('Nenhum cuidador encontrado com esse código. Confira e tente novamente.');
      }
      const novaConexao = await conectarComCuidador(familiarId, cuidadorEncontrado.id);
      setConexao(novaConexao);
      return novaConexao;
    } catch (err) {
      setErro(err);
      throw err;
    } finally {
      setProcessando(false);
    }
  }, [familiarId]);

  const desconectar = useCallback(async () => {
    if (!conexao) return;
    setProcessando(true);
    setErro(null);
    try {
      await desconectarDoCuidador(conexao.id);
      setConexao(null);
    } catch (err) {
      setErro(err);
      throw err;
    } finally {
      setProcessando(false);
    }
  }, [conexao]);

  return { conexao, carregando, processando, erro, conectarPorCodigo, desconectar, recarregar };
}

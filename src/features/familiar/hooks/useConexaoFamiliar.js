// @ts-check
import { useCallback, useEffect, useState } from 'react';
import {
  buscarConexaoAtivaDoFamiliar,
  conectarComCuidador,
  desconectarDoCuidador,
} from '../../../services/conexaoService';
import { buscarCuidadorPorCodigo } from '../../../services/cuidadorService';
import { DomainError } from '../../../services/errors';
import { useMontadoRef } from '../../../hooks/useMontadoRef';

/** @typedef {import('../../../types/models').Conexao} Conexao */

/**
 * Toda a regra de "Familiar só pode estar conectado a um Cuidador por vez"
 * fica nesta camada (hook + services), nunca dentro de uma tela.
 * A tela só chama `conectarPorCodigo` / `desconectar` e lê `conexao`/`erro`.
 *
 * @param {string | undefined} familiarId
 */
export function useConexaoFamiliar(familiarId) {
  const [conexao, setConexao] = useState(/** @type {Conexao | null} */ (null));
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState(/** @type {Error | null} */ (null));
  const montadoRef = useMontadoRef();

  const recarregar = useCallback(async () => {
    if (!familiarId) {
      setConexao(null);
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const conexaoAtiva = await buscarConexaoAtivaDoFamiliar(familiarId);
      if (montadoRef.current) setConexao(conexaoAtiva);
    } catch (err) {
      if (montadoRef.current) setErro(err);
    } finally {
      if (montadoRef.current) setCarregando(false);
    }
  }, [familiarId, montadoRef]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  const conectarPorCodigo = useCallback(
    /** @param {string} codigo */
    async (codigo) => {
      setProcessando(true);
      setErro(null);
      try {
        const cuidadorEncontrado = await buscarCuidadorPorCodigo(codigo);
        if (!cuidadorEncontrado) {
          throw new DomainError('Nenhum cuidador encontrado com esse código. Confira e tente novamente.');
        }
        const novaConexao = await conectarComCuidador(familiarId, cuidadorEncontrado.id);
        if (montadoRef.current) setConexao(novaConexao);
        return novaConexao;
      } catch (err) {
        if (montadoRef.current) setErro(err);
        throw err;
      } finally {
        if (montadoRef.current) setProcessando(false);
      }
    },
    [familiarId, montadoRef]
  );

  const desconectar = useCallback(async () => {
    if (!conexao) return;
    setProcessando(true);
    setErro(null);
    try {
      await desconectarDoCuidador(conexao.id);
      if (montadoRef.current) setConexao(null);
    } catch (err) {
      if (montadoRef.current) setErro(err);
      throw err;
    } finally {
      if (montadoRef.current) setProcessando(false);
    }
  }, [conexao, montadoRef]);

  return { conexao, carregando, processando, erro, conectarPorCodigo, desconectar, recarregar };
}

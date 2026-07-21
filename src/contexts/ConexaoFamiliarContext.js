import React, { createContext, useContext } from 'react';
import { useConexaoFamiliar } from '../features/familiar/hooks/useConexaoFamiliar';

/**
 * Expõe o estado de conexão Familiar↔Cuidador para toda a subárvore da
 * tela do Familiar (card de status, modal de conectar, lista de
 * atividades) sem precisar repassar props manualmente por vários níveis.
 */
const ConexaoFamiliarContext = createContext(null);

export function ConexaoFamiliarProvider({ familiarId, children }) {
  const conexaoState = useConexaoFamiliar(familiarId);
  return (
    <ConexaoFamiliarContext.Provider value={conexaoState}>
      {children}
    </ConexaoFamiliarContext.Provider>
  );
}

export function useConexaoFamiliarContext() {
  const context = useContext(ConexaoFamiliarContext);
  if (!context) {
    throw new Error('useConexaoFamiliarContext deve ser usado dentro de <ConexaoFamiliarProvider>.');
  }
  return context;
}

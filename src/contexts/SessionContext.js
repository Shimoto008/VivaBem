import React, { createContext, useContext, useMemo, useState } from 'react';

/**
 * Sessão "leve" do app: guarda o cuidador e/ou familiar que acabaram de se
 * cadastrar/entrar, para que qualquer tela (perfil, conexão, atividades)
 * saiba "quem está usando o app agora" sem precisar repassar isso via
 * parâmetros de navegação manualmente em cada rota.
 *
 * Observação importante (ver relatório final): o app não tem um sistema de
 * login real (sem senha/token) — isso é um cadastro simples. Por isso a
 * sessão vive só em memória (Context), e some ao reiniciar o app. Para
 * persistir entre sessões do app seria necessário adicionar autenticação
 * real (ex.: Supabase Auth) e armazenamento local (ex.: AsyncStorage),
 * ambos fora do escopo desta refatoração de front-end.
 */
const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [cuidador, setCuidador] = useState(null);
  const [familiar, setFamiliar] = useState(null);

  const value = useMemo(
    () => ({ cuidador, setCuidador, familiar, setFamiliar }),
    [cuidador, familiar]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession deve ser usado dentro de um <SessionProvider>.');
  }
  return context;
}

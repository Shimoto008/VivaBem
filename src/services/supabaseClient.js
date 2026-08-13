import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
/**
 * Credenciais lidas de variáveis de ambiente (suporte nativo do Expo a
 * variáveis prefixadas com EXPO_PUBLIC_, sem necessidade de libs extras).
 *
 * IMPORTANTE — antes essas credenciais estavam hardcoded neste arquivo e
 * commitadas no Git. Para rodar o projeto agora, crie um arquivo `.env`
 * na raiz (já está no .gitignore) com:
 *
 *   EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
 *   EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-publica
 *
 * Veja docs/DATABASE.md para o restante da configuração do backend.
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabaseClient] Variáveis EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY não foram ' +
    'configuradas. Crie um arquivo .env na raiz do projeto (veja docs/DATABASE.md).'
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

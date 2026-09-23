import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { configSupabase } from "./config";
import type { Database } from "./database.types";

/**
 * Cliente para Server Components / Route Handlers.
 * Sem sessão de usuário (ainda não há login): age como `anon`, então só enxerga
 * o que as políticas de RLS liberam para anon (trilhas ativas e a RPC de insights).
 * Quando o login entrar, trocar por `createServerClient` do @supabase/ssr lendo os cookies.
 */
export function supabaseServidor(): SupabaseClient<Database> | null {
  const cfg = configSupabase();
  if (!cfg) return null;
  return createClient<Database>(cfg.url, cfg.chave, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

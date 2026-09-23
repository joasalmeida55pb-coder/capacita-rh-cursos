"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { configSupabase } from "./config";
import type { Database } from "./database.types";

let instancia: SupabaseClient<Database> | null = null;

/** Cliente único no navegador (mantém a sessão quando o login for adicionado). */
export function supabaseNavegador(): SupabaseClient<Database> | null {
  if (instancia) return instancia;
  const cfg = configSupabase();
  if (!cfg) return null;
  instancia = createClient<Database>(cfg.url, cfg.chave);
  return instancia;
}

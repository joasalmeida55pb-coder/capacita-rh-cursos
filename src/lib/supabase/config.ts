/**
 * Variáveis públicas do Supabase. Ambas são seguras no navegador:
 * o acesso aos dados é controlado pelas políticas de RLS do banco.
 * Aceita a chave nova (publishable, `sb_publishable_...`) ou a anon legada.
 */
export function configSupabase(): { url: string; chave: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !chave) return null;
  return { url, chave };
}

export const supabaseConfigurado = (): boolean => configSupabase() !== null;

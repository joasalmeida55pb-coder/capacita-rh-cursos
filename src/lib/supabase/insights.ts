import "server-only";
import { connection } from "next/server";
import type { InsightsResumo, Json } from "./database.types";
import { supabaseServidor } from "./server";

export type ResultadoInsights =
  | { status: "ok"; dados: InsightsResumo }
  | { status: "nao-configurado" }
  | { status: "erro"; mensagem: string };

type Obj = { [k: string]: Json | undefined };

const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const num = (v: unknown): number => (typeof v === "number" ? v : Number(v) || 0);
const numOuNull = (v: unknown): number | null => (v === null || v === undefined ? null : num(v));
const txt = (v: unknown): string => (typeof v === "string" ? v : String(v ?? ""));
const lista = (v: unknown): Obj[] => (Array.isArray(v) ? v.filter(isObj) : []);

/** Converte o jsonb da RPC num objeto tipado, tolerando campos ausentes. */
function normalizar(bruto: Json): InsightsResumo {
  const r = isObj(bruto) ? bruto : {};
  return {
    total_cidadaos: num(r.total_cidadaos),
    prontidao_media: numOuNull(r.prontidao_media),
    trilhas_ativas: num(r.trilhas_ativas),
    total_matriculas: num(r.total_matriculas),
    total_concluidas: num(r.total_concluidas),
    vagas_demandadas: num(r.vagas_demandadas),
    cidadaos_por_area: lista(r.cidadaos_por_area).map((x) => ({ area: txt(x.area), total: num(x.total) })),
    demanda_por_cargo: lista(r.demanda_por_cargo).map((x) => ({
      cargo: txt(x.cargo),
      vagas: num(x.vagas),
      empresas: num(x.empresas),
    })),
    demanda_por_periodo: lista(r.demanda_por_periodo).map((x) => ({ periodo: txt(x.periodo), vagas: num(x.vagas) })),
    matriculas_por_trilha: lista(r.matriculas_por_trilha).map((x) => ({
      trilha_id: txt(x.trilha_id),
      titulo: txt(x.titulo),
      setor: txt(x.setor),
      matriculas: num(x.matriculas),
      concluidas: num(x.concluidas),
      progresso_medio: numOuNull(x.progresso_medio),
    })),
    atualizado_em: txt(r.atualizado_em) || new Date().toISOString(),
  };
}

/**
 * Chama `public.insights_resumo()` (SECURITY DEFINER, liberada para anon).
 * Devolve só agregados — nenhum dado pessoal sai do banco.
 * Roda a cada requisição (`connection()`), sem ser congelada no build.
 */
export async function obterInsightsResumo(): Promise<ResultadoInsights> {
  await connection();
  const supabase = supabaseServidor();
  if (!supabase) return { status: "nao-configurado" };

  const { data, error } = await supabase.rpc("insights_resumo");
  if (error) {
    console.error("[insights_resumo]", error);
    return { status: "erro", mensagem: error.message };
  }
  return { status: "ok", dados: normalizar(data) };
}

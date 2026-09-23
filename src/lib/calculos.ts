import { OCUPACOES, getOcupacao } from "@/data/base";
import { INDICADORES_OCUPACAO, PROFISSIONAIS_POR_COMPETENCIA } from "@/data/insights";
import { aulasDaTrilha, trilhasPorCompetencia } from "@/data/trilhas";
import type { Ocupacao, Previsao, Trilha } from "@/lib/types";

export interface Diagnostico {
  ocupacao: Ocupacao;
  prontidao: number;
  concluidas: string[];
  pendentes: string[];
}

/** Prontidão estimada = soma dos pesos das competências que a pessoa já possui */
export function diagnosticar(ocupacaoId: string, competencias: Iterable<string>): Diagnostico | null {
  const ocupacao = getOcupacao(ocupacaoId);
  if (!ocupacao) return null;
  const possui = new Set(competencias);
  const concluidas: string[] = [];
  const pendentes: string[] = [];
  let prontidao = 0;
  for (const req of ocupacao.requisitos) {
    if (possui.has(req.competenciaId)) {
      concluidas.push(req.competenciaId);
      prontidao += req.peso;
    } else {
      pendentes.push(req.competenciaId);
    }
  }
  return { ocupacao, prontidao, concluidas, pendentes };
}

/** Ranking de ocupações compatíveis com um conjunto de competências */
export function rankingOcupacoes(competencias: Iterable<string>): Diagnostico[] {
  const lista = Array.from(competencias);
  return OCUPACOES.map((o) => diagnosticar(o.id, lista))
    .filter((d): d is Diagnostico => d !== null)
    .sort((a, b) => b.prontidao - a.prontidao);
}

/** Primeira trilha que desenvolve a competência (para recomendação) */
export function trilhaRecomendada(competenciaId: string): Trilha | undefined {
  return trilhasPorCompetencia(competenciaId)[0];
}

export function progressoTrilha(trilha: Trilha, aulasConcluidas: ReadonlySet<string>): number {
  const aulas = aulasDaTrilha(trilha);
  if (aulas.length === 0) return 0;
  const feitas = aulas.filter((a) => aulasConcluidas.has(a.id)).length;
  return Math.round((feitas / aulas.length) * 100);
}

export type NivelProntidao = "pronto" | "preparavel" | "inicial";

export function nivelProntidao(prontidao: number): NivelProntidao {
  if (prontidao >= 80) return "pronto";
  if (prontidao >= 50) return "preparavel";
  return "inicial";
}

// ---------- Insights ----------

export interface LinhaInsight {
  ocupacaoId: string;
  nome: string;
  demanda: number;
  demandaEmpresas: number;
  disponiveis: number;
  prontos: number;
  gap: number;
  indiceEscassez: number;
  nivelEscassez: NivelEscassez;
}

export type NivelEscassez = "critica" | "alta" | "moderada" | "equilibrada";

export function nivelEscassez(indice: number): NivelEscassez {
  if (indice >= 3) return "critica";
  if (indice >= 1.5) return "alta";
  if (indice > 1) return "moderada";
  return "equilibrada";
}

/** Cruza demanda (base + previsões das empresas) com disponíveis e prontos */
export function cruzamentoOcupacoes(previsoes: Previsao[]): LinhaInsight[] {
  return INDICADORES_OCUPACAO.map((ind) => {
    const demandaEmpresas = previsoes
      .filter((p) => p.ocupacaoId === ind.ocupacaoId)
      .reduce((acc, p) => acc + p.quantidade, 0);
    const demanda = ind.demandaBase + demandaEmpresas;
    const indice = ind.prontos > 0 ? demanda / ind.prontos : demanda;
    return {
      ocupacaoId: ind.ocupacaoId,
      nome: getOcupacao(ind.ocupacaoId)?.nome ?? ind.ocupacaoId,
      demanda,
      demandaEmpresas,
      disponiveis: ind.disponiveis,
      prontos: ind.prontos,
      gap: demanda - ind.prontos,
      indiceEscassez: Math.round(indice * 10) / 10,
      nivelEscassez: nivelEscassez(indice),
    };
  }).sort((a, b) => b.gap - a.gap);
}

export interface GapCompetencia {
  competenciaId: string;
  exigida: number;
  disponivel: number;
  deficit: number;
  trilha?: Trilha;
}

/**
 * Estima quantas vagas previstas exigem cada competência (demanda × presença no perfil)
 * e compara com quantos profissionais já a possuem.
 */
export function gapsDeCompetencia(linhas: LinhaInsight[]): GapCompetencia[] {
  const exigida = new Map<string, number>();
  for (const linha of linhas) {
    const ocupacao = getOcupacao(linha.ocupacaoId);
    if (!ocupacao) continue;
    for (const req of ocupacao.requisitos) {
      exigida.set(req.competenciaId, (exigida.get(req.competenciaId) ?? 0) + linha.demanda);
    }
  }
  return Array.from(exigida.entries())
    .map(([competenciaId, total]) => {
      const disponivel = PROFISSIONAIS_POR_COMPETENCIA[competenciaId] ?? 0;
      return {
        competenciaId,
        exigida: total,
        disponivel,
        deficit: total - disponivel,
        trilha: trilhaRecomendada(competenciaId),
      };
    })
    .sort((a, b) => b.deficit - a.deficit);
}

/** Quantas vagas previstas dependem das competências desenvolvidas por uma trilha */
export function demandaConectadaTrilha(trilha: Trilha, linhas: LinhaInsight[]): number {
  let total = 0;
  for (const linha of linhas) {
    const ocupacao = getOcupacao(linha.ocupacaoId);
    if (ocupacao?.requisitos.some((r) => trilha.competencias.includes(r.competenciaId))) {
      total += linha.demanda;
    }
  }
  return total;
}


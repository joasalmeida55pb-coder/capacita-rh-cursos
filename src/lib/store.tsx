"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { COLABORADORES_DEMO, PREVISOES_DEMO } from "@/data/empresa";
import { AULAS_CONCLUIDAS_DEMO, CIDADAO_DEMO, TRILHAS_CONCLUIDAS_DEMO } from "@/data/pessoas";
import { TRILHAS, aulasDaTrilha, getTrilha } from "@/data/trilhas";
import type { Colaborador, Previsao, TipoAtribuicao } from "@/lib/types";

/**
 * Estado local compartilhado entre os 4 módulos.
 * Persistido em localStorage para simular um backend durante o piloto.
 * Para plugar um banco real (ex.: Supabase), substitua o reducer por chamadas de API
 * mantendo a mesma interface do hook `useCapacita`.
 */
export interface CapacitaState {
  objetivoOcupacaoId: string;
  aulasConcluidas: string[];
  /** trilhaId -> data ISO da conclusão (gera certificado) */
  trilhasConcluidas: Record<string, string>;
  previsoes: Previsao[];
  colaboradores: Colaborador[];
  /** IDs de talentos convidados/encaminhados pela empresa */
  encaminhados: string[];
}

const STORAGE_KEY = "capacita-rh:estado:v1";

const estadoInicial: CapacitaState = {
  objetivoOcupacaoId: "recepcionista",
  aulasConcluidas: AULAS_CONCLUIDAS_DEMO,
  trilhasConcluidas: TRILHAS_CONCLUIDAS_DEMO,
  previsoes: PREVISOES_DEMO,
  colaboradores: COLABORADORES_DEMO,
  encaminhados: [],
};

type Acao =
  | { type: "hidratar"; estado: CapacitaState }
  | { type: "definirObjetivo"; ocupacaoId: string }
  | { type: "alternarAula"; aulaId: string; trilhaId: string }
  | { type: "adicionarPrevisao"; previsao: Omit<Previsao, "id" | "criadaEm"> }
  | { type: "removerPrevisao"; id: string }
  | { type: "atribuirTrilha"; colaboradorId: string; trilhaId: string; tipo: TipoAtribuicao }
  | { type: "removerTrilha"; colaboradorId: string; trilhaId: string }
  | { type: "avancarTrilhaColaborador"; colaboradorId: string; trilhaId: string }
  | { type: "alternarEncaminhamento"; talentoId: string }
  | { type: "resetar" };

function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function novoId(prefixo: string): string {
  return `${prefixo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function reducer(state: CapacitaState, acao: Acao): CapacitaState {
  switch (acao.type) {
    case "hidratar":
      return acao.estado;

    case "definirObjetivo":
      return { ...state, objetivoOcupacaoId: acao.ocupacaoId };

    case "alternarAula": {
      const trilha = getTrilha(acao.trilhaId);
      if (!trilha) return state;
      const set = new Set(state.aulasConcluidas);
      if (set.has(acao.aulaId)) set.delete(acao.aulaId);
      else set.add(acao.aulaId);

      const completa = aulasDaTrilha(trilha).every((a) => set.has(a.id));
      const trilhasConcluidas = { ...state.trilhasConcluidas };
      if (completa && !trilhasConcluidas[trilha.id]) trilhasConcluidas[trilha.id] = hojeISO();
      if (!completa) delete trilhasConcluidas[trilha.id];

      return { ...state, aulasConcluidas: Array.from(set), trilhasConcluidas };
    }

    case "adicionarPrevisao":
      return {
        ...state,
        previsoes: [{ ...acao.previsao, id: novoId("prev"), criadaEm: hojeISO() }, ...state.previsoes],
      };

    case "removerPrevisao":
      return { ...state, previsoes: state.previsoes.filter((p) => p.id !== acao.id) };

    case "atribuirTrilha":
      return {
        ...state,
        colaboradores: state.colaboradores.map((c) => {
          if (c.id !== acao.colaboradorId) return c;
          const existente = c.trilhas.find((t) => t.trilhaId === acao.trilhaId);
          const trilhas = existente
            ? c.trilhas.map((t) => (t.trilhaId === acao.trilhaId ? { ...t, tipo: acao.tipo } : t))
            : [...c.trilhas, { trilhaId: acao.trilhaId, tipo: acao.tipo, progresso: 0 }];
          return { ...c, trilhas };
        }),
      };

    case "removerTrilha":
      return {
        ...state,
        colaboradores: state.colaboradores.map((c) =>
          c.id === acao.colaboradorId
            ? { ...c, trilhas: c.trilhas.filter((t) => t.trilhaId !== acao.trilhaId) }
            : c,
        ),
      };

    case "avancarTrilhaColaborador":
      // Simula o avanço do colaborador; ao chegar em 100% as competências são verificadas.
      return {
        ...state,
        colaboradores: state.colaboradores.map((c) => {
          if (c.id !== acao.colaboradorId) return c;
          let novasCompetencias = c.competencias;
          const trilhas = c.trilhas.map((t) => {
            if (t.trilhaId !== acao.trilhaId) return t;
            const progresso = Math.min(100, t.progresso + 25);
            if (progresso === 100) {
              const trilha = getTrilha(t.trilhaId);
              if (trilha) {
                novasCompetencias = Array.from(new Set([...c.competencias, ...trilha.competencias]));
              }
            }
            return { ...t, progresso };
          });
          return { ...c, trilhas, competencias: novasCompetencias };
        }),
      };

    case "alternarEncaminhamento":
      return {
        ...state,
        encaminhados: state.encaminhados.includes(acao.talentoId)
          ? state.encaminhados.filter((id) => id !== acao.talentoId)
          : [...state.encaminhados, acao.talentoId],
      };

    case "resetar":
      return estadoInicial;
  }
}

function lerEstadoSalvo(): CapacitaState | null {
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY);
    if (!bruto) return null;
    const dados = JSON.parse(bruto) as Partial<CapacitaState>;
    return { ...estadoInicial, ...dados };
  } catch {
    return null;
  }
}

interface CapacitaContexto {
  state: CapacitaState;
  /** Competências do cidadão demo: verificadas + desenvolvidas em trilhas concluídas */
  competenciasCidadao: string[];
  aulasConcluidasSet: ReadonlySet<string>;
  definirObjetivo: (ocupacaoId: string) => void;
  alternarAula: (trilhaId: string, aulaId: string) => void;
  adicionarPrevisao: (previsao: Omit<Previsao, "id" | "criadaEm">) => void;
  removerPrevisao: (id: string) => void;
  atribuirTrilha: (colaboradorId: string, trilhaId: string, tipo: TipoAtribuicao) => void;
  removerTrilha: (colaboradorId: string, trilhaId: string) => void;
  avancarTrilhaColaborador: (colaboradorId: string, trilhaId: string) => void;
  alternarEncaminhamento: (talentoId: string) => void;
  resetar: () => void;
}

const Contexto = createContext<CapacitaContexto | null>(null);

export function CapacitaProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, estadoInicial);
  // Carrega o estado salvo apenas no cliente (evita divergência de hidratação)
  useEffect(() => {
    const salvo = lerEstadoSalvo();
    if (salvo) dispatch({ type: "hidratar", estado: salvo });
  }, []);

  // Persiste mudanças. O estado inicial (referência) nunca é gravado, então o
  // primeiro render não sobrescreve o que já estava salvo.
  useEffect(() => {
    if (state === estadoInicial) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // armazenamento indisponível (modo privado etc.) — segue só em memória
    }
  }, [state]);

  const valor = useMemo<CapacitaContexto>(() => {
    const desenvolvidas = TRILHAS.filter((t) => state.trilhasConcluidas[t.id]).flatMap(
      (t) => t.competencias,
    );
    const competenciasCidadao = Array.from(
      new Set([...CIDADAO_DEMO.competenciasVerificadas, ...desenvolvidas]),
    );
    return {
      state,
      competenciasCidadao,
      aulasConcluidasSet: new Set(state.aulasConcluidas),
      definirObjetivo: (ocupacaoId) => dispatch({ type: "definirObjetivo", ocupacaoId }),
      alternarAula: (trilhaId, aulaId) => dispatch({ type: "alternarAula", trilhaId, aulaId }),
      adicionarPrevisao: (previsao) => dispatch({ type: "adicionarPrevisao", previsao }),
      removerPrevisao: (id) => dispatch({ type: "removerPrevisao", id }),
      atribuirTrilha: (colaboradorId, trilhaId, tipo) =>
        dispatch({ type: "atribuirTrilha", colaboradorId, trilhaId, tipo }),
      removerTrilha: (colaboradorId, trilhaId) =>
        dispatch({ type: "removerTrilha", colaboradorId, trilhaId }),
      avancarTrilhaColaborador: (colaboradorId, trilhaId) =>
        dispatch({ type: "avancarTrilhaColaborador", colaboradorId, trilhaId }),
      alternarEncaminhamento: (talentoId) => dispatch({ type: "alternarEncaminhamento", talentoId }),
      resetar: () => {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignora
        }
        dispatch({ type: "resetar" });
      },
    };
  }, [state]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useCapacita(): CapacitaContexto {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useCapacita deve ser usado dentro de <CapacitaProvider>");
  return ctx;
}

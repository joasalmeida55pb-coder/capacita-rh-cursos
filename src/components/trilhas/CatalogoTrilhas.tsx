"use client";

import Link from "next/link";
import { useState } from "react";
import { Award, BookOpen, Clock, GraduationCap, Search, Users } from "lucide-react";
import { Badge, SetorBadge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SETORES, nomeCompetencia } from "@/data/base";
import { DESEMPENHO_TRILHAS } from "@/data/insights";
import { TRILHAS, aulasDaTrilha } from "@/data/trilhas";
import { cruzamentoOcupacoes, demandaConectadaTrilha, progressoTrilha } from "@/lib/calculos";
import { cx, fmtNumero } from "@/lib/format";
import { useCapacita } from "@/lib/store";
import type { SetorId } from "@/lib/types";

export function CatalogoTrilhas() {
  const { state, aulasConcluidasSet } = useCapacita();
  const [setor, setSetor] = useState<SetorId | "todos">("todos");
  const [busca, setBusca] = useState("");
  const linhas = cruzamentoOcupacoes(state.previsoes);

  const termo = busca.trim().toLowerCase();
  const filtradas = TRILHAS.filter(
    (t) =>
      (setor === "todos" || t.setor === setor) &&
      (termo === "" ||
        t.titulo.toLowerCase().includes(termo) ||
        t.competencias.some((c) => nomeCompetencia(c).toLowerCase().includes(termo))),
  );

  return (
    <div>
      <PageHeader
        icone={GraduationCap}
        modulo="Capacita Trilhas"
        titulo="Qualificação orientada pela demanda"
        descricao="Trilhas curtas conectadas às necessidades reais dos setores de Balneário Camboriú. Cada trilha responde: por que é necessária, quem precisa e qual resultado se espera."
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[{ id: "todos" as const, nome: "Todas" }, ...SETORES].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSetor(s.id)}
              className={cx(
                "rounded-full px-3 py-1.5 text-xs font-medium transition",
                setor === s.id ? "bg-teal-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
              )}
            >
              {s.nome}
            </button>
          ))}
        </div>
        <label className="relative block lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <span className="sr-only">Buscar trilha ou competência</span>
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar trilha ou competência"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-teal-500 focus:outline-none"
          />
        </label>
      </div>

      {filtradas.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Nenhuma trilha encontrada para esse filtro.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtradas.map((t) => {
            const progresso = progressoTrilha(t, aulasConcluidasSet);
            const concluida = Boolean(state.trilhasConcluidas[t.id]);
            const desempenho = DESEMPENHO_TRILHAS[t.id];
            const demanda = demandaConectadaTrilha(t, linhas);
            return (
              <Link
                key={t.id}
                href={`/trilhas/${t.id}`}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-500 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <SetorBadge setor={t.setor} />
                  {concluida ? (
                    <Badge tom="sucesso">
                      <Award className="size-3" aria-hidden /> Certificada
                    </Badge>
                  ) : progresso > 0 ? (
                    <Badge tom="alerta">Em andamento</Badge>
                  ) : null}
                </div>
                <h3 className="mt-3 font-semibold text-slate-900 group-hover:text-teal-800">{t.titulo}</h3>
                <p className="mt-1 flex-1 text-sm text-slate-600">{t.resumo}</p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {t.competencias.map((c) => (
                    <Badge key={c} tom="marca">
                      {nomeCompetencia(c)}
                    </Badge>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" aria-hidden /> {t.cargaHoraria}h
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="size-3.5" aria-hidden /> {t.modulos.length} módulos · {aulasDaTrilha(t).length} aulas
                  </span>
                  {desempenho && (
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" aria-hidden /> {fmtNumero(desempenho.inscritos)}
                    </span>
                  )}
                </div>

                <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <strong className="tabular-nums text-slate-900">{fmtNumero(demanda)}</strong> vagas previstas exigem
                  competências desta trilha
                </div>

                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>Seu progresso</span>
                    <span className="tabular-nums">{progresso}%</span>
                  </div>
                  <ProgressBar valor={progresso} tom={concluida ? "sucesso" : "marca"} rotulo={`Progresso em ${t.titulo}`} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

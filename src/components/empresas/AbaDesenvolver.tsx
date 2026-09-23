"use client";

import { useState } from "react";
import { Award, BookOpenCheck, Check, CircleDashed, FastForward, Grid3x3, Minus, Plus, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/ui/StatCard";
import { nomeCompetencia } from "@/data/base";
import { EMPRESA_DEMO, competenciasDaMatriz } from "@/data/empresa";
import { TRILHAS, getTrilha } from "@/data/trilhas";
import { trilhaRecomendada } from "@/lib/calculos";
import { cx } from "@/lib/format";
import { useCapacita } from "@/lib/store";
import type { Colaborador, TipoAtribuicao } from "@/lib/types";

type EstadoCelula = "possui" | "desenvolvendo" | "gap" | "nao-aplica";

const equipesMap = new Map(EMPRESA_DEMO.equipes.map((e) => [e.nome, e.competencias]));

function estadoCelula(colab: Colaborador, competenciaId: string): EstadoCelula {
  if (colab.competencias.includes(competenciaId)) return "possui";
  const esperadas = equipesMap.get(colab.equipe) ?? [];
  if (!esperadas.includes(competenciaId)) return "nao-aplica";
  const emCurso = colab.trilhas.some(
    (t) => t.progresso < 100 && getTrilha(t.trilhaId)?.competencias.includes(competenciaId),
  );
  return emCurso ? "desenvolvendo" : "gap";
}

const CELULA: Record<EstadoCelula, { classe: string; rotulo: string }> = {
  possui: { classe: "bg-emerald-100 text-emerald-700", rotulo: "Possui" },
  desenvolvendo: { classe: "bg-amber-100 text-amber-700", rotulo: "Em desenvolvimento" },
  gap: { classe: "bg-rose-100 text-rose-700", rotulo: "Gap" },
  "nao-aplica": { classe: "bg-slate-50 text-slate-300", rotulo: "Não se aplica à função" },
};

function IconeCelula({ estado }: { estado: EstadoCelula }) {
  const props = { className: "size-3.5", "aria-hidden": true } as const;
  if (estado === "possui") return <Check {...props} />;
  if (estado === "desenvolvendo") return <CircleDashed {...props} />;
  if (estado === "gap") return <X {...props} />;
  return <Minus {...props} />;
}

export function AbaDesenvolver() {
  const { state, atribuirTrilha, removerTrilha, avancarTrilhaColaborador } = useCapacita();
  const [equipe, setEquipe] = useState<string>("todas");
  const [atribuindo, setAtribuindo] = useState<string | null>(null);
  const [trilhaSel, setTrilhaSel] = useState(TRILHAS[0]?.id ?? "");
  const [tipoSel, setTipoSel] = useState<TipoAtribuicao>("obrigatoria");

  const colaboradores = state.colaboradores.filter((c) => equipe === "todas" || c.equipe === equipe);
  const competencias = competenciasDaMatriz(EMPRESA_DEMO);

  const todasTrilhas = state.colaboradores.flatMap((c) => c.trilhas);
  const emAndamento = todasTrilhas.filter((t) => t.progresso < 100).length;
  const concluidas = todasTrilhas.filter((t) => t.progresso === 100).length;

  let esperadas = 0;
  let cobertas = 0;
  for (const c of state.colaboradores) {
    for (const comp of equipesMap.get(c.equipe) ?? []) {
      esperadas += 1;
      if (c.competencias.includes(comp)) cobertas += 1;
    }
  }
  const cobertura = esperadas ? Math.round((cobertas / esperadas) * 100) : 0;

  // Gaps internos por competência (quem precisa e não possui nem está em trilha)
  const gaps = competencias
    .map((comp) => ({
      comp,
      pessoas: colaboradores.filter((c) => estadoCelula(c, comp) === "gap"),
      trilha: trilhaRecomendada(comp),
    }))
    .filter((g) => g.pessoas.length > 0)
    .sort((a, b) => b.pessoas.length - a.pessoas.length);

  function confirmarAtribuicao(colaboradorId: string) {
    atribuirTrilha(colaboradorId, trilhaSel, tipoSel);
    setAtribuindo(null);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icone={Users} rotulo="Colaboradores" valor={String(state.colaboradores.length)} detalhe={`${EMPRESA_DEMO.equipes.length} equipes`} />
        <StatCard icone={BookOpenCheck} rotulo="Trilhas em andamento" valor={String(emAndamento)} />
        <StatCard icone={Award} rotulo="Trilhas concluídas" valor={String(concluidas)} detalhe="certificados emitidos" />
        <StatCard icone={Grid3x3} rotulo="Cobertura da matriz" valor={`${cobertura}%`} detalhe="competências esperadas já verificadas" />
      </div>

      <div className="flex flex-wrap gap-2">
        {["todas", ...EMPRESA_DEMO.equipes.map((e) => e.nome)].map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setEquipe(e)}
            className={cx(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              equipe === e ? "bg-teal-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
            )}
          >
            {e === "todas" ? "Todas as equipes" : e}
          </button>
        ))}
      </div>

      <Card titulo="Colaboradores e trilhas atribuídas" subtitulo="Atribua trilhas obrigatórias ou recomendadas e acompanhe o progresso.">
        <ul className="divide-y divide-slate-100">
          {colaboradores.map((c) => (
            <li key={c.id} className="py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start">
                <div className="md:w-56">
                  <p className="font-medium text-slate-900">{c.nome}</p>
                  <p className="text-xs text-slate-500">
                    {c.funcao} · {c.equipe}
                  </p>
                </div>
                <div className="flex-1 space-y-2">
                  {c.trilhas.length === 0 && <p className="text-xs text-slate-400">Nenhuma trilha atribuída.</p>}
                  {c.trilhas.map((t) => {
                    const trilha = getTrilha(t.trilhaId);
                    if (!trilha) return null;
                    const completa = t.progresso === 100;
                    return (
                      <div key={t.trilhaId} className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="truncate text-sm text-slate-800">{trilha.titulo}</span>
                            <Badge tom={t.tipo === "obrigatoria" ? "perigo" : "info"}>
                              {t.tipo === "obrigatoria" ? "Obrigatória" : "Recomendada"}
                            </Badge>
                            {completa && (
                              <Badge tom="sucesso">
                                <Award className="size-3" aria-hidden /> Certificado
                              </Badge>
                            )}
                          </div>
                          <div className="mt-1.5 flex items-center gap-2">
                            <ProgressBar valor={t.progresso} tom={completa ? "sucesso" : "marca"} className="max-w-xs" rotulo={trilha.titulo} />
                            <span className="text-xs tabular-nums text-slate-500">{t.progresso}%</span>
                          </div>
                        </div>
                        {!completa && (
                          <button
                            type="button"
                            onClick={() => avancarTrilhaColaborador(c.id, t.trilhaId)}
                            className="rounded-md p-1.5 text-slate-400 hover:bg-white hover:text-teal-700"
                            title="Simular avanço de 25%"
                            aria-label={`Simular avanço de ${c.nome} em ${trilha.titulo}`}
                          >
                            <FastForward className="size-4" aria-hidden />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removerTrilha(c.id, t.trilhaId)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-white hover:text-rose-600"
                          aria-label={`Remover ${trilha.titulo} de ${c.nome}`}
                        >
                          <X className="size-4" aria-hidden />
                        </button>
                      </div>
                    );
                  })}

                  {atribuindo === c.id ? (
                    <div className="flex flex-col gap-2 rounded-lg border border-teal-200 bg-teal-50/50 p-2 sm:flex-row sm:items-center">
                      <select
                        value={trilhaSel}
                        onChange={(e) => setTrilhaSel(e.target.value)}
                        className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                        aria-label="Trilha"
                      >
                        {TRILHAS.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.titulo}
                          </option>
                        ))}
                      </select>
                      <select
                        value={tipoSel}
                        onChange={(e) => setTipoSel(e.target.value as TipoAtribuicao)}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                        aria-label="Tipo de atribuição"
                      >
                        <option value="obrigatoria">Obrigatória</option>
                        <option value="recomendada">Recomendada</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => confirmarAtribuicao(c.id)}
                          className="rounded-md bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
                        >
                          Atribuir
                        </button>
                        <button
                          type="button"
                          onClick={() => setAtribuindo(null)}
                          className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-white"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAtribuindo(c.id)}
                      className="flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline"
                    >
                      <Plus className="size-3.5" aria-hidden /> Atribuir trilha
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2" titulo="Matriz de competências do time" subtitulo="Competências esperadas por equipe × competências verificadas.">
          <div className="overflow-x-auto pr-28">
            <table className="border-separate border-spacing-1 text-xs">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-white pr-4 text-left align-bottom font-semibold text-slate-500">Colaborador</th>
                  {competencias.map((comp) => (
                    <th key={comp} className="relative h-36 w-14 min-w-14 align-bottom font-medium text-slate-600">
                      <span className="absolute bottom-2 left-1/2 origin-bottom-left -rotate-45 whitespace-nowrap">
                        {nomeCompetencia(comp)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {colaboradores.map((c) => (
                  <tr key={c.id}>
                    <td className="sticky left-0 z-10 whitespace-nowrap bg-white pr-4 text-slate-700">
                      {c.nome}
                      <span className="block text-[10px] text-slate-400">{c.equipe}</span>
                    </td>
                    {competencias.map((comp) => {
                      const estado = estadoCelula(c, comp);
                      return (
                        <td key={comp} title={`${nomeCompetencia(comp)}: ${CELULA[estado].rotulo}`}>
                          <div className={cx("flex h-8 items-center justify-center rounded-md", CELULA[estado].classe)}>
                            <IconeCelula estado={estado} />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
            {(Object.keys(CELULA) as EstadoCelula[]).map((e) => (
              <span key={e} className="flex items-center gap-1.5">
                <span className={cx("flex size-5 items-center justify-center rounded", CELULA[e].classe)}>
                  <IconeCelula estado={e} />
                </span>
                {CELULA[e].rotulo}
              </span>
            ))}
          </div>
        </Card>

        <Card titulo="Gaps internos" subtitulo="Competências esperadas sem trilha em andamento.">
          {gaps.length === 0 ? (
            <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Nenhum gap sem plano de desenvolvimento.</p>
          ) : (
            <ul className="space-y-3">
              {gaps.map(({ comp, pessoas, trilha }) => (
                <li key={comp} className="rounded-xl border border-rose-100 bg-rose-50/50 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-900">{nomeCompetencia(comp)}</span>
                    <Badge tom="perigo">
                      {pessoas.length} pessoa{pessoas.length > 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{pessoas.map((p) => p.nome.split(" ")[0]).join(", ")}</p>
                  {trilha && (
                    <button
                      type="button"
                      onClick={() => pessoas.forEach((p) => atribuirTrilha(p.id, trilha.id, "recomendada"))}
                      className="mt-2 text-xs font-medium text-teal-700 hover:underline"
                    >
                      Atribuir “{trilha.titulo}” a todos →
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

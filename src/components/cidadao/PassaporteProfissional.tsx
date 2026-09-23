"use client";

import Link from "next/link";
import {
  Award,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Circle,
  IdCard,
  MapPin,
  Sparkles,
} from "lucide-react";
import { ReadinessRing } from "@/components/charts/ReadinessRing";
import { Badge, SetorBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar, tomPorProntidao } from "@/components/ui/ProgressBar";
import { COMPETENCIAS, OCUPACOES, nomeCompetencia } from "@/data/base";
import { CIDADAO_DEMO } from "@/data/pessoas";
import { TRILHAS } from "@/data/trilhas";
import {
  diagnosticar,
  nivelProntidao,
  progressoTrilha,
  rankingOcupacoes,
  trilhaRecomendada,
} from "@/lib/calculos";
import { fmtData } from "@/lib/format";
import { useCapacita } from "@/lib/store";
import type { CategoriaCompetencia, Disponibilidade } from "@/lib/types";

const ROTULO_DISPONIBILIDADE: Record<Disponibilidade, string> = {
  integral: "Período integral",
  manha: "Manhã",
  tarde: "Tarde",
  noite: "Noite",
  "fins-de-semana": "Fins de semana",
  temporada: "Temporada de verão",
};

const ROTULO_CATEGORIA: Record<CategoriaCompetencia, string> = {
  comportamental: "Comportamentais",
  tecnica: "Técnicas",
  idioma: "Idiomas",
  seguranca: "Segurança",
};

const ROTULO_NIVEL = {
  pronto: { texto: "Pronto(a) para contratação", tom: "sucesso" },
  preparavel: { texto: "Pode ser preparado(a)", tom: "alerta" },
  inicial: { texto: "Em formação", tom: "perigo" },
} as const;

export function PassaporteProfissional() {
  const { state, competenciasCidadao, aulasConcluidasSet, definirObjetivo } = useCapacita();
  const perfil = CIDADAO_DEMO;
  const diag = diagnosticar(state.objetivoOcupacaoId, competenciasCidadao);
  const ranking = rankingOcupacoes(competenciasCidadao);
  const possui = new Set(competenciasCidadao);

  const certificadosTrilhas = TRILHAS.filter((t) => state.trilhasConcluidas[t.id]).map((t) => ({
    id: t.id,
    titulo: t.titulo,
    instituicao: `Capacita Trilhas · ${t.parceiro}`,
    emitidoEm: state.trilhasConcluidas[t.id] ?? "",
    horas: t.cargaHoraria,
    competencias: t.competencias,
  }));
  const certificados = [...certificadosTrilhas, ...perfil.certificadosExternos].sort((a, b) =>
    b.emitidoEm.localeCompare(a.emitidoEm),
  );
  const emAndamento = TRILHAS.map((t) => ({ trilha: t, progresso: progressoTrilha(t, aulasConcluidasSet) })).filter(
    ({ trilha, progresso }) => progresso > 0 && !state.trilhasConcluidas[trilha.id],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        icone={IdCard}
        modulo="Capacita Cidadão"
        titulo="Passaporte Profissional"
        descricao="Perfil baseado em competências: o que a pessoa já sabe fazer, onde deseja atuar e quais passos faltam para aumentar sua prontidão."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Perfil */}
        <Card className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-teal-100 text-lg font-bold text-teal-800">
              {perfil.nome
                .split(" ")
                .map((p) => p[0])
                .join("")}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{perfil.nome}</p>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="size-3" aria-hidden /> {perfil.bairro} · {perfil.idadeFaixa}
              </p>
            </div>
          </div>

          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <CalendarClock className="size-3.5" aria-hidden /> Disponibilidade
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {perfil.disponibilidade.map((d) => (
                  <Badge key={d}>{ROTULO_DISPONIBILIDADE[d]}</Badge>
                ))}
              </dd>
            </div>
            <div>
              <dt className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Áreas de interesse</dt>
              <dd className="flex flex-wrap gap-1.5">
                {perfil.areasInteresse.map((s) => (
                  <SetorBadge key={s} setor={s} />
                ))}
              </dd>
            </div>
            <div>
              <dt className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <BriefcaseBusiness className="size-3.5" aria-hidden /> Experiência
              </dt>
              <dd className="space-y-2">
                {perfil.experiencias.map((e) => (
                  <div key={e.cargo} className="rounded-lg bg-slate-50 p-2.5">
                    <p className="font-medium text-slate-800">{e.cargo}</p>
                    <p className="text-xs text-slate-500">
                      {e.empresa} · {e.periodo}
                    </p>
                  </div>
                ))}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Diagnóstico */}
        <Card
          className="lg:col-span-2"
          titulo="Diagnóstico de prontidão"
          subtitulo="Calculado pelo peso de cada competência exigida na ocupação."
          acao={
            <label className="text-xs text-slate-500">
              <span className="sr-only">Objetivo profissional</span>
              <select
                value={state.objetivoOcupacaoId}
                onChange={(e) => definirObjetivo(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:outline-none"
              >
                {OCUPACOES.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.nome}
                  </option>
                ))}
              </select>
            </label>
          }
        >
          {diag && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr]">
              <div className="flex flex-col items-center gap-3">
                <ReadinessRing valor={diag.prontidao} />
                <p className="text-center text-sm text-slate-600">
                  Objetivo: <strong className="text-slate-900">{diag.ocupacao.nome}</strong>
                </p>
                <Badge tom={ROTULO_NIVEL[nivelProntidao(diag.prontidao)].tom}>
                  {ROTULO_NIVEL[nivelProntidao(diag.prontidao)].texto}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Concluídas ({diag.concluidas.length})
                  </h3>
                  <ul className="space-y-2">
                    {diag.ocupacao.requisitos
                      .filter((r) => diag.concluidas.includes(r.competenciaId))
                      .map((r) => (
                        <li key={r.competenciaId} className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm">
                          <CheckCircle2 className="size-4 shrink-0 text-emerald-600" aria-hidden />
                          <span className="flex-1 text-slate-800">{nomeCompetencia(r.competenciaId)}</span>
                          <span className="text-xs tabular-nums text-emerald-700">{r.peso}%</span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-700">
                    Pendentes ({diag.pendentes.length})
                  </h3>
                  {diag.pendentes.length === 0 ? (
                    <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                      Todas as competências exigidas foram verificadas.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {diag.ocupacao.requisitos
                        .filter((r) => diag.pendentes.includes(r.competenciaId))
                        .map((r) => {
                          const trilha = trilhaRecomendada(r.competenciaId);
                          const progresso = trilha ? progressoTrilha(trilha, aulasConcluidasSet) : 0;
                          return (
                            <li key={r.competenciaId} className="rounded-lg border border-rose-100 bg-rose-50/60 px-3 py-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Circle className="size-4 shrink-0 text-rose-400" aria-hidden />
                                <span className="flex-1 text-slate-800">{nomeCompetencia(r.competenciaId)}</span>
                                <span className="text-xs font-medium tabular-nums text-rose-700">+{r.peso}%</span>
                              </div>
                              {trilha && (
                                <Link
                                  href={`/trilhas/${trilha.id}`}
                                  className="mt-1.5 block text-xs font-medium text-teal-700 hover:underline"
                                >
                                  {progresso > 0 ? `Continuar trilha (${progresso}%)` : "Iniciar trilha"}: {trilha.titulo} →
                                </Link>
                              )}
                            </li>
                          );
                        })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card titulo="Mapa de competências verificadas" subtitulo="Por diagnóstico prático, certificados externos e trilhas concluídas.">
          <div className="space-y-4">
            {(Object.keys(ROTULO_CATEGORIA) as CategoriaCompetencia[]).map((cat) => {
              const lista = COMPETENCIAS.filter((c) => c.categoria === cat);
              return (
                <div key={cat}>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{ROTULO_CATEGORIA[cat]}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {lista.map((c) => (
                      <Badge key={c.id} tom={possui.has(c.id) ? "sucesso" : "neutro"} className={possui.has(c.id) ? "" : "opacity-60"}>
                        {possui.has(c.id) && <CheckCircle2 className="size-3" aria-hidden />}
                        {c.nome}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card titulo="Oportunidades compatíveis" subtitulo="Prontidão atual para cada perfil ocupacional mapeado no município.">
          <ul className="space-y-3">
            {ranking.map((d) => (
              <li key={d.ocupacao.id}>
                <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => definirObjetivo(d.ocupacao.id)}
                    className="text-left font-medium text-slate-800 hover:text-teal-700"
                    title="Definir como objetivo"
                  >
                    {d.ocupacao.nome}
                    {d.ocupacao.id === state.objetivoOcupacaoId && (
                      <span className="ml-2 text-xs font-normal text-teal-700">(objetivo)</span>
                    )}
                  </button>
                  <span className="tabular-nums text-slate-600">{d.prontidao}%</span>
                </div>
                <ProgressBar valor={d.prontidao} tom={tomPorProntidao(d.prontidao)} rotulo={d.ocupacao.nome} />
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-start gap-2 rounded-lg bg-sky-50 p-3 text-xs text-sky-800">
            <Sparkles className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            Ao concluir as trilhas recomendadas, novas ocupações passam a ser compatíveis e o perfil é sinalizado às
            empresas que buscam talentos prontos.
          </p>
        </Card>
      </div>

      <Card titulo="Histórico de cursos e certificações" subtitulo="Certificados emitidos e trilhas em andamento.">
        {emAndamento.length > 0 && (
          <div className="mb-5 grid gap-3 sm:grid-cols-2">
            {emAndamento.map(({ trilha, progresso }) => (
              <Link
                key={trilha.id}
                href={`/trilhas/${trilha.id}`}
                className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 hover:border-amber-300"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-800">{trilha.titulo}</span>
                  <Badge tom="alerta">Em andamento</Badge>
                </div>
                <ProgressBar valor={progresso} tom="alerta" className="mt-2" rotulo={trilha.titulo} />
                <p className="mt-1 text-xs text-slate-500">{progresso}% concluído</p>
              </Link>
            ))}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr className="border-b border-slate-200">
                <th className="py-2 pr-3 font-semibold">Certificado</th>
                <th className="py-2 pr-3 font-semibold">Emissor</th>
                <th className="py-2 pr-3 font-semibold">Competências</th>
                <th className="py-2 pr-3 text-right font-semibold">Carga</th>
                <th className="py-2 text-right font-semibold">Emissão</th>
              </tr>
            </thead>
            <tbody>
              {certificados.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-2.5 pr-3">
                    <span className="flex items-center gap-2 font-medium text-slate-800">
                      <Award className="size-4 shrink-0 text-teal-600" aria-hidden />
                      {c.titulo}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-slate-600">{c.instituicao}</td>
                  <td className="py-2.5 pr-3">
                    <div className="flex flex-wrap gap-1">
                      {c.competencias.map((id) => (
                        <Badge key={id} tom="marca">
                          {nomeCompetencia(id)}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums text-slate-600">{c.horas}h</td>
                  <td className="py-2.5 text-right tabular-nums text-slate-600">{c.emitidoEm ? fmtData(c.emitidoEm) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">
            Dica: conclua uma trilha em <Link href="/trilhas" className="font-medium text-teal-700 hover:underline">Capacita Trilhas</Link> e
            veja o certificado aparecer aqui e a prontidão subir automaticamente.
        </p>
      </Card>
    </div>
  );
}

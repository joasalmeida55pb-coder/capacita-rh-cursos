"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Circle,
  ClipboardCheck,
  Clock,
  HelpCircle,
  PlayCircle,
  Target,
  TrendingUp,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Badge, SetorBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { OCUPACOES, nomeCompetencia } from "@/data/base";
import { DESEMPENHO_TRILHAS } from "@/data/insights";
import { CIDADAO_DEMO } from "@/data/pessoas";
import { getTrilha } from "@/data/trilhas";
import { cruzamentoOcupacoes, demandaConectadaTrilha, diagnosticar, progressoTrilha } from "@/lib/calculos";
import { cx, fmtData, fmtNumero } from "@/lib/format";
import { useCapacita } from "@/lib/store";
import type { TipoAula } from "@/lib/types";

const ICONE_AULA: Record<TipoAula, LucideIcon> = {
  video: PlayCircle,
  leitura: BookOpen,
  pratica: Wrench,
  quiz: ClipboardCheck,
};

const ROTULO_AULA: Record<TipoAula, string> = {
  video: "Vídeo",
  leitura: "Leitura",
  pratica: "Prática",
  quiz: "Avaliação",
};

export function DetalheTrilha({ trilhaId }: { trilhaId: string }) {
  const { state, aulasConcluidasSet, alternarAula, competenciasCidadao } = useCapacita();
  const trilha = getTrilha(trilhaId);
  const [abertos, setAbertos] = useState<Set<string>>(() => new Set(trilha ? [trilha.modulos[0]?.id ?? ""] : []));

  if (!trilha) return null;

  const progresso = progressoTrilha(trilha, aulasConcluidasSet);
  const concluidaEm = state.trilhasConcluidas[trilha.id];
  const desempenho = DESEMPENHO_TRILHAS[trilha.id];
  const linhas = cruzamentoOcupacoes(state.previsoes);
  const demanda = demandaConectadaTrilha(trilha, linhas);
  const linhasPorOcupacao = new Map(linhas.map((l) => [l.ocupacaoId, l]));
  const ocupacoesRelacionadas = OCUPACOES.filter((o) =>
    o.requisitos.some((r) => trilha.competencias.includes(r.competenciaId)),
  );

  // Impacto projetado na prontidão da cidadã demo
  const diagAtual = diagnosticar(state.objetivoOcupacaoId, competenciasCidadao);
  const diagApos = diagnosticar(state.objetivoOcupacaoId, [...competenciasCidadao, ...trilha.competencias]);
  const ganho = diagAtual && diagApos ? diagApos.prontidao - diagAtual.prontidao : 0;

  function alternarModulo(id: string) {
    setAbertos((atual) => {
      const novo = new Set(atual);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

  const perguntas: { icone: LucideIcon; titulo: string; texto: string }[] = [
    { icone: HelpCircle, titulo: "Por que esta capacitação é necessária?", texto: trilha.porQue },
    { icone: Users, titulo: "Quem precisa dela?", texto: trilha.quemPrecisa },
    { icone: Target, titulo: "Qual resultado esperamos?", texto: trilha.resultadoEsperado },
  ];

  return (
    <div className="space-y-6">
      <Link href="/trilhas" className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:underline">
        <ArrowLeft className="size-4" aria-hidden /> Catálogo de trilhas
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SetorBadge setor={trilha.setor} />
            <h1 className="mt-2 text-2xl font-bold text-slate-900">{trilha.titulo}</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">{trilha.resumo}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden /> {trilha.cargaHoraria}h
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="size-3.5" aria-hidden /> {trilha.modulos.length} módulos
              </span>
              <span>Parceiro: {trilha.parceiro}</span>
            </div>
          </div>
          <div className="w-full lg:w-64">
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-slate-700">Progresso de {CIDADAO_DEMO.nome.split(" ")[0]}</span>
              <span className="font-semibold tabular-nums text-slate-900">{progresso}%</span>
            </div>
            <ProgressBar valor={progresso} tom={concluidaEm ? "sucesso" : "marca"} rotulo="Progresso da trilha" />
          </div>
        </div>

        {concluidaEm && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <Award className="size-8 shrink-0 text-emerald-600" aria-hidden />
            <div className="text-sm">
              <p className="font-semibold text-emerald-900">Certificado emitido em {fmtData(concluidaEm)}</p>
              <p className="text-emerald-800">
                Competências verificadas no Passaporte:{" "}
                {trilha.competencias.map(nomeCompetencia).join(", ")}.{" "}
                <Link href="/cidadao" className="font-medium underline">
                  Ver passaporte
                </Link>
              </p>
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {perguntas.map(({ icone: Icone, titulo, texto }) => (
          <div key={titulo} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <Icone className="size-5 text-teal-600" aria-hidden />
            <p className="mt-2 text-sm font-semibold text-slate-900">{titulo}</p>
            <p className="mt-1 text-sm text-slate-600">{texto}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">Módulos e aulas</h2>
          {trilha.modulos.map((modulo, mi) => {
            const feitas = modulo.aulas.filter((a) => aulasConcluidasSet.has(a.id)).length;
            const aberto = abertos.has(modulo.id);
            const completo = feitas === modulo.aulas.length;
            return (
              <div key={modulo.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => alternarModulo(modulo.id)}
                  aria-expanded={aberto}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-slate-50"
                >
                  <span
                    className={cx(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      completo ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600",
                    )}
                  >
                    {completo ? <CheckCircle2 className="size-4" aria-hidden /> : mi + 1}
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium text-slate-900">{modulo.titulo}</span>
                    <span className="block text-xs text-slate-500">
                      {feitas}/{modulo.aulas.length} aulas concluídas
                    </span>
                  </span>
                  <ChevronDown className={cx("size-4 text-slate-400 transition", aberto && "rotate-180")} aria-hidden />
                </button>
                {aberto && (
                  <ul className="border-t border-slate-100">
                    {modulo.aulas.map((aula) => {
                      const feita = aulasConcluidasSet.has(aula.id);
                      const Icone = ICONE_AULA[aula.tipo];
                      return (
                        <li key={aula.id} className="flex items-center gap-3 border-b border-slate-100 px-5 py-3 last:border-0">
                          <Icone className="size-4 shrink-0 text-slate-400" aria-hidden />
                          <span className="flex-1">
                            <span className={cx("block text-sm", feita ? "text-slate-500 line-through" : "text-slate-800")}>
                              {aula.titulo}
                            </span>
                            <span className="text-xs text-slate-400">
                              {ROTULO_AULA[aula.tipo]} · {aula.duracaoMin} min
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => alternarAula(trilha.id, aula.id)}
                            className={cx(
                              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
                              feita
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-teal-600 text-white hover:bg-teal-700",
                            )}
                          >
                            {feita ? (
                              <>
                                <CheckCircle2 className="size-3.5" aria-hidden /> Concluída
                              </>
                            ) : (
                              <>
                                <Circle className="size-3.5" aria-hidden /> Marcar como concluída
                              </>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <Card titulo="Conexão com a demanda">
            <p className="text-3xl font-bold tabular-nums text-slate-900">{fmtNumero(demanda)}</p>
            <p className="text-sm text-slate-600">vagas previstas no município exigem competências desta trilha.</p>
            <ul className="mt-4 space-y-2 text-sm">
              {ocupacoesRelacionadas.map((o) => {
                const linha = linhasPorOcupacao.get(o.id);
                return (
                  <li key={o.id} className="flex items-center justify-between gap-2">
                    <span className="text-slate-700">{o.nome}</span>
                    {linha && (
                      <Badge tom={linha.gap > 0 ? "perigo" : "sucesso"}>
                        gap {linha.gap > 0 ? "+" : ""}
                        {fmtNumero(linha.gap)}
                      </Badge>
                    )}
                  </li>
                );
              })}
            </ul>
            {diagAtual && ganho > 0 && !concluidaEm && (
              <p className="mt-4 flex items-start gap-2 rounded-lg bg-teal-50 p-3 text-xs text-teal-900">
                <TrendingUp className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                Concluir esta trilha eleva a prontidão para {diagAtual.ocupacao.nome} de {diagAtual.prontidao}% para{" "}
                {diagAtual.prontidao + ganho}%.
              </p>
            )}
          </Card>

          <Card titulo="Competências desenvolvidas">
            <div className="flex flex-wrap gap-1.5">
              {trilha.competencias.map((c) => (
                <Badge key={c} tom="marca">
                  {nomeCompetencia(c)}
                </Badge>
              ))}
            </div>
          </Card>

          {desempenho && (
            <Card titulo="Resultados no piloto">
              <dl className="grid grid-cols-3 gap-2 text-center">
                {[
                  { rotulo: "Inscritos", valor: desempenho.inscritos },
                  { rotulo: "Concluintes", valor: desempenho.concluintes },
                  { rotulo: "Contratados", valor: desempenho.contratados },
                ].map((item) => (
                  <div key={item.rotulo} className="rounded-lg bg-slate-50 p-2">
                    <dd className="text-lg font-bold tabular-nums text-slate-900">{fmtNumero(item.valor)}</dd>
                    <dt className="text-[11px] text-slate-500">{item.rotulo}</dt>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-slate-500">
                Taxa de conclusão {Math.round((desempenho.concluintes / desempenho.inscritos) * 100)}% · contratação após
                capacitação {Math.round((desempenho.contratados / desempenho.concluintes) * 100)}%
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

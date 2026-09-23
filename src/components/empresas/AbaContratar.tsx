"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Circle, MailCheck, MapPin, Send, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProgressBar, tomPorProntidao } from "@/components/ui/ProgressBar";
import { OCUPACOES, nomeCompetencia } from "@/data/base";
import { CIDADAO_DEMO, TALENTOS } from "@/data/pessoas";
import { diagnosticar, nivelProntidao, trilhaRecomendada, type Diagnostico } from "@/lib/calculos";
import { cx } from "@/lib/format";
import { useCapacita } from "@/lib/store";
import type { Talento } from "@/lib/types";

interface Resultado {
  talento: Talento;
  diag: Diagnostico;
}

function pseudonimo(nome: string): string {
  const [primeiro, segundo] = nome.split(" ");
  return segundo ? `${primeiro} ${segundo[0]}.` : primeiro ?? nome;
}

export function AbaContratar() {
  const { state, competenciasCidadao, alternarEncaminhamento } = useCapacita();
  const [ocupacaoId, setOcupacaoId] = useState("recepcionista");
  const [minimo, setMinimo] = useState(50);

  // A cidadã demo entra no banco de talentos com as competências atualizadas pelo Passaporte
  const talentos: Talento[] = [
    {
      id: CIDADAO_DEMO.id,
      nome: pseudonimo(CIDADAO_DEMO.nome),
      bairro: CIDADAO_DEMO.bairro,
      ocupacaoAlvoId: state.objetivoOcupacaoId,
      competencias: competenciasCidadao,
      disponibilidade: CIDADAO_DEMO.disponibilidade,
      experienciaAnos: 2,
    },
    ...TALENTOS,
  ];

  const resultados: Resultado[] = talentos
    .map((talento) => ({ talento, diag: diagnosticar(ocupacaoId, talento.competencias) }))
    .filter((r): r is Resultado => r.diag !== null && r.diag.prontidao >= minimo)
    .sort((a, b) => b.diag.prontidao - a.diag.prontidao);

  const prontos = resultados.filter((r) => nivelProntidao(r.diag.prontidao) === "pronto");
  const preparaveis = resultados.filter((r) => nivelProntidao(r.diag.prontidao) !== "pronto");

  return (
    <div className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Ocupação</span>
            <select
              value={ocupacaoId}
              onChange={(e) => setOcupacaoId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-teal-500 focus:outline-none"
            >
              {OCUPACOES.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nome}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 flex justify-between font-medium text-slate-700">
              Prontidão mínima <span className="tabular-nums text-teal-700">{minimo}%</span>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={minimo}
              onChange={(e) => setMinimo(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
          </label>
          <p className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <ShieldCheck className="size-4 text-teal-600" aria-hidden />
            Perfis pseudonimizados · contato mediado (LGPD)
          </p>
        </div>
      </Card>

      <Grupo
        titulo="Prontos para contratar"
        descricao="Prontidão ≥ 80% com competências verificadas."
        resultados={prontos}
        encaminhados={state.encaminhados}
        onEncaminhar={alternarEncaminhamento}
        destaqueId={CIDADAO_DEMO.id}
      />
      <Grupo
        titulo="Podem ser preparados"
        descricao="Faltam poucas competências; a trilha indicada fecha o gap."
        resultados={preparaveis}
        encaminhados={state.encaminhados}
        onEncaminhar={alternarEncaminhamento}
        destaqueId={CIDADAO_DEMO.id}
      />
    </div>
  );
}

interface GrupoProps {
  titulo: string;
  descricao: string;
  resultados: Resultado[];
  encaminhados: string[];
  onEncaminhar: (id: string) => void;
  destaqueId: string;
}

function Grupo({ titulo, descricao, resultados, encaminhados, onEncaminhar, destaqueId }: GrupoProps) {
  return (
    <section>
      <div className="mb-3 flex items-baseline gap-2">
        <h2 className="text-base font-semibold text-slate-900">{titulo}</h2>
        <span className="text-sm text-slate-500">({resultados.length})</span>
      </div>
      <p className="-mt-2 mb-3 text-xs text-slate-500">{descricao}</p>
      {resultados.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
          Nenhum talento neste grupo com os filtros atuais.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resultados.map(({ talento, diag }) => {
            const convidado = encaminhados.includes(talento.id);
            const trilhasSugeridas = Array.from(
              new Map(
                diag.pendentes
                  .map((c) => trilhaRecomendada(c))
                  .filter((t) => t !== undefined)
                  .map((t) => [t.id, t]),
              ).values(),
            );
            return (
              <article
                key={talento.id}
                className={cx(
                  "flex flex-col rounded-2xl border bg-white p-4 shadow-sm",
                  talento.id === destaqueId ? "border-teal-400 ring-1 ring-teal-400" : "border-slate-200",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{talento.nome}</p>
                    <p className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="size-3" aria-hidden /> {talento.bairro} · {talento.experienciaAnos} ano
                      {talento.experienciaAnos === 1 ? "" : "s"} de experiência
                    </p>
                  </div>
                  {talento.id === destaqueId && <Badge tom="marca">Passaporte demo</Badge>}
                </div>

                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-500">Prontidão</span>
                    <span className="font-semibold tabular-nums text-slate-900">{diag.prontidao}%</span>
                  </div>
                  <ProgressBar valor={diag.prontidao} tom={tomPorProntidao(diag.prontidao)} rotulo={`Prontidão de ${talento.nome}`} />
                </div>

                <ul className="mt-3 flex-1 space-y-1 text-xs">
                  {diag.concluidas.map((c) => (
                    <li key={c} className="flex items-center gap-1.5 text-slate-700">
                      <CheckCircle2 className="size-3.5 text-emerald-600" aria-hidden /> {nomeCompetencia(c)}
                    </li>
                  ))}
                  {diag.pendentes.map((c) => (
                    <li key={c} className="flex items-center gap-1.5 text-slate-400">
                      <Circle className="size-3.5" aria-hidden /> {nomeCompetencia(c)}
                    </li>
                  ))}
                </ul>

                {trilhasSugeridas.length > 0 && (
                  <p className="mt-3 rounded-lg bg-amber-50 px-2.5 py-2 text-xs text-amber-900">
                    Preparar com:{" "}
                    {trilhasSugeridas.map((t, i) => (
                      <span key={t.id}>
                        {i > 0 && ", "}
                        <Link href={`/trilhas/${t.id}`} className="font-medium underline">
                          {t.titulo}
                        </Link>
                      </span>
                    ))}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => onEncaminhar(talento.id)}
                  className={cx(
                    "mt-3 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                    convidado
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-teal-600 text-white hover:bg-teal-700",
                  )}
                >
                  {convidado ? (
                    <>
                      <MailCheck className="size-4" aria-hidden /> Convite enviado
                    </>
                  ) : (
                    <>
                      <Send className="size-4" aria-hidden /> Convidar para entrevista
                    </>
                  )}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

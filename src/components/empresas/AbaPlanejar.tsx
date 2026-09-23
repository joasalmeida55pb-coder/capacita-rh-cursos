"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AlertTriangle, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { OCUPACOES, getOcupacao, nomeOcupacao } from "@/data/base";
import { EMPRESA_DEMO, HORIZONTES, rotuloHorizonte } from "@/data/empresa";
import { cruzamentoOcupacoes, trilhaRecomendada } from "@/lib/calculos";
import { cx, fmtData, fmtNumero } from "@/lib/format";
import { useCapacita } from "@/lib/store";
import type { HorizontePrevisao } from "@/lib/types";

export function AbaPlanejar() {
  const { state, adicionarPrevisao, removerPrevisao } = useCapacita();
  const [ocupacaoId, setOcupacaoId] = useState(OCUPACOES[0]?.id ?? "");
  const [quantidade, setQuantidade] = useState(2);
  const [horizonte, setHorizonte] = useState<HorizontePrevisao>("30");
  const [observacao, setObservacao] = useState("");
  const [salvo, setSalvo] = useState(false);

  const previsoes = state.previsoes.filter((p) => p.empresaId === EMPRESA_DEMO.id);
  const linhas = new Map(cruzamentoOcupacoes(state.previsoes).map((l) => [l.ocupacaoId, l]));
  const ocupacoesPrevistas = Array.from(new Set(previsoes.map((p) => p.ocupacaoId)));

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ocupacaoId || quantidade < 1) return;
    adicionarPrevisao({
      empresaId: EMPRESA_DEMO.id,
      ocupacaoId,
      quantidade,
      horizonte,
      observacao: observacao.trim(),
    });
    setObservacao("");
    setSalvo(true);
    window.setTimeout(() => setSalvo(false), 2500);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2" titulo="Registrar previsão de contratação" subtitulo="Antecipe a demanda para que a qualificação comece antes da urgência.">
        <form onSubmit={enviar} className="space-y-4">
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
            <span className="mb-1 block font-medium text-slate-700">Quantidade de pessoas</span>
            <input
              type="number"
              min={1}
              max={200}
              value={quantidade}
              onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value) || 1))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 tabular-nums focus:border-teal-500 focus:outline-none"
            />
          </label>

          <fieldset className="text-sm">
            <legend className="mb-1 font-medium text-slate-700">Horizonte</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {HORIZONTES.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setHorizonte(h.id)}
                  title={h.descricao}
                  aria-pressed={horizonte === h.id}
                  className={cx(
                    "rounded-lg border px-2 py-2 text-xs font-medium transition",
                    horizonte === h.id
                      ? "border-teal-600 bg-teal-50 text-teal-900 ring-1 ring-teal-600"
                      : "border-slate-200 text-slate-600 hover:border-slate-300",
                  )}
                >
                  {h.rotulo}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-slate-500">{HORIZONTES.find((h) => h.id === horizonte)?.descricao}</p>
          </fieldset>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Observação (opcional)</span>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={2}
              placeholder="Ex.: inglês desejável, turno noturno…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <Plus className="size-4" aria-hidden /> Registrar previsão
          </button>
          {salvo && (
            <p className="flex items-center gap-1.5 text-xs text-emerald-700" role="status">
              <CheckCircle2 className="size-3.5" aria-hidden /> Previsão registrada e enviada ao Capacita Insights.
            </p>
          )}
        </form>
      </Card>

      <div className="space-y-6 lg:col-span-3">
        <Card titulo="Previsões registradas" subtitulo={`${previsoes.reduce((a, p) => a + p.quantidade, 0)} pessoas previstas em ${previsoes.length} registros`}>
          {previsoes.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma previsão registrada.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {previsoes.map((p) => (
                <li key={p.id} className="flex items-start gap-3 py-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold tabular-nums text-slate-700">
                    {p.quantidade}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{nomeOcupacao(p.ocupacaoId)}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <Badge tom={p.horizonte.includes("temporada") ? "info" : "neutro"}>{rotuloHorizonte(p.horizonte)}</Badge>
                      <span>registrada em {fmtData(p.criadaEm)}</span>
                    </div>
                    {p.observacao && <p className="mt-1 text-xs text-slate-600">{p.observacao}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removerPrevisao(p.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Remover previsão de ${nomeOcupacao(p.ocupacaoId)}`}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card titulo="Leitura de disponibilidade no município" subtitulo="Profissionais prontos hoje frente à demanda total prevista (todas as empresas).">
          <ul className="space-y-3">
            {ocupacoesPrevistas.map((id) => {
              const linha = linhas.get(id);
              const ocupacao = getOcupacao(id);
              if (!linha || !ocupacao) return null;
              const escasso = linha.gap > 0;
              const pendente = ocupacao.requisitos
                .slice()
                .sort((a, b) => b.peso - a.peso)
                .map((r) => trilhaRecomendada(r.competenciaId))
                .find((t) => t !== undefined);
              return (
                <li key={id} className={cx("rounded-xl border p-3 text-sm", escasso ? "border-amber-200 bg-amber-50/60" : "border-emerald-200 bg-emerald-50/60")}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-900">{ocupacao.nome}</span>
                    {escasso ? (
                      <Badge tom="alerta">
                        <AlertTriangle className="size-3" aria-hidden /> Gap +{fmtNumero(linha.gap)}
                      </Badge>
                    ) : (
                      <Badge tom="sucesso">Oferta suficiente</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    Demanda {fmtNumero(linha.demanda)} · disponíveis {fmtNumero(linha.disponiveis)} · prontos{" "}
                    {fmtNumero(linha.prontos)}
                  </p>
                  {escasso && pendente && (
                    <p className="mt-1.5 text-xs text-slate-700">
                      Sugestão: apoiar turmas de{" "}
                      <Link href={`/trilhas/${pendente.id}`} className="font-medium text-teal-700 hover:underline">
                        {pendente.titulo}
                      </Link>{" "}
                      para preparar candidatos antes do prazo.
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}

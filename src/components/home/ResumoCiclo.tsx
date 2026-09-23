"use client";

import { ArrowRight, ClipboardList, GraduationCap, Target, TrendingUp } from "lucide-react";
import { diagnosticar, cruzamentoOcupacoes } from "@/lib/calculos";
import { fmtNumero } from "@/lib/format";
import { useCapacita } from "@/lib/store";

/** Mostra, com dados vivos, como cada etapa do ciclo alimenta a seguinte */
export function ResumoCiclo() {
  const { state, competenciasCidadao } = useCapacita();
  const linhas = cruzamentoOcupacoes(state.previsoes);
  const maiorGap = linhas[0];
  const diag = diagnosticar(state.objetivoOcupacaoId, competenciasCidadao);
  const vagasEmpresas = state.previsoes.reduce((acc, p) => acc + p.quantidade, 0);
  const certificados = Object.keys(state.trilhasConcluidas).length;

  const etapas = [
    {
      icone: ClipboardList,
      titulo: "1. Demanda",
      valor: `${fmtNumero(vagasEmpresas)} vagas`,
      texto: "previstas pela empresa demo em Capacita Empresas",
    },
    {
      icone: Target,
      titulo: "2. Gap",
      valor: maiorGap ? `+${fmtNumero(maiorGap.gap)}` : "—",
      texto: maiorGap ? `maior déficit: ${maiorGap.nome}` : "",
    },
    {
      icone: GraduationCap,
      titulo: "3. Capacitação",
      valor: `${certificados} certificado${certificados === 1 ? "" : "s"}`,
      texto: "emitidos pelas trilhas no passaporte da cidadã demo",
    },
    {
      icone: TrendingUp,
      titulo: "4. Resultado",
      valor: diag ? `${diag.prontidao}%` : "—",
      texto: diag ? `prontidão para ${diag.ocupacao.nome}` : "",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      {etapas.map(({ icone: Icone, titulo, valor, texto }, i) => (
        <div key={titulo} className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-teal-700">
            <Icone className="size-4" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wide">{titulo}</span>
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">{valor}</p>
          <p className="text-xs text-slate-500">{texto}</p>
          {i < etapas.length - 1 && (
            <ArrowRight
              className="absolute -right-3 top-1/2 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-white text-slate-300 md:block"
              aria-hidden
            />
          )}
        </div>
      ))}
    </div>
  );
}

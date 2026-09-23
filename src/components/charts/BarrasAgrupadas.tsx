"use client";

import { useState } from "react";
import { fmtNumero } from "@/lib/format";

export interface SerieBarra {
  chave: string;
  rotulo: string;
  cor: string;
}

export interface LinhaBarra {
  id: string;
  rotulo: string;
  valores: Record<string, number>;
}

interface Props {
  series: SerieBarra[];
  linhas: LinhaBarra[];
}

/** Barras horizontais agrupadas (uma escala, uma linha por categoria) com tooltip por linha */
export function BarrasAgrupadas({ series, linhas }: Props) {
  const [foco, setFoco] = useState<string | null>(null);
  const max = Math.max(1, ...linhas.flatMap((l) => series.map((s) => l.valores[s.chave] ?? 0)));

  return (
    <div>
      <ul className="mb-4 flex flex-wrap gap-4 text-xs text-slate-600" aria-label="Legenda">
        {series.map((s) => (
          <li key={s.chave} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm" style={{ backgroundColor: s.cor }} aria-hidden />
            {s.rotulo}
          </li>
        ))}
      </ul>
      <ul className="space-y-3">
        {linhas.map((linha) => (
          <li
            key={linha.id}
            className="relative grid grid-cols-[8.5rem_1fr] items-center gap-3 rounded-lg px-1 py-1 hover:bg-slate-50 sm:grid-cols-[11rem_1fr]"
            onMouseEnter={() => setFoco(linha.id)}
            onMouseLeave={() => setFoco(null)}
            onFocus={() => setFoco(linha.id)}
            onBlur={() => setFoco(null)}
            tabIndex={0}
          >
            <span className="truncate text-sm text-slate-700" title={linha.rotulo}>
              {linha.rotulo}
            </span>
            <div className="space-y-0.5">
              {series.map((s) => {
                const v = linha.valores[s.chave] ?? 0;
                return (
                  <div key={s.chave} className="flex items-center gap-2">
                    <div
                      className="h-2.5 rounded-r-[4px] transition-all duration-500"
                      style={{ width: `${(v / max) * 100}%`, backgroundColor: s.cor, minWidth: v > 0 ? 2 : 0 }}
                    />
                  </div>
                );
              })}
            </div>
            {foco === linha.id && (
              <div
                role="tooltip"
                className="pointer-events-none absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg"
              >
                <p className="mb-1 font-semibold text-slate-900">{linha.rotulo}</p>
                {series.map((s) => (
                  <p key={s.chave} className="flex items-center gap-2 text-slate-600">
                    <span className="size-2 rounded-sm" style={{ backgroundColor: s.cor }} aria-hidden />
                    {s.rotulo}: <strong className="tabular-nums text-slate-900">{fmtNumero(linha.valores[s.chave] ?? 0)}</strong>
                  </p>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

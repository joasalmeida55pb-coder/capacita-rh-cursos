import { fmtNumero } from "@/lib/format";
import type { EtapaFunil } from "@/lib/types";

/** Funil de conversão: barras centradas proporcionais ao primeiro estágio */
export function Funil({ etapas, cor }: { etapas: EtapaFunil[]; cor: string }) {
  const base = etapas[0]?.valor ?? 1;
  return (
    <ol className="space-y-1.5">
      {etapas.map((e, i) => {
        const anterior = i > 0 ? etapas[i - 1]?.valor : undefined;
        const conversao = anterior ? Math.round((e.valor / anterior) * 100) : null;
        return (
          <li key={e.etapa} className="grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-3 text-sm" title={`${e.etapa}: ${fmtNumero(e.valor)}`}>
            <span className="text-slate-700">{e.etapa}</span>
            <div className="flex justify-center">
              <div
                className="flex h-7 items-center justify-center rounded-[4px] text-xs font-semibold tabular-nums text-white"
                style={{ width: `${Math.max(12, (e.valor / base) * 100)}%`, backgroundColor: cor }}
              >
                {fmtNumero(e.valor)}
              </div>
            </div>
            <span className="text-right text-xs tabular-nums text-slate-500">{conversao !== null ? `${conversao}%` : ""}</span>
          </li>
        );
      })}
    </ol>
  );
}

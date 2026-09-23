import { cx } from "@/lib/format";

interface ReadinessRingProps {
  valor: number;
  tamanho?: number;
  rotulo?: string;
}

/** Indicador circular de prontidão (0–100) */
export function ReadinessRing({ valor, tamanho = 148, rotulo = "Prontidão" }: ReadinessRingProps) {
  const v = Math.max(0, Math.min(100, valor));
  const traco = 12;
  const raio = (tamanho - traco) / 2;
  const circ = 2 * Math.PI * raio;
  const cor = v >= 80 ? "stroke-emerald-500" : v >= 50 ? "stroke-amber-500" : "stroke-rose-500";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: tamanho, height: tamanho }}>
      <svg width={tamanho} height={tamanho} className="-rotate-90" role="img" aria-label={`${rotulo}: ${v}%`}>
        <circle cx={tamanho / 2} cy={tamanho / 2} r={raio} strokeWidth={traco} className="fill-none stroke-slate-100" />
        <circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={raio}
          strokeWidth={traco}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - v / 100)}
          className={cx("fill-none transition-all duration-700", cor)}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-bold tabular-nums text-slate-900">{v}%</p>
        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{rotulo}</p>
      </div>
    </div>
  );
}

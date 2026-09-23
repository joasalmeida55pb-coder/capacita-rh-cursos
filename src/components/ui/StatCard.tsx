import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icone: LucideIcon;
  rotulo: string;
  valor: string;
  detalhe?: string;
}

export function StatCard({ icone: Icone, rotulo, valor, detalhe }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-slate-500">
        <Icone className="size-4" aria-hidden />
        <span className="text-xs font-medium uppercase tracking-wide">{rotulo}</span>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">{valor}</p>
      {detalhe && <p className="mt-0.5 text-xs text-slate-500">{detalhe}</p>}
    </div>
  );
}

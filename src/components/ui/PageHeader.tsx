import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  icone: LucideIcon;
  modulo: string;
  titulo: string;
  descricao: string;
  acao?: ReactNode;
}

export function PageHeader({ icone: Icone, modulo, titulo, descricao, acao }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
          <Icone className="size-5" aria-hidden />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">{modulo}</p>
          <h1 className="text-2xl font-bold text-slate-900">{titulo}</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">{descricao}</p>
        </div>
      </div>
      {acao}
    </div>
  );
}

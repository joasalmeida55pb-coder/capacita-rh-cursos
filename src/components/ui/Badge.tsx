import type { ReactNode } from "react";
import { getSetor } from "@/data/base";
import { cx } from "@/lib/format";
import type { SetorId } from "@/lib/types";

export type Tom = "neutro" | "sucesso" | "alerta" | "perigo" | "info" | "marca";

const TONS: Record<Tom, string> = {
  neutro: "bg-slate-100 text-slate-700 ring-slate-200",
  sucesso: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  alerta: "bg-amber-50 text-amber-800 ring-amber-200",
  perigo: "bg-rose-50 text-rose-700 ring-rose-200",
  info: "bg-sky-50 text-sky-700 ring-sky-200",
  marca: "bg-teal-50 text-teal-700 ring-teal-200",
};

interface BadgeProps {
  children: ReactNode;
  tom?: Tom;
  className?: string;
}

export function Badge({ children, tom = "neutro", className }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONS[tom],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SetorBadge({ setor }: { setor: SetorId }) {
  const s = getSetor(setor);
  return (
    <span className={cx("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", s.cor)}>
      {s.nome}
    </span>
  );
}

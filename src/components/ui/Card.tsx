import type { ReactNode } from "react";
import { cx } from "@/lib/format";

interface CardProps {
  children: ReactNode;
  className?: string;
  titulo?: string;
  subtitulo?: string;
  acao?: ReactNode;
}

export function Card({ children, className, titulo, subtitulo, acao }: CardProps) {
  return (
    <section className={cx("min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm", className)}>
      {(titulo || acao) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            {titulo && <h2 className="text-base font-semibold text-slate-900">{titulo}</h2>}
            {subtitulo && <p className="mt-0.5 text-sm text-slate-500">{subtitulo}</p>}
          </div>
          {acao}
        </header>
      )}
      {children}
    </section>
  );
}

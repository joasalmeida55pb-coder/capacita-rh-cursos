"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { useCapacita } from "@/lib/store";
import { cx } from "@/lib/format";
import { NAVEGACAO } from "./navegacao";

function ativo(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();
  const { resetar } = useCapacita();

  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-teal-600 text-sm font-black text-white">
            C
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-slate-900">Capacita RH</p>
            <p className="text-xs text-slate-500">Balneário Camboriú · Piloto</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAVEGACAO.map(({ href, rotulo, descricao, icone: Icone }) => {
            const selecionado = ativo(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cx(
                  "flex items-start gap-3 rounded-lg px-3 py-2.5 transition",
                  selecionado ? "bg-teal-50 text-teal-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <Icone className={cx("mt-0.5 size-4 shrink-0", selecionado ? "text-teal-700" : "text-slate-400")} aria-hidden />
                <span>
                  <span className="block text-sm font-medium">{rotulo}</span>
                  <span className="block text-xs text-slate-500">{descricao}</span>
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={resetar}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Restaurar dados de demonstração
          </button>
          <p className="mt-3 text-[11px] leading-snug text-slate-400">
            Dados fictícios salvos localmente no navegador. Painéis institucionais usam apenas dados agregados (LGPD).
          </p>
        </div>
      </aside>

      {/* Mobile */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-teal-600 text-sm font-black text-white">C</div>
          <p className="text-sm font-bold text-slate-900">Capacita RH</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
          {NAVEGACAO.map(({ href, rotulo, icone: Icone }) => (
            <Link
              key={href}
              href={href}
              className={cx(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
                ativo(pathname, href) ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700",
              )}
            >
              <Icone className="size-3.5" aria-hidden />
              {rotulo.replace("Capacita ", "")}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}

"use client";

import type { LucideIcon } from "lucide-react";
import { cx } from "@/lib/format";

export interface TabItem<T extends string> {
  id: T;
  rotulo: string;
  icone: LucideIcon;
  descricao?: string;
}

interface TabsProps<T extends string> {
  itens: TabItem<T>[];
  ativo: T;
  onChange: (id: T) => void;
}

export function Tabs<T extends string>({ itens, ativo, onChange }: TabsProps<T>) {
  return (
    <div role="tablist" className="mb-6 grid gap-2 sm:grid-cols-3">
      {itens.map(({ id, rotulo, icone: Icone, descricao }) => {
        const selecionado = id === ativo;
        return (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={selecionado}
            onClick={() => onChange(id)}
            className={cx(
              "flex items-start gap-3 rounded-xl border p-3 text-left transition",
              selecionado
                ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600"
                : "border-slate-200 bg-white hover:border-slate-300",
            )}
          >
            <Icone className={cx("mt-0.5 size-5 shrink-0", selecionado ? "text-teal-700" : "text-slate-400")} aria-hidden />
            <span>
              <span className={cx("block text-sm font-semibold", selecionado ? "text-teal-900" : "text-slate-800")}>
                {rotulo}
              </span>
              {descricao && <span className="block text-xs text-slate-500">{descricao}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

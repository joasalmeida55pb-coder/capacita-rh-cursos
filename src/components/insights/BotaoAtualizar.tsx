"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cx } from "@/lib/format";

/** Rebusca os dados do servidor (nova chamada à RPC) sem recarregar a página. */
export function BotaoAtualizar() {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  return (
    <button
      type="button"
      onClick={() => iniciar(() => router.refresh())}
      disabled={pendente}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
    >
      <RefreshCw className={cx("size-3.5", pendente && "animate-spin")} aria-hidden />
      {pendente ? "Atualizando…" : "Atualizar"}
    </button>
  );
}

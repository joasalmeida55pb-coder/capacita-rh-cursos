"use client";

import { Building2, LogIn, LogOut, UserRound } from "lucide-react";
import { nomeSessao, useAuth } from "@/lib/auth/AuthProvider";
import { mascararCNPJ } from "@/lib/auth/validacao";

function iniciais(nome: string): string {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Bloco de conta da barra lateral: botão de acesso ou usuário conectado */
export function ContaUsuario({ compacto = false }: { compacto?: boolean }) {
  const { sessao, carregado, abrirAcesso, sair } = useAuth();

  if (!carregado) return <div className={compacto ? "size-8" : "h-[52px]"} aria-hidden />;

  if (!sessao) {
    return compacto ? (
      <button
        type="button"
        onClick={() => abrirAcesso()}
        className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white"
      >
        <LogIn className="size-3.5" aria-hidden /> Entrar
      </button>
    ) : (
      <button
        type="button"
        onClick={() => abrirAcesso()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
      >
        <LogIn className="size-4" aria-hidden /> Entrar ou cadastrar
      </button>
    );
  }

  const nome = nomeSessao(sessao);
  const detalhe =
    sessao.tipo === "empresa"
      ? `Empresa · ${mascararCNPJ(sessao.cnpj)}`
      : `Cidadão · ${sessao.via === "govbr" ? "via gov.br" : "e-mail"}`;
  const Icone = sessao.tipo === "empresa" ? Building2 : UserRound;

  if (compacto) {
    return (
      <button
        type="button"
        onClick={sair}
        title={`${nome} — sair`}
        className="flex size-8 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800"
      >
        {iniciais(nome)}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-2.5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
        {iniciais(nome)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900" title={nome}>
          {nome}
        </p>
        <p className="flex items-center gap-1 truncate text-[11px] text-slate-500">
          <Icone className="size-3 shrink-0" aria-hidden /> {detalhe}
        </p>
      </div>
      <button type="button" onClick={sair} className="rounded-md p-1.5 text-slate-400 hover:bg-white hover:text-rose-600" aria-label="Sair">
        <LogOut className="size-4" aria-hidden />
      </button>
    </div>
  );
}

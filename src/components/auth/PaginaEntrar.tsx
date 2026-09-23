"use client";

import Link from "next/link";
import { CheckCircle2, LogIn } from "lucide-react";
import { nomeSessao, useAuth } from "@/lib/auth/AuthProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { PainelAcesso } from "./PainelAcesso";

export function PaginaEntrar() {
  const { sessao, carregado, sair } = useAuth();

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader icone={LogIn} modulo="Acesso" titulo="Entrar ou criar conta" descricao="Área única de acesso para cidadãos e empresas." />
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        {!carregado ? null : sessao ? (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="mx-auto size-10 text-emerald-500" aria-hidden />
            <p className="text-slate-700">
              Você está conectado(a) como <strong>{nomeSessao(sessao)}</strong>.
            </p>
            <div className="flex justify-center gap-2">
              <Link
                href={sessao.tipo === "empresa" ? "/empresas" : "/cidadao"}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                {sessao.tipo === "empresa" ? "Ir para Capacita Empresas" : "Ver meu passaporte"}
              </Link>
              <button type="button" onClick={sair} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Sair
              </button>
            </div>
          </div>
        ) : (
          <PainelAcesso />
        )}
      </div>
      <p className="mt-4 text-center text-xs text-slate-500">
        Gestor público? O painel Capacita Insights tem{" "}
        <Link href="/insights" className="font-medium text-teal-700 hover:underline">
          acesso governamental próprio
        </Link>
        .
      </p>
    </div>
  );
}

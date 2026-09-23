"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, ShieldCheck, UserRound } from "lucide-react";
import { IDENTIDADE_GOVBR_DEMO, useAuth } from "@/lib/auth/AuthProvider";
import { ocultarCPF } from "@/lib/auth/validacao";

/** Azul do Padrão Digital de Governo usado nos botões de acesso gov.br */
const AZUL_GOV = "#1351B4";

export function BotaoGovBr({ onClick, rotulo = "Entrar com gov.br" }: { onClick: () => void; rotulo?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ backgroundColor: AZUL_GOV }}
      className="flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
    >
      <UserRound className="size-4" aria-hidden />
      {rotulo}
    </button>
  );
}

/**
 * Simulação do fluxo Login Único gov.br.
 * No fluxo real o usuário é redirecionado para acesso.gov.br, informa CPF e senha LÁ
 * e volta autenticado (OpenID Connect). Esta tela nunca pede a senha do gov.br.
 */
export function SimulacaoGovBr({ onVoltar }: { onVoltar: () => void }) {
  const { entrarGovBr } = useAuth();
  const [etapa, setEtapa] = useState<"redirecionando" | "consentimento" | "concluindo">("redirecionando");
  const identidade = IDENTIDADE_GOVBR_DEMO;

  // Pequena espera para representar o redirecionamento ao acesso.gov.br
  useEffect(() => {
    if (etapa !== "redirecionando") return;
    const t = window.setTimeout(() => setEtapa("consentimento"), 900);
    return () => window.clearTimeout(t);
  }, [etapa]);

  async function autorizar() {
    setEtapa("concluindo");
    await entrarGovBr(identidade);
  }

  return (
    <div className="space-y-4">
      <button type="button" onClick={onVoltar} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800">
        <ArrowLeft className="size-3.5" aria-hidden /> Voltar
      </button>

      <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
        <strong>Ambiente de simulação.</strong> Na versão oficial, você será levado ao site acesso.gov.br para digitar
        CPF e senha. O Capacita RH nunca solicita a senha do gov.br.
      </p>

      {etapa === "redirecionando" ? (
        <div className="flex flex-col items-center gap-3 py-8 text-sm text-slate-600" role="status">
          <Loader2 className="size-6 animate-spin" style={{ color: AZUL_GOV }} aria-hidden />
          Redirecionando para o acesso gov.br…
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="px-4 py-3 text-sm font-semibold text-white" style={{ backgroundColor: AZUL_GOV }}>
            Autorização de uso de dados pessoais
          </div>
          <div className="space-y-3 p-4 text-sm">
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                <UserRound className="size-5" aria-hidden />
              </div>
              <div>
                <p className="font-medium text-slate-900">{identidade.nome}</p>
                <p className="text-xs text-slate-500">
                  CPF {ocultarCPF(identidade.cpf)} · conta nível {identidade.nivel}
                </p>
              </div>
            </div>
            <p className="text-slate-700">
              O serviço <strong>Capacita RH — Prefeitura de Balneário Camboriú</strong> solicita acesso a:
            </p>
            <ul className="space-y-1 text-slate-600">
              {["Nome completo", "CPF", "E-mail", "Nível da conta (bronze, prata ou ouro)"].map((d) => (
                <li key={d} className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600" aria-hidden /> {d}
                </li>
              ))}
            </ul>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={autorizar}
                disabled={etapa === "concluindo"}
                style={{ backgroundColor: AZUL_GOV }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
              >
                {etapa === "concluindo" && <Loader2 className="size-4 animate-spin" aria-hidden />}
                Autorizar
              </button>
              <button
                type="button"
                onClick={onVoltar}
                className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

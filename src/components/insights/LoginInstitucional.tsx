"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import { Landmark, Loader2, Lock, ShieldCheck } from "lucide-react";
import { entrarInstitucional, type EstadoLoginInstitucional } from "@/app/insights/actions";
import { Campo } from "@/components/auth/Campo";

interface Props {
  orgaos: readonly string[];
  /** Credencial de demonstração (exibida só fora de produção) */
  demo?: { usuario: string; senha: string };
}

export function LoginInstitucional({ orgaos, demo }: Props) {
  const [estado, acao, pendente] = useActionState<EstadoLoginInstitucional, FormData>(entrarInstitucional, {});
  const [orgao, setOrgao] = useState("");
  const [usuario, setUsuario] = useState("");

  // Envio manual (em vez de `action={...}`) para o React não limpar o formulário após um erro
  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    startTransition(() => acao(dados));
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg md:grid-cols-5">
        <aside className="flex flex-col justify-between gap-6 bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white md:col-span-2 sm:p-8">
          <div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-white/10">
              <Landmark className="size-6" aria-hidden />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-slate-300">Capacita Insights</p>
            <h1 className="mt-1 text-2xl font-bold leading-tight">Acesso Governamental</h1>
            <p className="mt-2 text-sm text-slate-300">
              Painel executivo de demanda, escassez e sazonalidade do mercado de trabalho de Balneário Camboriú.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden />
              Exclusivo para servidores da Prefeitura e Secretarias.
            </li>
            <li className="flex items-start gap-2">
              <Lock className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden />
              Somente dados agregados, sem identificação de pessoas (LGPD).
            </li>
          </ul>
        </aside>

        <form onSubmit={enviar} className="space-y-4 p-6 md:col-span-3 sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Entrar com credencial institucional</h2>
            <p className="text-sm text-slate-500">Use o usuário fornecido pela Secretaria responsável pelo piloto.</p>
          </div>

          <div>
            <label htmlFor="orgao" className="mb-1 block text-sm font-medium text-slate-700">
              Órgão / Secretaria
            </label>
            <select
              id="orgao"
              name="orgao"
              value={orgao}
              onChange={(e) => setOrgao(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
            >
              <option value="" disabled>
                Selecione…
              </option>
              {orgaos.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <Campo
            rotulo="Usuário ou matrícula"
            name="usuario"
            autoComplete="username"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
          <Campo rotulo="Senha" name="senha" type="password" autoComplete="current-password" required />

          {estado.erro && (
            <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {estado.erro}
            </p>
          )}

          <button
            type="submit"
            disabled={pendente}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-70"
          >
            {pendente ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Lock className="size-4" aria-hidden />}
            Acessar painel
          </button>

          {demo && (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              Ambiente de desenvolvimento — usuário <code className="font-semibold text-slate-700">{demo.usuario}</code> · senha{" "}
              <code className="font-semibold text-slate-700">{demo.senha}</code>. Em produção defina INSIGHTS_USUARIO,
              INSIGHTS_SENHA e CAPACITA_AUTH_SECRET.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

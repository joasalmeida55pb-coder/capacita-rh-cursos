import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ResumoCiclo } from "@/components/home/ResumoCiclo";
import { NAVEGACAO } from "@/components/layout/navegacao";

const DESCRICOES: Record<string, string> = {
  "/cidadao":
    "Perfil por competências, diagnóstico de prontidão para a ocupação desejada, competências pendentes e histórico de certificados.",
  "/trilhas":
    "Trilhas curtas conectadas à demanda de Turismo, Comércio, Gastronomia e Inglês para Atendimento, com módulos e progresso.",
  "/empresas":
    "Planejar contratações (30/60/90 dias e temporadas), desenvolver equipes com trilhas e matriz de competências, contratar por prontidão.",
  "/insights":
    "Demanda prevista × disponíveis × prontos × gap por ocupação, escassez, sazonalidade, gaps de competência e funil de impacto.",
};

export default function Home() {
  const modulos = NAVEGACAO.filter((n) => n.href !== "/");

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 to-sky-800 p-6 text-white shadow-lg sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-100">
          Qualificação · Competências · Inteligência do mercado de trabalho
        </p>
        <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
          Preparar pessoas para as necessidades reais de Balneário Camboriú
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-teal-50 sm:text-base">
          O Capacita RH complementa os canais municipais de emprego: não é um balcão de vagas. Ele transforma a
          demanda das empresas em trilhas de qualificação e em inteligência para a decisão pública.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Ciclo integrado · dados ao vivo da demonstração
        </h2>
        <ResumoCiclo />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Módulos da plataforma</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {modulos.map(({ href, rotulo, descricao, icone: Icone }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-500 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Icone className="size-5" aria-hidden />
                </div>
                <ArrowUpRight className="size-4 text-slate-300 transition group-hover:text-teal-600" aria-hidden />
              </div>
              <h3 className="mt-3 font-semibold text-slate-900">{rotulo}</h3>
              <p className="text-xs font-medium text-teal-700">{descricao}</p>
              <p className="mt-2 text-sm text-slate-600">{DESCRICOES[href]}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

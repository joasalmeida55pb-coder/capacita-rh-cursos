"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  Award,
  Building2,
  ChartColumnBig,
  CheckCircle2,
  Clock,
  GraduationCap,
  Handshake,
  Info,
  Landmark,
  LogOut,
  Users,
  type LucideIcon,
} from "lucide-react";
import { BarrasAgrupadas } from "@/components/charts/BarrasAgrupadas";
import { SERIES } from "@/components/charts/cores";
import { Funil } from "@/components/charts/Funil";
import { MapaCalor } from "@/components/charts/MapaCalor";
import { Badge, type Tom } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { getSetor, nomeCompetencia } from "@/data/base";
import { DESEMPENHO_TRILHAS, FUNIL_IMPACTO, KPIS_MUNICIPIO, MESES, SAZONALIDADE } from "@/data/insights";
import { getTrilha } from "@/data/trilhas";
import { cruzamentoOcupacoes, gapsDeCompetencia, type NivelEscassez } from "@/lib/calculos";
import { cx, fmtNumero, fmtSinal } from "@/lib/format";
import { useCapacita } from "@/lib/store";

const ESCASSEZ: Record<NivelEscassez, { rotulo: string; tom: Tom; icone: LucideIcon }> = {
  critica: { rotulo: "Crítica", tom: "perigo", icone: AlertOctagon },
  alta: { rotulo: "Alta", tom: "alerta", icone: AlertTriangle },
  moderada: { rotulo: "Moderada", tom: "info", icone: Info },
  equilibrada: { rotulo: "Equilibrada", tom: "sucesso", icone: CheckCircle2 },
};

/** Meses de alta temporada em BC: dez, jan, fev, mar */
const ALTA_TEMPORADA = [11, 0, 1, 2];

function media(valores: number[]): number {
  return valores.length ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;
}

interface PainelInsightsProps {
  baseReal?: ReactNode;
  /** Sessão institucional validada no servidor */
  sessao?: { nome: string; orgao: string };
  /** Server Action que encerra a sessão institucional */
  acaoSair?: () => Promise<void>;
}

export function PainelInsights({ baseReal, sessao, acaoSair }: PainelInsightsProps) {
  const { state } = useCapacita();
  const [incluirEmpresas, setIncluirEmpresas] = useState(true);

  const linhas = cruzamentoOcupacoes(incluirEmpresas ? state.previsoes : []);
  const gaps = gapsDeCompetencia(linhas).slice(0, 8);
  const maxGapComp = Math.max(1, ...gaps.map((g) => Math.max(g.exigida, g.disponivel)));
  const totais = linhas.reduce(
    (acc, l) => ({
      demanda: acc.demanda + l.demanda,
      disponiveis: acc.disponiveis + l.disponiveis,
      prontos: acc.prontos + l.prontos,
    }),
    { demanda: 0, disponiveis: 0, prontos: 0 },
  );
  const previstoEmpresas = state.previsoes.reduce((a, p) => a + p.quantidade, 0);

  const trilhasRanking = Object.entries(DESEMPENHO_TRILHAS)
    .map(([id, d]) => ({ id, titulo: getTrilha(id)?.titulo ?? id, ...d }))
    .sort((a, b) => b.inscritos - a.inscritos);

  return (
    <div className="space-y-6">
      {sessao && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-900 px-4 py-2.5 text-sm text-slate-200">
          <p className="flex items-center gap-2">
            <Landmark className="size-4 text-emerald-400" aria-hidden />
            <span>
              Acesso governamental · <strong className="text-white">{sessao.nome}</strong>
              <span className="text-slate-400"> — {sessao.orgao}</span>
            </span>
          </p>
          {acaoSair && (
            <form action={acaoSair}>
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white">
                <LogOut className="size-3.5" aria-hidden /> Encerrar sessão
              </button>
            </form>
          )}
        </div>
      )}

      <PageHeader
        icone={ChartColumnBig}
        modulo="Capacita Insights"
        titulo="Painel executivo municipal"
        descricao="Inteligência agregada para decisões de capacitação, empregabilidade e desenvolvimento econômico. Somente dados agregados — sem identificação de pessoas."
        acao={
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm">
            <input
              type="checkbox"
              checked={incluirEmpresas}
              onChange={(e) => setIncluirEmpresas(e.target.checked)}
              className="size-4 accent-teal-600"
            />
            Incluir previsões registradas pelas empresas (+{fmtNumero(previstoEmpresas)})
          </label>
        }
      />

      {/* Dados reais (Supabase) */}
      {baseReal}

      <div className="flex items-center gap-3 pt-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cenário ilustrativo do piloto</h2>
        <span className="h-px flex-1 bg-slate-200" />
        <Badge tom="neutro">Dados simulados</Badge>
      </div>

      {/* Visão geral */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard icone={Users} rotulo="Profissionais" valor={fmtNumero(KPIS_MUNICIPIO.profissionaisMapeados)} detalhe="mapeados por competência" />
        <StatCard icone={Building2} rotulo="Empresas" valor={fmtNumero(KPIS_MUNICIPIO.empresasParticipantes)} detalhe="participantes do piloto" />
        <StatCard icone={GraduationCap} rotulo="Em capacitação" valor={fmtNumero(KPIS_MUNICIPIO.emCapacitacao)} detalhe="trilhas ativas" />
        <StatCard icone={Award} rotulo="Certificações" valor={fmtNumero(KPIS_MUNICIPIO.certificacoes)} detalhe="emitidas no período" />
        <StatCard icone={Handshake} rotulo="Contratações" valor={fmtNumero(KPIS_MUNICIPIO.contratacoesPosCapacitacao)} detalhe="após capacitação" />
        <StatCard icone={Clock} rotulo="Recolocação" valor={`${KPIS_MUNICIPIO.tempoMedioRecolocacaoDias} dias`} detalhe="tempo médio pós-trilha" />
      </div>

      {/* Cruzamento */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card
          className="xl:col-span-3"
          titulo="Demanda prevista × disponíveis × prontos"
          subtitulo="Por ocupação. Prontos = prontidão estimada ≥ 80%."
        >
          <BarrasAgrupadas
            series={[
              { chave: "demanda", rotulo: "Demanda prevista", cor: SERIES.demanda },
              { chave: "disponiveis", rotulo: "Profissionais disponíveis", cor: SERIES.disponiveis },
              { chave: "prontos", rotulo: "Prontos", cor: SERIES.prontos },
            ]}
            linhas={linhas.map((l) => ({
              id: l.ocupacaoId,
              rotulo: l.nome,
              valores: { demanda: l.demanda, disponiveis: l.disponiveis, prontos: l.prontos },
            }))}
          />
        </Card>

        <Card className="xl:col-span-2" titulo="Indicadores de escassez" subtitulo="Demanda prevista ÷ profissionais prontos.">
          <ul className="space-y-2.5">
            {linhas
              .slice()
              .sort((a, b) => b.indiceEscassez - a.indiceEscassez)
              .map((l) => {
                const e = ESCASSEZ[l.nivelEscassez];
                const Icone = e.icone;
                return (
                  <li key={l.ocupacaoId} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-700">{l.nome}</span>
                    <span className="flex items-center gap-2">
                      <span className="tabular-nums text-slate-900">{l.indiceEscassez.toLocaleString("pt-BR")}×</span>
                      <Badge tom={e.tom}>
                        <Icone className="size-3" aria-hidden /> {e.rotulo}
                      </Badge>
                    </span>
                  </li>
                );
              })}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            Crítica ≥ 3× · Alta ≥ 1,5× · Moderada &gt; 1× · Equilibrada ≤ 1× (oferta de prontos cobre a demanda).
          </p>
        </Card>
      </div>

      <Card titulo="Tabela de cruzamento por ocupação" subtitulo="Gap = demanda prevista − profissionais prontos. Valores negativos indicam excedente de mão de obra pronta.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr className="border-b border-slate-200 text-right">
                <th className="py-2 text-left font-semibold">Ocupação</th>
                <th className="py-2 font-semibold">Demanda prevista</th>
                <th className="py-2 font-semibold">Das empresas</th>
                <th className="py-2 font-semibold">Disponíveis</th>
                <th className="py-2 font-semibold">Prontos</th>
                <th className="py-2 font-semibold">Gap</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {linhas.map((l) => (
                <tr key={l.ocupacaoId} className="border-b border-slate-100 text-right last:border-0">
                  <td className="py-2.5 text-left font-medium text-slate-800">{l.nome}</td>
                  <td className="py-2.5 text-slate-700">{fmtNumero(l.demanda)}</td>
                  <td className="py-2.5 text-slate-500">{l.demandaEmpresas ? fmtSinal(l.demandaEmpresas) : "—"}</td>
                  <td className="py-2.5 text-slate-700">{fmtNumero(l.disponiveis)}</td>
                  <td className="py-2.5 text-slate-700">{fmtNumero(l.prontos)}</td>
                  <td className={cx("py-2.5 font-semibold", l.gap > 0 ? "text-rose-700" : "text-emerald-700")}>{fmtSinal(l.gap)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-200 text-right font-semibold text-slate-900">
                <td className="py-2.5 text-left">Total</td>
                <td className="py-2.5">{fmtNumero(totais.demanda)}</td>
                <td />
                <td className="py-2.5">{fmtNumero(totais.disponiveis)}</td>
                <td className="py-2.5">{fmtNumero(totais.prontos)}</td>
                <td className="py-2.5">{fmtSinal(totais.demanda - totais.prontos)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Sazonalidade */}
      <Card titulo="Sazonalidade regional da demanda" subtitulo="Índice mensal de demanda por setor — base para antecipar turmas antes da alta temporada.">
        <MapaCalor
          colunas={MESES}
          linhas={SAZONALIDADE.map((s) => ({ id: s.setor, rotulo: getSetor(s.setor).nome, valores: s.indices }))}
          destaque={ALTA_TEMPORADA}
          rotuloDestaque="Alta temporada (dez–mar)"
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {SAZONALIDADE.map((s) => {
            const alta = media(ALTA_TEMPORADA.map((i) => s.indices[i] ?? 0));
            const baixa = media(s.indices.filter((_, i) => !ALTA_TEMPORADA.includes(i)));
            const variacao = Math.round(((alta - baixa) / baixa) * 100);
            return (
              <div key={s.setor} className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">{getSetor(s.setor).nome}</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">+{variacao}%</p>
                <p className="text-xs text-slate-500">demanda na alta vs. baixa temporada</p>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Gap de competências */}
        <Card titulo="Gap de competências" subtitulo="Vagas previstas que exigem a competência × profissionais que já a possuem.">
          <ul className="mb-4 flex flex-wrap gap-4 text-xs text-slate-600" aria-label="Legenda">
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm" style={{ backgroundColor: SERIES.demanda }} aria-hidden /> Exigida pela demanda
            </li>
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm" style={{ backgroundColor: SERIES.prontos }} aria-hidden /> Profissionais com a competência
            </li>
          </ul>
          <ul className="space-y-3">
            {gaps.map((g) => (
              <li key={g.competenciaId} title={`Exigida: ${fmtNumero(g.exigida)} · Disponível: ${fmtNumero(g.disponivel)}`}>
                <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                  <span className="text-slate-800">{nomeCompetencia(g.competenciaId)}</span>
                  <span className={cx("text-xs font-semibold tabular-nums", g.deficit > 0 ? "text-rose-700" : "text-emerald-700")}>
                    {g.deficit > 0 ? `déficit ${fmtNumero(g.deficit)}` : `excedente ${fmtNumero(-g.deficit)}`}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <div className="h-2 rounded-r-[4px]" style={{ width: `${(g.exigida / maxGapComp) * 100}%`, backgroundColor: SERIES.demanda }} />
                  <div className="h-2 rounded-r-[4px]" style={{ width: `${(g.disponivel / maxGapComp) * 100}%`, backgroundColor: SERIES.prontos }} />
                </div>
                {g.deficit > 0 && g.trilha && (
                  <Link href={`/trilhas/${g.trilha.id}`} className="mt-1 inline-block text-xs font-medium text-teal-700 hover:underline">
                    Priorizar trilha: {g.trilha.titulo} →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          {/* Impacto */}
          <Card titulo="Funil de impacto" subtitulo="Cadastro → capacitação → encaminhamento → entrevista → contratação → permanência.">
            <Funil etapas={FUNIL_IMPACTO} cor="#256abf" />
            <p className="mt-3 text-xs text-slate-500">Percentual à direita = conversão em relação à etapa anterior.</p>
          </Card>

          {/* Qualificação */}
          <Card titulo="Qualificação por trilha" subtitulo="Inscrições, conclusão e contratação após capacitação.">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-500">
                  <tr className="border-b border-slate-200 text-right">
                    <th className="py-2 text-left font-semibold">Trilha</th>
                    <th className="py-2 pl-3 font-semibold">Inscritos</th>
                    <th className="py-2 pl-3 font-semibold">Conclusão</th>
                    <th className="py-2 pl-3 font-semibold">Contratação</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {trilhasRanking.map((t) => (
                    <tr key={t.id} className="border-b border-slate-100 text-right last:border-0">
                      <td className="py-2 text-left">
                        <Link href={`/trilhas/${t.id}`} className="text-slate-800 hover:text-teal-700">
                          {t.titulo}
                        </Link>
                      </td>
                      <td className="py-2 text-slate-700">{fmtNumero(t.inscritos)}</td>
                      <td className="py-2 text-slate-700">{Math.round((t.concluintes / t.inscritos) * 100)}%</td>
                      <td className="py-2 text-slate-700">{Math.round((t.contratados / t.concluintes) * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400">
        Valores ilustrativos do piloto. Os números reais serão produzidos pela base de dados do Capacita RH.
      </p>
    </div>
  );
}

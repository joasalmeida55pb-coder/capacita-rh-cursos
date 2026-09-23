import { Award, Briefcase, Database, GraduationCap, Route, Users, type LucideIcon } from "lucide-react";
import { SERIES } from "@/components/charts/cores";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SETORES } from "@/data/base";
import { fmtNumero } from "@/lib/format";
import type { InsightsResumo } from "@/lib/supabase/database.types";
import { obterInsightsResumo } from "@/lib/supabase/insights";
import { BotaoAtualizar } from "./BotaoAtualizar";

const TITULO = "Base real do piloto";
const SUBTITULO = "Dados ao vivo do Supabase via RPC insights_resumo · somente agregados, sem identificação de pessoas.";

/** O banco guarda códigos (ex.: "turismo", "alta-temporada"); exibimos o nome amigável quando houver. */
const rotuloSetor = (codigo: string) => SETORES.find((s) => s.id === codigo)?.nome ?? codigo;
const PERIODOS: Record<string, string> = {
  "30": "Próximos 30 dias",
  "60": "Próximos 60 dias",
  "90": "Próximos 90 dias",
  "alta-temporada": "Alta temporada",
  "baixa-temporada": "Baixa temporada",
};
const rotuloPeriodo = (codigo: string) => PERIODOS[codigo] ?? codigo;

const fmtHora = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" });

function Indicador({ icone: Icone, rotulo, valor, detalhe }: { icone: LucideIcon; rotulo: string; valor: string; detalhe?: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="flex items-center gap-1.5 text-slate-500">
        <Icone className="size-3.5" aria-hidden />
        <span className="text-[11px] font-medium uppercase tracking-wide">{rotulo}</span>
      </div>
      <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">{valor}</p>
      {detalhe && <p className="text-[11px] text-slate-500">{detalhe}</p>}
    </div>
  );
}

function ListaBarras({ titulo, nota, itens, cor }: { titulo: string; nota?: string; itens: { rotulo: string; valor: number; extra?: string }[]; cor: string }) {
  const max = Math.max(1, ...itens.map((i) => i.valor));
  return (
    <div className="min-w-0">
      <h3 className="text-sm font-semibold text-slate-800">{titulo}</h3>
      {nota && <p className="text-xs text-slate-500">{nota}</p>}
      {itens.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400">Sem registros ainda</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {itens.slice(0, 8).map((i) => (
            <li key={i.rotulo}>
              <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                <span className="truncate text-slate-700">{i.rotulo}</span>
                <span className="shrink-0 tabular-nums text-slate-900">
                  {fmtNumero(i.valor)}
                  {i.extra && <span className="ml-1 text-xs text-slate-500">{i.extra}</span>}
                </span>
              </div>
              <div className="h-2 rounded-r-[4px]" style={{ width: `${(i.valor / max) * 100}%`, backgroundColor: cor }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Conteudo({ d }: { d: InsightsResumo }) {
  const vazio = d.total_cidadaos + d.total_matriculas + d.vagas_demandadas + d.trilhas_ativas === 0;
  const taxaConclusao = d.total_matriculas ? Math.round((d.total_concluidas / d.total_matriculas) * 100) : null;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Indicador icone={Users} rotulo="Cidadãos" valor={fmtNumero(d.total_cidadaos)} detalhe="perfis cadastrados" />
        <Indicador
          icone={Award}
          rotulo="Prontidão média"
          valor={d.prontidao_media === null ? "—" : `${d.prontidao_media}%`}
          detalhe={d.prontidao_media === null ? "exibida a partir de 5 perfis" : "estimada"}
        />
        <Indicador icone={Route} rotulo="Trilhas ativas" valor={fmtNumero(d.trilhas_ativas)} detalhe="no catálogo" />
        <Indicador icone={GraduationCap} rotulo="Matrículas" valor={fmtNumero(d.total_matriculas)} detalhe="em trilhas" />
        <Indicador
          icone={Award}
          rotulo="Concluídas"
          valor={fmtNumero(d.total_concluidas)}
          detalhe={taxaConclusao === null ? "certificados emitidos" : `${taxaConclusao}% das matrículas`}
        />
        <Indicador icone={Briefcase} rotulo="Vagas demandadas" valor={fmtNumero(d.vagas_demandadas)} detalhe="previstas pelas empresas" />
      </div>

      {vazio && (
        <p className="rounded-xl border border-dashed border-teal-200 bg-teal-50/60 px-4 py-3 text-sm text-teal-800">
          A base está conectada, mas ainda vazia. Os números aparecem aqui assim que trilhas, cidadãos, matrículas e
          demandas das empresas forem registrados.
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <ListaBarras
          titulo="Demanda por cargo"
          cor={SERIES.demanda}
          itens={d.demanda_por_cargo.map((c) => ({
            rotulo: c.cargo,
            valor: c.vagas,
            extra: `· ${c.empresas} ${c.empresas === 1 ? "empresa" : "empresas"}`,
          }))}
        />
        <ListaBarras
          titulo="Demanda por período"
          cor={SERIES.disponiveis}
          itens={d.demanda_por_periodo.map((p) => ({ rotulo: rotuloPeriodo(p.periodo), valor: p.vagas }))}
        />
        <ListaBarras
          titulo="Cidadãos por área de interesse"
          nota="Áreas com menos de 5 pessoas ficam ocultas."
          cor={SERIES.prontos}
          itens={d.cidadaos_por_area.map((a) => ({ rotulo: rotuloSetor(a.area), valor: a.total }))}
        />
      </div>

      {d.matriculas_por_trilha.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr className="border-b border-slate-200 text-right">
                <th className="py-2 text-left font-semibold">Trilha</th>
                <th className="py-2 pl-3 font-semibold">Matrículas</th>
                <th className="py-2 pl-3 font-semibold">Concluídas</th>
                <th className="py-2 pl-3 font-semibold">Progresso médio</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {d.matriculas_por_trilha.map((t) => (
                <tr key={t.trilha_id} className="border-b border-slate-100 text-right last:border-0">
                  <td className="py-2 text-left text-slate-800">
                    {t.titulo} <span className="text-xs text-slate-400">· {rotuloSetor(t.setor)}</span>
                  </td>
                  <td className="py-2 text-slate-700">{fmtNumero(t.matriculas)}</td>
                  <td className="py-2 text-slate-700">{fmtNumero(t.concluidas)}</td>
                  <td className="py-2 text-slate-700">{t.progresso_medio === null ? "—" : `${t.progresso_medio}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** Server Component: chama a RPC a cada requisição. */
export async function BaseRealPiloto() {
  const r = await obterInsightsResumo();

  if (r.status === "nao-configurado") {
    return (
      <Card titulo={TITULO} subtitulo={SUBTITULO} acao={<Badge tom="alerta">Não conectado</Badge>}>
        <p className="text-sm text-slate-600">
          Defina <code className="rounded bg-slate-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
          <code className="rounded bg-slate-100 px-1">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> no arquivo{" "}
          <code className="rounded bg-slate-100 px-1">.env.local</code> (veja <code>.env.example</code>) e reinicie o servidor.
        </p>
      </Card>
    );
  }

  if (r.status === "erro") {
    return (
      <Card titulo={TITULO} subtitulo={SUBTITULO} acao={<BotaoAtualizar />}>
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Não foi possível consultar a base agora: {r.mensagem}
        </p>
      </Card>
    );
  }

  return (
    <Card
      titulo={TITULO}
      subtitulo={SUBTITULO}
      acao={
        <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-2">
          <Badge tom="sucesso">
            <Database className="size-3" aria-hidden /> Ao vivo · {fmtHora(r.dados.atualizado_em)}
          </Badge>
          <BotaoAtualizar />
        </div>
      }
    >
      <Conteudo d={r.dados} />
    </Card>
  );
}

export function BaseRealCarregando() {
  return (
    <Card titulo={TITULO} subtitulo={SUBTITULO}>
      <div className="grid animate-pulse grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6" aria-label="Carregando dados da base">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-[74px] rounded-xl bg-slate-100" />
        ))}
      </div>
    </Card>
  );
}

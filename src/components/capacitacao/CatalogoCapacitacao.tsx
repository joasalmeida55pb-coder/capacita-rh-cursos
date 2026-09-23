"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  CalendarDays,
  CheckCircle2,
  Clock,
  FilterX,
  Landmark,
  Library,
  MapPin,
  MonitorPlay,
  Route,
  Search,
  SlidersHorizontal,
  Sun,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { nomeCompetencia } from "@/data/base";
import {
  AREAS_CURSO,
  CURSOS,
  FAIXAS_CARGA,
  LOCAIS_CURSO,
  TURNOS,
  faixaCarga,
  formatoLocal,
  nomeArea,
  nomeLocal,
  nomeTurno,
} from "@/data/cursos";
import { getTrilha } from "@/data/trilhas";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cx, fmtData, fmtNumero } from "@/lib/format";
import { useCapacita } from "@/lib/store";
import type { AreaCurso, Curso, FaixaCarga, LocalCurso, Turno } from "@/lib/types";

interface Filtros {
  area: AreaCurso[];
  local: LocalCurso[];
  carga: FaixaCarga[];
  turno: Turno[];
}

type Grupo = keyof Filtros;
type Ordem = "inicio" | "carga-asc" | "carga-desc" | "vagas";

const FILTROS_VAZIOS: Filtros = { area: [], local: [], carga: [], turno: [] };
const GRUPOS: Grupo[] = ["area", "local", "carga", "turno"];

const ORDENS: { id: Ordem; rotulo: string }[] = [
  { id: "inicio", rotulo: "Próximas turmas" },
  { id: "carga-asc", rotulo: "Menor carga horária" },
  { id: "carga-desc", rotulo: "Maior carga horária" },
  { id: "vagas", rotulo: "Mais vagas" },
];

/** Um curso atende a um grupo quando o grupo está vazio ou contém algum valor do curso */
function atende(curso: Curso, grupo: Grupo, valores: string[]): boolean {
  if (valores.length === 0) return true;
  switch (grupo) {
    case "area":
      return valores.includes(curso.area);
    case "local":
      return valores.includes(curso.local);
    case "carga":
      return valores.includes(faixaCarga(curso.cargaHoraria));
    case "turno":
      return curso.turnos.some((t) => valores.includes(t));
  }
}

function buscaCasa(curso: Curso, termo: string): boolean {
  if (!termo) return true;
  const alvo = [curso.titulo, curso.descricao, curso.instituicao, ...curso.competencias.map(nomeCompetencia)]
    .join(" ")
    .toLowerCase();
  return alvo.includes(termo);
}

export function CatalogoCapacitacao() {
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIOS);
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState<Ordem>("inicio");
  const termo = busca.trim().toLowerCase();

  const totalAtivos = GRUPOS.reduce((acc, g) => acc + filtros[g].length, 0);

  /** Cursos que passam em todos os filtros, exceto (opcionalmente) um grupo — base das contagens por opção */
  const filtrarExceto = useMemo(
    () => (exceto?: Grupo) =>
      CURSOS.filter(
        (c) => buscaCasa(c, termo) && GRUPOS.every((g) => g === exceto || atende(c, g, filtros[g])),
      ),
    [filtros, termo],
  );

  const resultados = useMemo(() => {
    const lista = filtrarExceto();
    return lista.sort((a, b) => {
      if (ordem === "carga-asc") return a.cargaHoraria - b.cargaHoraria;
      if (ordem === "carga-desc") return b.cargaHoraria - a.cargaHoraria;
      if (ordem === "vagas") return b.vagas - a.vagas;
      return a.inicio.localeCompare(b.inicio);
    });
  }, [filtrarExceto, ordem]);

  function alternar(grupo: Grupo, valor: string) {
    setFiltros((f) => {
      const atuais = f[grupo] as string[];
      const proximos = atuais.includes(valor) ? atuais.filter((v) => v !== valor) : [...atuais, valor];
      return { ...f, [grupo]: proximos };
    });
  }

  function limpar() {
    setFiltros(FILTROS_VAZIOS);
    setBusca("");
  }

  const contagem = (grupo: Grupo, valor: string) => filtrarExceto(grupo).filter((c) => atende(c, grupo, [valor])).length;

  const instituicoes = new Set(CURSOS.map((c) => c.instituicao)).size;
  const vagas = CURSOS.reduce((acc, c) => acc + c.vagas, 0);

  const gruposUI: { id: Grupo; titulo: string; icone: typeof MapPin; opcoes: { id: string; rotulo: string; detalhe?: string }[] }[] = [
    { id: "area", titulo: "Área / Setor", icone: Library, opcoes: AREAS_CURSO.map((a) => ({ id: a.id, rotulo: a.nome })) },
    { id: "local", titulo: "Local / Modalidade", icone: MapPin, opcoes: LOCAIS_CURSO.map((l) => ({ id: l.id, rotulo: l.nome })) },
    { id: "carga", titulo: "Carga horária", icone: Clock, opcoes: FAIXAS_CARGA.map((f) => ({ id: f.id, rotulo: f.nome, detalhe: f.descricao })) },
    { id: "turno", titulo: "Período / Turno", icone: Sun, opcoes: TURNOS.map((t) => ({ id: t.id, rotulo: t.nome, detalhe: t.horario })) },
  ];

  return (
    <div>
      <PageHeader
        icone={Library}
        modulo="Capacitação"
        titulo="Catálogo formativo"
        descricao="Cursos e turmas ofertados pelas instituições parceiras do município, conectados às competências que o mercado de Balneário Camboriú mais demanda."
        acao={
          <div className="flex gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
            <Resumo valor={CURSOS.length} rotulo="cursos" />
            <Resumo valor={instituicoes} rotulo="instituições" />
            <Resumo valor={vagas} rotulo="vagas abertas" />
          </div>
        }
      />

      {/* Filtros */}
      <section aria-label="Filtros do catálogo" className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative block flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <span className="sr-only">Buscar curso, instituição ou competência</span>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar curso, instituição ou competência"
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-teal-500 focus:outline-none"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <ArrowUpDown className="size-4 text-slate-400" aria-hidden />
            <span className="sr-only">Ordenar por</span>
            <select
              value={ordem}
              onChange={(e) => setOrdem(e.target.value as Ordem)}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm focus:border-teal-500 focus:outline-none"
            >
              {ORDENS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {gruposUI.map(({ id, titulo, icone: Icone, opcoes }) => (
            <fieldset key={id}>
              <legend className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Icone className="size-3.5" aria-hidden /> {titulo}
              </legend>
              <div className="flex flex-wrap gap-2">
                {opcoes.map((o) => {
                  const ativo = (filtros[id] as string[]).includes(o.id);
                  const n = contagem(id, o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={ativo}
                      onClick={() => alternar(id, o.id)}
                      disabled={!ativo && n === 0}
                      className={cx(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40",
                        ativo
                          ? "bg-teal-600 text-white shadow-sm"
                          : "bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100",
                      )}
                    >
                      {ativo && <CheckCircle2 className="size-3.5" aria-hidden />}
                      {o.rotulo}
                      {o.detalhe && <span className={ativo ? "text-teal-100" : "text-slate-400"}>· {o.detalhe}</span>}
                      <span
                        className={cx(
                          "rounded-full px-1.5 text-[10px] tabular-nums",
                          ativo ? "bg-teal-700 text-white" : "bg-white text-slate-500 ring-1 ring-inset ring-slate-200",
                        )}
                      >
                        {n}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-sm">
          <p className="flex items-center gap-1.5 text-slate-600" aria-live="polite">
            <SlidersHorizontal className="size-4 text-slate-400" aria-hidden />
            <strong className="tabular-nums text-slate-900">{resultados.length}</strong>
            {resultados.length === 1 ? "curso encontrado" : "cursos encontrados"}
            {totalAtivos > 0 && <span className="text-slate-400">· {totalAtivos} filtro{totalAtivos > 1 ? "s" : ""} ativo{totalAtivos > 1 ? "s" : ""}</span>}
          </p>
          {(totalAtivos > 0 || termo) && (
            <button type="button" onClick={limpar} className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 hover:underline">
              <FilterX className="size-3.5" aria-hidden /> Limpar filtros
            </button>
          )}
        </div>
      </section>

      {resultados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-medium text-slate-800">Nenhum curso com essa combinação de filtros.</p>
          <p className="mt-1 text-sm text-slate-500">Remova algum filtro para ver mais opções.</p>
          <button type="button" onClick={limpar} className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {resultados.map((c) => (
            <CartaoCurso key={c.id} curso={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function Resumo({ valor, rotulo }: { valor: number; rotulo: string }) {
  return (
    <div>
      <p className="text-lg font-bold tabular-nums text-slate-900">{fmtNumero(valor)}</p>
      <p className="text-xs text-slate-500">{rotulo}</p>
    </div>
  );
}

function CartaoCurso({ curso }: { curso: Curso }) {
  const { sessao, abrirAcesso } = useAuth();
  const { state, alternarInscricaoCurso } = useCapacita();
  const inscrito = state.inscricoesCursos.includes(curso.id);
  const trilha = curso.trilhaId ? getTrilha(curso.trilhaId) : undefined;
  const faixa = FAIXAS_CARGA.find((f) => f.id === faixaCarga(curso.cargaHoraria));

  function inscrever() {
    if (!sessao) {
      abrirAcesso({ perfil: "cidadao", modo: "entrar", motivo: `Entre como cidadão para se inscrever em “${curso.titulo}”.` });
      return;
    }
    if (sessao.tipo !== "cidadao") {
      abrirAcesso({ perfil: "cidadao", modo: "entrar", motivo: "A inscrição em cursos é feita com uma conta de cidadão." });
      return;
    }
    alternarInscricaoCurso(curso.id);
  }

  const detalhes: { icone: typeof Clock; rotulo: string; valor: string }[] = [
    { icone: Clock, rotulo: "Carga horária", valor: `${curso.cargaHoraria}h${faixa ? ` · ${faixa.nome.toLowerCase()}` : ""}` },
    { icone: Landmark, rotulo: "Instituição", valor: curso.instituicao },
    { icone: curso.local === "online" ? MonitorPlay : MapPin, rotulo: "Formato", valor: `${formatoLocal(curso.local)} · ${curso.detalheLocal}` },
    { icone: Sun, rotulo: "Turnos", valor: curso.turnos.map(nomeTurno).join(", ") },
    { icone: CalendarDays, rotulo: "Início", valor: fmtData(curso.inicio) },
    { icone: Users, rotulo: "Vagas", valor: `${curso.vagas} vagas` },
  ];

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tom="marca">{nomeArea(curso.area)}</Badge>
        <Badge tom={curso.local === "online" ? "info" : curso.local === "hibrido" ? "alerta" : "neutro"}>{nomeLocal(curso.local)}</Badge>
        {curso.gratuito ? <Badge tom="sucesso">Gratuito</Badge> : <Badge>Bolsa parcial</Badge>}
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug text-slate-900">{curso.titulo}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{curso.descricao}</p>

      <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-2">
        {detalhes.map(({ icone: Icone, rotulo, valor }) => (
          <div key={rotulo} className="flex items-start gap-2">
            <Icone className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />
            <div className="min-w-0">
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{rotulo}</dt>
              <dd className="text-slate-800">{valor}</dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {curso.competencias.map((c) => (
          <Badge key={c}>{nomeCompetencia(c)}</Badge>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        {trilha ? (
          <Link href={`/trilhas/${trilha.id}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 hover:underline">
            <Route className="size-3.5" aria-hidden /> Trilha relacionada: {trilha.titulo}
          </Link>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={inscrever}
          className={cx(
            "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition",
            inscrito ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-teal-600 text-white hover:bg-teal-700",
          )}
        >
          {inscrito ? (
            <>
              <CheckCircle2 className="size-4" aria-hidden /> Inscrito(a)
            </>
          ) : (
            "Inscrever-se"
          )}
        </button>
      </div>
    </article>
  );
}

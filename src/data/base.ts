import type { Competencia, Ocupacao, Setor, SetorId } from "@/lib/types";

export const SETORES: Setor[] = [
  { id: "turismo", nome: "Turismo & Hospitalidade", cor: "bg-sky-50 text-sky-700 ring-sky-200" },
  { id: "comercio", nome: "Comércio & Vendas", cor: "bg-violet-50 text-violet-700 ring-violet-200" },
  { id: "gastronomia", nome: "Gastronomia & Salão", cor: "bg-amber-50 text-amber-800 ring-amber-200" },
  { id: "ingles", nome: "Inglês para Atendimento", cor: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  { id: "transversal", nome: "Competências Transversais", cor: "bg-slate-100 text-slate-700 ring-slate-200" },
];

export const COMPETENCIAS: Competencia[] = [
  { id: "atendimento", nome: "Atendimento ao cliente", categoria: "comportamental" },
  { id: "comunicacao", nome: "Comunicação", categoria: "comportamental" },
  { id: "trabalho-equipe", nome: "Trabalho em equipe", categoria: "comportamental" },
  { id: "informatica", nome: "Informática básica", categoria: "tecnica" },
  { id: "hospitalidade", nome: "Hospitalidade", categoria: "tecnica" },
  { id: "reservas", nome: "Sistemas de reservas (PMS)", categoria: "tecnica" },
  { id: "governanca", nome: "Governança e arrumação", categoria: "tecnica" },
  { id: "ingles-basico", nome: "Inglês básico", categoria: "idioma" },
  { id: "primeiros-socorros", nome: "Primeiros socorros", categoria: "seguranca" },
  { id: "vendas-consultivas", nome: "Vendas consultivas", categoria: "tecnica" },
  { id: "negociacao", nome: "Negociação", categoria: "comportamental" },
  { id: "caixa-pdv", nome: "Operação de caixa / PDV", categoria: "tecnica" },
  { id: "servico-mesa", nome: "Serviço de mesa", categoria: "tecnica" },
  { id: "bebidas", nome: "Bebidas e bar", categoria: "tecnica" },
  { id: "higiene-alimentos", nome: "Boas práticas com alimentos", categoria: "seguranca" },
];

export const OCUPACOES: Ocupacao[] = [
  {
    id: "recepcionista",
    nome: "Recepcionista de Hotel",
    setor: "turismo",
    requisitos: [
      { competenciaId: "atendimento", peso: 25 },
      { competenciaId: "informatica", peso: 20 },
      { competenciaId: "hospitalidade", peso: 27 },
      { competenciaId: "ingles-basico", peso: 18 },
      { competenciaId: "primeiros-socorros", peso: 10 },
    ],
  },
  {
    id: "garcom",
    nome: "Garçom / Garçonete",
    setor: "gastronomia",
    requisitos: [
      { competenciaId: "servico-mesa", peso: 30 },
      { competenciaId: "atendimento", peso: 20 },
      { competenciaId: "bebidas", peso: 15 },
      { competenciaId: "higiene-alimentos", peso: 15 },
      { competenciaId: "ingles-basico", peso: 10 },
      { competenciaId: "trabalho-equipe", peso: 10 },
    ],
  },
  {
    id: "vendedor",
    nome: "Vendedor(a) de Loja",
    setor: "comercio",
    requisitos: [
      { competenciaId: "vendas-consultivas", peso: 35 },
      { competenciaId: "atendimento", peso: 25 },
      { competenciaId: "negociacao", peso: 20 },
      { competenciaId: "comunicacao", peso: 10 },
      { competenciaId: "ingles-basico", peso: 10 },
    ],
  },
  {
    id: "operador-caixa",
    nome: "Operador(a) de Caixa",
    setor: "comercio",
    requisitos: [
      { competenciaId: "caixa-pdv", peso: 40 },
      { competenciaId: "atendimento", peso: 25 },
      { competenciaId: "informatica", peso: 20 },
      { competenciaId: "comunicacao", peso: 15 },
    ],
  },
  {
    id: "camareira",
    nome: "Camareira(o)",
    setor: "turismo",
    requisitos: [
      { competenciaId: "governanca", peso: 45 },
      { competenciaId: "hospitalidade", peso: 20 },
      { competenciaId: "trabalho-equipe", peso: 20 },
      { competenciaId: "primeiros-socorros", peso: 15 },
    ],
  },
  {
    id: "auxiliar-cozinha",
    nome: "Auxiliar de Cozinha",
    setor: "gastronomia",
    requisitos: [
      { competenciaId: "higiene-alimentos", peso: 45 },
      { competenciaId: "trabalho-equipe", peso: 25 },
      { competenciaId: "primeiros-socorros", peso: 15 },
      { competenciaId: "comunicacao", peso: 15 },
    ],
  },
];

const setorMap = new Map(SETORES.map((s) => [s.id, s]));
const competenciaMap = new Map(COMPETENCIAS.map((c) => [c.id, c]));
const ocupacaoMap = new Map(OCUPACOES.map((o) => [o.id, o]));

export function getSetor(id: SetorId): Setor {
  const setor = setorMap.get(id);
  if (!setor) throw new Error(`Setor desconhecido: ${id}`);
  return setor;
}

export function getCompetencia(id: string): Competencia | undefined {
  return competenciaMap.get(id);
}

export function nomeCompetencia(id: string): string {
  return competenciaMap.get(id)?.nome ?? id;
}

export function getOcupacao(id: string): Ocupacao | undefined {
  return ocupacaoMap.get(id);
}

export function nomeOcupacao(id: string): string {
  return ocupacaoMap.get(id)?.nome ?? id;
}

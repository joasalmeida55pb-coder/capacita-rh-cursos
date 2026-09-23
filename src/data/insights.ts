import type { EtapaFunil, IndicadorOcupacao, SerieSazonal } from "@/lib/types";

/**
 * Base agregada do piloto (valores ilustrativos).
 * Gap = demanda prevista − profissionais prontos.
 * As previsões registradas em "Capacita Empresas" são somadas à demanda base.
 */
export const INDICADORES_OCUPACAO: IndicadorOcupacao[] = [
  { ocupacaoId: "recepcionista", demandaBase: 210, disponiveis: 90, prontos: 32 },
  { ocupacaoId: "garcom", demandaBase: 280, disponiveis: 340, prontos: 198 },
  { ocupacaoId: "vendedor", demandaBase: 180, disponiveis: 520, prontos: 287 },
  { ocupacaoId: "operador-caixa", demandaBase: 150, disponiveis: 260, prontos: 140 },
  { ocupacaoId: "camareira", demandaBase: 240, disponiveis: 110, prontos: 41 },
  { ocupacaoId: "auxiliar-cozinha", demandaBase: 130, disponiveis: 150, prontos: 64 },
];

/** Profissionais cadastrados que já possuem cada competência verificada */
export const PROFISSIONAIS_POR_COMPETENCIA: Record<string, number> = {
  atendimento: 1480,
  comunicacao: 1210,
  "trabalho-equipe": 1350,
  informatica: 890,
  hospitalidade: 310,
  reservas: 95,
  governanca: 120,
  "ingles-basico": 260,
  "primeiros-socorros": 180,
  "vendas-consultivas": 540,
  negociacao: 410,
  "caixa-pdv": 380,
  "servico-mesa": 330,
  bebidas: 210,
  "higiene-alimentos": 290,
};

export const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/** Índice de demanda por mês (100 = média anual) */
export const SAZONALIDADE: SerieSazonal[] = [
  { setor: "turismo", indices: [165, 155, 120, 85, 70, 62, 78, 68, 74, 88, 110, 170] },
  { setor: "gastronomia", indices: [160, 150, 118, 88, 72, 66, 80, 72, 78, 90, 112, 162] },
  { setor: "comercio", indices: [135, 120, 98, 90, 95, 85, 92, 88, 86, 95, 118, 175] },
];

export const KPIS_MUNICIPIO = {
  profissionaisMapeados: 4820,
  empresasParticipantes: 137,
  emCapacitacao: 612,
  certificacoes: 1284,
  contratacoesPosCapacitacao: 389,
  tempoMedioRecolocacaoDias: 38,
};

export const FUNIL_IMPACTO: EtapaFunil[] = [
  { etapa: "Cadastro", valor: 4820 },
  { etapa: "Capacitação", valor: 1896 },
  { etapa: "Encaminhamento", valor: 902 },
  { etapa: "Entrevista", valor: 611 },
  { etapa: "Contratação", valor: 389 },
  { etapa: "Permanência 90 dias", valor: 318 },
];

/** Desempenho agregado das trilhas no piloto */
export const DESEMPENHO_TRILHAS: Record<string, { inscritos: number; concluintes: number; contratados: number }> = {
  "recepcao-hoteleira": { inscritos: 320, concluintes: 214, contratados: 96 },
  "ingles-atendimento": { inscritos: 540, concluintes: 298, contratados: 71 },
  "vendas-varejo": { inscritos: 260, concluintes: 201, contratados: 64 },
  "caixa-pdv": { inscritos: 190, concluintes: 172, contratados: 58 },
  "garcom-salao": { inscritos: 280, concluintes: 196, contratados: 67 },
  "boas-praticas-alimentos": { inscritos: 210, concluintes: 188, contratados: 19 },
  "governanca-hoteleira": { inscritos: 140, concluintes: 92, contratados: 11 },
  "primeiros-socorros": { inscritos: 180, concluintes: 165, contratados: 3 },
};

import type { Colaborador, Empresa, HorizontePrevisao, Previsao } from "@/lib/types";

/** Competências da matriz do time (união das competências esperadas por equipe) */
export function competenciasDaMatriz(empresa: Empresa): string[] {
  return Array.from(new Set(empresa.equipes.flatMap((e) => e.competencias)));
}

/** Empresa fictícia usada na demonstração do módulo Capacita Empresas */
export const EMPRESA_DEMO: Empresa = {
  id: "emp-001",
  nome: "Hotel Maré Alta",
  setor: "turismo",
  porte: "Médio porte · 86 UHs",
  bairro: "Centro",
  equipes: [
    { nome: "Recepção", competencias: ["atendimento", "hospitalidade", "reservas", "ingles-basico", "primeiros-socorros"] },
    { nome: "Governança", competencias: ["hospitalidade", "governanca", "trabalho-equipe", "primeiros-socorros"] },
    { nome: "Restaurante", competencias: ["atendimento", "servico-mesa", "higiene-alimentos", "ingles-basico", "trabalho-equipe"] },
    { nome: "Cozinha", competencias: ["higiene-alimentos", "trabalho-equipe", "primeiros-socorros"] },
  ],
};

export const COLABORADORES_DEMO: Colaborador[] = [
  {
    id: "col-01",
    nome: "Renata Lima",
    funcao: "Recepcionista",
    equipe: "Recepção",
    admissao: "2023-03-01",
    competencias: ["atendimento", "hospitalidade", "reservas", "informatica"],
    trilhas: [{ trilhaId: "ingles-atendimento", tipo: "obrigatoria", progresso: 55 }],
  },
  {
    id: "col-02",
    nome: "Thiago Costa",
    funcao: "Recepcionista noturno",
    equipe: "Recepção",
    admissao: "2024-11-15",
    competencias: ["atendimento", "reservas", "ingles-basico"],
    trilhas: [{ trilhaId: "recepcao-hoteleira", tipo: "obrigatoria", progresso: 80 }],
  },
  {
    id: "col-03",
    nome: "Sueli Martins",
    funcao: "Camareira líder",
    equipe: "Governança",
    admissao: "2019-06-10",
    competencias: ["governanca", "hospitalidade", "primeiros-socorros", "trabalho-equipe"],
    trilhas: [],
  },
  {
    id: "col-04",
    nome: "Jéssica Alves",
    funcao: "Camareira",
    equipe: "Governança",
    admissao: "2025-01-05",
    competencias: ["governanca", "trabalho-equipe"],
    trilhas: [{ trilhaId: "primeiros-socorros", tipo: "recomendada", progresso: 20 }],
  },
  {
    id: "col-05",
    nome: "Marcos Pereira",
    funcao: "Garçom",
    equipe: "Restaurante",
    admissao: "2022-12-01",
    competencias: ["servico-mesa", "atendimento", "higiene-alimentos"],
    trilhas: [{ trilhaId: "ingles-atendimento", tipo: "recomendada", progresso: 10 }],
  },
  {
    id: "col-06",
    nome: "Aline Rocha",
    funcao: "Garçonete",
    equipe: "Restaurante",
    admissao: "2025-02-20",
    competencias: ["atendimento"],
    trilhas: [{ trilhaId: "garcom-salao", tipo: "obrigatoria", progresso: 35 }],
  },
  {
    id: "col-07",
    nome: "Pedro Nunes",
    funcao: "Auxiliar de cozinha",
    equipe: "Cozinha",
    admissao: "2024-05-12",
    competencias: ["trabalho-equipe"],
    trilhas: [{ trilhaId: "boas-praticas-alimentos", tipo: "obrigatoria", progresso: 0 }],
  },
  {
    id: "col-08",
    nome: "Cláudia Reis",
    funcao: "Cozinheira",
    equipe: "Cozinha",
    admissao: "2020-08-03",
    competencias: ["higiene-alimentos", "trabalho-equipe", "primeiros-socorros"],
    trilhas: [],
  },
];

export const HORIZONTES: { id: HorizontePrevisao; rotulo: string; descricao: string }[] = [
  { id: "30", rotulo: "30 dias", descricao: "Contratação de curto prazo" },
  { id: "60", rotulo: "60 dias", descricao: "Planejamento do próximo bimestre" },
  { id: "90", rotulo: "90 dias", descricao: "Planejamento trimestral" },
  { id: "alta-temporada", rotulo: "Alta temporada", descricao: "Dez – Mar (verão, réveillon, carnaval)" },
  { id: "baixa-temporada", rotulo: "Baixa temporada", descricao: "Abr – Nov (eventos e reposição)" },
];

export function rotuloHorizonte(id: HorizontePrevisao): string {
  return HORIZONTES.find((h) => h.id === id)?.rotulo ?? id;
}

export const PREVISOES_DEMO: Previsao[] = [
  {
    id: "prev-01",
    empresaId: "emp-001",
    ocupacaoId: "recepcionista",
    quantidade: 4,
    horizonte: "alta-temporada",
    observacao: "Reforço para réveillon e janeiro; inglês desejável.",
    criadaEm: "2026-09-01",
  },
  {
    id: "prev-02",
    empresaId: "emp-001",
    ocupacaoId: "camareira",
    quantidade: 6,
    horizonte: "alta-temporada",
    observacao: "Ocupação prevista acima de 90%.",
    criadaEm: "2026-09-01",
  },
  {
    id: "prev-03",
    empresaId: "emp-001",
    ocupacaoId: "garcom",
    quantidade: 3,
    horizonte: "60",
    observacao: "Abertura do restaurante para o público externo.",
    criadaEm: "2026-09-12",
  },
];

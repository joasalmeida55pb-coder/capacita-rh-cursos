import type { PerfilCidadao, Talento } from "@/lib/types";

/** Cidadã de demonstração do Passaporte Profissional */
export const CIDADAO_DEMO: PerfilCidadao = {
  id: "cid-001",
  nome: "Mariana Souza",
  bairro: "Nações",
  idadeFaixa: "25–34 anos",
  disponibilidade: ["integral", "temporada"],
  areasInteresse: ["turismo", "comercio"],
  experiencias: [
    { cargo: "Atendente de loja", empresa: "Comércio de moda — Av. Brasil", periodo: "2022 – 2024" },
    { cargo: "Promotora de eventos (temporada)", empresa: "Agência de eventos local", periodo: "Dez/2024 – Mar/2025" },
  ],
  competenciasVerificadas: ["atendimento", "informatica", "comunicacao", "trabalho-equipe"],
  certificadosExternos: [
    {
      id: "ext-001",
      titulo: "Informática Básica e Pacote Office",
      instituicao: "Instituição de ensino parceira",
      emitidoEm: "2025-04-18",
      horas: 40,
      competencias: ["informatica"],
    },
    {
      id: "ext-002",
      titulo: "Atendimento de Excelência",
      instituicao: "Diagnóstico Capacita (verificação prática)",
      emitidoEm: "2025-08-02",
      horas: 4,
      competencias: ["atendimento", "comunicacao"],
    },
  ],
};

/**
 * Aulas já concluídas pela cidadã de demonstração.
 * A trilha de Recepção está 100% concluída; Inglês está em andamento.
 */
export const AULAS_CONCLUIDAS_DEMO: string[] = [
  "recepcao-hoteleira-m1-a1",
  "recepcao-hoteleira-m1-a2",
  "recepcao-hoteleira-m1-a3",
  "recepcao-hoteleira-m2-a1",
  "recepcao-hoteleira-m2-a2",
  "recepcao-hoteleira-m2-a3",
  "recepcao-hoteleira-m3-a1",
  "ingles-atendimento-m1-a1",
  "ingles-atendimento-m1-a2",
  "ingles-atendimento-m1-a3",
  "ingles-atendimento-m2-a1",
];

export const TRILHAS_CONCLUIDAS_DEMO: Record<string, string> = {
  "recepcao-hoteleira": "2025-09-10",
};

/** Banco de talentos (dados pseudonimizados — LGPD) */
export const TALENTOS: Talento[] = [
  { id: "tal-01", nome: "Ana P.", bairro: "Centro", ocupacaoAlvoId: "recepcionista", competencias: ["atendimento", "informatica", "hospitalidade", "ingles-basico", "primeiros-socorros"], disponibilidade: ["integral"], experienciaAnos: 3 },
  { id: "tal-02", nome: "Bruno L.", bairro: "Barra", ocupacaoAlvoId: "recepcionista", competencias: ["atendimento", "informatica", "hospitalidade", "ingles-basico"], disponibilidade: ["noite", "temporada"], experienciaAnos: 2 },
  { id: "tal-03", nome: "Carla M.", bairro: "Nações", ocupacaoAlvoId: "recepcionista", competencias: ["atendimento", "informatica", "comunicacao"], disponibilidade: ["integral"], experienciaAnos: 1 },
  { id: "tal-04", nome: "Diego R.", bairro: "Pioneiros", ocupacaoAlvoId: "garcom", competencias: ["servico-mesa", "atendimento", "bebidas", "higiene-alimentos", "trabalho-equipe"], disponibilidade: ["noite", "fins-de-semana"], experienciaAnos: 4 },
  { id: "tal-05", nome: "Elisa T.", bairro: "Centro", ocupacaoAlvoId: "garcom", competencias: ["servico-mesa", "atendimento", "trabalho-equipe", "ingles-basico"], disponibilidade: ["temporada"], experienciaAnos: 1 },
  { id: "tal-06", nome: "Fábio S.", bairro: "Municípios", ocupacaoAlvoId: "garcom", competencias: ["atendimento", "trabalho-equipe"], disponibilidade: ["integral"], experienciaAnos: 0 },
  { id: "tal-07", nome: "Gabriela N.", bairro: "Ariribá", ocupacaoAlvoId: "vendedor", competencias: ["vendas-consultivas", "atendimento", "negociacao", "comunicacao", "ingles-basico"], disponibilidade: ["integral"], experienciaAnos: 5 },
  { id: "tal-08", nome: "Henrique A.", bairro: "Vila Real", ocupacaoAlvoId: "vendedor", competencias: ["atendimento", "comunicacao", "vendas-consultivas"], disponibilidade: ["tarde", "fins-de-semana"], experienciaAnos: 2 },
  { id: "tal-09", nome: "Isabela C.", bairro: "Nova Esperança", ocupacaoAlvoId: "operador-caixa", competencias: ["caixa-pdv", "atendimento", "informatica", "comunicacao"], disponibilidade: ["manha", "tarde"], experienciaAnos: 2 },
  { id: "tal-10", nome: "João V.", bairro: "Estados", ocupacaoAlvoId: "operador-caixa", competencias: ["atendimento", "informatica"], disponibilidade: ["integral"], experienciaAnos: 0 },
  { id: "tal-11", nome: "Karina F.", bairro: "Barra", ocupacaoAlvoId: "camareira", competencias: ["governanca", "hospitalidade", "trabalho-equipe"], disponibilidade: ["integral", "temporada"], experienciaAnos: 6 },
  { id: "tal-12", nome: "Lucas B.", bairro: "São Judas", ocupacaoAlvoId: "camareira", competencias: ["trabalho-equipe", "primeiros-socorros"], disponibilidade: ["manha"], experienciaAnos: 0 },
  { id: "tal-13", nome: "Marta G.", bairro: "Centro", ocupacaoAlvoId: "auxiliar-cozinha", competencias: ["higiene-alimentos", "trabalho-equipe", "comunicacao", "primeiros-socorros"], disponibilidade: ["integral"], experienciaAnos: 3 },
  { id: "tal-14", nome: "Nícolas D.", bairro: "Pioneiros", ocupacaoAlvoId: "auxiliar-cozinha", competencias: ["trabalho-equipe", "comunicacao"], disponibilidade: ["noite", "temporada"], experienciaAnos: 1 },
  { id: "tal-15", nome: "Olívia H.", bairro: "Nações", ocupacaoAlvoId: "recepcionista", competencias: ["atendimento", "hospitalidade", "ingles-basico", "comunicacao", "reservas"], disponibilidade: ["integral"], experienciaAnos: 2 },
  { id: "tal-16", nome: "Paulo E.", bairro: "Vila Real", ocupacaoAlvoId: "garcom", competencias: ["servico-mesa", "bebidas", "atendimento", "ingles-basico", "trabalho-equipe"], disponibilidade: ["noite"], experienciaAnos: 7 },
];

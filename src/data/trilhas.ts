import type { Aula, ModuloTrilha, TipoAula, Trilha } from "@/lib/types";

type AulaSeed = [titulo: string, tipo: TipoAula, duracaoMin: number];
type ModuloSeed = { titulo: string; aulas: AulaSeed[] };

/** Gera IDs estáveis para módulos e aulas: `<trilha>-m1-a2` */
function modulos(trilhaId: string, seeds: ModuloSeed[]): ModuloTrilha[] {
  return seeds.map((m, mi) => ({
    id: `${trilhaId}-m${mi + 1}`,
    titulo: m.titulo,
    aulas: m.aulas.map(
      ([titulo, tipo, duracaoMin], ai): Aula => ({
        id: `${trilhaId}-m${mi + 1}-a${ai + 1}`,
        titulo,
        tipo,
        duracaoMin,
      }),
    ),
  }));
}

export const TRILHAS: Trilha[] = [
  {
    id: "recepcao-hoteleira",
    titulo: "Recepção e Hospitalidade Hoteleira",
    setor: "turismo",
    resumo: "Check-in, check-out, postura de hospitalidade e rotina de front office.",
    cargaHoraria: 24,
    parceiro: "Rede hoteleira de BC + instituição de ensino parceira",
    competencias: ["hospitalidade", "atendimento", "reservas"],
    porQue: "Recepção é a ocupação com maior gap previsto para a alta temporada.",
    quemPrecisa: "Pessoas em transição para hotelaria e recepcionistas sem formação formal.",
    resultadoEsperado: "Profissional apto a operar o balcão de um hotel de médio porte.",
    modulos: modulos("recepcao-hoteleira", [
      {
        titulo: "Fundamentos da hospitalidade",
        aulas: [
          ["O que é hospitalidade na prática", "video", 15],
          ["Jornada do hóspede em Balneário Camboriú", "leitura", 10],
          ["Postura, imagem e linguagem", "video", 20],
        ],
      },
      {
        titulo: "Rotina de front office",
        aulas: [
          ["Check-in e check-out passo a passo", "video", 25],
          ["Simulação de balcão", "pratica", 40],
          ["Lidando com reclamações", "video", 20],
        ],
      },
      {
        titulo: "Avaliação final",
        aulas: [["Estudo de caso: noite de réveillon lotada", "quiz", 20]],
      },
    ]),
  },
  {
    id: "ingles-atendimento",
    titulo: "Inglês para Atendimento Turístico",
    setor: "ingles",
    resumo: "Frases essenciais para receber, orientar e resolver pedidos de turistas.",
    cargaHoraria: 30,
    parceiro: "Escola de idiomas parceira",
    competencias: ["ingles-basico"],
    porQue: "Inglês básico é exigido em recepção, salão e lojas com fluxo turístico.",
    quemPrecisa: "Profissionais de linha de frente em hotéis, restaurantes e comércio.",
    resultadoEsperado: "Atender um turista estrangeiro do início ao fim sem intérprete.",
    modulos: modulos("ingles-atendimento", [
      {
        titulo: "Primeiro contato",
        aulas: [
          ["Greetings & small talk", "video", 15],
          ["Números, horários e valores", "video", 20],
          ["Prática de pronúncia", "pratica", 25],
        ],
      },
      {
        titulo: "Situações de atendimento",
        aulas: [
          ["At the front desk", "video", 20],
          ["At the restaurant", "video", 20],
          ["Giving directions around the city", "pratica", 25],
        ],
      },
      {
        titulo: "Resolução de problemas",
        aulas: [
          ["Handling complaints politely", "video", 20],
          ["Role-play com feedback", "pratica", 30],
          ["Avaliação oral", "quiz", 20],
        ],
      },
    ]),
  },
  {
    id: "vendas-varejo",
    titulo: "Vendas e Atendimento no Varejo",
    setor: "comercio",
    resumo: "Venda consultiva, negociação e experiência do cliente em loja física.",
    cargaHoraria: 20,
    parceiro: "CDL / entidades do comércio",
    competencias: ["vendas-consultivas", "negociacao"],
    porQue: "O comércio contrata muito, mas sofre com rotatividade e baixa conversão.",
    quemPrecisa: "Vendedores iniciantes e pessoas migrando para o varejo.",
    resultadoEsperado: "Aumentar a conversão e o ticket médio no primeiro trimestre.",
    modulos: modulos("vendas-varejo", [
      {
        titulo: "Entendendo o cliente",
        aulas: [
          ["Perfis de cliente e escuta ativa", "video", 20],
          ["Perguntas que vendem", "leitura", 15],
        ],
      },
      {
        titulo: "Negociação e fechamento",
        aulas: [
          ["Tratando objeções", "video", 20],
          ["Simulação de venda", "pratica", 35],
          ["Pós-venda e fidelização", "video", 15],
        ],
      },
    ]),
  },
  {
    id: "caixa-pdv",
    titulo: "Operação de Caixa e PDV",
    setor: "comercio",
    resumo: "Rotinas de caixa, meios de pagamento, fechamento e prevenção de erros.",
    cargaHoraria: 12,
    parceiro: "Rede de supermercados parceira",
    competencias: ["caixa-pdv", "informatica"],
    porQue: "Alta demanda sazonal em supermercados e lojas no verão.",
    quemPrecisa: "Pessoas buscando o primeiro emprego no comércio.",
    resultadoEsperado: "Operar um PDV com segurança desde o primeiro dia.",
    modulos: modulos("caixa-pdv", [
      {
        titulo: "Rotina do caixa",
        aulas: [
          ["Abertura e fechamento de caixa", "video", 15],
          ["Pix, cartões e troco", "video", 15],
          ["Simulador de PDV", "pratica", 30],
        ],
      },
      {
        titulo: "Avaliação",
        aulas: [["Teste prático de operação", "quiz", 15]],
      },
    ]),
  },
  {
    id: "garcom-salao",
    titulo: "Garçom e Salão",
    setor: "gastronomia",
    resumo: "Serviço de mesa, bebidas, comandas e trabalho em equipe no salão.",
    cargaHoraria: 20,
    parceiro: "Sindicato de bares e restaurantes",
    competencias: ["servico-mesa", "bebidas", "trabalho-equipe"],
    porQue: "Restaurantes da orla ampliam equipes em até 60% na alta temporada.",
    quemPrecisa: "Iniciantes em gastronomia e garçons sem formação.",
    resultadoEsperado: "Atuar no salão com padrão de serviço e agilidade.",
    modulos: modulos("garcom-salao", [
      {
        titulo: "Serviço de mesa",
        aulas: [
          ["Mise en place do salão", "video", 15],
          ["Tipos de serviço", "video", 20],
          ["Prática de serviço", "pratica", 40],
        ],
      },
      {
        titulo: "Bebidas e bar",
        aulas: [
          ["Vinhos, cervejas e drinks básicos", "video", 25],
          ["Serviço de bebidas", "pratica", 25],
        ],
      },
      {
        titulo: "Equipe e ritmo",
        aulas: [
          ["Comunicação salão-cozinha", "leitura", 10],
          ["Avaliação final", "quiz", 15],
        ],
      },
    ]),
  },
  {
    id: "boas-praticas-alimentos",
    titulo: "Boas Práticas na Manipulação de Alimentos",
    setor: "gastronomia",
    resumo: "Higiene, conservação e segurança alimentar conforme a vigilância sanitária.",
    cargaHoraria: 8,
    parceiro: "Vigilância Sanitária municipal",
    competencias: ["higiene-alimentos"],
    porQue: "Requisito para cozinha e salão; reduz riscos sanitários.",
    quemPrecisa: "Auxiliares de cozinha, garçons e atendentes de food service.",
    resultadoEsperado: "Certificação em boas práticas válida para fiscalização.",
    modulos: modulos("boas-praticas-alimentos", [
      {
        titulo: "Higiene e conservação",
        aulas: [
          ["Contaminação e prevenção", "video", 20],
          ["Armazenamento e temperaturas", "leitura", 15],
          ["Checklist de boas práticas", "quiz", 15],
        ],
      },
    ]),
  },
  {
    id: "governanca-hoteleira",
    titulo: "Governança e Arrumação Hoteleira",
    setor: "turismo",
    resumo: "Padrões de arrumação, enxoval, produtos e produtividade na governança.",
    cargaHoraria: 16,
    parceiro: "Rede hoteleira de BC",
    competencias: ["governanca", "hospitalidade"],
    porQue: "Camareiras estão entre as funções com maior rotatividade no verão.",
    quemPrecisa: "Pessoas iniciando na hotelaria e equipes de governança.",
    resultadoEsperado: "Arrumar UHs no padrão do hotel dentro do tempo-meta.",
    modulos: modulos("governanca-hoteleira", [
      {
        titulo: "Padrões de arrumação",
        aulas: [
          ["Sequência de arrumação da UH", "video", 20],
          ["Enxoval e produtos químicos", "leitura", 15],
          ["Prática supervisionada", "pratica", 45],
        ],
      },
      {
        titulo: "Avaliação",
        aulas: [["Checklist de qualidade", "quiz", 15]],
      },
    ]),
  },
  {
    id: "primeiros-socorros",
    titulo: "Primeiros Socorros e Segurança no Atendimento",
    setor: "transversal",
    resumo: "Primeiro atendimento, acionamento de emergência e prevenção de acidentes.",
    cargaHoraria: 8,
    parceiro: "Corpo de Bombeiros / Defesa Civil",
    competencias: ["primeiros-socorros"],
    porQue: "Exigência crescente em hotéis e estabelecimentos com grande fluxo.",
    quemPrecisa: "Qualquer profissional de atendimento ao público.",
    resultadoEsperado: "Agir corretamente nos primeiros minutos de uma emergência.",
    modulos: modulos("primeiros-socorros", [
      {
        titulo: "Primeiro atendimento",
        aulas: [
          ["Avaliação da cena e acionamento do 193", "video", 15],
          ["Engasgo, desmaio e queimaduras", "video", 20],
          ["Prática de RCP", "pratica", 30],
          ["Avaliação", "quiz", 10],
        ],
      },
    ]),
  },
];

const trilhaMap = new Map(TRILHAS.map((t) => [t.id, t]));

export function getTrilha(id: string): Trilha | undefined {
  return trilhaMap.get(id);
}

export function aulasDaTrilha(trilha: Trilha): Aula[] {
  return trilha.modulos.flatMap((m) => m.aulas);
}

/** Trilhas que desenvolvem uma competência */
export function trilhasPorCompetencia(competenciaId: string): Trilha[] {
  return TRILHAS.filter((t) => t.competencias.includes(competenciaId));
}

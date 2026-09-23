import type { AreaCurso, Curso, FaixaCarga, LocalCurso, Turno } from "@/lib/types";

export const AREAS_CURSO: { id: AreaCurso; nome: string }[] = [
  { id: "hotelaria", nome: "Hotelaria" },
  { id: "vendas", nome: "Vendas" },
  { id: "gastronomia", nome: "Gastronomia" },
  { id: "atendimento", nome: "Atendimento" },
  { id: "tecnologia", nome: "Tecnologia" },
];

export const LOCAIS_CURSO: { id: LocalCurso; nome: string; formato: string }[] = [
  { id: "presencial-centro", nome: "Presencial · Centro", formato: "Presencial" },
  { id: "presencial-barra-sul", nome: "Presencial · Barra Sul", formato: "Presencial" },
  { id: "online", nome: "Online", formato: "Online (EAD)" },
  { id: "hibrido", nome: "Híbrido", formato: "Híbrido" },
];

export const TURNOS: { id: Turno; nome: string; horario: string }[] = [
  { id: "matutino", nome: "Matutino", horario: "8h – 12h" },
  { id: "vespertino", nome: "Vespertino", horario: "13h30 – 17h30" },
  { id: "noturno", nome: "Noturno", horario: "19h – 22h" },
];

export const FAIXAS_CARGA: { id: FaixaCarga; nome: string; descricao: string }[] = [
  { id: "curta", nome: "Curta", descricao: "até 20h" },
  { id: "media", nome: "Média", descricao: "21h a 60h" },
  { id: "longa", nome: "Longa", descricao: "mais de 60h" },
];

export function faixaCarga(horas: number): FaixaCarga {
  if (horas <= 20) return "curta";
  if (horas <= 60) return "media";
  return "longa";
}

export const nomeArea = (id: AreaCurso) => AREAS_CURSO.find((a) => a.id === id)?.nome ?? id;
export const nomeLocal = (id: LocalCurso) => LOCAIS_CURSO.find((l) => l.id === id)?.nome ?? id;
export const formatoLocal = (id: LocalCurso) => LOCAIS_CURSO.find((l) => l.id === id)?.formato ?? id;
export const nomeTurno = (id: Turno) => TURNOS.find((t) => t.id === id)?.nome ?? id;

/** Catálogo ilustrativo de turmas ofertadas por instituições parceiras */
export const CURSOS: Curso[] = [
  {
    id: "recepcionista-meios-hospedagem",
    titulo: "Recepcionista em Meios de Hospedagem",
    descricao:
      "Formação completa para atuar no front office: check-in e check-out, reservas, atendimento ao hóspede, uso de sistemas de gestão hoteleira (PMS) e resolução de reclamações. Inclui prática simulada em balcão.",
    cargaHoraria: 160,
    instituicao: "Senac",
    area: "hotelaria",
    local: "presencial-centro",
    detalheLocal: "Unidade Centro · Av. Brasil",
    turnos: ["matutino", "noturno"],
    vagas: 25,
    inicio: "2026-10-13",
    gratuito: true,
    competencias: ["hospitalidade", "reservas", "atendimento"],
    trilhaId: "recepcao-hoteleira",
  },
  {
    id: "camareira-governanca",
    titulo: "Camareira(o) e Governança Hoteleira",
    descricao:
      "Padrões de arrumação de unidades habitacionais, controle de enxoval, uso seguro de produtos de limpeza e rotina da governança em hotéis de médio e grande porte.",
    cargaHoraria: 60,
    instituicao: "Senac",
    area: "hotelaria",
    local: "presencial-barra-sul",
    detalheLocal: "Laboratório parceiro · Barra Sul",
    turnos: ["matutino", "vespertino"],
    vagas: 20,
    inicio: "2026-10-20",
    gratuito: true,
    competencias: ["governanca", "hospitalidade", "trabalho-equipe"],
    trilhaId: "governanca-hoteleira",
  },
  {
    id: "ingles-hotelaria-basico",
    titulo: "Inglês Básico para Hotelaria e Turismo",
    descricao:
      "Vocabulário e situações reais de atendimento a turistas estrangeiros: recepção, restaurante, informações sobre a cidade e resolução de problemas. Aulas ao vivo com conversação.",
    cargaHoraria: 40,
    instituicao: "Secretaria Municipal de Turismo",
    area: "atendimento",
    local: "online",
    detalheLocal: "Aulas ao vivo por videoconferência",
    turnos: ["noturno"],
    vagas: 60,
    inicio: "2026-10-06",
    gratuito: true,
    competencias: ["ingles-basico"],
    trilhaId: "ingles-atendimento",
  },
  {
    id: "espanhol-atendimento",
    titulo: "Espanhol para Atendimento ao Turista",
    descricao:
      "Comunicação essencial em espanhol para receber o turista argentino, uruguaio e chileno no comércio, na hotelaria e nos restaurantes da orla.",
    cargaHoraria: 30,
    instituicao: "Secretaria Municipal de Turismo",
    area: "atendimento",
    local: "hibrido",
    detalheLocal: "Teoria online + prática no Centro de Eventos",
    turnos: ["vespertino", "noturno"],
    vagas: 40,
    inicio: "2026-11-03",
    gratuito: true,
    competencias: ["comunicacao", "atendimento"],
  },
  {
    id: "excelencia-atendimento",
    titulo: "Excelência no Atendimento ao Cliente",
    descricao:
      "Comunicação, escuta ativa, postura profissional e gestão de conflitos para quem atende o público em qualquer setor. Curso curto com certificação imediata.",
    cargaHoraria: 16,
    instituicao: "Sebrae",
    area: "atendimento",
    local: "presencial-centro",
    detalheLocal: "Sala do Empreendedor · Centro",
    turnos: ["matutino", "vespertino", "noturno"],
    vagas: 35,
    inicio: "2026-09-29",
    gratuito: true,
    competencias: ["atendimento", "comunicacao"],
  },
  {
    id: "vendas-varejo-consultivo",
    titulo: "Técnicas de Vendas no Varejo",
    descricao:
      "Venda consultiva, abordagem, apresentação de produto, tratamento de objeções e fechamento. Inclui simulações de venda com feedback individual.",
    cargaHoraria: 24,
    instituicao: "Sebrae",
    area: "vendas",
    local: "presencial-centro",
    detalheLocal: "Sala do Empreendedor · Centro",
    turnos: ["noturno"],
    vagas: 30,
    inicio: "2026-10-08",
    gratuito: true,
    competencias: ["vendas-consultivas", "negociacao"],
    trilhaId: "vendas-varejo",
  },
  {
    id: "operador-caixa",
    titulo: "Operador(a) de Caixa",
    descricao:
      "Abertura e fechamento de caixa, meios de pagamento (Pix, cartões, dinheiro), prevenção de erros e atendimento no PDV. Prática em simulador.",
    cargaHoraria: 20,
    instituicao: "Senac",
    area: "vendas",
    local: "presencial-barra-sul",
    detalheLocal: "Laboratório parceiro · Barra Sul",
    turnos: ["matutino", "vespertino"],
    vagas: 24,
    inicio: "2026-10-01",
    gratuito: true,
    competencias: ["caixa-pdv", "informatica"],
    trilhaId: "caixa-pdv",
  },
  {
    id: "vendas-digitais",
    titulo: "Vendas pelo WhatsApp e Redes Sociais",
    descricao:
      "Atendimento e vendas por canais digitais: catálogo no WhatsApp Business, mensagens que convertem, pós-venda e organização de pedidos para o comércio local.",
    cargaHoraria: 12,
    instituicao: "Sebrae",
    area: "vendas",
    local: "online",
    detalheLocal: "Plataforma EAD com encontros ao vivo",
    turnos: ["noturno"],
    vagas: 80,
    inicio: "2026-10-15",
    gratuito: true,
    competencias: ["vendas-consultivas", "comunicacao"],
  },
  {
    id: "garcom-atendimento-salao",
    titulo: "Garçom e Atendimento de Salão",
    descricao:
      "Serviço de mesa à francesa e à americana, comandas, serviço de bebidas, postura no salão e trabalho em equipe com a cozinha. Prática em restaurante-escola.",
    cargaHoraria: 80,
    instituicao: "Senac",
    area: "gastronomia",
    local: "presencial-centro",
    detalheLocal: "Restaurante-escola · Centro",
    turnos: ["vespertino", "noturno"],
    vagas: 20,
    inicio: "2026-10-27",
    gratuito: false,
    competencias: ["servico-mesa", "bebidas", "trabalho-equipe"],
    trilhaId: "garcom-salao",
  },
  {
    id: "boas-praticas-manipulacao",
    titulo: "Boas Práticas na Manipulação de Alimentos",
    descricao:
      "Higiene pessoal e do ambiente, contaminação cruzada, armazenamento e controle de temperatura conforme a legislação sanitária. Exigido para atuar em cozinhas.",
    cargaHoraria: 8,
    instituicao: "Vigilância Sanitária Municipal",
    area: "gastronomia",
    local: "online",
    detalheLocal: "Curso autoinstrucional + prova on-line",
    turnos: ["matutino", "vespertino", "noturno"],
    vagas: 200,
    inicio: "2026-09-28",
    gratuito: true,
    competencias: ["higiene-alimentos"],
    trilhaId: "boas-praticas-alimentos",
  },
  {
    id: "auxiliar-cozinha",
    titulo: "Auxiliar de Cozinha",
    descricao:
      "Pré-preparo, cortes básicos, organização da praça, higienização e rotina de uma cozinha profissional de restaurante ou hotel.",
    cargaHoraria: 120,
    instituicao: "Senac",
    area: "gastronomia",
    local: "presencial-barra-sul",
    detalheLocal: "Cozinha pedagógica · Barra Sul",
    turnos: ["matutino"],
    vagas: 16,
    inicio: "2026-11-10",
    gratuito: true,
    competencias: ["higiene-alimentos", "trabalho-equipe"],
  },
  {
    id: "bartender-drinks",
    titulo: "Bartender: Drinks Clássicos e Serviço de Bar",
    descricao:
      "Técnicas de coquetelaria, montagem de bar, controle de estoque e atendimento no balcão para bares e beach clubs na temporada.",
    cargaHoraria: 36,
    instituicao: "Senac",
    area: "gastronomia",
    local: "hibrido",
    detalheLocal: "Teoria online + prática no bar-escola · Centro",
    turnos: ["noturno"],
    vagas: 18,
    inicio: "2026-11-05",
    gratuito: false,
    competencias: ["bebidas", "atendimento"],
  },
  {
    id: "informatica-basica",
    titulo: "Informática Básica para o Trabalho",
    descricao:
      "Uso do computador, e-mail, editores de texto e planilhas, segurança digital e serviços públicos on-line. Ideal para quem está voltando ao mercado.",
    cargaHoraria: 40,
    instituicao: "Secretaria Municipal de Educação",
    area: "tecnologia",
    local: "presencial-centro",
    detalheLocal: "Telecentro municipal · Centro",
    turnos: ["matutino", "vespertino", "noturno"],
    vagas: 30,
    inicio: "2026-10-05",
    gratuito: true,
    competencias: ["informatica"],
  },
  {
    id: "excel-negocios",
    titulo: "Planilhas para Pequenos Negócios",
    descricao:
      "Controle de estoque, fluxo de caixa e relatórios simples em planilhas, com modelos prontos para comércio e serviços.",
    cargaHoraria: 20,
    instituicao: "Sebrae",
    area: "tecnologia",
    local: "online",
    detalheLocal: "Plataforma EAD",
    turnos: ["noturno"],
    vagas: 100,
    inicio: "2026-10-19",
    gratuito: true,
    competencias: ["informatica"],
  },
  {
    id: "sistemas-reserva-pms",
    titulo: "Sistemas de Reserva e Gestão Hoteleira (PMS)",
    descricao:
      "Operação de sistemas de gestão de propriedades (PMS) e channel managers: reservas, tarifas, disponibilidade e relatórios de ocupação.",
    cargaHoraria: 30,
    instituicao: "Secretaria Municipal de Turismo",
    area: "tecnologia",
    local: "hibrido",
    detalheLocal: "Online + laboratório no Centro",
    turnos: ["vespertino"],
    vagas: 25,
    inicio: "2026-11-17",
    gratuito: true,
    competencias: ["reservas", "informatica"],
  },
  {
    id: "primeiros-socorros-atendimento",
    titulo: "Primeiros Socorros para Atendimento ao Público",
    descricao:
      "Avaliação da cena, acionamento de emergência, RCP, engasgo, desmaio e queimaduras. Aula prática com manequins e certificação.",
    cargaHoraria: 8,
    instituicao: "Corpo de Bombeiros",
    area: "atendimento",
    local: "presencial-barra-sul",
    detalheLocal: "Posto de guarda-vidas · Barra Sul",
    turnos: ["matutino", "vespertino"],
    vagas: 30,
    inicio: "2026-10-10",
    gratuito: true,
    competencias: ["primeiros-socorros"],
    trilhaId: "primeiros-socorros",
  },
  {
    id: "gestao-hospedagem",
    titulo: "Gestão de Pousadas e Hospedagens",
    descricao:
      "Precificação, gestão de canais de venda, experiência do hóspede e indicadores de ocupação para pequenos meios de hospedagem.",
    cargaHoraria: 64,
    instituicao: "Sebrae",
    area: "hotelaria",
    local: "hibrido",
    detalheLocal: "Encontros online + visitas técnicas",
    turnos: ["noturno"],
    vagas: 30,
    inicio: "2026-11-24",
    gratuito: false,
    competencias: ["hospitalidade", "reservas", "negociacao"],
  },
];

const cursoMap = new Map(CURSOS.map((c) => [c.id, c]));
export const getCurso = (id: string) => cursoMap.get(id);

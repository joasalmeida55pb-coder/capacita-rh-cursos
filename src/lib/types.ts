// Tipos centrais da plataforma Capacita RH.
// Todos os módulos (Cidadão, Trilhas, Empresas, Insights) compartilham
// a mesma base de competências e ocupações.

export type SetorId =
  | "turismo"
  | "comercio"
  | "gastronomia"
  | "ingles"
  | "transversal";

export interface Setor {
  id: SetorId;
  nome: string;
  /** Classes Tailwind para chips/badges do setor */
  cor: string;
}

export type CategoriaCompetencia = "tecnica" | "comportamental" | "idioma" | "seguranca";

export interface Competencia {
  id: string;
  nome: string;
  categoria: CategoriaCompetencia;
}

export interface RequisitoCompetencia {
  competenciaId: string;
  /** Peso no cálculo de prontidão. A soma dos pesos de uma ocupação é 100. */
  peso: number;
}

export interface Ocupacao {
  id: string;
  nome: string;
  setor: SetorId;
  requisitos: RequisitoCompetencia[];
}

export type TipoAula = "video" | "leitura" | "pratica" | "quiz";

export interface Aula {
  id: string;
  titulo: string;
  tipo: TipoAula;
  duracaoMin: number;
}

export interface ModuloTrilha {
  id: string;
  titulo: string;
  aulas: Aula[];
}

export interface Trilha {
  id: string;
  titulo: string;
  setor: SetorId;
  resumo: string;
  cargaHoraria: number;
  parceiro: string;
  /** Competências desenvolvidas/verificadas ao concluir a trilha */
  competencias: string[];
  porQue: string;
  quemPrecisa: string;
  resultadoEsperado: string;
  modulos: ModuloTrilha[];
}

export type Disponibilidade = "integral" | "manha" | "tarde" | "noite" | "fins-de-semana" | "temporada";

export interface Experiencia {
  cargo: string;
  empresa: string;
  periodo: string;
}

export interface CertificadoExterno {
  id: string;
  titulo: string;
  instituicao: string;
  emitidoEm: string;
  horas: number;
  competencias: string[];
}

export interface PerfilCidadao {
  id: string;
  nome: string;
  bairro: string;
  idadeFaixa: string;
  disponibilidade: Disponibilidade[];
  areasInteresse: SetorId[];
  experiencias: Experiencia[];
  /** Competências verificadas por diagnóstico ou certificados externos */
  competenciasVerificadas: string[];
  certificadosExternos: CertificadoExterno[];
}

export interface Talento {
  id: string;
  nome: string;
  bairro: string;
  ocupacaoAlvoId: string;
  competencias: string[];
  disponibilidade: Disponibilidade[];
  experienciaAnos: number;
}

export type TipoAtribuicao = "obrigatoria" | "recomendada";

export interface TrilhaAtribuida {
  trilhaId: string;
  tipo: TipoAtribuicao;
  /** 0 a 100 */
  progresso: number;
}

export interface Colaborador {
  id: string;
  nome: string;
  funcao: string;
  equipe: string;
  admissao: string;
  competencias: string[];
  trilhas: TrilhaAtribuida[];
}

export interface Empresa {
  id: string;
  nome: string;
  setor: SetorId;
  porte: string;
  bairro: string;
  /** Equipes e as competências esperadas de cada uma (base da matriz do time) */
  equipes: EquipeEmpresa[];
}

export interface EquipeEmpresa {
  nome: string;
  competencias: string[];
}

export type HorizontePrevisao = "30" | "60" | "90" | "alta-temporada" | "baixa-temporada";

export interface Previsao {
  id: string;
  empresaId: string;
  ocupacaoId: string;
  quantidade: number;
  horizonte: HorizontePrevisao;
  observacao: string;
  criadaEm: string;
}

export interface IndicadorOcupacao {
  ocupacaoId: string;
  /** Demanda prevista agregada no município (base do piloto) */
  demandaBase: number;
  /** Profissionais cadastrados com interesse na ocupação */
  disponiveis: number;
  /** Profissionais com prontidão ≥ 80% */
  prontos: number;
}

export interface SerieSazonal {
  setor: SetorId;
  /** Índice de demanda mensal (jan → dez), 100 = média anual */
  indices: number[];
}

export interface EtapaFunil {
  etapa: string;
  valor: number;
}

// ---------- Capacitação (catálogo formativo) ----------

export type AreaCurso = "hotelaria" | "vendas" | "gastronomia" | "atendimento" | "tecnologia";
export type LocalCurso = "presencial-centro" | "presencial-barra-sul" | "online" | "hibrido";
export type Turno = "matutino" | "vespertino" | "noturno";
export type FaixaCarga = "curta" | "media" | "longa";

export interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  cargaHoraria: number;
  instituicao: string;
  area: AreaCurso;
  local: LocalCurso;
  /** Detalhe do local/formato (endereço de referência ou plataforma) */
  detalheLocal: string;
  turnos: Turno[];
  vagas: number;
  /** Data de início da próxima turma (ISO) */
  inicio: string;
  gratuito: boolean;
  competencias: string[];
  /** Trilha do Capacita relacionada, quando houver */
  trilhaId?: string;
}

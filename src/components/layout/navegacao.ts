import { Building2, ChartColumnBig, GraduationCap, IdCard, Library, type LucideIcon } from "lucide-react";

export interface ItemNav {
  href: string;
  rotulo: string;
  descricao: string;
  icone: LucideIcon;
  /** Área de acesso restrito (ex.: Prefeitura) */
  restrito?: boolean;
}

export const NAVEGACAO: ItemNav[] = [
  { href: "/capacitacao", rotulo: "Capacitação", descricao: "Catálogo formativo", icone: Library },
  { href: "/cidadao", rotulo: "Capacita Cidadão", descricao: "Passaporte profissional", icone: IdCard },
  { href: "/trilhas", rotulo: "Capacita Trilhas", descricao: "Qualificação por demanda", icone: GraduationCap },
  { href: "/empresas", rotulo: "Capacita Empresas", descricao: "Contratar, planejar, desenvolver", icone: Building2 },
  { href: "/insights", rotulo: "Capacita Insights", descricao: "Acesso restrito · Prefeitura", icone: ChartColumnBig, restrito: true },
];

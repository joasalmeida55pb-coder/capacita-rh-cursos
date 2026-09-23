import { Building2, ChartColumnBig, GraduationCap, House, IdCard, type LucideIcon } from "lucide-react";

export interface ItemNav {
  href: string;
  rotulo: string;
  descricao: string;
  icone: LucideIcon;
}

export const NAVEGACAO: ItemNav[] = [
  { href: "/", rotulo: "Visão geral", descricao: "Ciclo integrado", icone: House },
  { href: "/cidadao", rotulo: "Capacita Cidadão", descricao: "Passaporte profissional", icone: IdCard },
  { href: "/trilhas", rotulo: "Capacita Trilhas", descricao: "Qualificação por demanda", icone: GraduationCap },
  { href: "/empresas", rotulo: "Capacita Empresas", descricao: "Contratar, planejar, desenvolver", icone: Building2 },
  { href: "/insights", rotulo: "Capacita Insights", descricao: "Painel executivo municipal", icone: ChartColumnBig },
];

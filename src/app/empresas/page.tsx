import type { Metadata } from "next";
import { ModuloEmpresas } from "@/components/empresas/ModuloEmpresas";

export const metadata: Metadata = { title: "Capacita Empresas" };

export default function EmpresasPage() {
  return <ModuloEmpresas />;
}

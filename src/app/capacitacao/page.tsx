import type { Metadata } from "next";
import { CatalogoCapacitacao } from "@/components/capacitacao/CatalogoCapacitacao";

export const metadata: Metadata = { title: "Capacitação" };

export default function CapacitacaoPage() {
  return <CatalogoCapacitacao />;
}

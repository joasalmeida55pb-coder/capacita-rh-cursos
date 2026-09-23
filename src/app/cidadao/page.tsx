import type { Metadata } from "next";
import { PassaporteProfissional } from "@/components/cidadao/PassaporteProfissional";

export const metadata: Metadata = { title: "Capacita Cidadão" };

export default function CidadaoPage() {
  return <PassaporteProfissional />;
}

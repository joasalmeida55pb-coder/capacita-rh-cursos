import type { Metadata } from "next";
import { CatalogoTrilhas } from "@/components/trilhas/CatalogoTrilhas";

export const metadata: Metadata = { title: "Capacita Trilhas" };

export default function TrilhasPage() {
  return <CatalogoTrilhas />;
}

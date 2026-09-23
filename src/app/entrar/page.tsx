import type { Metadata } from "next";
import { PaginaEntrar } from "@/components/auth/PaginaEntrar";

export const metadata: Metadata = { title: "Entrar ou cadastrar" };

export default function EntrarPage() {
  return <PaginaEntrar />;
}

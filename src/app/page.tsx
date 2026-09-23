import { redirect } from "next/navigation";

/** A antiga "Visão geral" virou o catálogo de Capacitação */
export default function Home() {
  redirect("/capacitacao");
}

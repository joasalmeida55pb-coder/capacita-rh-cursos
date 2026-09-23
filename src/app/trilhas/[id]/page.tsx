import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetalheTrilha } from "@/components/trilhas/DetalheTrilha";
import { TRILHAS, getTrilha } from "@/data/trilhas";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return TRILHAS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: getTrilha(id)?.titulo ?? "Trilha" };
}

export default async function TrilhaPage({ params }: Props) {
  const { id } = await params;
  const trilha = getTrilha(id);
  if (!trilha) notFound();
  return <DetalheTrilha trilhaId={trilha.id} />;
}

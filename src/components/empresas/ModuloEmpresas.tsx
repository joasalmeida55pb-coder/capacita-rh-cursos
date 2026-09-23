"use client";

import { useState } from "react";
import { Building2, CalendarRange, MapPin, Sprout, UserSearch } from "lucide-react";
import { SetorBadge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { EMPRESA_DEMO } from "@/data/empresa";
import { AbaContratar } from "./AbaContratar";
import { AbaDesenvolver } from "./AbaDesenvolver";
import { AbaPlanejar } from "./AbaPlanejar";

type Aba = "planejar" | "desenvolver" | "contratar";

const ABAS: TabItem<Aba>[] = [
  { id: "planejar", rotulo: "Planejar", icone: CalendarRange, descricao: "Previsão de contratação antecipada" },
  { id: "desenvolver", rotulo: "Desenvolver", icone: Sprout, descricao: "Equipe, trilhas e matriz de competências" },
  { id: "contratar", rotulo: "Contratar", icone: UserSearch, descricao: "Talentos por prontidão verificada" },
];

export function ModuloEmpresas() {
  const [aba, setAba] = useState<Aba>("planejar");
  const empresa = EMPRESA_DEMO;

  return (
    <div>
      <PageHeader
        icone={Building2}
        modulo="Capacita Empresas"
        titulo="Contratar, planejar e desenvolver"
        descricao="A empresa usa o Capacita também quando não está contratando: antecipa demandas e desenvolve continuamente a equipe."
        acao={
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
            <p className="font-semibold text-slate-900">{empresa.nome}</p>
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="size-3" aria-hidden /> {empresa.bairro} · {empresa.porte}
            </p>
            <div className="mt-1.5">
              <SetorBadge setor={empresa.setor} />
            </div>
          </div>
        }
      />
      <Tabs itens={ABAS} ativo={aba} onChange={setAba} />
      <div role="tabpanel">
        {aba === "planejar" && <AbaPlanejar />}
        {aba === "desenvolver" && <AbaDesenvolver />}
        {aba === "contratar" && <AbaContratar />}
      </div>
    </div>
  );
}

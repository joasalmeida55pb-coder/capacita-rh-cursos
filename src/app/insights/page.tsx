import type { Metadata } from "next";
import { Suspense } from "react";
import { BaseRealCarregando, BaseRealPiloto } from "@/components/insights/BaseRealPiloto";
import { LoginInstitucional } from "@/components/insights/LoginInstitucional";
import { PainelInsights } from "@/components/insights/PainelInsights";
import { CONTA_DEMO, ORGAOS, obterSessaoInstitucional, usandoContaDemo } from "@/lib/auth/institucional";
import { sairInstitucional } from "./actions";

export const metadata: Metadata = { title: "Capacita Insights" };

/**
 * Rota protegida: a sessão institucional é validada no servidor antes de renderizar
 * (e de consultar) qualquer dado analítico. Sem sessão, só a tela de login é enviada.
 */
export default async function InsightsPage() {
  const sessao = await obterSessaoInstitucional();

  if (!sessao) {
    return (
      <LoginInstitucional
        orgaos={ORGAOS}
        demo={usandoContaDemo() ? { usuario: CONTA_DEMO.usuario, senha: CONTA_DEMO.senha } : undefined}
      />
    );
  }

  return (
    <PainelInsights
      sessao={{ nome: sessao.nome, orgao: sessao.orgao }}
      acaoSair={sairInstitucional}
      baseReal={
        <Suspense fallback={<BaseRealCarregando />}>
          <BaseRealPiloto />
        </Suspense>
      }
    />
  );
}

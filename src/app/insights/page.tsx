import type { Metadata } from "next";
import { Suspense } from "react";
import { BaseRealCarregando, BaseRealPiloto } from "@/components/insights/BaseRealPiloto";
import { PainelInsights } from "@/components/insights/PainelInsights";

export const metadata: Metadata = { title: "Capacita Insights" };

export default function InsightsPage() {
  return (
    <PainelInsights
      baseReal={
        <Suspense fallback={<BaseRealCarregando />}>
          <BaseRealPiloto />
        </Suspense>
      }
    />
  );
}

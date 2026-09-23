import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { CapacitaProvider } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Capacita RH · Balneário Camboriú",
    template: "%s · Capacita RH",
  },
  description:
    "Plataforma de qualificação, competências e inteligência do mercado de trabalho de Balneário Camboriú.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <CapacitaProvider>
          <div className="flex min-h-screen flex-col lg:flex-row">
            <Sidebar />
            <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
              <div className="mx-auto max-w-6xl">{children}</div>
            </main>
          </div>
        </CapacitaProvider>
      </body>
    </html>
  );
}

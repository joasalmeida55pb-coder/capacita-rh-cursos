import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ModalAcesso } from "@/components/auth/ModalAcesso";
import { Sidebar } from "@/components/layout/Sidebar";
import { AuthProvider } from "@/lib/auth/AuthProvider";
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
        <AuthProvider>
          <CapacitaProvider>
            <div className="flex min-h-screen flex-col lg:flex-row">
              <Sidebar />
              <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
                <div className="mx-auto max-w-6xl">{children}</div>
              </main>
            </div>
            <ModalAcesso />
          </CapacitaProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

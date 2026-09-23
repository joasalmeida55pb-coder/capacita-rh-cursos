"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PainelAcesso } from "./PainelAcesso";

/** Modal global de login/cadastro. Abra com `useAuth().abrirAcesso({ perfil, modo, motivo })`. */
export function ModalAcesso() {
  const { acesso, fecharAcesso } = useAuth();
  const dialogo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!acesso) return;
    const anterior = document.activeElement as HTMLElement | null;
    dialogo.current?.focus();
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") fecharAcesso();
    };
    document.addEventListener("keydown", aoTeclar);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
      anterior?.focus();
    };
  }, [acesso, fecharAcesso]);

  if (!acesso) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={fecharAcesso}>
      <div
        ref={dialogo}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-acesso"
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl focus:outline-none sm:max-w-md sm:rounded-2xl sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="titulo-acesso" className="text-lg font-bold text-slate-900">
              Acesso ao Capacita RH
            </h2>
            <p className="text-sm text-slate-500">Entre ou crie sua conta de cidadão ou empresa.</p>
          </div>
          <button type="button" onClick={fecharAcesso} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Fechar">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <PainelAcesso perfilInicial={acesso.perfil} modoInicial={acesso.modo} motivo={acesso.motivo} />
      </div>
    </div>
  );
}

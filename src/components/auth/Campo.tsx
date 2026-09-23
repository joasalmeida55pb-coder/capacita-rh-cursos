"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cx } from "@/lib/format";

interface CampoProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  rotulo: string;
  erro?: string;
  dica?: string;
}

/** Campo de formulário com rótulo, dica, mensagem de erro e alternância de senha visível */
export function Campo({ rotulo, erro, dica, type = "text", className, ...props }: CampoProps) {
  const id = useId();
  const [visivel, setVisivel] = useState(false);
  const senha = type === "password";

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {rotulo}
      </label>
      <div className="relative">
        <input
          id={id}
          type={senha && visivel ? "text" : type}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? `${id}-erro` : dica ? `${id}-dica` : undefined}
          className={cx(
            "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2",
            erro ? "border-rose-400 focus:ring-rose-200" : "border-slate-300 focus:border-teal-500 focus:ring-teal-100",
            senha && "pr-10",
          )}
          {...props}
        />
        {senha && (
          <button
            type="button"
            onClick={() => setVisivel((v) => !v)}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400 hover:text-slate-600"
            aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
          >
            {visivel ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        )}
      </div>
      {erro ? (
        <p id={`${id}-erro`} className="mt-1 text-xs text-rose-600">
          {erro}
        </p>
      ) : dica ? (
        <p id={`${id}-dica`} className="mt-1 text-xs text-slate-500">
          {dica}
        </p>
      ) : null}
    </div>
  );
}

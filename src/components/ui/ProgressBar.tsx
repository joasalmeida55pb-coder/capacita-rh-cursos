import { cx } from "@/lib/format";

interface ProgressBarProps {
  valor: number;
  className?: string;
  tom?: "marca" | "sucesso" | "alerta" | "perigo";
  rotulo?: string;
}

const CORES = {
  marca: "bg-teal-600",
  sucesso: "bg-emerald-500",
  alerta: "bg-amber-500",
  perigo: "bg-rose-500",
};

export function ProgressBar({ valor, className, tom = "marca", rotulo }: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, valor));
  return (
    <div
      className={cx("h-2 w-full overflow-hidden rounded-full bg-slate-100", className)}
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={rotulo}
    >
      <div className={cx("h-full rounded-full transition-all duration-500", CORES[tom])} style={{ width: `${v}%` }} />
    </div>
  );
}

export function tomPorProntidao(valor: number): "sucesso" | "alerta" | "perigo" {
  if (valor >= 80) return "sucesso";
  if (valor >= 50) return "alerta";
  return "perigo";
}

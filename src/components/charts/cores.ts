/**
 * Paleta dos gráficos (categórica validada para daltonismo, slots em ordem fixa).
 * Demanda, Disponíveis e Prontos sempre usam a mesma cor em todo o painel.
 */
export const SERIES = {
  demanda: "#2a78d6",
  disponiveis: "#eb6834",
  prontos: "#1baf7a",
} as const;

/** Rampa sequencial (um único matiz, claro → escuro) para mapas de calor */
export const RAMPA_SEQUENCIAL = ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#256abf", "#184f95", "#0d366b"];

export function corSequencial(valor: number, min: number, max: number): string {
  const t = max === min ? 0 : (valor - min) / (max - min);
  const i = Math.min(RAMPA_SEQUENCIAL.length - 1, Math.max(0, Math.round(t * (RAMPA_SEQUENCIAL.length - 1))));
  return RAMPA_SEQUENCIAL[i] ?? RAMPA_SEQUENCIAL[0]!;
}

/** Texto legível sobre a célula: escuro nas claras, branco nas escuras */
export function corTextoSobre(valor: number, min: number, max: number): string {
  const t = max === min ? 0 : (valor - min) / (max - min);
  return t > 0.45 ? "#ffffff" : "#0f172a";
}

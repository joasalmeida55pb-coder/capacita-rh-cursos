const numero = new Intl.NumberFormat("pt-BR");

export function fmtNumero(valor: number): string {
  return numero.format(valor);
}

export function fmtSinal(valor: number): string {
  return `${valor > 0 ? "+" : ""}${numero.format(valor)}`;
}

/** Converte "2025-09-10" em "10/09/2025" sem depender de fuso horário */
export function fmtData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

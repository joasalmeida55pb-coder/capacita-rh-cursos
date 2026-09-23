/** Utilitários de CPF/CNPJ (máscara e dígitos verificadores) */

export const somenteDigitos = (v: string) => v.replace(/\D/g, "");

export function mascararCPF(v: string): string {
  const d = somenteDigitos(v).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

export function mascararCNPJ(v: string): string {
  const d = somenteDigitos(v).slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

/** CPF parcialmente oculto, como exibido em telas de identificação */
export function ocultarCPF(cpf: string): string {
  const d = somenteDigitos(cpf);
  if (d.length !== 11) return cpf;
  return `***.${d.slice(3, 6)}.${d.slice(6, 9)}-**`;
}

function digitoVerificador(base: string, pesos: number[]): number {
  const soma = base.split("").reduce((acc, n, i) => acc + Number(n) * (pesos[i] ?? 0), 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export function validarCPF(valor: string): boolean {
  const d = somenteDigitos(valor);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const d1 = digitoVerificador(d.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = digitoVerificador(d.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  return d1 === Number(d[9]) && d2 === Number(d[10]);
}

export function validarCNPJ(valor: string): boolean {
  const d = somenteDigitos(valor);
  if (d.length !== 14 || /^(\d)\1{13}$/.test(d)) return false;
  const d1 = digitoVerificador(d.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = digitoVerificador(d.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return d1 === Number(d[12]) && d2 === Number(d[13]);
}

export const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

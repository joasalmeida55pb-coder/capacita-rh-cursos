import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Acesso institucional (Prefeitura / Gestão Pública) ao Capacita Insights.
 *
 * A sessão é um cookie httpOnly assinado com HMAC-SHA256, validado no servidor antes de
 * renderizar qualquer dado do painel. As credenciais vêm de variáveis de ambiente; sem
 * elas, em desenvolvimento, vale a conta de demonstração abaixo.
 *
 * Produção: trocar a validação de credenciais por Supabase Auth (ou SSO da Prefeitura /
 * gov.br) com papel "gestor_publico" e restringir a RPC `insights_resumo` a esse papel via RLS.
 */

export const COOKIE_INSTITUCIONAL = "capacita_gov";
const DURACAO_SEGUNDOS = 8 * 60 * 60; // um expediente

export const ORGAOS = [
  "Secretaria de Desenvolvimento Econômico",
  "Secretaria de Turismo",
  "Secretaria de Educação",
  "Secretaria de Assistência Social",
  "Gabinete do Prefeito",
] as const;

export interface SessaoInstitucional {
  usuario: string;
  nome: string;
  orgao: string;
  /** Expiração em milissegundos desde a época */
  exp: number;
}

interface ContaInstitucional {
  usuario: string;
  senha: string;
  nome: string;
}

const EM_PRODUCAO = process.env.NODE_ENV === "production";

/** Conta de demonstração (somente fora de produção, quando não há variáveis configuradas) */
export const CONTA_DEMO: ContaInstitucional = {
  usuario: "gestor.demo",
  senha: "Capacita@2026",
  nome: "Gestor(a) de Demonstração",
};

function contaConfigurada(): ContaInstitucional | null {
  const usuario = process.env.INSIGHTS_USUARIO;
  const senha = process.env.INSIGHTS_SENHA;
  if (usuario && senha) return { usuario, senha, nome: process.env.INSIGHTS_NOME ?? "Gestor(a) municipal" };
  return EM_PRODUCAO ? null : CONTA_DEMO;
}

/** Indica se a tela de login pode exibir a credencial de demonstração */
export const usandoContaDemo = (): boolean => !process.env.INSIGHTS_USUARIO && !EM_PRODUCAO;

function segredo(): string | null {
  const s = process.env.CAPACITA_AUTH_SECRET;
  if (s && s.length >= 32) return s;
  return EM_PRODUCAO ? null : "capacita-dev-secret-troque-em-producao-0000";
}

function assinar(dados: string, chave: string): string {
  return createHmac("sha256", chave).update(dados).digest("base64url");
}

function iguais(a: string, b: string): boolean {
  // Compara via HMAC para ter tamanho fixo e tempo constante
  const chave = "comparacao";
  return timingSafeEqual(createHmac("sha256", chave).update(a).digest(), createHmac("sha256", chave).update(b).digest());
}

export function verificarCredenciais(usuario: string, senha: string): ContaInstitucional | null {
  const conta = contaConfigurada();
  if (!conta) return null;
  const okUsuario = iguais(usuario.trim().toLowerCase(), conta.usuario.toLowerCase());
  const okSenha = iguais(senha, conta.senha);
  return okUsuario && okSenha ? conta : null;
}

export function configuracaoValida(): boolean {
  return contaConfigurada() !== null && segredo() !== null;
}

export async function criarSessaoInstitucional(dados: Omit<SessaoInstitucional, "exp">): Promise<void> {
  const chave = segredo();
  if (!chave) throw new Error("CAPACITA_AUTH_SECRET não configurado.");
  const sessao: SessaoInstitucional = { ...dados, exp: Date.now() + DURACAO_SEGUNDOS * 1000 };
  const corpo = Buffer.from(JSON.stringify(sessao)).toString("base64url");
  const loja = await cookies();
  loja.set(COOKIE_INSTITUCIONAL, `${corpo}.${assinar(corpo, chave)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: EM_PRODUCAO,
    path: "/",
    maxAge: DURACAO_SEGUNDOS,
  });
}

export async function encerrarSessaoInstitucional(): Promise<void> {
  const loja = await cookies();
  loja.delete(COOKIE_INSTITUCIONAL);
}

/** Lê e valida o cookie. Retorna null se ausente, adulterado ou expirado. */
export async function obterSessaoInstitucional(): Promise<SessaoInstitucional | null> {
  // Lê o cookie primeiro: isso também torna a rota dinâmica (nunca pré-renderizada)
  const valor = (await cookies()).get(COOKIE_INSTITUCIONAL)?.value;
  const chave = segredo();
  if (!valor || !chave) return null;
  const [corpo, assinatura] = valor.split(".");
  if (!corpo || !assinatura || !iguais(assinatura, assinar(corpo, chave))) return null;
  try {
    const sessao = JSON.parse(Buffer.from(corpo, "base64url").toString("utf8")) as SessaoInstitucional;
    return typeof sessao.exp === "number" && sessao.exp > Date.now() ? sessao : null;
  } catch {
    return null;
  }
}

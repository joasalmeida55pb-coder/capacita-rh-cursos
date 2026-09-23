"use server";

import { redirect } from "next/navigation";
import {
  ORGAOS,
  configuracaoValida,
  criarSessaoInstitucional,
  encerrarSessaoInstitucional,
  verificarCredenciais,
} from "@/lib/auth/institucional";

export interface EstadoLoginInstitucional {
  erro?: string;
}

const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function entrarInstitucional(
  _anterior: EstadoLoginInstitucional,
  dados: FormData,
): Promise<EstadoLoginInstitucional> {
  const usuario = String(dados.get("usuario") ?? "").trim();
  const senha = String(dados.get("senha") ?? "");
  const orgao = String(dados.get("orgao") ?? "");

  if (!configuracaoValida()) {
    return { erro: "Acesso institucional não configurado no servidor (defina INSIGHTS_USUARIO, INSIGHTS_SENHA e CAPACITA_AUTH_SECRET)." };
  }
  if (!usuario || !senha) return { erro: "Informe usuário e senha." };
  if (!(ORGAOS as readonly string[]).includes(orgao)) return { erro: "Selecione o órgão." };

  const conta = verificarCredenciais(usuario, senha);
  if (!conta) {
    await espera(700); // reduz tentativas automatizadas
    return { erro: "Usuário ou senha inválidos." };
  }

  await criarSessaoInstitucional({ usuario: conta.usuario, nome: conta.nome, orgao });
  redirect("/insights");
}

export async function sairInstitucional(): Promise<void> {
  await encerrarSessaoInstitucional();
  redirect("/insights");
}

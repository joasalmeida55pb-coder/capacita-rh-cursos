"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { somenteDigitos } from "./validacao";

/**
 * Autenticação de Cidadão e Empresa — MODO DEMONSTRAÇÃO.
 *
 * Contas e sessão ficam no localStorage deste navegador e a senha é guardada como hash
 * SHA-256. Isso serve para validar a experiência; em produção substitua as funções deste
 * provider por Supabase Auth (e-mail/senha) e pela integração oficial Login Único gov.br
 * (OpenID Connect), mantendo a interface do hook `useAuth()`.
 */

export type PerfilAcesso = "cidadao" | "empresa";
export type ModoAcesso = "entrar" | "cadastrar";

export type Sessao =
  | { tipo: "cidadao"; id: string; nome: string; email?: string; cpf?: string; via: "govbr" | "email" }
  | { tipo: "empresa"; id: string; razaoSocial: string; cnpj: string; responsavel: string };

interface ContaCidadao {
  tipo: "cidadao";
  id: string;
  nome: string;
  cpf: string;
  email: string;
  senhaHash: string;
}

interface ContaEmpresa {
  tipo: "empresa";
  id: string;
  cnpj: string;
  razaoSocial: string;
  responsavel: string;
  senhaHash: string;
}

type Conta = ContaCidadao | ContaEmpresa;

export type Resultado = { ok: true } | { ok: false; erro: string };

/** Identidade devolvida pelo gov.br (na simulação, uma pessoa de demonstração) */
export interface IdentidadeGovBr {
  cpf: string;
  nome: string;
  email: string;
  nivel: "bronze" | "prata" | "ouro";
}

export const IDENTIDADE_GOVBR_DEMO: IdentidadeGovBr = {
  cpf: "52998224725",
  nome: "Mariana Souza",
  email: "mariana.souza@exemplo.com",
  nivel: "prata",
};

/** Contas de demonstração (senha: capacita123) */
const CONTAS_DEMO: Conta[] = [
  {
    tipo: "cidadao",
    id: "cid-001",
    nome: "Mariana Souza",
    cpf: "52998224725",
    email: "mariana.souza@exemplo.com",
    senhaHash: "a17b55a799d8961a2caf9b5151ec576498cc5aeb0151d0c0cab40a2e5fedf1c6",
  },
  {
    tipo: "empresa",
    id: "emp-001",
    cnpj: "11222333000181",
    razaoSocial: "Hotel Maré Alta Ltda.",
    responsavel: "Carla Menezes",
    senhaHash: "506f6e70a893c64aa380325fe2ab3ef66924bab061ea0a4970ee00b8158509c9",
  },
];

export const CREDENCIAIS_DEMO = {
  cidadao: { email: "mariana.souza@exemplo.com", senha: "capacita123" },
  empresa: { cnpj: "11.222.333/0001-81", senha: "capacita123" },
} as const;

const CHAVE_CONTAS = "capacita-rh:contas:v1";
const CHAVE_SESSAO = "capacita-rh:sessao:v1";

async function hashSenha(identificador: string, senha: string): Promise<string> {
  const dados = new TextEncoder().encode(`capacita-rh:${identificador}:${senha}`);
  const digest = await crypto.subtle.digest("SHA-256", dados);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function ler<T>(chave: string, padrao: T): T {
  try {
    const bruto = window.localStorage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as T) : padrao;
  } catch {
    return padrao;
  }
}

function gravar(chave: string, valor: unknown) {
  try {
    if (valor === null) window.localStorage.removeItem(chave);
    else window.localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // armazenamento indisponível — segue só em memória
  }
}

function sessaoDe(conta: Conta, via: "govbr" | "email" = "email"): Sessao {
  return conta.tipo === "cidadao"
    ? { tipo: "cidadao", id: conta.id, nome: conta.nome, email: conta.email, cpf: conta.cpf, via }
    : { tipo: "empresa", id: conta.id, razaoSocial: conta.razaoSocial, cnpj: conta.cnpj, responsavel: conta.responsavel };
}

export interface OpcoesAcesso {
  perfil?: PerfilAcesso;
  modo?: ModoAcesso;
  /** Mensagem de contexto exibida no topo (ex.: "Entre para se inscrever") */
  motivo?: string;
}

interface AuthContexto {
  sessao: Sessao | null;
  carregado: boolean;
  entrarCidadao: (email: string, senha: string) => Promise<Resultado>;
  entrarGovBr: (identidade: IdentidadeGovBr) => Promise<Resultado>;
  entrarEmpresa: (cnpj: string, senha: string) => Promise<Resultado>;
  cadastrarCidadao: (dados: { nome: string; cpf: string; email: string; senha: string }) => Promise<Resultado>;
  cadastrarEmpresa: (dados: { cnpj: string; razaoSocial: string; responsavel: string; senha: string }) => Promise<Resultado>;
  sair: () => void;
  // Controle do modal de acesso
  acesso: OpcoesAcesso | null;
  abrirAcesso: (opcoes?: OpcoesAcesso) => void;
  fecharAcesso: () => void;
}

const Contexto = createContext<AuthContexto | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [carregado, setCarregado] = useState(false);
  const [acesso, setAcesso] = useState<OpcoesAcesso | null>(null);

  // Restaura a sessão apenas no cliente, depois da hidratação
  useEffect(() => {
    const salva = ler<Sessao | null>(CHAVE_SESSAO, null);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única do armazenamento local
    setSessao(salva);
    setCarregado(true);
  }, []);

  const iniciarSessao = useCallback((nova: Sessao) => {
    setSessao(nova);
    gravar(CHAVE_SESSAO, nova);
    setAcesso(null);
  }, []);

  const contas = useCallback((): Conta[] => [...CONTAS_DEMO, ...ler<Conta[]>(CHAVE_CONTAS, [])], []);

  const valor = useMemo<AuthContexto>(
    () => ({
      sessao,
      carregado,
      acesso,
      abrirAcesso: (opcoes = {}) => setAcesso(opcoes),
      fecharAcesso: () => setAcesso(null),

      async entrarCidadao(email, senha) {
        const alvo = email.trim().toLowerCase();
        const conta = contas().find((c): c is ContaCidadao => c.tipo === "cidadao" && c.email === alvo);
        if (!conta || conta.senhaHash !== (await hashSenha(alvo, senha))) {
          return { ok: false, erro: "E-mail ou senha incorretos." };
        }
        iniciarSessao(sessaoDe(conta));
        return { ok: true };
      },

      async entrarGovBr(identidade) {
        // No gov.br a identidade chega validada; vincula a uma conta existente pelo CPF, se houver.
        const conta = contas().find((c): c is ContaCidadao => c.tipo === "cidadao" && c.cpf === identidade.cpf);
        iniciarSessao(
          conta
            ? sessaoDe(conta, "govbr")
            : {
                tipo: "cidadao",
                id: `gov-${identidade.cpf}`,
                nome: identidade.nome,
                email: identidade.email,
                cpf: identidade.cpf,
                via: "govbr",
              },
        );
        return { ok: true };
      },

      async entrarEmpresa(cnpj, senha) {
        const digitos = somenteDigitos(cnpj);
        const conta = contas().find((c): c is ContaEmpresa => c.tipo === "empresa" && c.cnpj === digitos);
        if (!conta || conta.senhaHash !== (await hashSenha(digitos, senha))) {
          return { ok: false, erro: "CNPJ ou senha incorretos." };
        }
        iniciarSessao(sessaoDe(conta));
        return { ok: true };
      },

      async cadastrarCidadao({ nome, cpf, email, senha }) {
        const alvo = email.trim().toLowerCase();
        const digitos = somenteDigitos(cpf);
        const existentes = contas();
        if (existentes.some((c) => c.tipo === "cidadao" && c.email === alvo)) {
          return { ok: false, erro: "Já existe uma conta com este e-mail." };
        }
        if (existentes.some((c) => c.tipo === "cidadao" && c.cpf === digitos)) {
          return { ok: false, erro: "Este CPF já está cadastrado. Entre com seu e-mail ou pelo gov.br." };
        }
        const conta: ContaCidadao = {
          tipo: "cidadao",
          id: `cid-${Date.now().toString(36)}`,
          nome: nome.trim(),
          cpf: digitos,
          email: alvo,
          senhaHash: await hashSenha(alvo, senha),
        };
        gravar(CHAVE_CONTAS, [...ler<Conta[]>(CHAVE_CONTAS, []), conta]);
        iniciarSessao(sessaoDe(conta));
        return { ok: true };
      },

      async cadastrarEmpresa({ cnpj, razaoSocial, responsavel, senha }) {
        const digitos = somenteDigitos(cnpj);
        if (contas().some((c) => c.tipo === "empresa" && c.cnpj === digitos)) {
          return { ok: false, erro: "Este CNPJ já possui cadastro. Use a opção Entrar." };
        }
        const conta: ContaEmpresa = {
          tipo: "empresa",
          id: `emp-${Date.now().toString(36)}`,
          cnpj: digitos,
          razaoSocial: razaoSocial.trim(),
          responsavel: responsavel.trim(),
          senhaHash: await hashSenha(digitos, senha),
        };
        gravar(CHAVE_CONTAS, [...ler<Conta[]>(CHAVE_CONTAS, []), conta]);
        iniciarSessao(sessaoDe(conta));
        return { ok: true };
      },

      sair() {
        setSessao(null);
        gravar(CHAVE_SESSAO, null);
      },
    }),
    [sessao, carregado, acesso, contas, iniciarSessao],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useAuth(): AuthContexto {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}

export function nomeSessao(sessao: Sessao): string {
  return sessao.tipo === "cidadao" ? sessao.nome : sessao.razaoSocial;
}

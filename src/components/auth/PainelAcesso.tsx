"use client";

import { useState, type FormEvent } from "react";
import { Building2, Info, Loader2, UserRound } from "lucide-react";
import { CREDENCIAIS_DEMO, useAuth, type ModoAcesso, type PerfilAcesso, type Resultado } from "@/lib/auth/AuthProvider";
import { emailValido, mascararCNPJ, mascararCPF, validarCNPJ, validarCPF } from "@/lib/auth/validacao";
import { cx } from "@/lib/format";
import { Campo } from "./Campo";
import { BotaoGovBr, SimulacaoGovBr } from "./GovBr";

interface Props {
  perfilInicial?: PerfilAcesso;
  modoInicial?: ModoAcesso;
  motivo?: string;
}

type Erros = Record<string, string>;

/** Tela unificada de login e cadastro com seleção de perfil (Cidadão ou Empresa) */
export function PainelAcesso({ perfilInicial = "cidadao", modoInicial = "entrar", motivo }: Props) {
  const [perfil, setPerfil] = useState<PerfilAcesso>(perfilInicial);
  const [modo, setModo] = useState<ModoAcesso>(modoInicial);
  const [govbr, setGovbr] = useState(false);

  if (govbr) return <SimulacaoGovBr onVoltar={() => setGovbr(false)} />;

  return (
    <div>
      {motivo && (
        <p className="mb-4 flex items-start gap-2 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-900">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden /> {motivo}
        </p>
      )}

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Acessar como</legend>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { id: "cidadao", rotulo: "Cidadão", descricao: "Qualificação e passaporte", icone: UserRound },
              { id: "empresa", rotulo: "Empresa", descricao: "Planejar, desenvolver, contratar", icone: Building2 },
            ] as const
          ).map(({ id, rotulo, descricao, icone: Icone }) => (
            <button
              key={id}
              type="button"
              aria-pressed={perfil === id}
              onClick={() => setPerfil(id)}
              className={cx(
                "flex items-start gap-2 rounded-xl border p-3 text-left transition",
                perfil === id ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600" : "border-slate-200 hover:border-slate-300",
              )}
            >
              <Icone className={cx("mt-0.5 size-5 shrink-0", perfil === id ? "text-teal-700" : "text-slate-400")} aria-hidden />
              <span>
                <span className="block text-sm font-semibold text-slate-900">{rotulo}</span>
                <span className="block text-xs text-slate-500">{descricao}</span>
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <div role="tablist" className="mt-5 flex border-b border-slate-200">
        {(
          [
            { id: "entrar", rotulo: "Entrar" },
            { id: "cadastrar", rotulo: "Criar conta" },
          ] as const
        ).map(({ id, rotulo }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={modo === id}
            onClick={() => setModo(id)}
            className={cx(
              "-mb-px flex-1 border-b-2 px-3 py-2 text-sm font-medium transition",
              modo === id ? "border-teal-600 text-teal-800" : "border-transparent text-slate-500 hover:text-slate-800",
            )}
          >
            {rotulo}
          </button>
        ))}
      </div>

      <div className="pt-5">
        {perfil === "cidadao" ? (
          <>
            <BotaoGovBr onClick={() => setGovbr(true)} rotulo={modo === "entrar" ? "Entrar com gov.br" : "Cadastrar com gov.br"} />
            <p className="mt-2 text-center text-xs text-slate-500">
              {modo === "entrar"
                ? "Identificação pelo CPF com a conta gov.br."
                : "Seus dados (nome, CPF e e-mail) são preenchidos automaticamente pelo gov.br."}
            </p>
            <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
              <span className="h-px flex-1 bg-slate-200" /> ou com e-mail e senha <span className="h-px flex-1 bg-slate-200" />
            </div>
            {modo === "entrar" ? <FormEntrarCidadao /> : <FormCadastroCidadao />}
          </>
        ) : modo === "entrar" ? (
          <FormEntrarEmpresa />
        ) : (
          <FormCadastroEmpresa />
        )}
      </div>
    </div>
  );
}

// ---------- Formulários ----------

function useEnvio() {
  const [enviando, setEnviando] = useState(false);
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  async function enviar(acao: () => Promise<Resultado>) {
    setEnviando(true);
    setErroGeral(null);
    const r = await acao();
    setEnviando(false);
    if (!r.ok) setErroGeral(r.erro);
  }
  return { enviando, erroGeral, enviar };
}

function BotaoEnviar({ enviando, children }: { enviando: boolean; children: string }) {
  return (
    <button
      type="submit"
      disabled={enviando}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-70"
    >
      {enviando && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

function ErroGeral({ mensagem }: { mensagem: string | null }) {
  if (!mensagem) return null;
  return (
    <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
      {mensagem}
    </p>
  );
}

function DicaDemo({ children }: { children: string }) {
  return <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">{children}</p>;
}

function AceiteLgpd({ marcado, onChange, erro }: { marcado: boolean; onChange: (v: boolean) => void; erro?: string }) {
  return (
    <div>
      <label className="flex items-start gap-2 text-xs text-slate-600">
        <input type="checkbox" checked={marcado} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 size-4 accent-teal-600" />
        Li e aceito os termos de uso e autorizo o tratamento dos meus dados para fins de qualificação profissional,
        conforme a LGPD.
      </label>
      {erro && <p className="mt-1 text-xs text-rose-600">{erro}</p>}
    </div>
  );
}

function validarSenha(senha: string, confirmacao: string, erros: Erros) {
  if (senha.length < 8) erros.senha = "A senha deve ter pelo menos 8 caracteres.";
  if (senha !== confirmacao) erros.confirmacao = "As senhas não conferem.";
}

function FormEntrarCidadao() {
  const { entrarCidadao } = useAuth();
  const { enviando, erroGeral, enviar } = useEnvio();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<Erros>({});

  function submeter(e: FormEvent) {
    e.preventDefault();
    const novos: Erros = {};
    if (!emailValido(email)) novos.email = "Informe um e-mail válido.";
    if (!senha) novos.senha = "Informe a senha.";
    setErros(novos);
    if (Object.keys(novos).length === 0) void enviar(() => entrarCidadao(email, senha));
  }

  return (
    <form onSubmit={submeter} className="space-y-3" noValidate>
      <Campo rotulo="E-mail" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} erro={erros.email} />
      <Campo rotulo="Senha" type="password" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} erro={erros.senha} />
      <ErroGeral mensagem={erroGeral} />
      <BotaoEnviar enviando={enviando}>Entrar</BotaoEnviar>
      <DicaDemo>{`Demonstração: ${CREDENCIAIS_DEMO.cidadao.email} · senha ${CREDENCIAIS_DEMO.cidadao.senha}`}</DicaDemo>
    </form>
  );
}

function FormCadastroCidadao() {
  const { cadastrarCidadao } = useAuth();
  const { enviando, erroGeral, enviar } = useEnvio();
  const [dados, setDados] = useState({ nome: "", cpf: "", email: "", senha: "", confirmacao: "" });
  const [aceite, setAceite] = useState(false);
  const [erros, setErros] = useState<Erros>({});
  const set = (campo: keyof typeof dados) => (valor: string) => setDados((d) => ({ ...d, [campo]: valor }));

  function submeter(e: FormEvent) {
    e.preventDefault();
    const novos: Erros = {};
    if (dados.nome.trim().split(/\s+/).length < 2) novos.nome = "Informe nome e sobrenome.";
    if (!validarCPF(dados.cpf)) novos.cpf = "CPF inválido.";
    if (!emailValido(dados.email)) novos.email = "Informe um e-mail válido.";
    validarSenha(dados.senha, dados.confirmacao, novos);
    if (!aceite) novos.aceite = "É necessário aceitar os termos.";
    setErros(novos);
    if (Object.keys(novos).length === 0) void enviar(() => cadastrarCidadao(dados));
  }

  return (
    <form onSubmit={submeter} className="space-y-3" noValidate>
      <Campo rotulo="Nome completo" autoComplete="name" value={dados.nome} onChange={(e) => set("nome")(e.target.value)} erro={erros.nome} />
      <Campo
        rotulo="CPF"
        inputMode="numeric"
        placeholder="000.000.000-00"
        value={dados.cpf}
        onChange={(e) => set("cpf")(mascararCPF(e.target.value))}
        erro={erros.cpf}
      />
      <Campo rotulo="E-mail" type="email" autoComplete="email" value={dados.email} onChange={(e) => set("email")(e.target.value)} erro={erros.email} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Campo rotulo="Senha" type="password" autoComplete="new-password" value={dados.senha} onChange={(e) => set("senha")(e.target.value)} erro={erros.senha} dica="Mínimo de 8 caracteres" />
        <Campo rotulo="Confirmar senha" type="password" autoComplete="new-password" value={dados.confirmacao} onChange={(e) => set("confirmacao")(e.target.value)} erro={erros.confirmacao} />
      </div>
      <AceiteLgpd marcado={aceite} onChange={setAceite} erro={erros.aceite} />
      <ErroGeral mensagem={erroGeral} />
      <BotaoEnviar enviando={enviando}>Criar conta de cidadão</BotaoEnviar>
    </form>
  );
}

function FormEntrarEmpresa() {
  const { entrarEmpresa } = useAuth();
  const { enviando, erroGeral, enviar } = useEnvio();
  const [cnpj, setCnpj] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<Erros>({});

  function submeter(e: FormEvent) {
    e.preventDefault();
    const novos: Erros = {};
    if (!validarCNPJ(cnpj)) novos.cnpj = "CNPJ inválido.";
    if (!senha) novos.senha = "Informe a senha.";
    setErros(novos);
    if (Object.keys(novos).length === 0) void enviar(() => entrarEmpresa(cnpj, senha));
  }

  return (
    <form onSubmit={submeter} className="space-y-3" noValidate>
      <Campo rotulo="CNPJ" inputMode="numeric" placeholder="00.000.000/0000-00" value={cnpj} onChange={(e) => setCnpj(mascararCNPJ(e.target.value))} erro={erros.cnpj} />
      <Campo rotulo="Senha" type="password" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} erro={erros.senha} />
      <ErroGeral mensagem={erroGeral} />
      <BotaoEnviar enviando={enviando}>Entrar como empresa</BotaoEnviar>
      <DicaDemo>{`Demonstração: CNPJ ${CREDENCIAIS_DEMO.empresa.cnpj} · senha ${CREDENCIAIS_DEMO.empresa.senha}`}</DicaDemo>
    </form>
  );
}

function FormCadastroEmpresa() {
  const { cadastrarEmpresa } = useAuth();
  const { enviando, erroGeral, enviar } = useEnvio();
  const [dados, setDados] = useState({ cnpj: "", razaoSocial: "", responsavel: "", senha: "", confirmacao: "" });
  const [aceite, setAceite] = useState(false);
  const [erros, setErros] = useState<Erros>({});
  const set = (campo: keyof typeof dados) => (valor: string) => setDados((d) => ({ ...d, [campo]: valor }));

  function submeter(e: FormEvent) {
    e.preventDefault();
    const novos: Erros = {};
    if (!validarCNPJ(dados.cnpj)) novos.cnpj = "CNPJ inválido.";
    if (dados.razaoSocial.trim().length < 3) novos.razaoSocial = "Informe a razão social.";
    if (dados.responsavel.trim().split(/\s+/).length < 2) novos.responsavel = "Informe nome e sobrenome do responsável.";
    validarSenha(dados.senha, dados.confirmacao, novos);
    if (!aceite) novos.aceite = "É necessário aceitar os termos.";
    setErros(novos);
    if (Object.keys(novos).length === 0) void enviar(() => cadastrarEmpresa(dados));
  }

  return (
    <form onSubmit={submeter} className="space-y-3" noValidate>
      <Campo rotulo="CNPJ" inputMode="numeric" placeholder="00.000.000/0000-00" value={dados.cnpj} onChange={(e) => set("cnpj")(mascararCNPJ(e.target.value))} erro={erros.cnpj} />
      <Campo rotulo="Razão social" autoComplete="organization" value={dados.razaoSocial} onChange={(e) => set("razaoSocial")(e.target.value)} erro={erros.razaoSocial} />
      <Campo rotulo="Responsável" autoComplete="name" value={dados.responsavel} onChange={(e) => set("responsavel")(e.target.value)} erro={erros.responsavel} dica="Pessoa que administrará a conta da empresa" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Campo rotulo="Senha" type="password" autoComplete="new-password" value={dados.senha} onChange={(e) => set("senha")(e.target.value)} erro={erros.senha} dica="Mínimo de 8 caracteres" />
        <Campo rotulo="Confirmar senha" type="password" autoComplete="new-password" value={dados.confirmacao} onChange={(e) => set("confirmacao")(e.target.value)} erro={erros.confirmacao} />
      </div>
      <AceiteLgpd marcado={aceite} onChange={setAceite} erro={erros.aceite} />
      <ErroGeral mensagem={erroGeral} />
      <BotaoEnviar enviando={enviando}>Cadastrar empresa</BotaoEnviar>
    </form>
  );
}

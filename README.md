# Capacita RH — Plataforma (piloto Balneário Camboriú)

Plataforma de **Qualificação, Competências e Inteligência do Mercado de Trabalho**.
Complementa os canais municipais de emprego (não é balcão de vagas).

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000

Requisitos: Node.js 20.9+.

### Supabase

1. Copie `.env.example` para `.env.local` e preencha a chave **publishable** (Supabase → Project Settings → API Keys).
2. Reinicie o `npm run dev`.

Sem as variáveis o app continua funcionando com os dados de demonstração; o card "Base real do piloto" em `/insights` mostra "Não conectado".

O que já está ligado ao banco:

- `/insights` → card **Base real do piloto**, que chama a RPC `public.insights_resumo()` no servidor a cada requisição (só agregados; prontidão média e áreas aparecem a partir de 5 pessoas). O botão "Atualizar" refaz a chamada.

Arquivos:

```
src/lib/supabase/
  config.ts           lê NEXT_PUBLIC_SUPABASE_URL e a chave publishable/anon
  server.ts           cliente para Server Components (sem sessão → papel anon)
  client.ts           cliente único no navegador (para quando houver login)
  database.types.ts   tipos das tabelas + formato do retorno da RPC
  insights.ts         obterInsightsResumo(): chama a RPC e normaliza o JSON
supabase/seed_trilhas.sql   catálogo inicial de trilhas (opcional, rodar no SQL Editor)
```

As demais telas (Cidadão, Trilhas, Empresas) ainda usam o estado local: as políticas de RLS exigem usuário
autenticado para gravar perfis, matrículas, demandas e colaboradores, então o próximo passo é o login.

## Módulos

| Rota | Módulo | O que tem |
|---|---|---|
| `/capacitacao` (`/` redireciona) | Capacitação | Catálogo formativo com filtros por área, local/modalidade, carga horária e turno; inscrição em cursos |
| `/entrar` (e modal global) | Acesso | Login/cadastro unificado com seleção de perfil: Cidadão (gov.br ou e-mail) ou Empresa (CNPJ) |
| `/cidadao` | Capacita Cidadão | Passaporte profissional, prontidão por ocupação, competências concluídas/pendentes, certificados |
| `/trilhas` e `/trilhas/[id]` | Capacita Trilhas | Catálogo por setor, módulos, aulas e progresso, emissão de certificado |
| `/empresas` | Capacita Empresas | Abas Planejar (30/60/90 dias, temporadas), Desenvolver (equipe, trilhas, matriz) e Contratar (talentos por prontidão) |
| `/insights` 🔒 | Capacita Insights | Acesso governamental. Demanda × disponíveis × prontos × gap, escassez, sazonalidade, gaps e funil |

## Acesso e autenticação

**Cidadão e Empresa (modo demonstração).** Contas e sessão ficam no `localStorage`, com senha em hash SHA-256
(`src/lib/auth/AuthProvider.tsx`). O botão **Entrar com gov.br** abre uma *simulação* do Login Único que nunca
pede a senha do gov.br. Para produção: Supabase Auth para e-mail/senha e integração oficial do Login Único gov.br
(OpenID Connect, exige credenciamento do órgão), mantendo a interface do hook `useAuth()`.

| Perfil | Login de demonstração |
|---|---|
| Cidadão | `mariana.souza@exemplo.com` / `capacita123` (ou gov.br simulado) |
| Empresa | CNPJ `11.222.333/0001-81` / `capacita123` |

**Prefeitura (Capacita Insights).** A rota `/insights` é validada **no servidor**: sem um cookie de sessão
assinado (HMAC, httpOnly, 8 h), só a tela *Acesso Governamental* é enviada, e nenhum dado analítico é consultado.
Configure `INSIGHTS_USUARIO`, `INSIGHTS_SENHA` e `CAPACITA_AUTH_SECRET` no `.env.local` (veja `.env.example`).
Em desenvolvimento, sem essas variáveis, vale `gestor.demo` / `Capacita@2026`; em produção o acesso fica
bloqueado até configurar.

> A RPC `insights_resumo` do Supabase ainda é liberada para `anon` pelo RLS. Para a proteção valer também
> no banco, restrinja a RPC a um papel de gestor público quando o login institucional migrar para o Supabase Auth.

## Integração entre módulos (demo)

- Concluir aulas em **Trilhas** emite o certificado e sobe a prontidão no **Passaporte**.
- A cidadã demo aparece em **Empresas → Contratar** com as competências atualizadas.
- Previsões registradas em **Empresas → Planejar** somam à demanda do **Insights**.
- Inscrições em cursos da **Capacitação** exigem login de cidadão.
- O estado fica no `localStorage` do navegador; o botão "Restaurar dados de demonstração" volta ao início.

## Estrutura

```
src/
  app/                 rotas (App Router)
  components/
    ui/                Card, Badge, ProgressBar, Tabs, StatCard, PageHeader
    charts/            ReadinessRing, BarrasAgrupadas, MapaCalor, Funil, cores
    layout/            Sidebar e navegação
    auth/              PainelAcesso, ModalAcesso, GovBr, Campo
    capacitacao/       CatalogoCapacitacao (filtros + cartões de curso)
    cidadao/ trilhas/ empresas/ insights/
  data/                mocks: competências, ocupações, trilhas, cursos, pessoas, empresa, insights
  lib/
    types.ts           tipos do domínio
    calculos.ts        prontidão, cruzamento demanda × oferta, gaps
    store.tsx          estado compartilhado (Context + useReducer)
    auth/              AuthProvider (cidadão/empresa), institucional.ts (sessão da Prefeitura), validacao.ts
```

Para ligar um banco (ex.: Supabase), troque o reducer de `src/lib/store.tsx` por chamadas de API
mantendo a interface do hook `useCapacita()`, e os arquivos de `src/data/` por consultas.

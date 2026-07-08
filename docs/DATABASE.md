# Banco de dados — VivaBem

Este documento lista **tudo que precisa ser rodado no Supabase** (SQL Editor do
seu projeto) para a versão refatorada do app funcionar de ponta a ponta.

Nenhum destes comandos foi executado por mim — não tenho acesso ao seu
projeto Supabase, só à `anon key` (que não tem permissão de DDL). Use o
SQL Editor do painel do Supabase para rodar tudo abaixo.

---

## 0. Pré-requisito: extensão de UUID

```sql
create extension if not exists "pgcrypto";
```

## 1. Tabela `cuidadores` (já existe — só precisa de uma coluna nova)

A tabela já existia e era usada pelo app antigo. Só falta a coluna `codigo`,
usada pelo Familiar para se conectar a um cuidador específico:

```sql
alter table cuidadores
  add column if not exists codigo text unique;
```

> O app gera esse código (6 caracteres) no momento do cadastro do cuidador,
> com novas tentativas em caso de colisão (ver `src/services/cuidadorService.js`).
> Isso é uma solução do lado do cliente; o ideal a longo prazo é gerar via
> função/trigger no banco para garantir unicidade sem depender do cliente.

## 2. Tabela `pacientes` (idosos cadastrados pelo cuidador)

Antes só existiam em memória (useState) — nunca eram salvos. Agora persistem aqui:

```sql
create table if not exists pacientes (
  id uuid primary key default gen_random_uuid(),
  cuidador_id uuid not null references cuidadores(id) on delete cascade,
  nome text not null,
  idade int,
  cpf text,
  created_at timestamptz not null default now()
);

create index if not exists idx_pacientes_cuidador on pacientes (cuidador_id);
```

## 3. Tabela `atividades` (agenda, relatórios, medicação, observações)

```sql
create table if not exists atividades (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  cuidador_id uuid not null references cuidadores(id) on delete cascade,
  tipo text not null check (tipo in ('agenda', 'relatorio', 'medicacao', 'observacao')),
  conteudo text not null,
  data_referencia date, -- usado só pelo tipo 'agenda'
  created_at timestamptz not null default now()
);

create index if not exists idx_atividades_paciente on atividades (paciente_id);
create index if not exists idx_atividades_cuidador on atividades (cuidador_id, created_at desc);
```

## 4. Tabela `familiares`

```sql
create table if not exists familiares (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cpf text,
  telefone text,
  created_at timestamptz not null default now()
);
```

## 5. Tabela `idosos` (cadastro do próprio idoso como usuário do app)

Conceito **diferente** de `pacientes` (que são os idosos cadastrados PELO
cuidador). Aqui é o idoso se cadastrando como usuário do app pela tela
"Idoso" da Home — hoje é só um cadastro simples, sem login.

```sql
create table if not exists idosos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cpf text,
  telefone text,
  created_at timestamptz not null default now()
);
```

## 6. Tabela `conexoes` (regra de negócio Familiar ↔ Cuidador)

Esta é a tabela mais importante da nova funcionalidade. O índice único
parcial abaixo é o que garante, **no banco**, que um familiar nunca tenha
duas conexões ativas — mesmo que a verificação feita no app (em
`conexaoService.js`) seja contornada por uma corrida de requisições:

```sql
create table if not exists conexoes (
  id uuid primary key default gen_random_uuid(),
  familiar_id uuid not null references familiares(id) on delete cascade,
  cuidador_id uuid not null references cuidadores(id) on delete cascade,
  status text not null default 'ativa' check (status in ('ativa', 'desfeita')),
  created_at timestamptz not null default now(),
  desfeita_em timestamptz
);

-- Garante, a nível de banco, no máximo 1 conexão ATIVA por familiar.
create unique index if not exists conexao_familiar_ativa_unica
  on conexoes (familiar_id)
  where status = 'ativa';

create index if not exists idx_conexoes_cuidador on conexoes (cuidador_id) where status = 'ativa';
```

> Um Cuidador pode ter várias linhas em `conexoes` (vários Familiares
> vinculados) — só o Familiar é limitado a uma conexão ativa, conforme a
> regra de negócio pedida.

---

## 7. Row Level Security (RLS) — atenção especial

O app usa a `anon key` (chave pública) direto no cliente, sem um sistema de
login real (sem Supabase Auth). Isso significa que, **por padrão, qualquer
pessoa com a anon key consegue ler/escrever em qualquer linha** dessas
tabelas, caso RLS esteja desabilitado.

Não consigo saber, de fora, em que estado RLS está no seu projeto. Verifique
no painel (Authentication → Policies) e decida entre duas estratégias:

- **Curto prazo (mínimo viável):** manter RLS desabilitado nessas tabelas
  (equivalente ao comportamento atual do app, que já não tinha proteção
  nenhuma) — funciona, mas qualquer pessoa com a URL+anon key pode ler dados
  de saúde de terceiros. **Não recomendado para produção.**
- **Recomendado:** implementar autenticação real (Supabase Auth) para que
  cada cuidador/familiar tenha uma sessão de verdade, e then escrever
  policies de RLS que restrinjam cada linha ao `auth.uid()` correspondente.
  Isso é uma mudança de escopo maior (fora do que foi pedido nesta
  refatoração de front-end), mas é o item de segurança mais importante a
  resolver antes de colocar o app em produção com dados reais de saúde.

---

## 8. Variáveis de ambiente

Depois de rodar o SQL acima, confirme que existe um arquivo `.env` na raiz
do projeto (já vem preenchido com as credenciais que estavam hardcoded no
código antigo — funciona imediatamente, mas **considere rotacionar essa
chave no painel do Supabase**, já que ela ficou exposta no histórico do Git):

```
EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-publica
```

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

## 1. Tabela `cuidadores` (ligada ao Supabase Auth)

O login é feito por **CPF + senha**: o app converte o CPF num e-mail interno
(`user_<cpf>@cuidadorapp.com`) e cria o usuário no Supabase Auth. O `id` da
linha em `cuidadores` é sempre o `id` do usuário em `auth.users`.

```sql
alter table cuidadores
  add column if not exists codigo text unique;

-- Campos editáveis no perfil do cuidador (Biografia e Formação Acadêmica).
alter table cuidadores
  add column if not exists formacao text,
  add column if not exists biografia text;

-- Impede dois perfis com o mesmo CPF (é o que o app usa para detectar
-- "CPF já cadastrado" de forma confiável).
alter table cuidadores
  add constraint cuidadores_cpf_unico unique (cpf);

-- Amarra o perfil ao usuário do Auth: apagar o usuário apaga o perfil,
-- evitando o estado "existe no Auth mas não no banco" (e vice-versa).
alter table cuidadores
  add constraint cuidadores_id_auth_fk
  foreign key (id) references auth.users (id) on delete cascade;
```

> **Importante:** se a edição de Biografia / Formação Acadêmica falhar no app
> com erro de coluna inexistente, rode no SQL Editor apenas:
>
> ```sql
> alter table cuidadores
>   add column if not exists formacao text,
>   add column if not exists biografia text;
> ```

> O app gera o código de 6 caracteres no cadastro do cuidador
> (`src/services/cuidadorService.js`). É uma solução do lado do cliente; o
> ideal a longo prazo é gerar via função/trigger no banco.

## 2. Tabela `pacientes` (idosos cadastrados pelo familiar)

Regra de negócio: quem cadastra o idoso é o **familiar**; o cuidador só
enxerga os pacientes dos familiares conectados a ele (via `conexoes`).

```sql
create table if not exists pacientes (
  id uuid primary key default gen_random_uuid(),
  familiar_id uuid not null references familiares(id) on delete cascade,
  nome text not null,
  idade int,
  cpf text,
  -- Ficha de saúde preenchida depois do cadastro básico:
  alergias text,
  tipo_sanguineo text,
  contato_emergencia text,
  observacoes_medicas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_pacientes_familiar on pacientes (familiar_id);
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

## 4. Tabela `familiares` (também ligada ao Supabase Auth)

```sql
create table if not exists familiares (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  cpf text unique,
  telefone text,
  created_at timestamptz not null default now()
);
```

Se a tabela já existir com `id uuid default gen_random_uuid()`, ajuste:

```sql
alter table familiares add constraint familiares_cpf_unico unique (cpf);
alter table familiares
  add constraint familiares_id_auth_fk
  foreign key (id) references auth.users (id) on delete cascade;
```

## 5. Tabela `idosos` (cadastro do próprio idoso como usuário do app)

Conceito **diferente** de `pacientes` (que são os idosos cadastrados pelo
familiar). Aqui o idoso se cadastra como usuário autenticado do app (mesmo
padrão de `cuidadores` / `familiares`: `id` = `auth.users.id`).

```sql
create table if not exists idosos (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  cpf text unique,
  telefone text,
  contato_emergencia text,
  preferencias text,
  created_at timestamptz not null default now()
);

alter table idosos enable row level security;

create policy "idosos_select_own" on idosos
  for select using (auth.uid() = id);

create policy "idosos_insert_own" on idosos
  for insert with check (auth.uid() = id);

create policy "idosos_update_own" on idosos
  for update using (auth.uid() = id);
```

### Migração (ambientes com `idosos` legado sem `auth.users`)

Se a tabela já existir com `id uuid default gen_random_uuid()` (cadastro sem
login), é preciso realinhar no Supabase **manualmente** antes de usar o novo
fluxo: apagar linhas órfãs ou recriar a tabela com FK para `auth.users`.
O app **não** migra esses registros automaticamente.

```sql
-- Exemplo (destrutivo — faça backup antes):
-- drop table if exists idosos cascade;
-- depois rode o create table da seção acima
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

## 7. Configuração do Supabase Auth (obrigatória)

Em **Authentication → Providers → Email**:

- **Desative "Confirm email".** O e-mail gerado a partir do CPF é fictício e
  nunca chega a ninguém; com a confirmação ligada, o `signUp` não devolve
  sessão e o cadastro falha na hora de gravar o perfil.
- Mantenha o provedor de e-mail/senha habilitado (é o que sustenta o login
  por CPF).

## 8. Row Level Security (RLS)

Com o Auth em uso, cada linha pode ser restrita ao `auth.uid()`:

```sql
alter table cuidadores enable row level security;
alter table familiares enable row level security;

-- Cada um cria e lê o próprio perfil.
create policy "perfil proprio insert" on cuidadores
  for insert to authenticated with check (auth.uid() = id);
create policy "perfil proprio update" on cuidadores
  for update to authenticated using (auth.uid() = id);
create policy "perfil proprio insert" on familiares
  for insert to authenticated with check (auth.uid() = id);
create policy "perfil proprio update" on familiares
  for update to authenticated using (auth.uid() = id);

-- O familiar precisa localizar o cuidador pelo código de vínculo, e o
-- cuidador precisa ver os familiares conectados a ele.
create policy "cuidadores visiveis para autenticados" on cuidadores
  for select to authenticated using (true);
create policy "familiares visiveis para autenticados" on familiares
  for select to authenticated using (true);
```

> A verificação prévia de CPF (`authService.buscarPerfilPorCpf`) roda **antes**
> do login, então o usuário ainda é `anon`. Com as policies acima ela não
> enxerga nada e o app cai no plano B: a `unique constraint` de CPF devolve o
> erro `23505`, que o `authService` traduz em "Este CPF já está cadastrado".
> Se quiser a mensagem amigável já na primeira tentativa, exponha uma função
> `security definer` que responde apenas sim/não (sem devolver dados):
>
> ```sql
> create or replace function cpf_ja_cadastrado(cpf_consulta text)
> returns boolean language sql security definer set search_path = public as $$
>   select exists (select 1 from cuidadores where cpf = cpf_consulta)
>       or exists (select 1 from familiares where cpf = cpf_consulta);
> $$;
> grant execute on function cpf_ja_cadastrado(text) to anon, authenticated;
> ```

## 9. "Diz que o CPF já existe, mas o banco está vazio"

Esse erro aparece quando o usuário existe no **Auth** mas o perfil foi apagado
das tabelas (ou o contrário) — normalmente depois de apagar linhas na mão pelo
painel. Duas formas de resolver:

1. **Pelo app:** o `authService` agora reaproveita a conta do Auth. Basta
   cadastrar de novo com o mesmo CPF **e a mesma senha** que o perfil é
   recriado e vinculado ao usuário existente.
2. **Pelo painel:** apague o usuário em Authentication → Users. Com a foreign
   key para `auth.users` (seção 1 e 4), apagar o usuário já remove o perfil, o
   que evita a divergência.

---

## 10. Variáveis de ambiente

Depois de rodar o SQL acima, confirme que existe um arquivo `.env` na raiz
do projeto (já vem preenchido com as credenciais que estavam hardcoded no
código antigo — funciona imediatamente, mas **considere rotacionar essa
chave no painel do Supabase**, já que ela ficou exposta no histórico do Git):

```
EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-publica
```

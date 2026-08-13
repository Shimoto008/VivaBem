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

O login é feito por **e-mail + senha**: o e-mail informado no cadastro é o
mesmo usado no Supabase Auth, o que permite a recuperação de senha por e-mail.
O `id` da linha em `cuidadores` é sempre o `id` do usuário em `auth.users`.

```sql
alter table cuidadores
  add column if not exists codigo text unique;

-- Campos editáveis no perfil do cuidador (Biografia e Formação Acadêmica).
alter table cuidadores
  add column if not exists formacao text,
  add column if not exists biografia text;

-- E-mail do cadastro, gravado junto do perfil para manter os dados do usuário
-- consistentes sem depender de uma leitura em auth.users. Sem `unique`: a
-- unicidade real é garantida pelo auth.users.email, e uma segunda constraint
-- deixaria o erro 23505 ambíguo com o do CPF.
alter table cuidadores
  add column if not exists email text;

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
  email text,
  created_at timestamptz not null default now()
);
```

Se a tabela já existir com `id uuid default gen_random_uuid()`, ajuste:

```sql
alter table familiares add column if not exists email text;
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
  email text,
  contato_emergencia text,
  preferencias text,
  created_at timestamptz not null default now()
);

-- Para bases criadas antes do cadastro por e-mail:
alter table idosos add column if not exists email text;

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

## 6.1. Tabela `mensagens` (chat 1:1) e Realtime

O chat é direto entre dois usuários do Auth: `remetente_id` e `destinatario_id`
apontam para `auth.users`. Não existe "sala" nem `cuidador_id` / `familiar_id`
aqui — qualquer par de usuários conversa pelos próprios ids.

```sql
create table if not exists mensagens (
  id uuid primary key default gen_random_uuid(),
  remetente_id uuid not null references auth.users (id) on delete cascade,
  destinatario_id uuid not null references auth.users (id) on delete cascade,
  conteudo text not null,
  created_at timestamptz not null default now()
);

-- O histórico é sempre lido pelo par (eu ↔ outro) em ordem cronológica.
create index if not exists idx_mensagens_remetente on mensagens (remetente_id, created_at);
create index if not exists idx_mensagens_destinatario on mensagens (destinatario_id, created_at);

alter table mensagens enable row level security;

-- Só os dois participantes leem a conversa.
create policy "mensagens_select_participantes" on mensagens
  for select to authenticated
  using (auth.uid() = remetente_id or auth.uid() = destinatario_id);

-- Ninguém envia mensagem no nome de outra pessoa.
create policy "mensagens_insert_remetente" on mensagens
  for insert to authenticated
  with check (auth.uid() = remetente_id);
```

### Publicar a tabela no Realtime (obrigatório)

**É este passo que faz as mensagens aparecerem na hora.** Sem ele o app abre o
canal, não recebe nenhum evento e a conversa só parece atualizar quando o
usuário sai e volta para a tela (o que dispara uma nova leitura do histórico).

```sql
alter publication supabase_realtime add table mensagens;
```

Pelo painel, o mesmo efeito: **Database → Replication → `supabase_realtime`** e
ligue a tabela `mensagens`. Para conferir se já está publicada:

```sql
select tablename from pg_publication_tables where pubname = 'supabase_realtime';
```

> O `postgres_changes` respeita RLS: cada usuário só recebe eventos das linhas
> que ele poderia ler pelo `select`. Por isso a policy de select acima é
> pré-requisito do tempo real, não só da listagem.
>
> O app **não** usa `filter` no canal (`destinatario_id=eq.…`): no React Native
> esse filtro combinado com RLS costuma engolir o INSERT e o chat só atualiza
> ao reabrir a tela. A conversa é filtrada no cliente, em
> `escutarNovasMensagens` (`src/services/ChatServices.js`).
>
> Se o canal não conectar, o app escreve um aviso no console
> (`[Realtime] Canal "chat" não conectou...`) em vez de falhar em silêncio.

---

## 7. Configuração do Supabase Auth (obrigatória)

Em **Authentication → Providers → Email**:

- Mantenha o provedor de e-mail/senha habilitado (é o que sustenta o login).
- **Desative "Confirm email".** Com a confirmação ligada, o `signUp` não devolve
  sessão e o cadastro falha na hora de gravar o perfil (a linha em
  `cuidadores` / `familiares` / `idosos` é inserida logo depois do `signUp`,
  já autenticado).

### 7.1. Template do e-mail de recuperação (código de 6 dígitos)

A tela "Esqueci minha senha" usa `resetPasswordForEmail` + `verifyOtp` com um
**código de 6 dígitos digitado dentro do app** — não um link. O template padrão
do Supabase só envia `{{ .ConfirmationURL }}`, então o código nunca chega.

Em **Authentication → Email Templates → Reset Password**, inclua `{{ .Token }}`
no corpo da mensagem. Exemplo:

```html
<h2>Redefinição de senha — VivaBem</h2>
<p>Use o código abaixo no aplicativo para criar uma nova senha:</p>
<p style="font-size:28px;letter-spacing:4px;"><strong>{{ .Token }}</strong></p>
<p>O código expira em 1 hora. Se não foi você que pediu, ignore este e-mail.</p>
```

### 7.2. SMTP

O serviço de e-mail padrão do Supabase é apenas para desenvolvimento: poucos
e-mails por hora e, em projetos novos, **entrega só para os endereços dos
membros do projeto**. Para demonstrar o app com e-mails de verdade, configure
um SMTP próprio em **Project Settings → Auth → SMTP Settings**.

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

## 9. Contas antigas (login por CPF com e-mail interno)

Antes da versão com cadastro por e-mail, o app criava no Auth um e-mail
fictício derivado do CPF (`user_<cpf>@cuidadorapp.com`). Essas contas **não
são migradas** e não têm como receber o e-mail de recuperação de senha: o login
agora é feito com o e-mail real informado no cadastro.

Ao subir esta versão, limpe a base de teste e cadastre os usuários novamente:

```sql
-- Destrutivo: apaga todos os usuários e, pelas foreign keys com
-- on delete cascade, também os perfis em cuidadores / familiares / idosos.
delete from auth.users;
```

Se preferir pelo painel, apague os usuários em **Authentication → Users**.

## 10. "Diz que o CPF já existe, mas o banco está vazio"

Esse erro aparece quando o usuário existe no **Auth** mas o perfil foi apagado
das tabelas (ou o contrário) — normalmente depois de apagar linhas na mão pelo
painel. Duas formas de resolver:

1. **Pelo app:** o `authService` agora reaproveita a conta do Auth. Basta
   cadastrar de novo com o mesmo e-mail **e a mesma senha** que o perfil é
   recriado e vinculado ao usuário existente.
2. **Pelo painel:** apague o usuário em Authentication → Users. Com a foreign
   key para `auth.users` (seção 1 e 4), apagar o usuário já remove o perfil, o
   que evita a divergência.

---

## 11. Variáveis de ambiente

Depois de rodar o SQL acima, confirme que existe um arquivo `.env` na raiz
do projeto (já vem preenchido com as credenciais que estavam hardcoded no
código antigo — funciona imediatamente, mas **considere rotacionar essa
chave no painel do Supabase**, já que ela ficou exposta no histórico do Git):

```
EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-publica
```

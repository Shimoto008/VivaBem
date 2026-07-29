# VivaBem

Aplicativo para conectar cuidadores, familiares e idosos — agenda de
atividades, medicações, relatórios e observações em um só lugar.

## Como rodar

```bash
npm install
npx expo start
```

### Configurar o backend (Supabase)

1. Confirme que o arquivo `.env` na raiz existe com `EXPO_PUBLIC_SUPABASE_URL`
   e `EXPO_PUBLIC_SUPABASE_ANON_KEY` (veja `.env.example`).
2. Rode no SQL Editor do seu projeto Supabase todo o SQL descrito em
   **[`docs/DATABASE.md`](./docs/DATABASE.md)** — sem isso, os cadastros de
   paciente, atividades, familiar, idoso e a conexão Familiar↔Cuidador não
   vão funcionar (as tabelas ainda não existem no banco).

### Qualidade de código (opcional)

ESLint/Prettier já vêm configurados (`eslint.config.js`, `.prettierrc`), mas
as dependências não foram instaladas automaticamente (ambiente sem acesso à
rede durante a refatoração). Para ativar:

```bash
npx expo install eslint eslint-config-expo --dev
npx eslint .
```

## Estrutura do projeto

```
src/
  components/ui/   Design System (Button, Input, Card, Badge, ...)
  constants/       Valores fixos centralizados (rotas, tipos de atividade, especialidades)
  contexts/        Estado global (sessão do usuário, conexão Familiar↔Cuidador)
  hooks/           Toda a lógica de negócio e chamadas de API, fora das telas
  navigation/      Rotas (React Navigation)
  screens/         Telas — organizadas por área (Home, Cuidador, Familiar, Idoso)
  services/        Camada de acesso ao Supabase (uma função por operação)
  theme/           Cores, espaçamento, tipografia, sombras
  utils/           Funções puras (máscaras, validação, datas)
docs/
  DATABASE.md      SQL necessário no Supabase + notas de segurança (RLS)
  RELATORIO_REFATORACAO.md   Relatório completo da refatoração
```

Veja **[`docs/RELATORIO_REFATORACAO.md`](./docs/RELATORIO_REFATORACAO.md)**
para o relatório completo de diagnóstico, correções e decisões de arquitetura.

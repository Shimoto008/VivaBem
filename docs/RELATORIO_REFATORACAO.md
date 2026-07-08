# Relatório Final — Refatoração VivaBem

## 1. Problemas encontrados (Fase 1)

| # | Problema | Gravidade |
|---|---|---|
| 1 | Credenciais do Supabase hardcoded no código, commitadas no Git | Alta |
| 2 | Pacientes (idosos) cadastrados pelo cuidador só existiam em `useState`, nunca persistidos | Crítica |
| 3 | Telas Familiar e Idoso sem nenhuma lógica de submit (`TouchableOpacity` sem `onPress`) | Alta |
| 4 | Perfil do cuidador usava dados fictícios fixos no código | Alta |
| 5 | Familiar.js e Idoso.js quase 100% duplicados | Alta |
| 6 | Estilos de input/botão/card duplicados em quase todo `Style.js` | Média |
| 7 | Splash/Onboarding implementados fora do React Navigation, como máquina de estados em `App.js` | Média |
| 8 | Sem pastas `contexts`, `hooks` genéricos, `theme`, `constants` | Média |
| 9 | `app.json` com identidade errada (`"Teste"`) | Baixa |
| 10 | Mutação direta de estado (`idoso.historicoAgenda[chave] = texto`) | Média |
| 11 | Erro de digitação consistente "medicaçao"/"observaçao" usado como identificador | Baixa |
| 12 | Parâmetro de navegação `nomeUsuario` nunca lido (código morto) | Baixa |
| 13 | Cadastro de idoso sem nenhuma validação | Média |
| 14 | Nenhum botão de cadastro tinha estado de loading | Média |
| 15 | `selecionarFoto` sem `try/catch` | Baixa |
| 16 | Despertador nativo sem `canOpenURL` prévio | Baixa |
| 17 | `PainelPaciente.js` com ~250 linhas concentrando 4 formulários + calendário + histórico | Média |
| 18 | `UseHomeCuidador.js` concentrando estado de pacientes + calendário + 4 tipos de nota | Média |
| 19 | Listas renderizadas com `.map()` em `ScrollView` em vez de `FlatList` | Baixa |
| 20 | Funções inline recriadas a cada render, sem `useCallback`/`useMemo` | Baixa |
| 21 | Nenhum componente com `accessibilityLabel`/`accessibilityRole` | Média |
| 22 | Grid do calendário com `width: '13.5%'` sem considerar tablets | Baixa |
| 23 | Imports não utilizados (`TextInput`, `Alert`, `Linking` etc. em `renderHome.js`) | Baixa |
| 24 | Ausência total de ESLint/Prettier/EditorConfig | Média |
| 25 | Arquivos com fim de linha CRLF misturado | Baixa |
| 26 | Sem camada de Design System / componentes reutilizáveis | Média |
| 27 | Sem funcionalidade de conexão Familiar↔Cuidador (não existia) | — (feature nova) |

## 2. Problemas corrigidos

- **Segurança**: credenciais movidas para `.env` (lidas via `EXPO_PUBLIC_*`, suporte nativo do Expo); `supabaseClient.js` avisa no console se as variáveis não estiverem configuradas.
- **Persistência real**: pacientes, atividades (agenda/relatório/medicação/observação), familiares e idosos agora são salvos no Supabase via camada de `services` — nada mais vive só em `useState`.
- **Telas Familiar e Idoso funcionais**: ambos os botões de cadastro agora validam, mostram erro de campo, chamam o serviço correto e mostram estado de loading.
- **Perfil do cuidador real**: `PerfilCuidadorTab` lê do `SessionContext` (o cuidador que de fato se cadastrou), e "Editar Perfil" persiste via `cuidadorService.atualizarPerfilCuidador`.
- **Duplicação eliminada**: cadastro de Cuidador/Familiar/Idoso compartilham os mesmos `utils/masks.js` e `utils/validators.js`; estilos de UI compartilham `components/ui/*`.
- **Imutabilidade**: `useAtividadesPaciente` sempre cria objetos novos (nunca muta `atividade.conteudo` diretamente); estado sempre atualizado via `setState` com novo array/objeto.
- **Nomenclatura corrigida**: `ATIVIDADE_TIPOS` centraliza `'agenda' | 'relatorio' | 'medicacao' | 'observacao'` com a grafia certa, em um único lugar.
- **Código morto removido**: parâmetro `nomeUsuario` não usado, imports não usados, todos os arquivos antigos substituídos.
- **Validação do cadastro de idoso**: agora usa as mesmas regras (`validarNomeCompleto`, `validarIdadeObrigatoria`, `validarCPFObrigatorio`) do cadastro de cuidador/familiar.
- **Loading states**: todo botão de submit (`Button` do Design System) tem estado de `loading` com spinner e fica desabilitado durante o envio.
- **`selecionarFoto` e despertador nativo**: agora com `try/catch` e `Linking.canOpenURL` antes de abrir, com mensagem amigável em caso de falha.
- **Componentização**: `PainelPaciente.js` dividido em `CalendarioAgenda`, `FormularioAtividade` (genérico, reaproveitado pelos 4 tipos) e `HistoricoAtividades`. `UseHomeCuidador.js` dividido em `usePacientes`, `useCalendarioAgenda`, `useAtividadesPaciente` e `useHomeCuidador` (orquestrador).
- **Acessibilidade**: `accessibilityRole`/`accessibilityLabel`/`accessibilityState` adicionados em botões, abas e itens de lista interativos por todo o app.
- **Ferramentas de qualidade**: `.editorconfig` e `.gitattributes` padronizam quebra de linha (LF); `eslint.config.js` e `.prettierrc` prontos para uso (dependências precisam ser instaladas manualmente — sem acesso à rede neste ambiente, ver `README.md`).

## 3. Arquivos criados

### Fundação
`src/theme/{colors,spacing,typography,shadows,index}.js` · `src/constants/{routeNames,especialidades,atividadeTipos,index}.js` · `src/utils/{masks,validators,dateUtils,nativeAlarm}.js`

### Services (camada de acesso a dados)
`src/services/{supabaseClient,errors,cuidadorService,pacienteService,atividadeService,familiarService,idosoService,conexaoService,index}.js`

### Contexts e Hooks (lógica de negócio)
`src/contexts/{SessionContext,ConexaoFamiliarContext}.js`
`src/hooks/{useCuidadorCadastro,useFamiliarCadastro,useIdosoCadastro,useCadastroPacienteForm,useHomeCuidador,usePacientes,useCalendarioAgenda,useAtividadesPaciente,useConexaoFamiliar,useAtividadesDoFamiliar}.js`

### Design System
`src/components/ui/{Button,Input,Card,Badge,Avatar,EmptyState,ScreenHeader,SelectModal,BottomTabBar,index}.js`

### Navegação
`src/navigation/routes.js` (reescrito)

### Telas
- `src/screens/Splash/{SplashScreen,Splash.styles}.js` — splash agora é rota de verdade
- `src/screens/Onboarding/{OnboardingScreen,Onboarding.styles,onboardingSteps}.js` — idem, dados em array
- `src/screens/Home/{HomeScreen,Home.styles,perfilOptions}.js`
- `src/screens/Cuidador/{CadastroCuidadorScreen,CadastroCuidador.styles}.js`
- `src/screens/Cuidador/HomeCuidador/{HomeCuidadorScreen,HomeCuidador.styles}.js`
- `src/screens/Cuidador/HomeCuidador/components/{ResumoTab,PacientesTab,PerfilCuidadorTab}.js`
- `src/screens/Cuidador/HomeCuidador/components/PainelPaciente/{PainelPaciente,CalendarioAgenda,FormularioAtividade,HistoricoAtividades}.js`
- `src/screens/Familiar/{CadastroFamiliarScreen,CadastroFamiliar.styles}.js` — **feature nova**, antes não funcionava
- `src/screens/Familiar/HomeFamiliar/{HomeFamiliarScreen,HomeFamiliar.styles}.js` — **feature nova**
- `src/screens/Familiar/HomeFamiliar/components/{ConexaoCuidadorCard,ConectarCuidadorModal,AtividadesFamiliarList}.js` — **feature nova**
- `src/screens/Idoso/{IdosoScreen,Idoso.styles}.js` — visual idêntico ao original, lógica nova

### Documentação e configuração
`README.md` · `docs/DATABASE.md` · `docs/RELATORIO_REFATORACAO.md` (este arquivo) · `.editorconfig` · `.gitattributes` · `eslint.config.js` · `.prettierrc` · `.env` / `.env.example`

## 4. Arquivos modificados

- `App.js` — reduzido a só montar `SessionProvider` + `NavigationContainer` + `StackRoutes`
- `app.json` — `name`/`slug` corrigidos de `"Teste"` para `"VivaBem"` / `"vivabem"`

## 5. Arquivos removidos (substituídos pelos novos)

`Style_App.js`, `src/screens/Cuidador/{CadastroCuidador,Cuidador,Style}.js`, `src/screens/Cuidador/HomeCuidador/{Home,Style,UseHomeCuidador}.js`, `src/screens/Cuidador/components/*` (pasta inteira), `src/screens/Familiar/{Familiar,Style}.js`, `src/screens/Home/{Home,Style}.js`, `src/screens/Idoso/{Idoso,Style}.js`, `src/services/{supabase,validation}.js`

## 6. Melhorias de arquitetura

- Separação em camadas: **services** (I/O com Supabase) → **hooks** (regras de negócio e estado) → **screens** (só renderizam e chamam funções dos hooks). Nenhuma tela faz chamada de API diretamente.
- **Contexts** para os dois únicos estados de fato globais: sessão do usuário (`SessionContext`) e conexão Familiar↔Cuidador (`ConexaoFamiliarContext`) — tudo o resto continua local, evitando Context desnecessário.
- **`DomainError`** como classe própria para erros de regra de negócio (ex.: "já existe conexão ativa"), distinta de erros de rede/infra, permitindo mensagens amigáveis na UI sem a tela conhecer detalhes do banco.
- Regra "1 Familiar → 1 Cuidador ativo" implementada em **duas camadas**: verificação no `conexaoService` (evita uma chamada desnecessária) **e** índice único parcial no banco (`docs/DATABASE.md`) — defesa em profundidade contra corrida de requisições.
- Splash/Onboarding migrados para dentro do React Navigation (antes eram estado manual em `App.js`, fora de qualquer rota).

## 7. Melhorias de UI/UX

- **Design System** novo (`Button`, `Input`, `Card`, `Badge`, `Avatar`, `EmptyState`, `ScreenHeader`, `SelectModal`, `BottomTabBar`) com paleta Azul Royal + Branco, cantos arredondados, sombras suaves, e estados de pressionado/loading/desabilitado no botão.
- **Área do Familiar redesenhada por completo**: cadastro funcional, card de status de conexão (mostra claramente qual cuidador está conectado), modal de conexão por código, lista de atividades do cuidador conectado.
- **Área do Idoso preservada visualmente 100%** (mesmos estilos, mesma estrutura) — única adição é uma linha de erro de validação por campo, que só aparece quando há erro.
- Acessibilidade: `accessibilityLabel`/`accessibilityRole`/`accessibilityState` em elementos interativos.

## 8. Melhorias de performance

- `useCallback` em todas as funções assíncronas dos hooks de dados (evita recriação a cada render).
- `useMemo` para o cálculo de "dias do mês com atividade" no calendário (`PainelPaciente`), que antes seria recalculado a cada render.
- Estilos sempre via `StyleSheet.create` (cache nativo do RN) em vez de estilos inline, eliminados em todos os arquivos novos.
- **Pendente** (documentado, não crítico no volume atual de dados): migrar listas de pacientes/atividades de `.map()` dentro de `ScrollView` para `FlatList` quando o volume de dados crescer.

## 9. Funcionalidades movidas do Front-end

| Estava na tela | Foi para |
|---|---|
| Validação de CPF/nome/telefone (cadastro de cuidador) | `src/utils/validators.js` |
| Chamada direta ao Supabase no cadastro do cuidador | `src/services/cuidadorService.js` |
| Estado de pacientes em memória | `src/services/pacienteService.js` + `src/hooks/usePacientes.js` |
| Lógica de agenda/relatório/medicação/observação | `src/services/atividadeService.js` + `src/hooks/useAtividadesPaciente.js` |
| Geração de código do cuidador | `src/services/cuidadorService.js` (`gerarCodigo`) |
| Regra "1 conexão ativa por familiar" | `src/services/conexaoService.js` + `src/hooks/useConexaoFamiliar.js` |
| Máscaras de CPF/telefone (estavam duplicadas em cada tela) | `src/utils/masks.js` |
| Cálculo de dias do mês / navegação de calendário | `src/utils/dateUtils.js` + `src/hooks/useCalendarioAgenda.js` |

## 10. Pontos que dependem do Backend

1. **Tabelas novas não existem ainda no Supabase**: `pacientes`, `atividades`, `familiares`, `idosos`, `conexoes`, e a coluna `codigo` em `cuidadores`. SQL completo em `docs/DATABASE.md`. Sem isso, os cadastros e a conexão Familiar↔Cuidador vão falhar com erro de "tabela não existe".
2. **RLS (Row Level Security)**: o app usa a `anon key` sem autenticação real — não tenho visibilidade do estado atual de RLS no seu projeto. Detalhado em `docs/DATABASE.md`, seção 7, com as duas estratégias possíveis (mínimo viável vs. recomendado).
3. **Sessão sem persistência entre reinícios do app**: como não há Supabase Auth, a sessão (`SessionContext`) vive só em memória. Para persistir entre aberturas do app seria necessário Supabase Auth + `AsyncStorage` (nenhum dos dois está no `package.json` atual).
4. **Foto de perfil do cuidador**: hoje só fica em memória (`useState` local); persistir exigiria Supabase Storage configurado no projeto.
5. **Geração do código do cuidador**: feita no cliente com novas tentativas em caso de colisão; o ideal a longo prazo é uma função/trigger no banco para garantir unicidade sem depender do cliente.

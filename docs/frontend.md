# CRM Frontend

## Visão Geral

Aplicação SPA construída com **React 19**, empacotada via **Vite 7**, estilizada com **Tailwind CSS v4** e Shadcn UI (Radix). A camada de dados usa **@tanstack/react-query** para cache e chamadas à API do backend NestJS. O projeto utiliza TypeScript e segue uma arquitetura modular com hooks, páginas e componentes especializados.

## Principais Dependências

- `react` / `react-dom` 19: rendering e hooks.
- `react-router-dom` 7: roteamento client-side.
- `@tanstack/react-query` 5: fetch/cache de dados.
- `axios`: client HTTP centralizado (`src/api/client.ts`).
- `@radix-ui/*` + `@shadcn/ui`: componentes UI reutilizáveis (botões, selects, tooltips etc.).
- `tailwindcss` 4 + `@tailwindcss/vite`: styling utility-first.
- `zod` e `react-hook-form`: validação e manuseio de formulários.

## Estrutura de Pastas (src)

```
src/
├── App.tsx                # Shell principal, rotas e layout global
├── api/                   # Clients REST (appointments, companies, contacts)
├── components/            # Componentes reutilizáveis (Layout, UI, formulários)
│   ├── Layout/             (Sidebar, Header, PaginationFooter)
│   ├── appointments/       (AppointmentForm, AppointmentsFilterSheet)
│   └── ui/                 (botões, inputs, tooltip, select, badge, etc.)
├── contexts/              # Contextos globais (AuthProvider, ThemeProvider)
├── hooks/                 # Hooks customizados
│   ├── queries/            (React Query hooks)
│   └── use-*.ts            (use-auth, use-theme-context, use-mobile, etc.)
├── lib/                   # utilidades (cn, formatadores)
├── pages/                 # Páginas principais (AppointmentsPage, ContactsPage...)
├── types/                 # Tipos compartilhados (appointment, company, contact)
└── index.css              # Theme Tailwind + tokens globais
```

## Layout Global

- `ThemeProvider`: garante alternância light/dark baseada na preferência do usuário, persistindo a escolha no `localStorage` e sincronizando com o sistema operacional.
- `App.tsx`: provê `QueryClientProvider`, `BrowserRouter`, Toaster de notificações e layout base com `AppSidebar`, `Header` e conteúdo principal. Detecta modo mobile via `useIsMobile` para alternar entre `AppSidebar` e `AppMobileSidebar`.
- `components/Layout`: contém elementos de navegação, cabeçalhos e `PaginationFooter` com paginação controlada.

## Fluxo de Dados

1. Hooks em `src/hooks/queries` encapsulam as chamadas React Query (`useAppointments`, `useCompanies`, `useContacts`).
2. Cada hook delega para API clients em `src/api`, que usam `axios` configurado com `baseURL` (`VITE_API_URL`).
3. As páginas consomem os hooks para renderizar listagens, formulários e estados de carregamento.

## Fluxos de Navegação

### Clientes (`/clientes`)

1. Usuário acessa a rota via sidebar → `ClientsListPage` renderiza layout com cabeçalho e CTA “Novo Cliente”.
2. Componente `ClientsList` consulta `useCompanies`, exibe tabela com ordenação, busca com debounce (`setDebouncedSearch`), paginação (`PaginationFooter`) e ações de editar/excluir.
3. Botão “Novo Cliente” redireciona para `/clientes/novo` (formulário de criação).
4. Ação de editar usa `navigate(/clientes/:id/editar)`; ao salvar, invalidamos cache via `useCompanies`.
5. Exclusões disparam `useDeleteCompany`, exibindo `AlertDialog` de confirmação e `toast` de feedback.

### Contatos (`/contatos`)

1. Rota exibida via sidebar → `ContactsPage` inclui `ContactsList` com cabeçalho, busca com debounce e paginação.
2. Hook `useContacts` traz dados paginados; estado local controla ordenação por nome/email/telefone/empresa.
3. Cada linha apresenta informações formatadas (`formatPhone`), status visual (badge) e ações de editar/excluir.
4. Edição dispara callback `onEditContact`, integrando com formulário lateral/modal (quando implementado).
5. Exclusão usa `useDeleteContact` + `AlertDialog` para confirmação e `toast` para feedback; atualização de cache via React Query garante sincronismo.

### Pagina principal de Agendamentos (`AppointmentsPage.tsx`)

- Realiza busca, paginação e filtros (status, datas, empresa) com estado local e debounce para search.
- Exibe cards de agendamentos com endereço completo e contato principal.
- Contém `AppointmentsFilterSheet` (sheet lateral) para filtros avançados.
- Usa `AppointmentForm` para criar/agendar com validação (`react-hook-form`, `zod`). Formulário agora permite selecionar o contato associado (`contactId`), enviando-o para o backend. O card prioriza o contato escolhido e faz fallback para o contato primário da empresa.

### Leads (`/leads`)

1. Navegação pela sidebar abre `LeadsPage`, que consome os hooks `useLeads`, `useLeadMetrics`, `useCreateLead`, `useUpdateLead`, `useMoveLeadStage` e `useDeleteLead`.
2. A barra de filtros (`LeadsFiltersBar`) exibe busca, estágio, origem, datas e ordenação em uma única linha. Todos os selects seguem o padrão visual dos filtros de agendamentos (hover amarelo e destaque do item selecionado) e o botão "Limpar filtros" só fica ativo quando existem filtros aplicados.
3. A tabela (`LeadsTable`) usa as mesmas regras de responsividade da listagem de clientes e exibe badges de estágio/origem traduzidas para português, com cores distintas por status/origem.
4. Badges de estágio e origem reutilizam labels `LEAD_STAGE_LABELS`/`LEAD_ORIGIN_LABELS` (ex.: "Novo", "Prospecção ativa"). Tooltip/cores seguem a paleta amarela/verde utilizada no projeto.
5. O modal de detalhes (`LeadDetailsDrawer`) substitui o antigo drawer lateral. Mostra informações gerais, associação, histórico completo e observações. Botões de editar (amarelo) e arquivar (vermelho) ficam alinhados na base do modal, respeitando o mesmo estilo dos modais existentes.
6. Modais de criação/edição (`LeadForm`) utilizam `Dialog` + `LeadForm`, com selects estilizados, autocomplete de empresa digitável e vínculo automático de contatos. Ao confirmar uma empresa existente, o campo de contato é habilitado dinamicamente e carrega apenas os registros da companhia selecionada. Inputs de data continuam com `hover:cursor-pointer` e a cor base dos botões segue o padrão amarelo já aplicado em Appointments.
7. O estado vazio (`LeadsEmptyState`) inclui CTA em amarelo e texto orientativo. Quando há erro na listagem ou métricas, cartões de feedback com retry são exibidos.
8. A mensagem "Ordenado por …" é derivada do rótulo exibido no select de ordenação, evitando termos técnicos como `updatedAt`.
9. Toda a experiência de leads respeita as mesmas convenções de cores/hover definidas nas páginas existentes (clientes, contatos, agendamentos), garantindo consistência visual.

### Outras Páginas

- `ClientsListPage`: lista empresas com paginação e filtros conectados à API de empresas.
- `ClientFormPage`: formulário de criação/edição com dados baseados em `useCompanies`.
- `ContactsPage`: lista contatos consumindo `useContacts`.

## Componentes Especializados

### Clientes
- `ClientTableHeader`: controla ordenação, responsividade e exibição condicional de colunas.
- `ClientTableRow`: renderiza cada linha com ações de editar/excluir e integra com o modal de detalhes.
- `ClientDetailsModal`: modal informativo que apresenta dados completos da empresa e contatos associados.

### Contatos
- `ContactTableRow`: aplica formatação de telefone, badges de status e ações contextuais.
- `ContactFiltersBar`: encapsula lógica de busca com debounce e ordenação.

### Leads
- `LeadsFiltersBar`: agrupamento de filtros com feedback visual e botão de limpar.
- `LeadsTable`: tabela responsiva com badges traduzidas e ordenação customizada.
- `LeadDetailsDrawer`: detalhamento completo do lead com histórico e ações rápidas.

## Formulários e Validação

- `AppointmentForm`: combo de inputs Shadcn (Select, Input, Textarea, Switch). Validação com `zod` e `zodResolver`. Controla contatos disponíveis com base na empresa selecionada.
- `AppointmentsFilterSheet`: estrutura de filtros aplicáveis (status, datas, empresa), persistindo estado temporário (`draftFilters`).

## Sistema de Temas

- `ThemeContext` (`src/contexts/ThemeContext.tsx`): provê `theme` (`light` | `dark`) e função `toggleTheme`.
- Persistência: o valor é armazenado em `localStorage` (`crm:theme`) e sincronizado com `matchMedia('(prefers-color-scheme: dark)')`.
- Header: botão circular alterna ícones `Sun`/`Moon` com tooltip descritiva.
- Tailwind: classes condicionais `dark:*` garantem contraste adequado em ambos os temas.

## Padrões de Código

- Funções utilitárias centralizadas (`lib/utils.ts`) para `cn`, formatadores, etc.
- Tipos compartilhados em `src/types` (ex.: `Appointment`, `Company`, `Contact`).
- Componentes UI seguem padrão Shadcn, sem alterar componentes core (`Button`, `Input`, `Select` etc.).
- Layout responsivo via Tailwind (classes `md:*`, `lg:*`) e preferências definidas pelo usuário (hover amarelo).

## Responsividade

- Breakpoints Tailwind adotados:
  - `sm` (640px): ajustes para teléfonos em landscape.
  - `md` (768px): layout otimizado para tablets.
  - `lg` (1024px) e `xl` (1280px): telas desktop.
- Tabelas escondem colunas progressivamente (`hidden sm:table-cell`, `hidden lg:table-cell`) para manter legibilidade.
- Sidebar alterna entre `AppSidebar` (desktop) e `AppMobileSidebar` (mobile) com base em `useIsMobile`.
- Header oculta informações não essenciais em telas menores (ex.: nome do usuário) e prioriza ações principais.

## Estilos

- Tailwind 4 com tokens centralizados em `src/styles/theme.css` (importado por `index.css`).
- Preferência por palheta amarela para destaques (classes `bg-yellow-500`, `hover:bg-yellow-400`).
- Uso de `tailwind-merge` e utilitário `cn` para combinar classes condicionalmente.

## Integração com Backend

- Base URL padrão `http://localhost:3000/api` (configurável via `.env`).
- Estrutura dos payloads de agendamento reflete `AppointmentCompanySummary` com endereço completo e contato primário.
- API clients tratam erros via interceptor e propagam mensagens.

## Scripts Disponíveis

- `pnpm dev`: inicia Vite com HMR.
- `pnpm build`: compila TypeScript e gera build estático.
- `pnpm preview`: serve build para inspeção.
- `pnpm lint`: roda ESLint.

## Boas Práticas Mantidas

- Componentes e hooks tipados (`no any`), nomes descritivos.
- Estado local separado de estado derivado (ex.: `debouncedSearch`).
- Funções auxiliares puras para formatação (`formatPhoneNumber`, `buildCompanyAddressLines`).
- Uso consistente de `TooltipProvider`, `Badge` para acessibilidade e feedback visual.

## Autenticação e Autorização ✅

### Status: IMPLEMENTADO E TESTADO

O frontend implementa autenticação JWT completa com proteção de rotas, persistência de sessão e interceptors axios.

### Arquitetura

#### Contextos e Hooks
- **`AuthContext`** (`src/contexts/AuthContext.tsx`):
  - Provider que gerencia estado global de autenticação
  - Exporta: `user`, `accessToken`, `isAuthenticated`, `isLoading`, `login()`, `logout()`
  - Separado em dois arquivos para evitar avisos de Fast Refresh:
    - `AuthContext.tsx`: componente `AuthProvider`
    - `auth-context.ts`: definição do contexto

- **`useAuth`** (`src/hooks/use-auth.ts`):
  - Hook customizado para consumir `AuthContext`
  - Lança erro se usado fora do `AuthProvider`

#### Persistência de Sessão
- Dados salvos no `localStorage`:
  - `accessToken`: JWT retornado pelo backend
  - `user`: objeto JSON com `{ id, email, name, role }`
- Restauração automática ao carregar aplicação
- Limpeza automática ao fazer logout ou receber 401/403

#### Interceptors Axios (`src/api/client.ts`)
- **Request Interceptor**:
  - Anexa automaticamente `Authorization: Bearer ${token}` em todas as requisições
  - Lê token do `localStorage`

- **Response Interceptor**:
  - Detecta respostas 401 (Unauthorized) e 403 (Forbidden)
  - Limpa sessão (`localStorage` e state)
  - Redireciona para `/login` via `window.location.href`

### Componentes de Autenticação

#### LoginPage (`src/pages/LoginPage.tsx`)
- Formulário com validação HTML5
- Componentes Shadcn UI: `Card`, `Input`, `Label`, `Button`
- Ícones Lucide React:
  - `Mail`: campo de email
  - `Lock`: campo de senha
  - `LogIn`: botão de submit
- Estilização:
  - Inputs com ícones posicionados à esquerda (`pl-10`)
  - Botão amarelo com texto preto (`bg-yellow-500 hover:bg-yellow-400 text-black`)
  - Cursor pointer no hover
- Feedback via toast (Sonner):
  - Sucesso: "Login realizado - Bem-vindo de volta!"
  - Erro: "Erro no login - Email ou senha inválidos"
- Redirecionamento automático para `/` após login

#### ProtectedLayout (`src/components/Layout/ProtectedLayout.tsx`)
- Wrapper que protege rotas privadas
- Verifica `isAuthenticated` via `useAuth()`
- Estados:
  - **Loading**: exibe spinner durante restauração de sessão
  - **Não autenticado**: redireciona para `/login`
  - **Autenticado**: renderiza `<Outlet />` com rotas filhas

#### Header Atualizado (`src/components/Layout/Header.tsx`)
- Consome `useAuth()` para obter `user` e `logout`
- Exibe:
  - Nome do usuário logado com ícone `User` (oculto em mobile)
  - Botão de logout com ícone `LogOut` vermelho
  - Toggle de tema (light/dark) com ícones `Sun`/`Moon`
- Estilização responsiva

### Estrutura de Rotas (`App.tsx`)

```tsx
<BrowserRouter>
  <ThemeProvider>
    <AuthProvider>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rotas protegidas */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/agendamentos" />} />
          <Route path="/clientes" element={<ClientsListPage />} />
          <Route path="/contatos" element={<ContactsPage />} />
          <Route path="/agendamentos" element={<AppointmentsPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          {/* ... outras rotas */}
        </Route>
      </Routes>
    </AuthProvider>
  </ThemeProvider>
</BrowserRouter>
```

### Fluxo de Autenticação

#### 1. Inicialização
1. `App.tsx` renderiza `AuthProvider`
2. `AuthProvider` verifica `localStorage` por `accessToken` e `user`
3. Se encontrados, restaura sessão (`isAuthenticated = true`)
4. Define `isLoading = false`

#### 2. Acesso sem Login
1. Usuário tenta acessar `/clientes`
2. `ProtectedLayout` verifica `isAuthenticated = false`
3. Redireciona para `/login`

#### 3. Login
1. Usuário preenche formulário em `LoginPage`
2. Submit chama `login(email, password)` do `AuthContext`
3. `AuthContext` faz `POST /api/auth/login`
4. Backend retorna `{ accessToken, user }`
5. Salva no `localStorage` e state
6. Redireciona para `/` → `/agendamentos`

#### 4. Requisições Autenticadas
1. Componente chama hook (ex: `useCompanies()`)
2. Hook usa `apiClient` (axios)
3. Interceptor adiciona `Authorization: Bearer ${token}`
4. Backend valida token e retorna dados

#### 5. Token Expirado
1. Backend retorna 401
2. Interceptor detecta 401
3. Limpa `localStorage`
4. Redireciona para `/login`

#### 6. Logout
1. Usuário clica em botão de logout
2. Chama `logout()` do `AuthContext`
3. Limpa state e `localStorage`
4. Redireciona para `/login`

### Arquivos Criados/Modificados

#### Novos Arquivos
```
src/
├── contexts/
│   ├── AuthContext.tsx          # Provider de autenticação
│   └── auth-context.ts          # Definição do contexto
├── hooks/
│   └── use-auth.ts              # Hook para consumir AuthContext
├── pages/
│   └── LoginPage.tsx            # Página de login
└── components/
    └── Layout/
        └── ProtectedLayout.tsx  # Wrapper para rotas protegidas
```

#### Arquivos Modificados
```
src/
├── api/
│   └── client.ts                # Interceptors axios
├── components/
│   └── Layout/
│       └── Header.tsx           # Logout e info do usuário
└── App.tsx                      # Rotas protegidas
```

### Variáveis de Ambiente
```env
VITE_API_URL=http://localhost:3000/api
```

Atualmente apenas `VITE_API_URL` é necessária. Caso novas integrações sejam adicionadas (ex.: analytics), documentar aqui seguindo o mesmo padrão.

### Próximos Passos de Autenticação
- [ ] Implementar refresh token
- [ ] Invalidar cache do React Query ao fazer logout
- [ ] Adicionar autorização por roles (condicionar menus/rotas)
- [ ] Implementar "Lembrar-me" (persistência opcional)
- [ ] Adicionar recuperação de senha
- [ ] Implementar 2FA

---

## Próximos Passos Gerais

- Adicionar testes de unidade para hooks e componentes principais.

## Troubleshooting

- **Loop de redirecionamento para /login**: verifique se o backend está retornando 401; limpe `localStorage` e confirme `JWT_SECRET` consistente entre ambientes.
- **Dados não atualizam após salvar**: invoque `queryClient.invalidateQueries()` no serviço correspondente ou confirme se a mutação está retornando o payload esperado.
- **Tema não persiste**: confirme permissão de escrita no `localStorage` e a existência da chave `crm:theme`.
- **Inconsistência visual em tabelas**: revise classes responsivas para garantir que colunas obrigatórias não estejam ocultas em breakpoints críticos.

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
├── hooks/                 # Hooks customizados (queries, use-mobile)
├── lib/                   # utilidades (cn, formatadores)
├── pages/                 # Páginas principais (AppointmentsPage, ContactsPage...)
├── types/                 # Tipos compartilhados (appointment, company, contact)
└── index.css              # Theme Tailwind + tokens globais
```

## Layout Global

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

## Formulários e Validação

- `AppointmentForm`: combo de inputs Shadcn (Select, Input, Textarea, Switch). Validação com `zod` e `zodResolver`. Controla contatos disponíveis com base na empresa selecionada.
- `AppointmentsFilterSheet`: estrutura de filtros aplicáveis (status, datas, empresa), persistindo estado temporário (`draftFilters`).

## Padrões de Código

- Funções utilitárias centralizadas (`lib/utils.ts`) para `cn`, formatadores, etc.
- Tipos compartilhados em `src/types` (ex.: `Appointment`, `Company`, `Contact`).
- Componentes UI seguem padrão Shadcn, sem alterar componentes core (`Button`, `Input`, `Select` etc.).
- Layout responsivo via Tailwind (classes `md:*`, `lg:*`) e preferências definidas pelo usuário (hover amarelo).

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

## Próximos Passos Sugeridos

- Adicionar testes de unidade para hooks e componentes principais.

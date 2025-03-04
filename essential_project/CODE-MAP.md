# Mapa de Código - BrasilitFieldTech

Este documento fornece uma visão geral das principais estruturas de código e seus relacionamentos para facilitar a navegação pelo projeto.

## Principais Arquivos e Suas Responsabilidades

### Configuração do Projeto

| Arquivo | Descrição |
|---------|-----------|
| `package.json` | Dependências e scripts do projeto |
| `vite.config.ts` | Configuração do Vite para build e desenvolvimento |
| `tailwind.config.ts` | Configuração do Tailwind CSS |
| `tsconfig.json` | Configuração do TypeScript |
| `theme.json` | Configuração de tema para o ShadcnUI |

### Servidor (Backend)

| Arquivo | Descrição |
|---------|-----------|
| `server/index.ts` | Ponto de entrada do servidor Express |
| `server/routes.ts` | Definição das rotas da API REST |
| `server/storage.ts` | Interface de armazenamento e implementação MemStorage |
| `server/vite.ts` | Configuração do Vite para desenvolvimento do servidor |

### Modelos de Dados (Shared)

| Arquivo | Descrição |
|---------|-----------|
| `shared/schema.ts` | Definições principais de tabelas e tipos |
| `shared/farReportSchema.ts` | Schema para relatórios FAR |
| `shared/relatorioVistoriaSchema.ts` | Schema para relatórios de vistoria |

### Cliente (Frontend)

#### Core

| Arquivo | Descrição |
|---------|-----------|
| `client/src/main.tsx` | Ponto de entrada do React |
| `client/src/App.tsx` | Definição de rotas e estrutura da aplicação |
| `client/src/index.css` | Estilos globais da aplicação |

#### Bibliotecas e Utilitários

| Arquivo | Descrição |
|---------|-----------|
| `client/src/lib/db.ts` | Cliente Dexie para IndexedDB (armazenamento local) |
| `client/src/lib/queryClient.ts` | Configuração do TanStack Query e funções de API |
| `client/src/lib/sync.ts` | Sistema de sincronização offline/online |
| `client/src/lib/geocoding.ts` | Serviços de geocodificação e rotas |
| `client/src/lib/reportGenerator.ts` | Geração de relatórios em DOCX |

#### Hooks Personalizados

| Arquivo | Descrição |
|---------|-----------|
| `client/src/hooks/useAuth.ts` | Gerenciamento de autenticação |
| `client/src/hooks/useVisits.ts` | Operações com visitas |
| `client/src/hooks/useGeolocation.ts` | Acesso à geolocalização |
| `client/src/hooks/useOfflineStatus.ts` | Detecção de status online/offline |

## Fluxos de Dados Principais

### Autenticação

```
LoginPage → useAuth hook → API (/api/auth/login) → server/routes.ts → MemStorage
```

### Listagem de Visitas

```
VisitListPage → useVisits hook → API (/api/visits) → server/routes.ts → MemStorage
                                 ↓
                     [Modo Offline] → client/src/lib/db.ts (IndexedDB)
```

### Criação de Relatório

```
VistoriaFARPage → form submission → API (/api/reports) → server/routes.ts → MemStorage
                 ↓
        reportGenerator.ts → Geração DOCX → Download pelo usuário
```

### Sincronização Offline/Online

```
lib/sync.ts → Detecta mudança online → syncVisitsToServer → API (/api/visits/sync)
                                                           ↓
                                      Resolução de conflitos se necessário
```

## Componentes UI Reutilizáveis

Os principais componentes reutilizáveis estão localizados em:

- `client/src/components/ui/` - Componentes básicos shadcn
- `client/src/components/visits/` - Componentes específicos para visitas
- `client/src/components/maps/` - Componentes relacionados a mapas
- `client/src/components/layout/` - Componentes de layout (header, sidebar)

## Diagramas de Relacionamento

### Modelo de Dados Simplificado

```
User 1:N Visits
Visit 1:N Reports
Visit 1:N Photos
Visit 1:N Documents
Report 1:1 Content (JSON)
```

### Hierarquia de Componentes UI

```
App
├── DashboardLayout
│   ├── Sidebar
│   ├── Header
│   └── {Conteúdo da Página}
│       ├── DashboardPage
│       ├── VisitListPage
│       ├── VisitDetailsPage
│       └── etc...
└── Standalone Pages
    ├── LoginPage
    └── NotFound
```

## Considerações de Performance

- **Code Splitting**: Implementado via lazy loading nas rotas
- **Otimização de Imagens**: Compressão de fotos antes de armazenar
- **Geolocalização**: Throttling para evitar atualizações excessivas
- **Sincronização**: Processos em background para não bloquear a UI

## Estratégia de Testes

O projeto está estruturado para suportar testes nos seguintes níveis:

- **Componentes**: Isolados com props mockadas
- **Hooks**: Testáveis isoladamente com contexts mockados
- **API**: Endpoints testáveis via supertest
- **E2E**: Fluxos completos testáveis via Cypress
# BrasilitFieldTech - Aplicação de Gerenciamento de Inspeções

## Descrição do Projeto

Aplicação web completa para gestão de inspeções técnicas de telhas e geração de relatórios, com suporte para operações offline e sincronização de dados.

## Estrutura do Projeto

```
├── client/               # Frontend React
│   ├── public/           # Arquivos estáticos
│   └── src/              # Código fonte do cliente
│       ├── components/   # Componentes reutilizáveis
│       ├── css/          # Estilos CSS globais e responsivos
│       ├── hooks/        # React hooks personalizados
│       ├── layouts/      # Layouts de página
│       ├── lib/          # Utilitários e serviços
│       ├── pages/        # Páginas da aplicação
│       ├── shared/       # Modelos compartilhados com o servidor
│       ├── styles/       # Estilos específicos
│       └── types/        # Definições de tipos
├── server/               # Backend Express
│   ├── index.ts          # Ponto de entrada do servidor
│   ├── routes.ts         # Definição de rotas da API
│   ├── storage.ts        # Camada de persistência
│   └── vite.ts           # Configuração do Vite para o servidor
├── shared/               # Código compartilhado entre cliente e servidor
│   ├── farReportSchema.ts          # Schema para relatórios FAR
│   ├── relatorioVistoriaSchema.ts  # Schema para relatórios de vistoria
│   └── schema.ts                   # Esquemas de dados principais
└── [arquivos de configuração]      # Configurações do projeto
```

## Principais Funcionalidades

1. **Gerenciamento de Inspeções**
   - Cadastro de inspeções técnicas
   - Agendamento de visitas
   - Mapa de rotas otimizado

2. **Relatórios Técnicos**
   - Geração de relatórios em formato DOCX
   - Formulários específicos para diferentes tipos de inspeção
   - Inclusão automática de fotos e observações

3. **Sincronização e Offline**
   - Operação offline completa
   - Sincronização automática quando online
   - Detecção e resolução de conflitos

## Tecnologias Utilizadas

- **Frontend**: React, TailwindCSS, ShadcnUI, React Query
- **Backend**: Express, Node.js
- **Banco de Dados**: MemStorage (substituível por PostgreSQL)
- **Validação**: Zod, React Hook Form
- **Documentos**: DocX para geração de relatórios
- **Mapas**: Leaflet, React Leaflet

## Fluxos Principais

### Autenticação
- Login: `/login`
- Perfil: `/perfil`

### Visitas
- Lista: `/visitas`
- Detalhes: `/visitas/:id`
- Nova Visita: `/visitas/nova`

### Relatórios
- Lista: `/relatorios`
- Vistoria FAR: `/vistoria-far`
- Novo Relatório: `/nova-vistoria`

## APIs Principais

### Auth
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/me`

### Visitas
- GET `/api/visits`
- GET `/api/visits/:id`
- POST `/api/visits`
- PATCH `/api/visits/:id`
- DELETE `/api/visits/:id`
- POST `/api/visits/sync`
- GET `/api/visits/sync`

### Relatórios
- GET `/api/reports`
- GET `/api/reports/:id`
- POST `/api/reports`
- PATCH `/api/reports/:id`
- DELETE `/api/reports/:id`
- POST `/api/reports/:id/share`

## Modelos de Dados Principais

### User
```typescript
{
  id: number;
  name: string;
  email: string;
  role: string;
  passwordHash: string;
}
```

### Visit
```typescript
{
  id: number;
  userId: number;
  clientName: string;
  address: string;
  date: string;
  time?: string;
  type: VisitType; // "installation" | "maintenance" | "inspection" | "repair" | "emergency"
  status: VisitStatus; // "scheduled" | "in-progress" | "pending" | "completed" | "urgent"
  priority: VisitPriority; // "normal" | "high" | "urgent"
  description?: string;
  contactInfo?: string;
  checklist?: JSON; // Array de itens de checklist
  photos?: JSON; // Array de fotos (dataUrls)
  documents?: JSON; // Array de documentos
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```

### Report
```typescript
{
  id: number;
  visitId?: number;
  userId: number;
  title: string;
  type: ReportType; // "inspection" | "maintenance" | "repair" | "installation"
  status: ReportStatus; // "draft" | "completed" | "approved" | "rejected"
  content: JSON; // Conteúdo do relatório
  attachments?: JSON; // Array de anexos
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  sharedWith?: JSON; // Lista de pessoas com quem foi compartilhado
}
```

## Instruções para Execução

1. **Instalação de Dependências**
   ```bash
   npm install
   ```

2. **Iniciar a Aplicação**
   ```bash
   npm run dev
   ```

3. **Build para Produção**
   ```bash
   npm run build
   ```

4. **Iniciar em Modo Produção**
   ```bash
   npm start
   ```

## Organização dos Componentes

A aplicação segue uma arquitetura de componentes modular:

- **Componentes UI**: Componentes base reutilizáveis (botões, inputs, modais)
- **Páginas**: Componentes de nível superior que representam rotas da aplicação
- **Layouts**: Estruturas de página reutilizáveis (dashboard, autenticação)
- **Hooks**: Lógica reutilizável e gerenciamento de estado

## Gerenciamento de Estado

- **React Query**: Para estado do servidor e comunicação com a API
- **React Hook Form**: Para gerenciamento de formulários
- **Contexto React**: Para estado global da aplicação (autenticação, tema)
- **localStorage/IndexedDB**: Para persistência de dados offline

## Notas para Desenvolvimento

- A aplicação utiliza um sistema de armazenamento em memória por padrão
- Para usar um banco de dados PostgreSQL, modifique a implementação em `server/storage.ts`
- As rotas da API estão configuradas para funcionamento offline primeiro
- Os relatórios são gerados no cliente usando a biblioteca DocX
# BrasilitAI - Plataforma de Documentação Inteligente

## Visão Geral

BrasilitAI é uma plataforma avançada de geração de documentação que transforma fluxos de trabalho complexos em soluções de relatórios inteligentes e adaptáveis, com foco na experiência do usuário simplificada e geração automatizada de conteúdo.

## Características Principais

- **Geração Inteligente de Relatórios**: Transforme dados brutos em relatórios profissionais com formatação inteligente
- **Suporte Offline**: Trabalhe sem conexão com internet e sincronize quando estiver online
- **UI Responsiva**: Interface adaptável para desktops, tablets e dispositivos móveis
- **Gestão de Visitas Técnicas**: Acompanhe, agende e documente visitas técnicas
- **Visualização Avançada**: Mapas interativos e gráficos para análise de dados
- **Modelos Personalizáveis**: Crie modelos de documentos padronizados para sua empresa

## Tecnologias

- **Frontend**: React, TypeScript, TanStack Query v5, Shadcn UI
- **Backend**: Express, Node.js
- **Mapeamento**: Leaflet, React Leaflet
- **Relatórios**: DOCX, PDF
- **Armazenamento**: Dexie.js para offline, PostgreSQL/Neon para nuvem
- **Roteamento**: Wouter
- **Visualização de Dados**: Recharts

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/brasilitai.git

# Instale as dependências
npm install

# Inicie a aplicação
npm run dev
```

## Estrutura do Projeto

```
.
├── client/               # Frontend da aplicação
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── hooks/        # Custom hooks
│   │   ├── layouts/      # Componentes de layout
│   │   ├── lib/          # Funções utilitárias 
│   │   ├── pages/        # Páginas da aplicação
│   │   └── shared/       # Tipos e schemas
│   └── public/           # Assets estáticos
├── server/               # Backend da aplicação
│   ├── routes.ts         # Rotas da API
│   ├── storage.ts        # Interface de armazenamento
│   └── index.ts          # Ponto de entrada do servidor
└── shared/               # Código compartilhado entre frontend e backend
    └── schema.ts         # Esquemas de dados e tipos
```

## Funcionalidades Principais

- Gerenciamento de Visitas Técnicas
- Geração de Relatórios (Vistorias, FAR, Inspeções)
- Mapeamento e Otimização de Rotas
- Sincronização Offline-Primeiro
- Dashboard Analítico
- Gestão de Usuários e Permissões

## Roadmap

- [ ] Integração com serviços em nuvem adicionais
- [ ] Aplicativo móvel nativo
- [ ] Recursos de IA avançados para análise de dados
- [ ] Suporte para múltiplos idiomas
- [ ] Integração com sistemas ERP

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

## Contato

Para mais informações, entre em contato com a equipe do BrasilitAI.
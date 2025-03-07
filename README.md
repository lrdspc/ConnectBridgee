
# Brasilit Visit - Sistema de Relatórios de Vistoria Técnica

Este projeto é uma aplicação web para criação, gerenciamento e geração de relatórios de vistoria técnica para telhas Brasilit. O sistema permite aos técnicos documentar vistorias, identificar não conformidades, adicionar fotos e gerar documentos padronizados em formato Word.

## Características

- Cadastro e gerenciamento de relatórios de vistoria técnica
- Interface intuitiva para preenchimento de formulários
- Seleção de não conformidades técnicas com descrições detalhadas
- Upload e gerenciamento de fotos da vistoria
- Geração de documentos Word formatados conforme padrão
- Armazenamento offline para trabalho em campo sem internet
- Sincronização automática quando a conexão é reestabelecida

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn/UI
- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL (via Neon Serverless)
- **Documentos**: biblioteca docx para geração de arquivos Word
- **Geolocalização**: React Leaflet para mapas interativos
- **Armazenamento Local**: Dexie.js para IndexedDB

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em modo produção
npm run start
```

## Estrutura do Projeto

```
├── client/              # Frontend da aplicação
│   ├── public/          # Arquivos estáticos
│   ├── src/             # Código fonte React
│       ├── components/  # Componentes reutilizáveis
│       ├── lib/         # Funções utilitárias
│       ├── pages/       # Páginas da aplicação
│       └── layouts/     # Layouts e templates
├── server/              # Backend da aplicação
│   ├── index.ts         # Ponto de entrada do servidor
│   ├── routes.ts        # Rotas da API
│   └── storage.ts       # Gerenciamento de armazenamento
└── shared/              # Código compartilhado
    └── relatorioVistoriaSchema.ts  # Esquemas de validação
```

## Fluxo de Trabalho

1. O técnico cria um novo relatório de vistoria
2. Preenche informações gerais (cliente, empreendimento, endereço)
3. Seleciona as não conformidades identificadas na vistoria
4. Adiciona fotos documentando a situação
5. Preenche análise técnica e conclusão
6. Gera o documento Word formatado para impressão/envio

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

MIT

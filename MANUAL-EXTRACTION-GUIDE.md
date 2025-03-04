# Guia de Extração Manual - BrasilitFieldTech

Este guia fornece instruções passo a passo para extrair e configurar manualmente o projeto BrasilitFieldTech em um novo ambiente.

## Passo 1: Preparação do Ambiente

1. Crie uma nova pasta para o projeto:
   ```
   mkdir BrasilitFieldTech
   cd BrasilitFieldTech
   ```

2. Estrutura de diretórios necessária:
   ```
   mkdir -p client/src/{components,hooks,layouts,lib,pages,shared}
   mkdir -p server
   mkdir -p shared
   ```

## Passo 2: Arquivos Essenciais para Copiar

### Configuração principal

Copie estes arquivos para a raiz do projeto:

- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `tailwind.config.ts`
- `postcss.config.js`
- `theme.json`
- `drizzle.config.ts`

### Servidor (pasta `/server`)

Copie estes arquivos para a pasta `server/`:

- `server/index.ts`
- `server/routes.ts`
- `server/storage.ts`
- `server/vite.ts`

### Schemas compartilhados (pasta `/shared`)

Copie estes arquivos para a pasta `shared/`:

- `shared/schema.ts`
- `shared/farReportSchema.ts`
- `shared/relatorioVistoriaSchema.ts`

### Cliente (pasta `/client`)

Para a estrutura do cliente, copie os arquivos principais:

- `client/index.html`
- `client/src/App.tsx`
- `client/src/main.tsx`
- `client/src/index.css`

## Passo 3: Componentes do Cliente

A estrutura do cliente está organizada em várias subpastas dentro de `client/src/`:

1. **Componentes**: Copie os arquivos de `client/src/components/` para sua nova estrutura
2. **Hooks**: Copie os arquivos de `client/src/hooks/` para sua nova estrutura
3. **Layouts**: Copie os arquivos de `client/src/layouts/` para sua nova estrutura
4. **Lib**: Copie os arquivos de `client/src/lib/` para sua nova estrutura
5. **Pages**: Copie os arquivos de `client/src/pages/` para sua nova estrutura
6. **Shared**: Copie os arquivos de `client/src/shared/` para sua nova estrutura

## Passo 4: Instalação e Execução Manual

1. Instale as dependências:
   ```
   npm install
   ```

2. Inicie o projeto:
   ```
   npm run dev
   ```

## Lista de Verificação

Confirme que você tem os arquivos essenciais:

- [ ] Arquivo package.json na raiz
- [ ] Estrutura completa de diretórios (client, server, shared)
- [ ] Arquivos de configuração (tsconfig.json, vite.config.ts, etc.)
- [ ] Componentes de UI no diretório correto
- [ ] Páginas no diretório correto
- [ ] Hooks e utilitários no diretório correto
- [ ] Schemas de dados compartilhados

## Alternativa: Copiando Diretórios Inteiros

Se você tiver acesso ao projeto completo, considere simplesmente copiar os diretórios principais:

```
cp -r /caminho/para/essential_project/client .
cp -r /caminho/para/essential_project/server .
cp -r /caminho/para/essential_project/shared .
cp /caminho/para/essential_project/*.* .
```

## Solução de Problemas

### Erros de Módulo não Encontrado

Se você encontrar erros de módulo não encontrado ao iniciar o projeto:

1. Verifique se todas as dependências estão no package.json
2. Execute `npm install` novamente
3. Confirme que a estrutura de diretórios está exatamente igual à original

### Erros de Importação

Se você encontrar erros de importação no código:

1. Verifique os caminhos de importação (eles são relativos à estrutura do projeto)
2. Confirme que os arquivos estão no local correto
3. Verifique se tsconfig.json tem as configurações de path mapping corretas
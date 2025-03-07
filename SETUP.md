# Guia de Configuração do BrasilitAI

Este guia explica como configurar e iniciar o projeto BrasilitAI em seu ambiente local.

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados:

- Node.js (versão 18.x ou superior)
- npm (versão 9.x ou superior)
- Git

## Passos para Configuração

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/brasilitai.git
cd brasilitai
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
# Configurações do Servidor
PORT=5000
NODE_ENV=development

# Configuração do Banco de Dados (se estiver usando um banco externo)
DATABASE_URL=postgresql://user:password@localhost:5432/brasilitai
```

### 4. Configure o Banco de Dados (Opcional)

Se você estiver usando um banco de dados PostgreSQL, crie o banco e execute as migrações:

```bash
npx drizzle-kit push:pg
```

### 5. Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

Isso iniciará o servidor Express no backend e o servidor Vite para o frontend. A aplicação estará disponível em: 

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Modo de Produção

Para construir a aplicação para produção:

```bash
npm run build
```

Para iniciar o servidor em modo de produção:

```bash
npm start
```

## Estrutura do Projeto

- `client/`: Código do frontend React
- `server/`: Código do backend Express
- `shared/`: Código compartilhado (schemas, tipos, etc.)

## Testes

Para executar os testes:

```bash
npm test
```

## Resolução de Problemas

### Erro de Conexão com Banco de Dados

Verifique se:
- O PostgreSQL está rodando
- As credenciais no `.env` estão corretas
- O banco de dados existe

### Erro no Servidor Frontend

- Verifique os logs no console
- Certifique-se de que as portas 5000 e 5173 não estão em uso por outros aplicativos

### Problemas de Dependências

Se encontrar problemas com dependências:

```bash
rm -rf node_modules
npm clean-cache
npm install
```

## Próximos Passos

Após a configuração bem-sucedida:

1. Faça login com as credenciais padrão (usuário: admin, senha: admin)
2. Explore o dashboard e os recursos disponíveis
3. Tente criar uma visita técnica e gerar um relatório
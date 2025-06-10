# ConnectBridge - Sistema de Relatórios de Vistoria Técnica

Sistema completo para geração de relatórios de vistoria técnica para telhas Brasilit/Saint-Gobain, desenvolvido com React, TypeScript e Node.js.

## 📋 Funcionalidades

- ✅ **Formulário Completo**: Interface moderna para preenchimento de dados de vistoria
- ✅ **14 Não Conformidades**: Banco de dados completo com textos técnicos detalhados
- ✅ **Geração de DOCX**: Exportação automática para documentos Word formatados
- ✅ **Validação de Dados**: Validação completa com React Hook Form e Zod
- ✅ **Upload de Fotos**: Inserção de evidências fotográficas nos relatórios
- ✅ **Preview de Relatório**: Visualização antes da exportação final
- ✅ **Integração com Clientes**: Sistema completo de gestão de visitas e clientes

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes de interface
- **React Hook Form** + **Zod** para validação
- **Wouter** para roteamento
- **docx** para geração de documentos Word

### Backend
- **Node.js** + **Express**
- **SQLite** com **Drizzle ORM**
- **TypeScript** end-to-end

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/[SEU-USUARIO]/connectbridge.git
cd connectbridge

# Instale as dependências
npm install

# Configure o banco de dados
npm run db:generate
npm run db:migrate

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build de produção
npm run db:generate  # Gera migrations do banco
npm run db:migrate   # Executa migrations
npm run db:studio    # Abre interface do banco de dados
```

## 🏗️ Estrutura do Projeto

```
ConnectBridge/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── lib/          # Utilitários e geradores
│   │   └── styles/       # Estilos globais
├── server/                # Backend Node.js/Express
├── shared/               # Tipos e schemas compartilhados
├── attached_assets/      # Documentação e especificações
└── drizzle/             # Configurações do banco de dados
```

## 📋 Como Usar o Sistema de Relatórios

### 1. Acesso ao Sistema
- Navegue até `/relatorio-vistoria`
- Preencha todos os campos obrigatórios

### 2. Campos Obrigatórios

#### Informações Básicas:
- Data de vistoria
- Nome do cliente  
- Tipo de empreendimento
- Cidade e estado
- Endereço completo
- Protocolo FAR
- Assunto da vistoria

#### Informações da Equipe:
- Técnico responsável
- Departamento (padrão: "Assistência Técnica")
- Unidade e regional
- Coordenador e gerente responsáveis

#### Informações do Produto:
- Modelo da telha (Ondulada 5mm/6mm/8mm CRFS, Estrutural)
- Quantidade de telhas
- Área coberta em m²

### 3. Não Conformidades
- Selecione pelo menos uma das 14 não conformidades disponíveis
- Cada não conformidade possui texto técnico detalhado conforme normas ABNT
- Upload de fotos como evidência (opcional)

### 4. Geração do Relatório
- Clique em "Gerar Relatório"
- O sistema gerará um documento DOCX formatado
- Download automático do arquivo

## 📄 Estrutura do Relatório Gerado

O relatório segue a estrutura técnica oficial:

1. **Cabeçalho**: Informações do cliente e protocolo
2. **Introdução**: Texto padrão sobre telhas Brasilit/CRFS
3. **Dados do Produto**: Especificações técnicas em tabela
4. **Análise Técnica**: Descrição detalhada das não conformidades encontradas
5. **Conclusão**: Lista de não conformidades + resultado (sempre "IMPROCEDENTE")
6. **Assinatura**: Saint-Gobain do Brasil - Assistência Técnica

## 🔧 Configuração de Desenvolvimento

### Banco de Dados
O projeto usa SQLite com Drizzle ORM. Para resetar o banco:

```bash
rm -f database.sqlite
npm run db:generate
npm run db:migrate
```

### Variáveis de Ambiente
Copie o arquivo de exemplo e configure suas variáveis:

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
```

#### Configurações Principais:
```env
# Banco de Dados (escolha uma opção)
DATABASE_URL="file:./database.sqlite"                    # SQLite (desenvolvimento)
# DATABASE_URL="postgresql://user:pass@localhost:5432/db" # PostgreSQL (produção)

# Servidor
PORT=5000
NODE_ENV=development

# Segurança (ALTERE EM PRODUÇÃO!)
JWT_SECRET="sua-chave-jwt-secreta-minimo-32-caracteres"
SESSION_SECRET="sua-chave-sessao-secreta-minimo-32-caracteres"

# Upload de Arquivos
UPLOAD_MAX_SIZE=10485760  # 10MB
UPLOAD_ALLOWED_TYPES="image/jpeg,image/png,image/gif,application/pdf"
```

> ⚠️ **Importante**: Nunca commite o arquivo `.env` com dados sensíveis. Use `.env.example` como template.

## 📋 Não Conformidades Técnicas

O sistema inclui as 14 não conformidades padrão para telhas de fibrocimento:

1. Armazenagem Incorreta
2. Carga Permanente sobre as Telhas  
3. Corte de Canto Incorreto ou Ausente
4. Estrutura Desalinhada
5. Fixação Irregular das Telhas
6. Inclinação da Telha Inferior ao Recomendado
7. Marcas de Caminhamento sobre o Telhado
8. Balanço Livre do Beiral Incorreto
9. Número de Apoios e Vão Livre Inadequados
10. Recobrimento Incorreto
11. Sentido de Montagem Incorreto
12. Uso de Cumeeira Cerâmica
13. Uso de Argamassa em Substituição a Peças Complementares
14. Fixação de Acessórios Complementares Realizada de Forma Inadequada

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:
- Abra uma issue no GitHub
- Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido para Saint-Gobain do Brasil - Assistência Técnica**

# Instruções para Uso do BrasilitFieldTech no Bolt

Este documento fornece orientações específicas para a utilização da aplicação BrasilitFieldTech em ambientes de IA como o Bolt.

## Restrições e Alternativas

O ambiente Bolt pode ter restrições de escrita em determinados arquivos e diretórios por motivos de segurança. Caso encontre mensagens como:

```
This message was terminated to preserve your tokens because Bolt attempted to write to restricted files.
```

Siga as alternativas abaixo:

## Como Utilizar o Código de Forma Eficiente

1. **Análise da Estrutura**: Solicite à IA para analisar a estrutura do projeto sem tentar modificar arquivos:
   ```
   Por favor, analise a estrutura do projeto BrasilitFieldTech e me explique como ele funciona.
   ```

2. **Exploração de Componentes Específicos**: Peça à IA para explicar partes específicas do código:
   ```
   Pode me explicar como funciona o sistema de sincronização offline da aplicação?
   ```

3. **Geração de Novo Código**: Em vez de modificar arquivos existentes, peça à IA para gerar código novo que você pode copiar:
   ```
   Gere um novo componente React para exibir um gráfico de performance baseado no modelo atual do projeto.
   ```

## Alternativas para Operações Restritas

1. **Em vez de zip/download**:
   - Peça à IA para listar os arquivos mais importantes que você deve copiar manualmente
   - Exporte seções específicas de código que você precisa

2. **Em vez de criar arquivos diretamente**:
   - Solicite que a IA gere o conteúdo que você pode copiar e colar em arquivos criados manualmente

3. **Em vez de modificar configurações**:
   - Peça à IA para gerar instruções passo a passo que você pode seguir manualmente

## Comandos Seguros para Análise

Estes comandos geralmente são permitidos e podem ajudar a explorar o projeto:

```
# Listar arquivos e diretórios
ls -la

# Ver conteúdo de um arquivo
cat arquivo.js

# Procurar padrões em arquivos
grep -r "função" --include="*.js" .

# Ver estatísticas de código
find . -type f -name "*.ts" | wc -l
```

## Exemplos de Perguntas Eficientes para o Bolt

1. "Qual é a estrutura principal do projeto BrasilitFieldTech?"
2. "Como funciona o sistema de relatórios no projeto?"
3. "Gere um novo componente para visualização de dados de inspeção"
4. "Explique o fluxo de autenticação usado na aplicação"
5. "Quais são as principais APIs implementadas no servidor?"

## Alternativas para Testes

Como o Bolt não pode executar o código diretamente, considere:

1. Copiar o código gerado para um ambiente local ou Replit
2. Verificar a lógica do código através de revisão em vez de execução
3. Pedir à IA para explicar detalhadamente como o código deve funcionar

## Documentação do Projeto

Consulte os seguintes arquivos para entender o projeto:

- `README.md`: Visão geral do projeto
- `AI-INSTRUCTIONS.md`: Instruções específicas para IAs
- `CODE-MAP.md`: Mapa estrutural do código
- `AI-MODEL.md`: Modelo detalhado de dados e operações
# Instruções de Implementação

Este documento explica como implementar o sistema de geração de relatórios de vistoria técnica utilizando os arquivos fornecidos.

## Arquivos Fornecidos

1. **especificacao-sistema.md**
   - Descrição completa do sistema e seus requisitos
   - Estrutura de dados necessária
   - Fluxo de funcionamento

2. **banco-nao-conformidades.json**
   - Banco de dados com todas as 14 não conformidades
   - Inclui ID, título e texto completo de cada item

3. **template-relatorio.txt**
   - Template do relatório com marcadores para substituição
   - Contém a estrutura exata do documento final

4. **exemplo-relatorio-preenchido.txt**
   - Exemplo de um relatório já preenchido com dados reais
   - Serve como referência visual para o resultado esperado

## Passos para Implementação

### 1. Criar o Formulário de Entrada de Dados

Desenvolva um formulário HTML que capture todos os campos descritos na especificação:
- Informações básicas (cliente, data, etc.)
- Informações da equipe
- Informações do produto
- Seleção de não conformidades (checkboxes)

### 2. Processamento dos Dados

Quando o formulário for submetido:
1. Valide todos os campos obrigatórios
2. Construa um objeto JSON com a estrutura definida na especificação
3. Busque os textos completos das não conformidades selecionadas no banco de dados
4. Construa o conteúdo para as seções de não conformidades:
   - Para a seção "Análise Técnica", use o formato: `**N. Título**\n\nTexto completo`
   - Para a lista na "Conclusão", use o formato: `N. Título`

### 3. Substituição no Template

1. Carregue o template do relatório (template-relatorio.txt)
2. Substitua todos os marcadores entre chaves `{variavel}` pelos valores correspondentes
3. Substitua `{SECAO_NAO_CONFORMIDADES}` pelo texto formatado das não conformidades
4. Substitua `{LISTA_NAO_CONFORMIDADES}` pela lista numerada dos títulos

### 4. Geração do Documento Final

1. Converta o texto processado para formato DOCX
2. Preserve a formatação (negrito, quebras de linha, etc.)
3. Disponibilize o documento para download

## Observações Importantes

- **Formatação**: O documento final DEVE manter a formatação exata do original
- **Textos**: Os textos das não conformidades NÃO devem ser alterados em hipótese alguma
- **Marcadores**: Certifique-se de substituir TODOS os marcadores no template
- **Numeração**: As não conformidades devem ser numeradas sequencialmente na ordem em que são selecionadas
- **Validação**: Confirme que pelo menos uma não conformidade foi selecionada

## Tecnologias Recomendadas

Para implementação, você pode utilizar:
- **Frontend**: HTML, CSS e JavaScript
- **Processamento**: JavaScript, Python ou outra linguagem de sua escolha
- **Geração de Documento**: docxtemplater (JavaScript), python-docx (Python), ou equivalente

## Teste da Implementação

1. Preencha o formulário com os dados do exemplo fornecido
2. Gere o documento
3. Compare com o exemplo-relatorio-preenchido.txt para verificar se estão idênticos

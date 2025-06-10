# IMPORTANTE: INSTRUÇÕES SOBRE O FORMULÁRIO

## ATENÇÃO: O FORMULÁRIO DEVE COLETAR APENAS OS DADOS VARIÁVEIS!

O formulário NÃO deve incluir campos para os textos fixos como introdução, conclusão, análise técnica ou qualquer outro texto que já está no template. Esses textos são FIXOS e NÃO MUDAM entre relatórios.

## O QUE NÃO DEVE TER NO FORMULÁRIO:
- Campos para introdução
- Campos para texto de conclusão 
- Campos para o texto inicial da análise técnica
- Campos para textos de não conformidades (esses textos vêm do JSON)
- Qualquer outro texto que já esteja definido no template

## O FORMULÁRIO DEVE TER APENAS:

1. **Informações Básicas** (dataVistoria, cliente, empreendimento, etc.)
2. **Informações da Equipe** (tecnico, departamento, unidade, etc.)
3. **Informações do Produto** (modeloTelha, quantidadeTelhas, areaCoberta)
4. **Checkboxes para selecionar** as não conformidades encontradas

## COMO FUNCIONA:

1. O usuário preenche APENAS os campos variáveis no formulário
2. O usuário seleciona quais não conformidades foram encontradas (checkboxes)
3. Quando o usuário clica em "Gerar Relatório":
   - O sistema pega o template completo com todos os textos fixos
   - Substitui apenas as variáveis (marcadas com {variavel}) pelos valores do formulário
   - Insere os textos das não conformidades selecionadas nas seções apropriadas
   - Gera o documento final

## EXEMPLO CLARO:

- No template temos: "**Data de vistoria:** {dataVistoria}"
- No formulário: apenas um campo para o usuário inserir a data
- No documento final: "**Data de vistoria:** 18/02/2025"

O FORMULÁRIO É APENAS PARA COLETAR OS DADOS QUE MUDAM DE UM RELATÓRIO PARA OUTRO. TODOS OS TEXTOS FIXOS JÁ ESTÃO NO TEMPLATE E NÃO DEVEM SER EDITÁVEIS!
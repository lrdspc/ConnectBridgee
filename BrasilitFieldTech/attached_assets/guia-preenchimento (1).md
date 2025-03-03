# Guia de Preenchimento do Modelo de Relatório de Vistoria Técnica

Este documento explica como utilizar o modelo de relatório para criar formulários automáticos. Os campos marcados entre colchetes ([CAMPO]) devem ser substituídos pelos dados reais.

## Campos para Preenchimento Automático

### Informações do Cabeçalho
- **[DATA_VISTORIA]**: Data em que a vistoria foi realizada (formato DD/MM/AAAA)
- **[NOME_CLIENTE]**: Nome completo do cliente
- **[TIPO_EMPREENDIMENTO]**: Tipo do empreendimento (Residencial, Comercial, Industrial, etc.)
- **[CIDADE]**: Nome da cidade
- **[UF]**: Sigla do estado
- **[ENDERECO]**: Endereço completo da edificação
- **[PROTOCOLO]**: Número do protocolo ou FAR
- **[ASSUNTO]**: Descrição resumida do problema (ex: AT - BRA - PERMEABILIDADE - Telhado com vazamento Geral)
- **[NOME_TECNICO]**: Nome do técnico responsável pela vistoria
- **[DEPARTAMENTO]**: Departamento do técnico (ex: Assistência Técnica)
- **[UNIDADE]**: Unidade regional (ex: PR)
- **[NOME_COORDENADOR]**: Nome do coordenador responsável
- **[NOME_GERENTE]**: Nome do gerente responsável
- **[REGIONAL]**: Nome da regional (ex: Sul)

### Informações Técnicas do Produto
- **[ESPESSURA]**: Espessura da telha em mm (geralmente 5 ou 6)
- **[MODELO_TELHA]**: Modelo específico da telha (ex: Ondulada)
- **[ANOS_GARANTIA]**: Anos de garantia padrão (geralmente 5)
- **[ANOS_GARANTIA_SISTEMA_COMPLETO]**: Anos de garantia para sistema completo (geralmente 10)
- **[QUANTIDADE]**: Quantidade de telhas
- **[AREA]**: Área coberta aproximada em m²

### Campos de Verificação (Checkboxes)
Para cada um dos 14 itens de não conformidade, utilizar:
- **[CHECKBOX_X]**: Substitua por "☒" se o problema foi encontrado ou "☐" se não foi encontrado
- **[RESULTADO_CHECKBOX_X]**: Substitua por "✓" se o problema foi confirmado ou deixe em branco se não foi confirmado

### Conclusão
- **[RESULTADO_RECLAMACAO]**: Resultado final da análise (ex: IMPROCEDENTE, PROCEDENTE)
- **[ANOS_GARANTIA_TOTAL]**: Anos totais de garantia do produto (geralmente 10)
- **[ASSINATURA_TECNICO]**: Campo para assinatura digital ou nome e cargo do técnico responsável

## Instruções para Implementação
1. Para criar um formulário automático, substitua todos os campos entre colchetes por controles de formulário ou campos variáveis
2. Os campos do tipo [CHECKBOX_X] podem ser substituídos por caixas de seleção reais no Word
3. Campos como data e informações do cliente podem ser vinculados a um banco de dados ou entrada de usuário
4. Para automatizar a conclusão, vincule os campos [RESULTADO_CHECKBOX_X] ao estado dos respectivos [CHECKBOX_X]

## Exemplo de Preenchimento
- **[DATA_VISTORIA]** → 22/02/2025
- **[NOME_CLIENTE]** → Cliente Teste
- **[CHECKBOX_1]** → ☒ (marcado)
- **[RESULTADO_CHECKBOX_1]** → ✓ (confirmado na conclusão)
- **[RESULTADO_RECLAMACAO]** → IMPROCEDENTE

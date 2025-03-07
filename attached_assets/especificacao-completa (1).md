# Especificação do Sistema de Geração de Relatórios de Vistoria Técnica

## Objetivo
Criar um sistema que gere relatórios de vistoria técnica para telhas Brasilit no formato idêntico ao modelo de referência, a partir de um formulário com campos específicos.

## Componentes Necessários

### 1. Formulário de Entrada de Dados

O formulário deve coletar as seguintes informações:

#### Informações Básicas
- Data de vistoria (obrigatório)
- Nome do cliente (obrigatório)
- Tipo de empreendimento (Residencial, Comercial, Industrial) (obrigatório)
- Cidade (obrigatório)
- Estado (padrão: PR) (obrigatório)
- Endereço (obrigatório)
- Protocolo FAR (obrigatório)
- Assunto (obrigatório)

#### Informações da Equipe
- Técnico responsável (obrigatório)
- Departamento (padrão: "Assistência Técnica") (obrigatório)
- Unidade (padrão: "PR") (obrigatório)
- Coordenador responsável (padrão: "Marlon Weingartner") (obrigatório)
- Gerente responsável (padrão: "Elisabete Kudo") (obrigatório)
- Regional (padrão: "Sul") (obrigatório)

#### Informações do Produto
- Modelo da telha (selecionar entre: "Ondulada 5mm CRFS", "Ondulada 6mm CRFS", "Ondulada 8mm CRFS", "Estrutural") (obrigatório)
- Quantidade de telhas (obrigatório)
- Área coberta em m² (obrigatório)

#### Não Conformidades
- Lista de checkboxes para seleção múltipla, contendo as 14 não conformidades (pelo menos uma deve ser selecionada)

### 2. Processador de Dados

O sistema deve:
1. Validar todos os campos obrigatórios
2. Formatar a data no padrão brasileiro (DD/MM/AAAA)
3. Processar as não conformidades selecionadas
4. Obter os textos completos para cada não conformidade selecionada
5. Gerar o documento final substituindo as variáveis no template

### 3. Gerador de Documentos

O sistema deve ser capaz de:
1. Substituir todas as variáveis no template pelos valores fornecidos
2. Inserir os textos completos de cada não conformidade selecionada na seção "Análise Técnica"
3. Listar os títulos das não conformidades selecionadas na seção "Conclusão"
4. Gerar um documento final no formato DOCX, mantendo a formatação original

## Estrutura de Dados

### Objeto JSON para envio ao processador

```json
{
  "informacoesBasicas": {
    "dataVistoria": "2025-02-18", // Formato do input date, será convertido para DD/MM/AAAA
    "cliente": "Cliente Teste",
    "empreendimento": "Residencial",
    "cidade": "Sarandi",
    "estado": "PR",
    "endereco": "Rua de Teste, 123",
    "protocolo": "TST-1739869627147",
    "assunto": "AT - BRA - PERMEABILIDADE - Telhado com vazamento Geral"
  },
  "equipe": {
    "tecnico": "Técnico Teste",
    "departamento": "Assistência Técnica",
    "unidade": "PR",
    "coordenador": "Marlon Weingartner",
    "gerente": "Elisabete Kudo", 
    "regional": "Sul"
  },
  "produto": {
    "modeloTelha": "Ondulada 6mm CRFS",
    "quantidadeTelhas": 100,
    "areaCoberta": "120"
  },
  "naoConformidades": [1, 2, 3, 4] // IDs das não conformidades selecionadas
}
```

## Fluxo do Sistema

1. Usuário preenche o formulário com todos os dados necessários
2. Sistema valida os dados
3. Sistema processa os dados, obtendo os textos completos das não conformidades
4. Sistema substitui as variáveis no template
5. Sistema gera o documento DOCX
6. Usuário recebe o documento para download

## Observações Importantes

- A formatação do documento final deve ser idêntica ao modelo de referência
- Os textos das não conformidades não devem ser alterados
- O resultado da análise sempre será "IMPROCEDENTE"
- O documento final deve conter o texto exato conforme o template, com as variáveis substituídas

# TESTE DO SISTEMA DE RELATÓRIO DE VISTORIA TÉCNICA

## Checklist de Verificação

### 1. Acesso ao Sistema
- [ ] Acessar http://localhost:5000/relatorio-vistoria
- [ ] Verificar se a página carrega sem erros
- [ ] Confirmar se todos os campos estão visíveis

### 2. Preenchimento dos Campos Obrigatórios

#### Informações Básicas:
- [ ] Data de vistoria
- [ ] Nome do cliente
- [ ] Tipo de empreendimento (Residencial/Comercial/Industrial)
- [ ] Cidade
- [ ] Estado (padrão PR)
- [ ] Endereço
- [ ] Protocolo FAR
- [ ] Assunto

#### Informações da Equipe:
- [ ] Técnico responsável
- [ ] Departamento (padrão: "Assistência Técnica")
- [ ] Unidade (padrão: "PR")
- [ ] Coordenador (padrão: "Marlon Weingartner")
- [ ] Gerente (padrão: "Elisabete Kudo")
- [ ] Regional (padrão: "Sul")

#### Informações do Produto:
- [ ] Modelo da telha (Ondulada 5mm/6mm/8mm CRFS, Estrutural)
- [ ] Quantidade de telhas
- [ ] Área coberta em m²

#### Não Conformidades:
- [ ] Lista com 14 checkboxes disponíveis
- [ ] Validação de pelo menos uma selecionada
- [ ] Textos completos corretos para cada não conformidade

### 3. Geração do Relatório

#### Teste 1 - Dados Básicos:
```
Cliente: Cliente Teste
Data: 18/02/2025
Empreendimento: Residencial
Cidade: Sarandi
Estado: PR
Endereço: Rua de Teste, 123
Protocolo: TST-1739869627147
Assunto: AT - BRA - PERMEABILIDADE - Telhado com vazamento Geral
Técnico: Técnico Teste
Modelo: Ondulada 6mm CRFS
Quantidade: 100
Área: 120m²
```

#### Não conformidades para teste:
- [ ] Selecionar: 1, 2, 3 (primeiras três)
- [ ] Gerar relatório
- [ ] Verificar download do DOCX

### 4. Verificação do Documento Gerado

#### Estrutura do documento:
- [ ] Cabeçalho com informações corretas
- [ ] Seção 1: INTRODUÇÃO (texto fixo correto)
- [ ] Seção 1.1: DADOS DO PRODUTO (tabela formatada)
- [ ] Seção 2: ANÁLISE TÉCNICA (texto introdutório + não conformidades)
- [ ] Seção 2.1: NÃO CONFORMIDADES IDENTIFICADAS (numeradas)
- [ ] Seção 3: CONCLUSÃO (lista + texto padrão IMPROCEDENTE)
- [ ] Assinatura da empresa

#### Verificar textos das não conformidades:
- [ ] **1. Armazenagem Incorreta** - texto completo correto
- [ ] **2. Carga Permanente sobre as Telhas** - texto completo correto  
- [ ] **3. Corte de Canto Incorreto ou Ausente** - texto completo correto

#### Verificar conclusão:
- [ ] Lista numerada: "1. Armazenagem Incorreta", "2. Carga Permanente...", "3. Corte de Canto..."
- [ ] Texto: "...considerando a reclamação como **IMPROCEDENTE**..."
- [ ] Informações de garantia corretas

### 5. Testes de Validação

#### Campos obrigatórios:
- [ ] Tentar gerar sem preencher campos obrigatórios
- [ ] Verificar mensagens de erro
- [ ] Tentar gerar sem selecionar não conformidades
- [ ] Confirmar validação funciona

#### Diferentes cenários:
- [ ] Testar com todas as 14 não conformidades selecionadas
- [ ] Testar com apenas 1 não conformidade
- [ ] Testar com dados diferentes de cliente

### 6. Problemas Identificados
(Anotar aqui qualquer problema encontrado durante os testes)

- [ ] Problema 1: ________________
- [ ] Problema 2: ________________
- [ ] Problema 3: ________________

### 7. Conformidade com Especificação Original

- [ ] O resultado sempre é "IMPROCEDENTE"
- [ ] Textos fixos são idênticos à especificação
- [ ] Formatação do documento é correta
- [ ] Estrutura de seções está correta
- [ ] Não conformidades aparecem na ordem correta
- [ ] Lista de conclusão contém apenas títulos

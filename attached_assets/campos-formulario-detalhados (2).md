# CAMPOS DO FORMULÁRIO - INSTRUÇÕES DETALHADAS

## LISTA COMPLETA DE TODOS OS CAMPOS QUE DEVEM ESTAR NO FORMULÁRIO

O formulário deve conter APENAS os seguintes campos para coleta de dados variáveis. NADA MAIS deve ser incluído.

### SEÇÃO 1: INFORMAÇÕES BÁSICAS

1. **Data de Vistoria** (dataVistoria)
   - Campo tipo: data
   - Formato a ser exibido no relatório final: DD/MM/AAAA
   - Obrigatório: Sim

2. **Nome do Cliente** (cliente)
   - Campo tipo: texto
   - Obrigatório: Sim

3. **Tipo de Empreendimento** (empreendimento)
   - Campo tipo: seleção/dropdown
   - Opções: "Residencial", "Comercial", "Industrial"
   - Obrigatório: Sim

4. **Cidade** (cidade)
   - Campo tipo: texto
   - Obrigatório: Sim

5. **Estado** (estado)
   - Campo tipo: texto
   - Valor padrão: "PR"
   - Obrigatório: Sim

6. **Endereço** (endereco)
   - Campo tipo: texto
   - Obrigatório: Sim

7. **Protocolo FAR** (protocolo)
   - Campo tipo: texto
   - Obrigatório: Sim

8. **Assunto** (assunto)
   - Campo tipo: texto
   - Obrigatório: Sim

### SEÇÃO 2: INFORMAÇÕES DA EQUIPE

9. **Técnico Responsável** (tecnico)
   - Campo tipo: texto
   - Obrigatório: Sim

10. **Departamento** (departamento)
    - Campo tipo: texto
    - Valor padrão: "Assistência Técnica"
    - Obrigatório: Sim

11. **Unidade** (unidade)
    - Campo tipo: texto
    - Valor padrão: "PR"
    - Obrigatório: Sim

12. **Coordenador Responsável** (coordenador)
    - Campo tipo: texto
    - Valor padrão: "Marlon Weingartner"
    - Obrigatório: Sim

13. **Gerente Responsável** (gerente)
    - Campo tipo: texto
    - Valor padrão: "Elisabete Kudo"
    - Obrigatório: Sim

14. **Regional** (regional)
    - Campo tipo: texto
    - Valor padrão: "Sul"
    - Obrigatório: Sim

### SEÇÃO 3: INFORMAÇÕES DO PRODUTO

15. **Modelo da Telha** (modeloTelha)
    - Campo tipo: seleção/dropdown
    - Opções: "Ondulada 5mm CRFS", "Ondulada 6mm CRFS", "Ondulada 8mm CRFS", "Estrutural"
    - Valor padrão: "Ondulada 6mm CRFS"
    - Obrigatório: Sim

16. **Quantidade de Telhas** (quantidadeTelhas)
    - Campo tipo: número
    - Obrigatório: Sim

17. **Área Coberta** (areaCoberta)
    - Campo tipo: texto (para permitir número com casas decimais)
    - Obrigatório: Sim

### SEÇÃO 4: NÃO CONFORMIDADES

18. **Lista de Não Conformidades** (naoConformidades)
    - Campo tipo: checkboxes (múltipla escolha)
    - 14 opções (uma para cada não conformidade do arquivo JSON)
    - Pelo menos uma opção deve ser selecionada
    - Para cada opção:
      - Título visível no formulário (ex: "1. Armazenagem Incorreta")
      - Breve descrição visível no formulário
      - Valor interno (ID) da não conformidade (1 a 14)

## CAMPOS QUE NÃO DEVEM ESTAR NO FORMULÁRIO

ATENÇÃO: Os seguintes elementos NÃO devem estar presentes como campos do formulário:

1. Título do relatório ("RELATÓRIO DE VISTORIA TÉCNICA")
2. Campo para texto de introdução
3. Campo para texto de análise técnica
4. Campo para texto completo das não conformidades
5. Campo para texto de conclusão
6. Campos para textos de rodapé e assinatura da empresa

Todos esses textos já estão no template do relatório e não devem ser editáveis!

## COMO O FORMULÁRIO DEVE FUNCIONAR

1. Quando o usuário preencher todos os campos obrigatórios e selecionar pelo menos uma não conformidade, o botão "Gerar Relatório" ficará ativo.

2. Ao clicar em "Gerar Relatório", o sistema deve:
   - Validar se todos os campos obrigatórios foram preenchidos
   - Coletar todos os valores inseridos
   - Obter os textos completos das não conformidades selecionadas do arquivo JSON
   - Usar o template para gerar o documento final

3. O sistema deve então disponibilizar o documento para download.

## EXEMPLO DE PROCESSAMENTO DE DADOS

Por exemplo, se o usuário selecionou as não conformidades 1, 2 e 3:

1. O sistema busca os textos completos dessas não conformidades no JSON
2. Para a seção "Análise Técnica", o sistema insere cada não conformidade no formato:
   ```
   **1. Armazenagem Incorreta**
   
   [Texto completo da não conformidade 1]
   
   **2. Carga Permanente sobre as Telhas**
   
   [Texto completo da não conformidade 2]
   
   **3. Corte de Canto Incorreto ou Ausente**
   
   [Texto completo da não conformidade 3]
   ```

3. Para a seção "Conclusão", o sistema insere uma lista numerada:
   ```
   1. Armazenagem Incorreta
   
   2. Carga Permanente sobre as Telhas
   
   3. Corte de Canto Incorreto ou Ausente
   ```

Os demais campos são simplesmente substituídos no template nas posições marcadas com {variavel}.

## IMPORTANTE

O formulário serve APENAS para coletar os dados que serão substituídos no template. Não tente recriar os textos fixos que já existem no template!

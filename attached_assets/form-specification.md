# Especificação para Geração de Relatório de Vistoria Técnica

Esta especificação detalha os requisitos exatos para criar um sistema que gere relatórios de vistoria técnica idênticos ao modelo fornecido.

## 1. Estrutura de Dados

O relatório deve ser gerado a partir de um objeto JSON com a seguinte estrutura:

```json
{
  "informacoesBasicas": {
    "dataVistoria": "18/02/2025",
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
    "modelo": "Ondulada 6mm CRFS",
    "quantidade": 100,
    "areaCoberta": "[ÁREA]"
  },
  "naoConformidades": [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
  ]
}
```

## 2. Campos Obrigatórios do Formulário

### Informações Básicas
| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| dataVistoria | Data | Data em que a vistoria foi realizada | 18/02/2025 |
| cliente | Texto | Nome do cliente | Cliente Teste |
| empreendimento | Texto | Tipo de empreendimento | Residencial |
| cidade | Texto | Cidade do empreendimento | Sarandi |
| estado | Texto | Estado do empreendimento (sigla) | PR |
| endereco | Texto | Endereço completo | Rua de Teste, 123 |
| protocolo | Texto | Número do protocolo ou FAR | TST-1739869627147 |
| assunto | Texto | Descrição do problema | AT - BRA - PERMEABILIDADE - Telhado com vazamento Geral |

### Informações da Equipe
| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| tecnico | Texto | Nome do técnico responsável | Técnico Teste |
| departamento | Texto | Departamento responsável | Assistência Técnica |
| unidade | Texto | Unidade de atendimento | PR |
| coordenador | Texto | Nome do coordenador | Marlon Weingartner |
| gerente | Texto | Nome do gerente | Elisabete Kudo |
| regional | Texto | Regional responsável | Sul |

### Informações do Produto
| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| modelo | Texto | Modelo da telha | Ondulada 6mm CRFS |
| quantidade | Número | Quantidade de telhas | 100 |
| areaCoberta | Texto/Número | Área coberta em m² | [ÁREA] |

### Não Conformidades
Lista de IDs das não conformidades identificadas. O sistema deve ter um banco de dados com os textos completos para cada tipo de não conformidade.

## 3. Banco de Dados de Não Conformidades

O sistema deve conter um banco de dados com as descrições completas de cada tipo de não conformidade. Cada entrada deve conter:

| ID | Título | Texto Completo |
|----|--------|----------------|
| 1 | Armazenagem Incorreta | Durante a inspeção, foi constatado que as telhas estão sendo armazenadas de forma inadequada, em desacordo com as recomendações técnicas do fabricante. As telhas BRASILIT devem ser armazenadas em local plano, firme, coberto e seco, protegidas das intempéries. O empilhamento deve ser feito horizontalmente, com as telhas apoiadas sobre caibros ou pontaletes de madeira espaçados no máximo a cada 50cm, garantindo um apoio uniforme. A altura máxima da pilha não deve ultrapassar 200 telhas. É fundamental manter uma distância mínima de 1 metro entre as pilhas para facilitar a circulação. O não cumprimento destas diretrizes pode resultar em deformações, trincas ou quebras das telhas, comprometendo sua integridade e desempenho futuro. |
| 2 | Carga Permanente sobre as Telhas | Foi identificada a presença de cargas permanentes não previstas sobre as telhas, incluindo equipamentos, estruturas ou instalações. Esta situação é extremamente prejudicial à integridade do sistema de cobertura, pois as telhas BRASILIT são dimensionadas para suportar apenas as cargas previstas em projeto, como seu próprio peso, a ação dos ventos e eventuais cargas acidentais de manutenção. A sobrecarga permanente pode causar deformações, trincas e até mesmo a ruptura das telhas, além de comprometer a estrutura de apoio. É imprescindível a remoção imediata dessas cargas e, caso necessário, deve-se prever uma estrutura independente para suportar equipamentos ou instalações, seguindo as orientações de um profissional habilitado. |
| etc... | ... | ... |

*Nota: Todos os textos completos das não conformidades devem ser extraídos diretamente do documento original.*

## 4. Estrutura do Documento Gerado

O relatório gerado deve seguir exatamente a seguinte estrutura:

1. **Cabeçalho**
   - Título "RELATÓRIO DE VISTORIA TÉCNICA" em negrito
   - Data, cliente, empreendimento, cidade, endereço, protocolo, assunto

2. **Informações da Equipe**
   - Técnico, departamento, unidade, coordenador, gerente, regional

3. **Introdução**
   - Texto padrão sobre assistência técnica e reclamação
   - Detalhes sobre o modelo de telha (extraído do campo "modelo")

4. **Quantidade e modelo**
   - Quantidade e modelo das telhas
   - Área coberta

5. **Análise Técnica**
   - Texto introdutório padrão
   - Seções numeradas para cada não conformidade identificada

6. **Conclusão**
   - Lista numerada de todas as não conformidades identificadas
   - Texto padrão de encerramento declarando a reclamação como IMPROCEDENTE
   - Informações sobre garantia

7. **Encerramento**
   - Texto de agradecimento
   - Assinatura da empresa

## 5. Textos Fixos

O sistema deve incluir os seguintes textos fixos que aparecem em todos os relatórios:

### Introdução
```
A Área de Assistência Técnica foi solicitada para atender uma reclamação relacionada ao surgimento de infiltrações nas telhas de fibrocimento: - Telha da marca BRASILIT modelo ONDULADA de 5mm, produzidas com tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem amianto - cuja fabricação segue a norma internacional ISO 9933, bem como as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.

Em atenção a vossa solicitação, analisamos as evidências encontradas, para avaliar as manifestações patológicas reclamadas em telhas de nossa marca aplicada em sua cobertura conforme registro de reclamação protocolo FAR {protocolo}.

O modelo de telha escolhido para a edificação foi: {modelo}. Esse modelo, como os demais, possui a necessidade de seguir rigorosamente as orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado --- Brasilit para o melhor desempenho do produto, assim como a garantia do produto coberta por 5 anos (ou dez anos para sistema completo).
```

### Análise Técnica (Introdução)
```
Durante a visita técnica realizada no local, nossa equipe conduziu uma vistoria minuciosa da cobertura, documentando e analisando as condições de instalação e o estado atual das telhas. Após criteriosa avaliação das evidências coletadas em campo, identificamos alguns desvios nos procedimentos de manuseio e instalação em relação às especificações técnicas do fabricante, os quais são detalhados a seguir:
```

### Conclusão (Encerramento)
```
Em função das não conformidades constatadas no manuseio e instalação das chapas Brasilit, finalizamos o atendimento considerando a reclamação como IMPROCEDENTE, onde os problemas reclamados se dão pelo incorreto manuseio e instalação das telhas e não a problemas relacionados à qualidade do material.

As telhas BRASILIT modelo FIBROCIMENTO ONDULADA possuem dez anos de garantia com relação a problemas de fabricação. A garantia Brasilit está condicionada a correta aplicação do produto, seguindo rigorosamente as instruções de instalação contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado --- Brasilit. Este guia técnico está sempre disponível em: http://www.brasilit.com.br.

Ratificamos que os produtos Brasilit atendem as Normas da Associação Brasileira de Normas Técnicas --- ABNT, específicas para cada linha de produto, e cumprimos as exigências legais de garantia de produtos conforme a legislação em vigor.
```

### Assinatura
```
Desde já, agradecemos e nos colocamos à disposição para quaisquer esclarecimentos que se fizerem necessário.

Atenciosamente,

Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.
Divisão Produtos Para Construção
Departamento de Assistência Técnica
```

## 6. Formatação

- O título principal deve estar em negrito e centralizado
- Os subtítulos devem estar em negrito
- As seções de não conformidades devem ser numeradas de 1 a N
- A lista de não conformidades na conclusão deve ser numerada
- O documento deve usar fonte serif (como Times New Roman)
- Espaçamento entre linhas de 1.5
- Margens padrão (2,5cm em todos os lados)

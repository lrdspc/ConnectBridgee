# Template do Documento Final

Este documento define o template exato para gerar o relatório de vistoria técnica. O sistema deve substituir todas as variáveis (indicadas entre chaves `{}`) pelos valores fornecidos no formulário.

## Estrutura Completa do Documento

```
**RELATÓRIO DE VISTORIA TÉCNICA**

**Data de vistoria:** {dataVistoria}

**Cliente:** {cliente}

**Empreendimento:** {empreendimento}

**Cidade:** {cidade} - {estado}

**Endereço:** {endereco}

**FAR/Protocolo:** {protocolo}

**Assunto:** {assunto}

**Elaborado por:** {tecnico}

**Departamento:** {departamento}

**Unidade:** {unidade}

**Coordenador Responsável:** {coordenador}

**Gerente Responsável:** {gerente}

**Regional:** {regional}

**Introdução**

A Área de Assistência Técnica foi solicitada para atender uma reclamação
relacionada ao surgimento de infiltrações nas telhas de fibrocimento: -
Telha da marca BRASILIT modelo ONDULADA de 5mm, produzidas com
tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem
amianto - cuja fabricação segue a norma internacional ISO 9933, bem como
as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.

Em atenção a vossa solicitação, analisamos as evidências encontradas,
para avaliar as manifestações patológicas reclamadas em telhas de nossa
marca aplicada em sua cobertura conforme registro de reclamação
protocolo FAR {protocolo}.

O modelo de telha escolhido para a edificação foi: {modeloTelha}. Esse
modelo, como os demais, possui a necessidade de seguir rigorosamente as
orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento
e Acessórios para Telhado --- Brasilit para o melhor desempenho do
produto, assim como a garantia do produto coberta por 5 anos (ou dez
anos para sistema completo).

**Quantidade e modelo:**

• {quantidadeTelhas}: {modeloTelha}.

• Área coberta: {areaCoberta}m² aproximadamente.

A análise do caso segue os requisitos presentes na norma ABNT NBR 7196:
Telhas de fibrocimento sem amianto --- Execução de coberturas e
fechamentos laterais ---Procedimento e Guia Técnico de Telhas de
Fibrocimento e Acessórios para Telhado --- Brasilit.

**Análise Técnica**

Durante a visita técnica realizada no local, nossa equipe conduziu uma
vistoria minuciosa da cobertura, documentando e analisando as condições
de instalação e o estado atual das telhas. Após criteriosa avaliação das
evidências coletadas em campo, identificamos alguns desvios nos
procedimentos de manuseio e instalação em relação às especificações
técnicas do fabricante, os quais são detalhados a seguir:

{SEÇÃO DE NÃO CONFORMIDADES}

**Conclusão**

Com base na análise técnica realizada, foram identificadas as seguintes
não conformidades:

{LISTA DE NÃO CONFORMIDADES}

Em função das não conformidades constatadas no manuseio e instalação das
chapas Brasilit, finalizamos o atendimento considerando a reclamação
como IMPROCEDENTE, onde os problemas reclamados se dão pelo incorreto
manuseio e instalação das telhas e não a problemas relacionados à
qualidade do material.

As telhas BRASILIT modelo FIBROCIMENTO ONDULADA possuem dez anos de
garantia com relação a problemas de fabricação. A garantia Brasilit está
condicionada a correta aplicação do produto, seguindo rigorosamente as
instruções de instalação contidas no Guia Técnico de Telhas de
Fibrocimento e Acessórios para Telhado --- Brasilit. Este guia técnico
está sempre disponível em: http://www.brasilit.com.br.

Ratificamos que os produtos Brasilit atendem as Normas da Associação
Brasileira de Normas Técnicas --- ABNT, específicas para cada linha de
produto, e cumprimos as exigências legais de garantia de produtos
conforme a legislação em vigor.

Desde já, agradecemos e nos colocamos à disposição para quaisquer
esclarecimentos que se fizerem necessário.

Atenciosamente,

Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.

Divisão Produtos Para Construção

Departamento de Assistência Técnica
```

## Substituição das Seções Dinâmicas

### Seção de Não Conformidades

Para cada não conformidade selecionada no formulário, o sistema deve incluir seu texto completo na seção "{SEÇÃO DE NÃO CONFORMIDADES}" no formato:

```
**1. Armazenagem Incorreta**

Durante a inspeção, foi constatado que as telhas estão sendo armazenadas de forma inadequada, em desacordo com as recomendações técnicas do fabricante. As telhas BRASILIT devem ser armazenadas em local plano, firme, coberto e seco, protegidas das intempéries. O empilhamento deve ser feito horizontalmente, com as telhas apoiadas sobre caibros ou pontaletes de madeira espaçados no máximo a cada 50cm, garantindo um apoio uniforme. A altura máxima da pilha não deve ultrapassar 200 telhas. É fundamental manter uma distância mínima de 1 metro entre as pilhas para facilitar a circulação. O não cumprimento destas diretrizes pode resultar em deformações, trincas ou quebras das telhas, comprometendo sua integridade e desempenho futuro.

**2. Carga Permanente sobre as Telhas**

[Texto completo...]

[...]
```

### Lista de Não Conformidades

Para a seção "{LISTA DE NÃO CONFORMIDADES}" na conclusão, o sistema deve listar apenas os títulos das não conformidades selecionadas, no formato:

```
1. Armazenagem Incorreta

2. Carga Permanente sobre as Telhas

3. Corte de Canto Incorreto ou Ausente

[...]
```

## Notas de Implementação

1. O documento deve ser gerado em formato DOCX, mantendo exatamente a mesma estrutura e formatação do modelo original.

2. Os espaçamentos, quebras de linha e formatação (negrito, itálico) devem ser preservados conforme o modelo original.

3. Todas as variáveis entre chaves `{}` devem ser substituídas pelos valores correspondentes do formulário.

4. As seções de não conformidades devem ser geradas dinamicamente com base nas seleções do usuário no formulário.

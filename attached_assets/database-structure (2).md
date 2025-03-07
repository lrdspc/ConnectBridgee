# Banco de Dados de Não Conformidades

Este documento contém o texto completo para cada tipo de não conformidade que deve ser armazenado no sistema. Cada entrada inclui o ID, título e texto completo exatamente como deve aparecer no relatório final.

## Estrutura de Dados

```javascript
const naoConformidades = [
  {
    id: 1,
    titulo: "Armazenagem Incorreta",
    textoCompleto: "Durante a inspeção, foi constatado que as telhas estão sendo armazenadas de forma inadequada, em desacordo com as recomendações técnicas do fabricante. As telhas BRASILIT devem ser armazenadas em local plano, firme, coberto e seco, protegidas das intempéries. O empilhamento deve ser feito horizontalmente, com as telhas apoiadas sobre caibros ou pontaletes de madeira espaçados no máximo a cada 50cm, garantindo um apoio uniforme. A altura máxima da pilha não deve ultrapassar 200 telhas. É fundamental manter uma distância mínima de 1 metro entre as pilhas para facilitar a circulação. O não cumprimento destas diretrizes pode resultar em deformações, trincas ou quebras das telhas, comprometendo sua integridade e desempenho futuro."
  },
  {
    id: 2,
    titulo: "Carga Permanente sobre as Telhas",
    textoCompleto: "Foi identificada a presença de cargas permanentes não previstas sobre as telhas, incluindo equipamentos, estruturas ou instalações. Esta situação é extremamente prejudicial à integridade do sistema de cobertura, pois as telhas BRASILIT são dimensionadas para suportar apenas as cargas previstas em projeto, como seu próprio peso, a ação dos ventos e eventuais cargas acidentais de manutenção. A sobrecarga permanente pode causar deformações, trincas e até mesmo a ruptura das telhas, além de comprometer a estrutura de apoio. É imprescindível a remoção imediata dessas cargas e, caso necessário, deve-se prever uma estrutura independente para suportar equipamentos ou instalações, seguindo as orientações de um profissional habilitado."
  },
  {
    id: 3,
    titulo: "Corte de Canto Incorreto ou Ausente",
    textoCompleto: "A inspeção revelou que os cortes de canto das telhas não foram executados corretamente ou estão ausentes. O corte de canto é um procedimento técnico obrigatório que consiste na remoção de um quadrado de 11x11cm nos cantos das telhas onde haverá sobreposição. Este procedimento é fundamental para evitar a sobreposição de quatro espessuras de telha em um mesmo ponto, o que criaria um desnível prejudicial ao escoamento da água e à vedação do telhado. A ausência ou execução incorreta do corte de canto pode resultar em infiltrações, goteiras e deterioração precoce do sistema de cobertura. É necessário realizar os cortes seguindo rigorosamente as especificações técnicas do fabricante."
  },
  {
    id: 4,
    titulo: "Estrutura Desalinhada",
    textoCompleto: "Foi constatado que a estrutura de apoio das telhas apresenta desalinhamento significativo em relação aos parâmetros técnicos aceitáveis. Este desalinhamento compromete diretamente o assentamento correto das telhas, afetando o caimento, a sobreposição e a vedação do sistema de cobertura. A estrutura deve estar perfeitamente alinhada e nivelada, com as terças paralelas entre si e perpendiculares à linha de maior caimento do telhado. O desalinhamento pode causar problemas graves como: infiltrações devido à sobreposição irregular das telhas, concentração inadequada de águas pluviais, comprometimento da estética do telhado e possível redução da vida útil do sistema. É necessária a correção do alinhamento da estrutura por profissional habilitado, seguindo as especificações de projeto e as recomendações técnicas do fabricante."
  },
  {
    id: 5,
    titulo: "Fixação Irregular das Telhas",
    textoCompleto: "Durante a vistoria, foi identificado que a fixação das telhas não atende às especificações técnicas do fabricante. A fixação adequada das telhas BRASILIT é fundamental para garantir a segurança e o desempenho do sistema de cobertura. As telhas devem ser fixadas com parafusos com rosca soberba Ø 8mm x 110mm ou ganchos com rosca Ø 8mm, sempre acompanhados de conjunto de vedação (arruela metálica e arruela de vedação em PVC). Os pontos de fixação devem seguir rigorosamente o esquema recomendado pelo fabricante, considerando a 2ª e a 4ª crista de onda nas extremidades e terças intermediárias. O reaperto dos parafusos deve ser verificado periodicamente. A fixação inadequada pode resultar em deslocamento das telhas, infiltrações e, em casos extremos, arrancamento das telhas pela ação dos ventos, comprometendo a segurança dos usuários."
  },
  {
    id: 6,
    titulo: "Inclinação da Telha Inferior ao Recomendado",
    textoCompleto: "A inspeção técnica identificou que a inclinação do telhado está abaixo do mínimo recomendado nas especificações do fabricante. A inclinação é um fator crítico para o desempenho do sistema de cobertura, pois garante o escoamento adequado das águas pluviais e evita o acúmulo de sujeira. Para telhas BRASILIT, a inclinação mínima varia de acordo com o modelo: para telhas onduladas, deve ser de 15° (27%); para telhas estruturais, 10° (17,6%); e para telhas de fibrocimento planas, 25° (46,6%). A inclinação inadequada pode resultar em infiltrações, acúmulo de águas pluviais, proliferação de fungos e algas, e redução significativa da vida útil do telhado. É necessária a adequação da estrutura para atender à inclinação mínima requerida."
  },
  {
    id: 7,
    titulo: "Marcas de Caminhamento sobre o Telhado",
    textoCompleto: "Durante a vistoria, foram identificadas marcas evidentes de caminhamento direto sobre as telhas, caracterizando uso inadequado do sistema de cobertura. As telhas BRASILIT não são projetadas para suportar tráfego direto, mesmo que eventual. O caminhamento incorreto pode causar trincas, deformações e comprometer a integridade das telhas. Para acesso à cobertura durante manutenções ou inspeções, é obrigatório o uso de tábuas ou pranchas apropriadas, apoiadas sobre as terças ou caibros, distribuindo as cargas de maneira adequada. Estas tábuas devem ter largura mínima de 20cm e espessura adequada para suportar o peso sem deformação. É fundamental estabelecer procedimentos seguros de acesso à cobertura e treinar as equipes de manutenção."
  },
  {
    id: 8,
    titulo: "Balanço Livre do Beiral Incorreto",
    textoCompleto: "Foi constatado que o balanço livre do beiral está em desacordo com as especificações técnicas do fabricante. O balanço do beiral é a distância entre a última terça e a extremidade da telha, sendo um elemento crucial para o correto funcionamento do sistema de cobertura. Para telhas BRASILIT, o balanço máximo permitido varia de acordo com o modelo e comprimento da telha: para telhas de até 1,83m, o balanço máximo é de 25cm; para telhas de 2,13m até 2,44m, 40cm; e para telhas acima de 3,05m, 50cm. O balanço excessivo pode causar deformações nas telhas, infiltrações e comprometer a estabilidade do beiral. O balanço insuficiente pode resultar em transbordamento de águas pluviais e danos à fachada. É necessário readequar o balanço do beiral seguindo rigorosamente as especificações dofabricante."
  },
  {
    id: 9,
    titulo: "Número de Apoios e Vão Livre Inadequados",
    textoCompleto: "A análise técnica revelou que a quantidade de apoios e/ou o vão livre entre eles está em desconformidade com as especificações do fabricante. Esta situação é crítica para a segurança e desempenho do sistema de cobertura. Para telhas BRASILIT, o número mínimo de apoios e o vão máximo permitido são determinados pelo modelo e espessura da telha: para telhas onduladas de 6mm, o vão máximo é de 1,69m com 3 apoios; para telhas de 8mm, 1,99m com 3 apoios; e para telhas estruturais, conforme especificação própria do modelo. O não atendimento a estes parâmetros pode resultar em deformações excessivas, trincas, infiltrações e, em casos extremos, colapso do sistema. É imprescindível a correção do espaçamento entre apoios e/ou adição de apoios intermediários para adequação às normas técnicas."
  },
  {
    id: 10,
    titulo: "Recobrimento Incorreto",
    textoCompleto: "Foi identificado que o recobrimento entre as telhas não atende às especificações mínimas estabelecidas pelo fabricante. O recobrimento adequado é fundamental para garantir a estanqueidade do sistema de cobertura. Para telhas BRASILIT, o recobrimento longitudinal deve ser de 14cm para inclinações até 15° e 20cm para inclinações menores que 15°. O recobrimento lateral deve ser de 1¼ onda para telhas onduladas. A não conformidade no recobrimento pode resultar em infiltrações generalizadas, principalmente em períodos de chuva intensa ou com ventos fortes. Além disso, o recobrimento inadequado pode comprometer a fixação das telhas e sua resistência a esforços de sucção causados pelo vento. É necessária a correção dos recobrimentos, o que pode implicar na remontagem parcial ou total do telhado."
  },
  {
    id: 11,
    titulo: "Sentido de Montagem Incorreto",
    textoCompleto: "A vistoria constatou que a montagem das telhas foi executada em sentido contrário ao tecnicamente recomendado. O sentido correto de montagem das telhas BRASILIT deve considerar os ventos predominantes da região, iniciando-se a colocação no sentido contrário a estes ventos. Este procedimento é fundamental para evitar que a água da chuva seja forçada contra os recobrimentos pelo vento. A montagem no sentido incorreto pode resultar em infiltrações significativas, principalmente durante chuvas com ventos fortes, comprometendo a estanqueidade do sistema e podendo causar danos ao interior da edificação. A correção desta não conformidade geralmente requer a remontagem completa do telhado."
  },
  {
    id: 12,
    titulo: "Uso de Cumeeira Cerâmica",
    textoCompleto: "Foi identificada a utilização de cumeeiras cerâmicas em conjunto com as telhas de fibrocimento BRASILIT, caracterizando uma incompatibilidade técnica grave. As cumeeiras cerâmicas possuem características físicas e dimensionais diferentes das telhas de fibrocimento, resultando em vedação inadequada e alto risco de infiltrações. Além disso, o peso específico diferente dos materiais pode causar deformações e trincas nas telhas. É obrigatório o uso exclusivo de cumeeiras e peças complementares específicas para telhas de fibrocimento BRASILIT, que são projetadas para garantir a perfeita compatibilidade dimensional e vedação do sistema. A substituição das cumeeiras cerâmicas por peçasapropriadas é necessária para garantir o desempenho adequado da cobertura."
  },
  {
    id: 13,
    titulo: "Uso de Argamassa em Substituição a Peças Complementares",
    textoCompleto: "Durante a inspeção, foi constatado o uso inadequado de argamassa em substituição às peças complementares originais BRASILIT. Esta prática é tecnicamente incorreta e compromete seriamente o desempenho do sistema de cobertura. A argamassa não possui as características necessárias para acompanhar as movimentações térmicas e estruturais do telhado, resultando em trincas e infiltrações. Além disso, o peso adicional da argamassa pode sobrecarregar a estrutura e as telhas. As peças complementares BRASILIT são especialmente projetadas para garantir avedação adequada e acompanhar as movimentações do sistema, sendo sua utilização obrigatória. É necessária a remoção completa da argamassa e substituição por peças complementares originais apropriadas."
  },
  {
    id: 14,
    titulo: "Fixação de Acessórios Complementares Realizada de Forma Inadequada",
    textoCompleto: "A análise técnica identificou que os acessórios complementares (rufos, calhas, pingadeiras, etc.) não estão fixados de acordo com as especificações técnicas do fabricante. A fixação adequada destes elementos é crucial para o desempenho do sistema de cobertura. Os rufos devem ser fixados à estrutura e nunca diretamente nas telhas, com sobreposição mínima de 5cm sobre as telhas e vedação apropriada. As calhas devem ter dimensionamento adequado, inclinação mínima de 0,5% e estar corretamente fixadas à estrutura. O espaçamento entre os suportes deve seguir as especificações do fabricante. A fixação inadequada pode resultar em infiltrações, transbordamentos, oxidação da estrutura e danos ao sistema de cobertura. É necessária a revisão completa da fixação dos acessórios complementares, seguindo rigorosamente as recomendações técnicas."
  }
];
```

## Uso no Sistema

Quando um relatório é gerado, o sistema deve:

1. Receber a lista de IDs de não conformidades do formulário
2. Buscar os textos completos correspondentes neste banco de dados
3. Incluir cada texto na seção "Análise Técnica" do relatório
4. Listar os títulos na seção "Conclusão" do relatório

Exemplo:

```javascript
// Exemplo de como processar as não conformidades para o relatório
function processarNaoConformidades(idsNaoConformidades) {
  // Filtrar apenas as não conformidades selecionadas
  const naoConformidadesSelecionadas = naoConformidades.filter(
    nc => idsNaoConformidades.includes(nc.id)
  );
  
  // Gerar a seção de análise técnica
  const secaoAnalise = naoConformidadesSelecionadas.map(nc => 
    `**${nc.id}. ${nc.titulo}**\n\n${nc.textoCompleto}`
  ).join('\n\n');
  
  // Gerar a lista para a conclusão
  const listaConclusao = naoConformidadesSelecionadas.map(nc => 
    `${nc.id}\\. ${nc.titulo}`
  ).join('\n\n');
  
  return {
    secaoAnalise,
    listaConclusao
  };
}
```

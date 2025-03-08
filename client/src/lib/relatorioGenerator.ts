
import { RelatorioVistoria } from "../../../shared/relatorioVistoriaSchema";

// Banco de dados de não conformidades
const naoConformidadesDB = [
  {
    id: 1,
    titulo: "Armazenagem Incorreta",
    descricao: "Durante a inspeção, foi constatado que as telhas estão sendo armazenadas de forma inadequada, em desacordo com as recomendações técnicas do fabricante. As telhas BRASILIT devem ser armazenadas em local plano, firme, coberto e seco, protegidas das intempéries. O empilhamento deve ser feito horizontalmente, com as telhas apoiadas sobre caibros ou pontaletes de madeira espaçados no máximo a cada 50cm, garantindo um apoio uniforme. A altura máxima da pilha não deve ultrapassar 200 telhas. É fundamental manter uma distância mínima de 1 metro entre as pilhas para facilitar a circulação. O não cumprimento destas diretrizes pode resultar em deformações, trincas ou quebras das telhas, comprometendo sua integridade e desempenho futuro."
  },
  {
    id: 2,
    titulo: "Carga Permanente sobre as Telhas",
    descricao: "Foi identificada a presença de cargas permanentes não previstas sobre as telhas, incluindo equipamentos, estruturas ou instalações. Esta situação é extremamente prejudicial à integridade do sistema de cobertura, pois as telhas BRASILIT são dimensionadas para suportar apenas as cargas previstas em projeto, como seu próprio peso, a ação dos ventos e eventuais cargas acidentais de manutenção. A sobrecarga permanente pode causar deformações, trincas e até mesmo a ruptura das telhas, além de comprometer a estrutura de suporte. É fundamental remover as cargas não previstas e, caso seja necessária a instalação de equipamentos sobre a cobertura, projetar estruturas independentes que não transmitam esforços diretamente para as telhas."
  },
  {
    id: 3,
    titulo: "Corte de Canto Incorreto ou Ausente",
    descricao: "A inspeção revelou que os cortes de canto das telhas não foram executados corretamente ou estão ausentes. O corte de canto é um procedimento técnico obrigatório que consiste na remoção de um quadrado de 11x11cm nos cantos das telhas onde haverá sobreposição. Este procedimento é fundamental para evitar a sobreposição de quatro espessuras de telha em um mesmo ponto, o que criaria um desnível prejudicial ao escoamento da água e à vedação do telhado. A ausência ou execução incorreta do corte de canto pode resultar em infiltrações, acúmulo de água, instalação de telhas com desnível e, consequentemente, comprometer a estanqueidade do telhado."
  },
  {
    id: 4,
    titulo: "Estrutura Desalinhada",
    descricao: "Foi constatado que a estrutura de apoio das telhas apresenta desalinhamento significativo em relação aos parâmetros técnicos aceitáveis. Este desalinhamento compromete diretamente o assentamento correto das telhas, afetando o caimento, a sobreposição e a vedação do sistema de cobertura. A estrutura deve estar perfeitamente alinhada e nivelada, com as terças paralelas entre si e perpendiculares à linha de maior caimento do telhado. O desalinhamento pode causar problemas como empoçamento de água, infiltrações, dificuldade na fixação das telhas e, em casos extremos, a instabilidade do conjunto. É necessário corrigir o alinhamento da estrutura, garantindo sua conformidade com as especificações técnicas do fabricante antes da reinstalação das telhas."
  },
  {
    id: 5,
    titulo: "Fixação Irregular das Telhas",
    descricao: "Durante a vistoria, foi identificado que a fixação das telhas não atende às especificações técnicas do fabricante. A fixação adequada das telhas BRASILIT é fundamental para garantir a segurança e o desempenho do sistema de cobertura. As telhas devem ser fixadas com parafusos com rosca soberba Ø 8mm x 110mm ou ganchos com rosca Ø 8mm, sempre acompanhados de conjunto de vedação (arruela metálica e arruela de vedação em PVC). Os pontos de fixação devem seguir rigorosamente o esquema indicado nos catálogos técnicos, variando conforme o modelo e o comprimento da telha. A fixação inadequada pode resultar no deslocamento das telhas pela ação dos ventos, infiltrações pelos furos mal vedados, danos estruturais às telhas devido à dilatação térmica restringida, além de comprometer a segurança de toda a cobertura."
  },
  {
    id: 6,
    titulo: "Inclinação da Telha Inferior ao Recomendado",
    descricao: "A inspeção técnica identificou que a inclinação do telhado está abaixo do mínimo recomendado nas especificações do fabricante. A inclinação é um fator crítico para o desempenho do sistema de cobertura, pois garante o escoamento adequado das águas pluviais e evita o acúmulo de sujeira. Para telhas BRASILIT, a inclinação mínima varia de acordo com o modelo: para telhas onduladas, deve ser de 15° (27%); para telhas estruturais, 10° (17,6%); e para telhas de fibrocimento, 5° (9%). A inclinação inferior ao recomendado pode resultar em infiltrações graves, empoçamento de água, sobrecarga na estrutura, acúmulo de detritos e redução significativa da vida útil da cobertura. A correção deste problema requer a alteração da estrutura de suporte para adequar a inclinação aos valores mínimos especificados."
  },
  {
    id: 7,
    titulo: "Marcas de Caminhamento sobre o Telhado",
    descricao: "Durante a vistoria, foram identificadas marcas evidentes de caminhamento direto sobre as telhas, caracterizando uso inadequado do sistema de cobertura. As telhas BRASILIT não são projetadas para suportar tráfego direto, mesmo que eventual. O caminhamento incorreto pode causar trincas, deformações e comprometer a integridade das telhas. Para acesso à cobertura durante manutenções ou inspeções, é obrigatório o uso de tábuas ou pranchas apropriadas, apoiadas sobre as terças ou caibros, que distribuam o peso do operador para a estrutura de sustentação, e não para as telhas. As telhas danificadas por caminhamento inadequado devem ser substituídas, pois a capacidade estrutural destes elementos pode ter sido comprometida, representando risco de ruptura e vazamentos futuros."
  },
  {
    id: 8,
    titulo: "Balanço Livre do Beiral Incorreto",
    descricao: "Foi constatado que o balanço livre do beiral está em desacordo com as especificações técnicas do fabricante. O balanço do beiral é a distância entre a última terça e a extremidade da telha, sendo um elemento crucial para o correto funcionamento do sistema de cobertura. Para telhas BRASILIT, o balanço máximo permitido varia de acordo com o modelo e comprimento da telha: para telhas de até 1,83m, o balanço máximo é de 25cm; para telhas de 2,13m até 2,44m, 40cm; e para telhas maiores que 3,05m, 50cm. O balanço excessivo pode causar deformações, vibração excessiva pelas ações do vento, acúmulo de água na extremidade e até mesmo a ruptura da telha. Já um balanço insuficiente pode resultar em problemas de drenagem e infiltrações na edificação. A correção deste problema requer o reposicionamento das terças ou o corte das telhas para adequar o balanço aos valores especificados."
  },
  {
    id: 9,
    titulo: "Número de Apoios e Vão Livre Inadequados",
    descricao: "A análise técnica revelou que a quantidade de apoios e/ou o vão livre entre eles está em desconformidade com as especificações do fabricante. Esta situação é crítica para a segurança e desempenho do sistema de cobertura. Para telhas BRASILIT, o número mínimo de apoios e o vão máximo permitido são determinados pelo modelo e espessura da telha: para telhas onduladas de 6mm, o vão máximo é de 1,69m com 3 apoios; para telhas de 8mm, 1,99m com 3 apoios; e para telhas estruturais, os valores variam conforme indicado no catálogo técnico. A inadequação no número de apoios e no vão livre pode resultar em deflexões excessivas, acúmulo de água, sobrecarga na estrutura das telhas e, em casos extremos, no colapso da cobertura. A correção deste problema requer o redimensionamento da estrutura de apoio, com a instalação de terças ou caibros adicionais para adequar os vãos às especificações técnicas."
  },
  {
    id: 10,
    titulo: "Recobrimento Incorreto",
    descricao: "Foi identificado que o recobrimento entre as telhas não atende às especificações mínimas estabelecidas pelo fabricante. O recobrimento adequado é fundamental para garantir a estanqueidade do sistema de cobertura. Para telhas BRASILIT, o recobrimento longitudinal deve ser de 14cm para inclinações até 15° e 20cm para inclinações menores que 15°. O recobrimento lateral deve ser de 1¼ onda para telhas onduladas. A não conformidade no recobrimento pode resultar em infiltrações significativas, principalmente em situações de chuvas com ventos fortes, quando a água pode ser forçada contra os recobrimentos. A correção deste problema requer o reposicionamento das telhas, garantindo o recobrimento mínimo especificado, o que pode afetar o dimensionamento total da cobertura e a quantidade de telhas necessárias."
  },
  {
    id: 11,
    titulo: "Sentido de Montagem Incorreto",
    descricao: "A vistoria constatou que a montagem das telhas foi executada em sentido contrário ao tecnicamente recomendado. O sentido correto de montagem das telhas BRASILIT deve considerar os ventos predominantes da região, iniciando-se a colocação no sentido contrário a estes ventos. Este procedimento é fundamental para evitar que a água da chuva seja forçada contra os recobrimentos pelo vento. A montagem no sentido incorreto pode resultar em infiltrações significativas, principalmente em situações de chuvas com ventos fortes. A correção deste problema requer a remontagem completa das telhas no sentido adequado, o que envolve a remoção de todas as telhas e sua reinstalação seguindo o procedimento correto. Durante esta operação, deve-se verificar também a condição de cada telha, substituindo aquelas que possam ter sido danificadas durante a instalação inicial ou remoção."
  },
  {
    id: 12,
    titulo: "Uso de Cumeeira Cerâmica",
    descricao: "Foi identificada a utilização de cumeeiras cerâmicas em conjunto com as telhas de fibrocimento BRASILIT, caracterizando uma incompatibilidade técnica grave. As cumeeiras cerâmicas possuem características físicas e dimensionais diferentes das telhas de fibrocimento, resultando em vedação inadequada e alto risco de infiltrações. Além disso, o peso específico diferente dos materiais pode causar deformações e trincas nas telhas. É obrigatório o uso exclusivo de cumeeiras de fibrocimento BRASILIT, especificamente projetadas para garantir a compatibilidade dimensional, a estanqueidade e a harmonia estética com as telhas do mesmo fabricante. A correção deste problema requer a substituição das cumeeiras cerâmicas por cumeeiras de fibrocimento BRASILIT apropriadas para o modelo de telha utilizado, seguindo rigorosamente as orientações de instalação do fabricante."
  },
  {
    id: 13,
    titulo: "Uso de Argamassa em Substituição a Peças Complementares",
    descricao: "Durante a inspeção, foi constatado o uso inadequado de argamassa em substituição às peças complementares originais BRASILIT. Esta prática é tecnicamente incorreta e compromete seriamente o desempenho do sistema de cobertura. A argamassa não possui as características necessárias para acompanhar as movimentações térmicas e estruturais do telhado, resultando em trincas e infiltrações. Além disso, o peso adicional da argamassa pode sobrecarregar a estrutura e as telhas, causando deformações e até mesmo rupturas. As peças complementares BRASILIT (rufos, cumeeiras, espigões, etc.) são especialmente projetadas para garantir a estanqueidade e o desempenho adequado do sistema de cobertura, e não podem ser substituídas por improvisações. A correção deste problema requer a remoção completa da argamassa e a instalação das peças complementares originais BRASILIT, seguindo rigorosamente as orientações de instalação do fabricante."
  },
  {
    id: 14,
    titulo: "Fixação de Acessórios Complementares Realizada de Forma Inadequada",
    descricao: "A análise técnica identificou que os acessórios complementares (rufos, calhas, pingadeiras, etc.) não estão fixados de acordo com as especificações técnicas do fabricante. A fixação adequada destes elementos é crucial para o desempenho do sistema de cobertura. Os rufos devem ser fixados à estrutura e nunca diretamente nas telhas, com sobreposição mínima de 5cm sobre as telhas e vedação apropriada. As calhas devem ter dimensionamento adequado, inclinação mínima de 0,5% e fixação que permita sua movimentação térmica. A fixação inadequada dos acessórios complementares pode resultar em infiltrações significativas, comprometendo a estanqueidade de todo o sistema de cobertura e a proteção da edificação. A correção deste problema requer a reinstalação dos acessórios complementares seguindo rigorosamente as especificações técnicas do fabricante, com especial atenção aos pontos de fixação e vedação."
  }
];

interface TemplateData {
  dataVistoria?: string;
  cliente?: string;
  empreendimento?: string;
  cidade?: string;
  estado?: string;
  endereco?: string;
  protocolo?: string;
  assunto?: string;
  tecnico?: string;
  departamento?: string;
  unidade?: string;
  coordenador?: string;
  gerente?: string;
  regional?: string;
  modeloTelha?: string;
  quantidadeTelhas?: number;
  areaCoberta?: number;
  SECAO_NAO_CONFORMIDADES?: string;
  LISTA_NAO_CONFORMIDADES?: string;
  numeroRegistro?: string;
}

// Formatar data de YYYY-MM-DD para DD/MM/YYYY
function formatarData(dataString: string): string {
  try {
    const partes = dataString.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataString;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return dataString;
  }
}

// Função para gerar um HTML que será convertido para DOCX
export function gerarRelatorioHTML(relatorio: RelatorioVistoria): string {
  // Identificar quais não conformidades estão selecionadas
  const naoConformidadesSelecionadas = relatorio.naoConformidades
    .filter(nc => nc.selecionado)
    .map(nc => {
      // Buscar a descrição completa no banco de dados
      const ncCompleta = naoConformidadesDB.find(item => item.id === nc.id);
      return {
        id: nc.id,
        titulo: nc.titulo,
        descricao: ncCompleta?.descricao || nc.descricao || ""
      };
    });

  // Gerar a seção de não conformidades para o relatório
  let secaoNaoConformidades = "";
  naoConformidadesSelecionadas.forEach((nc, index) => {
    secaoNaoConformidades += `<p><strong>${index + 1}. ${nc.titulo}</strong></p>\n\n<p>${nc.descricao}</p>\n\n`;
  });

  // Gerar a lista de títulos para a conclusão
  let listaNaoConformidades = "";
  naoConformidadesSelecionadas.forEach((nc, index) => {
    listaNaoConformidades += `<p>${index + 1}. ${nc.titulo}</p>\n`;
  });

  // Obter os dados da primeira telha (para compatibilidade)
  const primeiraTelha = relatorio.telhas && relatorio.telhas.length > 0 
    ? relatorio.telhas[0] 
    : { espessura: relatorio.espessura, quantidade: relatorio.quantidade, area: relatorio.area };

  // Preparar dados para o template
  const templateData: TemplateData = {
    dataVistoria: formatarData(relatorio.dataVistoria),
    cliente: relatorio.cliente,
    empreendimento: relatorio.empreendimento,
    cidade: relatorio.cidade,
    estado: relatorio.uf,
    endereco: relatorio.endereco,
    protocolo: relatorio.protocolo,
    assunto: relatorio.assunto,
    tecnico: relatorio.elaboradoPor,
    departamento: relatorio.departamento,
    unidade: relatorio.unidade,
    coordenador: relatorio.coordenador,
    gerente: relatorio.gerente,
    regional: relatorio.regional,
    modeloTelha: `${relatorio.modeloTelha} ${primeiraTelha.espessura}mm`,
    quantidadeTelhas: primeiraTelha.quantidade,
    areaCoberta: primeiraTelha.area || relatorio.areaTotal,
    SECAO_NAO_CONFORMIDADES: secaoNaoConformidades,
    LISTA_NAO_CONFORMIDADES: listaNaoConformidades,
    numeroRegistro: relatorio.numeroRegistro
  };

  // Template HTML do relatório seguindo o modelo exato
  const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Relatório de Vistoria Técnica</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.5;
      margin: 2.5cm 2.5cm 2.5cm 3cm; /* Margens ABNT */
    }
    h1 {
      font-size: 14pt;
      text-align: center;
      margin-bottom: 20px;
    }
    p {
      text-align: justify;
      margin-bottom: 10px;
    }
    strong {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>RELATÓRIO DE VISTORIA TÉCNICA</h1>

  <p><strong>Data de vistoria:</strong> ${templateData.dataVistoria}</p>

  <p><strong>Cliente:</strong> ${templateData.cliente}</p>

  <p><strong>Empreendimento:</strong> ${templateData.empreendimento}</p>

  <p><strong>Cidade:</strong> ${templateData.cidade} - ${templateData.estado}</p>

  <p><strong>Endereço:</strong> ${templateData.endereco}</p>

  <p><strong>FAR/Protocolo:</strong> ${templateData.protocolo}</p>

  <p><strong>Assunto:</strong> ${templateData.assunto}</p>

  <p><strong>Elaborado por:</strong> ${templateData.tecnico}</p>

  <p><strong>Departamento:</strong> ${templateData.departamento}</p>

  <p><strong>Unidade:</strong> ${templateData.unidade}</p>

  <p><strong>Coordenador Responsável:</strong> ${templateData.coordenador}</p>

  <p><strong>Gerente Responsável:</strong> ${templateData.gerente}</p>

  <p><strong>Regional:</strong> ${templateData.regional}</p>

  <p><strong>Introdução</strong></p>

  <p>A Área de Assistência Técnica foi solicitada para atender uma reclamação
  relacionada ao surgimento de infiltrações nas telhas de fibrocimento: -
  Telha da marca BRASILIT modelo ONDULADA de 5mm, produzidas com
  tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem
  amianto - cuja fabricação segue a norma internacional ISO 9933, bem como
  as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.</p>

  <p>Em atenção a vossa solicitação, analisamos as evidências encontradas,
  para avaliar as manifestações patológicas reclamadas em telhas de nossa
  marca aplicada em sua cobertura conforme registro de reclamação
  protocolo FAR ${templateData.protocolo}.</p>

  <p>O modelo de telha escolhido para a edificação foi: ${templateData.modeloTelha}. Esse
  modelo, como os demais, possui a necessidade de seguir rigorosamente as
  orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento
  e Acessórios para Telhado --- Brasilit para o melhor desempenho do
  produto, assim como a garantia do produto coberta por 5 anos (ou dez
  anos para sistema completo).</p>

  <p><strong>Quantidade e modelo:</strong></p>

  <p>• ${templateData.quantidadeTelhas}: ${templateData.modeloTelha}.</p>

  <p>• Área coberta: ${templateData.areaCoberta}m² aproximadamente.</p>

  <p>A análise do caso segue os requisitos presentes na norma ABNT NBR 7196:
  Telhas de fibrocimento sem amianto --- Execução de coberturas e
  fechamentos laterais ---Procedimento e Guia Técnico de Telhas de
  Fibrocimento e Acessórios para Telhado --- Brasilit.</p>

  <p><strong>Análise Técnica</strong></p>

  <p>Durante a visita técnica realizada no local, nossa equipe conduziu uma
  vistoria minuciosa da cobertura, documentando e analisando as condições
  de instalação e o estado atual das telhas. Após criteriosa avaliação das
  evidências coletadas em campo, identificamos alguns desvios nos
  procedimentos de manuseio e instalação em relação às especificações
  técnicas do fabricante, os quais são detalhados a seguir:</p>

  ${templateData.SECAO_NAO_CONFORMIDADES}

  <p><strong>Conclusão</strong></p>

  <p>Com base na análise técnica realizada, foram identificadas as seguintes
  não conformidades:</p>

  ${templateData.LISTA_NAO_CONFORMIDADES}

  <p>Em função das não conformidades constatadas no manuseio e instalação das
  chapas Brasilit, finalizamos o atendimento considerando a reclamação
  como IMPROCEDENTE, onde os problemas reclamados se dão pelo incorreto
  manuseio e instalação das telhas e não a problemas relacionados à
  qualidade do material.</p>

  <p>As telhas BRASILIT modelo FIBROCIMENTO ONDULADA possuem dez anos de
  garantia com relação a problemas de fabricação. A garantia Brasilit está
  condicionada a correta aplicação do produto, seguindo rigorosamente as
  instruções de instalação contidas no Guia Técnico de Telhas de
  Fibrocimento e Acessórios para Telhado --- Brasilit. Este guia técnico
  está sempre disponível em: http://www.brasilit.com.br.</p>

  <p>Ratificamos que os produtos Brasilit atendem as Normas da Associação
  Brasileira de Normas Técnicas --- ABNT, específicas para cada linha de
  produto, e cumprimos as exigências legais de garantia de produtos
  conforme a legislação em vigor.</p>

  <p>Desde já, agradecemos e nos colocamos à disposição para quaisquer
  esclarecimentos que se fizerem necessário.</p>

  <p>Atenciosamente,</p>

  <p>Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.</p>

  <p>Divisão Produtos Para Construção</p>

  <p>Departamento de Assistência Técnica</p>
</body>
</html>
`;

  return htmlTemplate;
}

// Função para preparar os dados no formato necessário para o relatório
export function prepararDadosRelatorio(relatorio: RelatorioVistoria) {
  // Identificar quais não conformidades estão selecionadas
  const naoConformidadesSelecionadas = relatorio.naoConformidades
    .filter(nc => nc.selecionado)
    .map(nc => {
      // Buscar a descrição completa no banco de dados
      const ncCompleta = naoConformidadesDB.find(item => item.id === nc.id);
      return {
        id: nc.id,
        titulo: nc.titulo,
        descricao: ncCompleta?.descricao || nc.descricao || ""
      };
    });

  // Gerar a seção de não conformidades para o relatório
  let secaoNaoConformidades = "";
  naoConformidadesSelecionadas.forEach((nc, index) => {
    secaoNaoConformidades += `**${index + 1}. ${nc.titulo}**\n\n${nc.descricao}\n\n`;
  });

  // Gerar a lista de títulos para a conclusão
  let listaNaoConformidades = "";
  naoConformidadesSelecionadas.forEach((nc, index) => {
    listaNaoConformidades += `${index + 1}. ${nc.titulo}\n\n`;
  });

  // Obter dados relevantes para o relatório
  const primeiraTelha = relatorio.telhas && relatorio.telhas.length > 0 
    ? relatorio.telhas[0] 
    : { espessura: relatorio.espessura, quantidade: relatorio.quantidade, area: relatorio.area };

  return {
    dataVistoria: formatarData(relatorio.dataVistoria),
    cliente: relatorio.cliente,
    empreendimento: relatorio.empreendimento,
    cidade: relatorio.cidade,
    estado: relatorio.uf,
    endereco: relatorio.endereco,
    protocolo: relatorio.protocolo,
    assunto: relatorio.assunto,
    tecnico: relatorio.elaboradoPor,
    departamento: relatorio.departamento,
    unidade: relatorio.unidade,
    coordenador: relatorio.coordenador,
    gerente: relatorio.gerente,
    regional: relatorio.regional,
    numeroRegistro: relatorio.numeroRegistro,
    modeloTelha: `${relatorio.modeloTelha} ${primeiraTelha.espessura}mm`,
    quantidadeTelhas: primeiraTelha.quantidade,
    areaCoberta: primeiraTelha.area || relatorio.areaTotal,
    secaoNaoConformidades,
    listaNaoConformidades,
    naoConformidadesSelecionadas
  };
}

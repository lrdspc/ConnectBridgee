import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const resultadoReclamacaoEnum = z.enum([
  "PROCEDENTE",
  "IMPROCEDENTE"
]);

export const modeloTelhaEnum = z.enum([
  "Ondulada",
  "Tropical",
  "Maxiplac",
  "Topcomfort",
  "Kalhetão"
]);

export const espessuraTelhaEnum = z.enum([
  "5",
  "6",
  "8"
]);

export const larguraTelhaEnum = z.enum([
  "0.92",
  "1.10"
]);

export const comprimentoTelhaEnum = z.enum([
  "1.22",
  "1.53",
  "1.83",
  "2.13",
  "2.44",
  "3.05",
  "3.66"
]);

// Definição de uma telha individual
export const telhaSchema = z.object({
  id: z.string().default(() => uuidv4()),
  espessura: espessuraTelhaEnum.default("6"),
  largura: larguraTelhaEnum.default("1.10"),
  comprimento: comprimentoTelhaEnum.default("2.44"),
  quantidade: z.number().default(0),
  area: z.number().default(0),
  peso: z.number().optional(),
  modelo: modeloTelhaEnum.optional().default("Ondulada"),
});

export type Telha = z.infer<typeof telhaSchema>;
export type ComprimentoTelha = z.infer<typeof comprimentoTelhaEnum>;

export const relatorioVistoriaSchema = z.object({
  id: z.string().optional().default(() => uuidv4()),
  protocolo: z.string().optional().default(""),
  dataVistoria: z.string().optional().default(() => new Date().toISOString().split('T')[0]),
  cliente: z.string().optional().default(""),
  empreendimento: z.string().optional().default(""),
  endereco: z.string().optional().default(""),
  cidade: z.string().optional().default(""),
  uf: z.string().optional().default(""),
  assunto: z.string().optional().default("AT - BRA - PERMEABILIDADE - Telhado com vazamento Geral"),
  
  // Responsáveis técnicos
  elaboradoPor: z.string().optional().default(""),
  departamento: z.string().optional().default("Assistência Técnica"),
  unidade: z.string().optional().default(""),
  coordenador: z.string().optional().default(""),
  gerente: z.string().optional().default(""),
  regional: z.string().optional().default(""),
  numeroRegistro: z.string().optional().default(""),
  
  // Produto - agora é um array de telhas
  telhas: z.array(telhaSchema).default([]),
  areaTotal: z.number().optional().default(0),
  
  // Mantém compatibilidade com código existente
  espessura: espessuraTelhaEnum.optional().default("6"),
  modeloTelha: modeloTelhaEnum.optional().default("Ondulada"),
  quantidade: z.number().optional().default(0),
  area: z.number().optional().default(0),
  
  anosGarantia: z.string().default("5"),
  anosGarantiaSistemaCompleto: z.string().default("10"),
  anosGarantiaTotal: z.string().default("10"),
  
  // Campos de texto fixo (não devem ser editados pelo usuário)
  // Os textos vêm do template e não dos campos de formulário
  introducao: z.string().optional().default(""),
  analiseTecnica: z.string().optional().default(""),
  conclusao: z.string().optional().default(""),
  
  // Campos opcionais que podem ser preenchidos pelo usuário
  recomendacao: z.string().optional(),
  observacoesGerais: z.string().optional(),
  
  // Não conformidades - cada item tem um id que corresponde a um item da lista
  naoConformidades: z.array(z.object({
    id: z.number(),
    titulo: z.string(),
    descricao: z.string().optional(),
    selecionado: z.boolean().default(false)
  })),
  
  // Fotos
  fotos: z.array(z.object({
    id: z.string(),
    dataUrl: z.string(),
    descricao: z.string().optional(),
    timestamp: z.string()
  })).optional().default([]),
  
  resultado: resultadoReclamacaoEnum.default("IMPROCEDENTE"),
  
  // Metadata
  dataCriacao: z.string().optional().default(() => new Date().toISOString()),
  dataAtualizacao: z.string().optional().default(() => new Date().toISOString()),
  status: z.string().optional().default("rascunho")
});

export const insertRelatorioVistoriaSchema = relatorioVistoriaSchema;

export type RelatorioVistoria = z.infer<typeof relatorioVistoriaSchema>;
export type InsertRelatorioVistoria = z.infer<typeof insertRelatorioVistoriaSchema>;

// Lista de não conformidades disponíveis com descrições detalhadas
export const naoConformidadesDisponiveis = [
  {
    id: 1,
    titulo: "Armazenagem Incorreta",
    descricao: "Durante a inspeção, foi constatado que as telhas estão sendo armazenadas de forma inadequada, em desacordo com as recomendações técnicas do fabricante. As telhas BRASILIT devem ser armazenadas em local plano, firme, coberto e seco, protegidas das intempéries. O empilhamento deve ser feito horizontalmente, com as telhas apoiadas sobre caibros ou pontaletes de madeira espaçados no máximo a cada 50cm, garantindo um apoio uniforme. A altura máxima da pilha não deve ultrapassar 200 cm. A armazenagem inadequada pode resultar em danos estruturais às telhas, como trincas, deformações e quebras, comprometendo seu desempenho quando instaladas."
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

export const modelosTelhas = modeloTelhaEnum.options;
export const espessurasTelhas = espessuraTelhaEnum.options;
export const largurasTelhas = larguraTelhaEnum.options;
export const comprimentosTelhas = comprimentoTelhaEnum.options;

// Tabela de opções disponíveis e pesos por espessura/largura/comprimento
export const telhaEspecificacoes: Record<string, Record<string, Record<string, number | null>>> = {
  // Espessura 5mm
  "5": {
    // Largura 0.92m
    "0.92": {
      "1.22": 11.5,
      "1.53": 14.4,
      "1.83": 17.2,
      "2.13": 20.0,
      "2.44": 22.9,
      "3.05": null, // não disponível
      "3.66": null, // não disponível
    },
    // Largura 1.10m
    "1.10": {
      "1.22": 13.5,
      "1.53": 17.0,
      "1.83": 20.3,
      "2.13": 23.6,
      "2.44": 27.1,
      "3.05": null, // não disponível
      "3.66": null, // não disponível
    }
  },
  // Espessura 6mm
  "6": {
    // Largura 0.92m
    "0.92": {
      "1.22": 13.8,
      "1.53": 17.3,
      "1.83": 20.6,
      "2.13": 24.0,
      "2.44": 27.5,
      "3.05": 34.4,
      "3.66": 41.3,
    },
    // Largura 1.10m
    "1.10": {
      "1.22": 16.3,
      "1.53": 20.4,
      "1.83": 24.4,
      "2.13": 28.4,
      "2.44": 32.5,
      "3.05": 40.7,
      "3.66": 48.8,
    }
  },
  // Espessura 8mm
  "8": {
    // Largura 0.92m
    "0.92": {
      "1.22": 18.4,
      "1.53": 23.0,
      "1.83": 27.5,
      "2.13": 32.0,
      "2.44": 36.7,
      "3.05": null, // não disponível
      "3.66": null, // não disponível
    },
    // Largura 1.10m
    "1.10": {
      "1.22": 21.7,
      "1.53": 27.2,
      "1.83": 32.5,
      "2.13": 37.9,
      "2.44": 43.4,
      "3.05": 54.0,
      "3.66": 65.0,
    }
  }
};

// Função para criar um novo relatório de vistoria com dados padrão
export function novoRelatorioVistoria(): RelatorioVistoria {
  const telhaInicial: Telha = {
    id: uuidv4(),
    espessura: "6",
    largura: "1.10",
    comprimento: "2.44",
    quantidade: 0,
    area: 0,
    peso: 32.5, // Peso correspondente à combinação acima
    modelo: "Ondulada"
  };
  
  return {
    id: uuidv4(),
    protocolo: "",
    dataVistoria: new Date().toISOString().split('T')[0],
    cliente: "",
    empreendimento: "",
    endereco: "",
    cidade: "",
    uf: "",
    assunto: "AT - BRA - PERMEABILIDADE - Telhado com vazamento Geral",
    
    elaboradoPor: "",
    departamento: "Assistência Técnica",
    unidade: "",
    coordenador: "",
    gerente: "",
    regional: "",
    numeroRegistro: "",
    
    // Novos campos para múltiplas telhas
    telhas: [telhaInicial],
    areaTotal: 0,
    
    // Mantendo compatibilidade com código existente
    espessura: "6",
    modeloTelha: "Ondulada",
    quantidade: 0,
    area: 0,
    
    anosGarantia: "5",
    anosGarantiaSistemaCompleto: "10",
    anosGarantiaTotal: "10",
    
    introducao: "",
    analiseTecnica: "",
    conclusao: "",
    recomendacao: "",
    observacoesGerais: "",
    
    naoConformidades: naoConformidadesDisponiveis.map(nc => ({
      id: nc.id,
      titulo: nc.titulo,
      descricao: nc.descricao,
      selecionado: false
    })),
    
    fotos: [],
    
    resultado: "IMPROCEDENTE",
    
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString(),
    status: "rascunho"
  };
}

// Função auxiliar para sortear um item de um array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Função para gerar um relatório com dados aleatórios para testes
export function gerarRelatorioAleatorio(): RelatorioVistoria {
  // Lista de nomes de cidades e UFs para escolha aleatória
  const cidades = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Brasília", "Salvador", "Fortaleza", "Curitiba", "Recife"];
  const ufs = ["SP", "RJ", "MG", "DF", "BA", "CE", "PR", "PE"];
  
  // Lista de nomes de clientes para escolha aleatória
  const clientes = ["Construtora Nova Era", "Empreendimentos Alvorada", "Incorporadora Horizonte", "Grupo Construtivo Brasil", "Residencial Vista Verde"];
  
  // Lista de nomes para escolha aleatória
  const nomes = ["Carlos Silva", "Ana Oliveira", "Roberto Santos", "Juliana Pereira", "Marcos Andrade", "Maria Costa", "João Vieira", "Fernanda Lima"];
  
  // Seleção aleatória de não conformidades
  const naoConformidadesSelecionadas = naoConformidadesDisponiveis.map(nc => ({
    id: nc.id,
    titulo: nc.titulo,
    descricao: nc.descricao,
    selecionado: Math.random() > 0.7 // 30% de chance de estar selecionado
  }));
  
  // Cálculo de área com base na quantidade e modelo
  const quantidade = Math.floor(Math.random() * 1000) + 200; // entre 200 e 1200
  const area = quantidade * 0.5 + Math.floor(Math.random() * 300); // área aproximada
  
  // Data aleatória nos últimos 30 dias
  const dataVistoriaDate = new Date();
  dataVistoriaDate.setDate(dataVistoriaDate.getDate() - Math.floor(Math.random() * 30));
  const dataVistoria = dataVistoriaDate.toISOString().split('T')[0];
  
  // Gerar número de protocolo FAR aleatório
  const numeroProtocolo = Math.floor(Math.random() * 900000) + 100000;
  const protocolo = `FAR-${numeroProtocolo}`;
  
  // Criar telhas aleatórias
  const espessura = getRandomItem(espessurasTelhas);
  const largura = getRandomItem(largurasTelhas);
  const comprimentosDisponiveis = Object.keys(telhaEspecificacoes[espessura][largura])
    .filter(comp => telhaEspecificacoes[espessura][largura][comp] !== null) as ComprimentoTelha[];
  const comprimento = getRandomItem(comprimentosDisponiveis);
  const peso = telhaEspecificacoes[espessura][largura][comprimento] || 0;
  
  // Criar de 1 a 3 tipos de telhas para o relatório
  const numTelhas = Math.floor(Math.random() * 2) + 1; // 1 a 2 tipos de telhas
  const telhasAleatorias: Telha[] = [];
  
  for (let i = 0; i < numTelhas; i++) {
    const qtd = Math.floor(Math.random() * 500) + 100; // 100 a 600 telhas
    const compTelha = Number(comprimento);
    const largTelha = Number(largura);
    const areaTelha = qtd * compTelha * largTelha;
    
    telhasAleatorias.push({
      id: uuidv4(),
      espessura: espessura,
      largura: largura,
      comprimento: comprimento as ComprimentoTelha,
      quantidade: qtd,
      area: Math.round(areaTelha * 100) / 100, // Arredonda para 2 casas decimais
      peso: peso,
      modelo: getRandomItem(modelosTelhas)
    });
  }
  
  // Calcular área total
  const areaTotal = telhasAleatorias.reduce((total, telha) => total + telha.area, 0);
  
  return {
    id: uuidv4(),
    protocolo: protocolo,
    dataVistoria: dataVistoria,
    cliente: getRandomItem(clientes),
    empreendimento: `Obra ${Math.floor(Math.random() * 100) + 1} - ${getRandomItem(clientes)}`,
    endereco: `Rua dos Ipês, ${Math.floor(Math.random() * 1000) + 1}, Bairro Jardim`,
    cidade: getRandomItem(cidades),
    uf: getRandomItem(ufs),
    assunto: "AT - BRA - PERMEABILIDADE - Telhado com vazamento Geral",
    
    elaboradoPor: getRandomItem(nomes),
    departamento: "Assistência Técnica",
    unidade: "São Paulo",
    coordenador: getRandomItem(nomes),
    gerente: getRandomItem(nomes),
    regional: "Sudeste",
    numeroRegistro: `${Math.floor(Math.random() * 90000) + 10000}-D`,
    
    // Novos campos para múltiplas telhas
    telhas: telhasAleatorias,
    areaTotal: Math.round(areaTotal * 100) / 100, // Arredonda para 2 casas decimais
    
    // Mantendo compatibilidade com código existente
    espessura: espessura,
    modeloTelha: getRandomItem(modelosTelhas),
    quantidade: quantidade,
    area: area,
    anosGarantia: "5",
    anosGarantiaSistemaCompleto: "10",
    anosGarantiaTotal: "10",
    
    // Os textos fixos devem permanecer vazios para que o template seja usado
    introducao: "",
    analiseTecnica: "",
    conclusao: "",
    
    recomendacao: "Recomendamos a correção das não conformidades identificadas neste relatório, seguindo rigorosamente as especificações técnicas do fabricante disponíveis no site da Brasilit. É essencial que as telhas sejam instaladas por profissionais qualificados e que todas as recomendações técnicas sejam observadas para garantir o desempenho adequado do produto.",
    
    observacoesGerais: "O cliente foi orientado sobre a importância de contratar profissionais especializados para a correção dos problemas identificados.",
    
    naoConformidades: naoConformidadesSelecionadas,
    
    fotos: [],
    
    resultado: Math.random() > 0.2 ? "IMPROCEDENTE" : "PROCEDENTE", // 80% improcedente
    
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString(),
    status: "rascunho"
  };
}
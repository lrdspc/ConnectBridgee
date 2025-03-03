import { z } from 'zod';

// Esquema para o relatório de Ficha de Atendimento para Reclamação (FAR)
export const farReportSchema = z.object({
  // Dados da Vistoria
  dataVistoria: z.string().optional().default(""),
  farProtocolo: z.string().optional().default(""),
  assunto: z.string().optional().default(""),

  // Dados do Cliente
  cliente: z.string().optional().default(""),
  empreendimento: z.string().optional().default(""),
  cidade: z.string().optional().default(""),
  uf: z.string().optional().default(""),
  endereco: z.string().optional().default(""),
  
  // Dados do Responsável
  elaboradoPor: z.string().optional().default(""),
  departamento: z.string().optional().default(""),
  regional: z.string().optional().default(""),
  unidade: z.string().optional().default(""),
  coordenador: z.string().optional().default(""),
  gerente: z.string().optional().default(""),
  
  // Informações sobre Telhas
  telhas: z.array(
    z.object({
      id: z.string(),
      modelo: z.string().optional().default(""),
      espessura: z.string().optional().default(""),
      comprimento: z.string().optional().default(""),
      largura: z.string().optional().default(""),
      quantidade: z.number().optional().default(0),
      area: z.number().optional(),
    })
  ).optional().default([]),
  
  // Problemas Identificados
  problemas: z.array(
    z.object({
      id: z.string(),
      tipo: z.string(),
      descricao: z.string().optional().default(""),
      observacoes: z.string().optional().default(""),
      imagens: z.array(z.string()).default([]),
      selecionado: z.boolean().default(false),
    })
  ).optional().default([]),
  
  // Textos do relatório
  introducao: z.string().optional().default(""),
  analiseTecnica: z.string().optional().default(""),
  
  // Informações adicionais
  conclusao: z.string().optional().default(""),
  recomendacao: z.string().optional().default(""),
  observacoesGerais: z.string().optional().default(""),
  
  // Anos de garantia
  anosGarantia: z.string().optional().default("5"),
  anosGarantiaSistemaCompleto: z.string().optional().default("10"),
  anosGarantiaTotal: z.string().optional().default("10"),
  
  // Campos de assinatura
  assinadoPor: z.string().optional().default(""),
  assinadoEm: z.string().optional().default(""),
  
  // Metadados do relatório
  id: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  status: z.enum(["draft", "completed", "approved", "rejected"]).optional().default("draft"),
});

// Tipo baseado no esquema
export type FARReport = z.infer<typeof farReportSchema>;

// Schema para inserção (omitindo campos que serão gerados pelo sistema)
export const insertFARReportSchema = farReportSchema.omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertFARReport = z.infer<typeof insertFARReportSchema>;

// Lista de problemas pré-definidos
export const problemasPredefinidosFAR = [
  { id: "1", tipo: "Armazenagem Incorreta", descricao: "As telhas não foram armazenadas conforme recomendações do fabricante" },
  { id: "2", tipo: "Carga Permanente sobre as Telhas", descricao: "Existem elementos causando sobrecarga nas telhas" },
  { id: "3", tipo: "Corte de Canto Incorreto ou Ausente", descricao: "Os cantos das telhas não foram cortados corretamente" },
  { id: "4", tipo: "Estrutura Desalinhada", descricao: "Estrutura de suporte apresenta desalinhamento" },
  { id: "5", tipo: "Fixação Irregular das Telhas", descricao: "Método de fixação inadequado ou insuficiente" },
  { id: "6", tipo: "Inclinação da Telha Inferior ao Recomendado", descricao: "A inclinação do telhado está abaixo do mínimo recomendado" },
  { id: "7", tipo: "Marcas de Caminhamento sobre o Telhado", descricao: "Sinais de trânsito sobre as telhas, causando danos" },
  { id: "8", tipo: "Balanço Livre do Beiral Incorreto", descricao: "Beiral com balanço excessivo ou insuficiente" },
  { id: "9", tipo: "Número de Apoios e Vão Livre Inadequados", descricao: "Quantidade ou espaçamento incorreto dos apoios" },
  { id: "10", tipo: "Recobrimento Incorreto", descricao: "Sobreposição das telhas inadequada" },
  { id: "11", tipo: "Sentido de Montagem Incorreto", descricao: "Telhas instaladas no sentido contrário ao recomendado" },
  { id: "12", tipo: "Uso de Cumeeira Cerâmica", descricao: "Utilização de cumeeira incompatível com telhas Brasilit" },
  { id: "13", tipo: "Uso de Argamassa em Substituição a Peças Complementares", descricao: "Substituição indevida de peças por argamassa" },
  { id: "14", tipo: "Fixação de Acessórios Complementares Realizada de Forma Inadequada", descricao: "Acessórios fixados incorretamente" }
];

// Modelos de telhas pré-definidos
export const modelosTelhasFAR = [
  { valor: "ondulada", nome: "Telha Ondulada" },
  { valor: "kalhetao", nome: "Telha Kalhetão" },
  { valor: "maxiplac", nome: "Telha Maxiplac" },
  { valor: "topcomfort", nome: "Telha TopComfort" },
  { valor: "kalheta", nome: "Telha Kalheta" },
  { valor: "colonial", nome: "Telha Colonial" },
  { valor: "fibratex", nome: "Fibratex" },
  { valor: "outro", nome: "Outro" }
];

// Espessuras disponíveis
export const espessurasTelhasFAR = [
  { valor: "4mm", nome: "4mm" },
  { valor: "5mm", nome: "5mm" },
  { valor: "6mm", nome: "6mm" },
  { valor: "8mm", nome: "8mm" }
];

// Função para gerar um relatório FAR com dados aleatórios
export function gerarFARReportAleatorio(): FARReport {
  // Função auxiliar para obter item aleatório de um array
  const getRandomItem = <T>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)];
  };

  // Data aleatória nos últimos 30 dias
  const dataAtual = new Date();
  const dataAnterior = new Date();
  dataAnterior.setDate(dataAtual.getDate() - Math.floor(Math.random() * 30));
  const dataVistoria = dataAnterior.toISOString().split('T')[0];

  // Clientes aleatórios
  const clientes = [
    "Construtora Horizonte", 
    "Incorporadora Costa e Silva", 
    "Engenharia Prudente", 
    "Construtora Alvorada",
    "Edifícios Modernos SA"
  ];

  // Empreendimentos aleatórios
  const empreendimentos = [
    "Residencial Aurora", 
    "Condomínio Montanhas Verdes", 
    "Edifício Industrial Norte", 
    "Shopping Vila Nova",
    "Centro Comercial Estrela"
  ];

  // Cidades aleatórias
  const cidades = ["São Paulo", "Rio de Janeiro", "Curitiba", "Porto Alegre", "Belo Horizonte"];

  // Estados aleatórios
  const estados = ["SP", "RJ", "PR", "RS", "MG"];

  // Responsáveis aleatórios
  const responsaveis = [
    "Carlos Silva", 
    "Juliana Mendes", 
    "Roberto Almeida", 
    "Patricia Costa",
    "Fernando Santos"
  ];

  // Departamentos aleatórios
  const departamentos = ["Engenharia", "Técnico", "Comercial", "Qualidade", "Atendimento"];

  // Regionais aleatórias
  const regionais = ["Sudeste", "Sul", "Nordeste", "Centro-Oeste", "Norte"];

  // Unidades aleatórias
  const unidades = ["Matriz", "Filial SP", "Filial RJ", "Filial MG", "Filial RS"];

  // Gerar telhas aleatórias (1 a 3 tipos)
  const numTiposTelhas = Math.floor(Math.random() * 3) + 1;
  const telhas = Array(numTiposTelhas).fill(null).map((_, idx) => {
    const modelo = getRandomItem(modelosTelhasFAR).valor;
    const espessura = getRandomItem(espessurasTelhasFAR).valor;
    const comprimento = (Math.floor(Math.random() * 5) + 1).toString() + 'm';
    const largura = (Math.floor(Math.random() * 2) + 1).toString() + 'm';
    const quantidade = Math.floor(Math.random() * 100) + 10;
    
    return {
      id: `telha-${idx + 1}`,
      modelo,
      espessura,
      comprimento,
      largura,
      quantidade,
      area: Math.floor(Math.random() * 900) + 100
    };
  });

  // Selecionar problemas aleatoriamente
  const problemas = problemasPredefinidosFAR.map(problema => {
    // 30% de chance de selecionar cada problema
    const selecionado = Math.random() < 0.3;
    
    let observacoes = "";
    if (selecionado) {
      const observacoesProblema = [
        "Problema verificado em várias áreas do telhado.",
        "Situação pontual, afetando apenas uma pequena região.",
        "Requer atenção imediata para evitar danos maiores.",
        "Problema comum neste tipo de instalação.",
        "Cliente já havia identificado este problema anteriormente."
      ];
      observacoes = getRandomItem(observacoesProblema);
    }
    
    return {
      ...problema,
      selecionado,
      observacoes,
      imagens: []
    };
  });

  // Conclusões aleatórias
  const conclusoes = [
    "As telhas apresentam danos causados principalmente por instalação inadequada.",
    "A cobertura está em boas condições, com apenas pequenos ajustes necessários.",
    "É necessária a substituição parcial do telhado nas áreas danificadas.",
    "Os problemas encontrados são resultado de manutenção inadequada.",
    "As patologias identificadas são típicas para a idade da cobertura."
  ];

  // Recomendações aleatórias
  const recomendacoes = [
    "Recomenda-se a substituição das telhas danificadas e reforço da estrutura.",
    "Sugerimos manutenção preventiva semestral para evitar novos problemas.",
    "É necessário refazer a instalação seguindo as normas técnicas do fabricante.",
    "Recomendamos a aplicação de impermeabilizante nas áreas afetadas.",
    "É aconselhável contratar empresa especializada para reforma completa."
  ];
  
  // Textos de introdução
  const introducaoTexto = "A Área de Assistência Técnica foi solicitada para atender uma reclamação relacionada ao surgimento de infiltrações nas telhas de fibrocimento: - Telha da marca BRASILIT modelo ONDULADA de 6mm, produzidas com tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem amianto - cuja fabricação segue a norma internacional ISO 9933, bem como as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.\n\nEm atenção a vossa solicitação, analisamos as evidências encontradas, para avaliar as manifestações patológicas reclamadas em telhas de nossa marca aplicada em sua cobertura conforme registro de reclamação protocolo FAR indicado.\n\nO modelo de telha escolhido para a edificação foi o indicado neste relatório. Esse modelo, como os demais, possui a necessidade de seguir rigorosamente as orientações técnicas contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit para o melhor desempenho do produto, assim como a garantia do produto.";
  
  // Textos de análise técnica
  const analiseTecnicaTexto = "Durante a visita técnica realizada no local, nossa equipe conduziu uma vistoria minuciosa da cobertura, documentando e analisando as condições de instalação e o estado atual das telhas. Após criteriosa avaliação das evidências coletadas em campo, identificamos os seguintes desvios nos procedimentos de manuseio e instalação em relação às especificações técnicas do fabricante:";

  return {
    dataVistoria,
    farProtocolo: `FAR-${Math.floor(Math.random() * 10000)}/${new Date().getFullYear()}`,
    assunto: "Vistoria técnica em cobertura",
    
    cliente: getRandomItem(clientes),
    empreendimento: getRandomItem(empreendimentos),
    cidade: getRandomItem(cidades),
    uf: getRandomItem(estados),
    endereco: `Av. ${getRandomItem(["Brasil", "Paulista", "Atlântica", "Santos Dumont", "Rio Branco"])}, ${Math.floor(Math.random() * 5000)}`,
    
    elaboradoPor: getRandomItem(responsaveis),
    departamento: getRandomItem(departamentos),
    regional: getRandomItem(regionais),
    unidade: getRandomItem(unidades),
    coordenador: "Marcos Oliveira",
    gerente: "Ana Paula Souza",
    
    telhas,
    problemas,
    
    // Novos campos
    introducao: introducaoTexto,
    analiseTecnica: analiseTecnicaTexto,
    
    conclusao: getRandomItem(conclusoes),
    recomendacao: getRandomItem(recomendacoes),
    observacoesGerais: "Inspeção realizada em condições climáticas normais. Cliente acompanhou a vistoria.",
    
    anosGarantia: "5",
    anosGarantiaSistemaCompleto: "10",
    anosGarantiaTotal: "10",
    
    assinadoPor: getRandomItem(responsaveis),
    assinadoEm: dataVistoria,
    
    status: "draft"
  };
}
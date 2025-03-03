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
  
  // Produto
  espessura: espessuraTelhaEnum.optional().default("6"),
  modeloTelha: modeloTelhaEnum.optional().default("Ondulada"),
  quantidade: z.number().optional().default(0),
  area: z.number().optional().default(0),
  anosGarantia: z.string().default("5"),
  anosGarantiaSistemaCompleto: z.string().default("10"),
  anosGarantiaTotal: z.string().default("10"),
  
  // Análise
  introducao: z.string().optional(),
  analiseTecnica: z.string().optional(),
  conclusao: z.string().optional(),
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

// Lista de não conformidades disponíveis
export const naoConformidadesDisponiveis = [
  {
    id: 1,
    titulo: "Armazenagem Incorreta",
    descricao: "As telhas estão sendo armazenadas de forma inadequada, em desacordo com as recomendações técnicas do fabricante."
  },
  {
    id: 2,
    titulo: "Carga Permanente sobre as Telhas",
    descricao: "Presença de cargas permanentes não previstas sobre as telhas, incluindo equipamentos ou estruturas."
  },
  {
    id: 3,
    titulo: "Corte de Canto Incorreto ou Ausente",
    descricao: "Os cortes de canto das telhas não foram executados corretamente ou estão ausentes."
  },
  {
    id: 4,
    titulo: "Estrutura Desalinhada",
    descricao: "A estrutura de apoio das telhas apresenta desalinhamento significativo em relação aos parâmetros técnicos."
  },
  {
    id: 5,
    titulo: "Fixação Irregular das Telhas",
    descricao: "A fixação das telhas não atende às especificações técnicas do fabricante."
  },
  {
    id: 6,
    titulo: "Inclinação da Telha Inferior ao Recomendado",
    descricao: "A inclinação do telhado está abaixo do mínimo recomendado nas especificações do fabricante."
  },
  {
    id: 7,
    titulo: "Marcas de Caminhamento sobre o Telhado",
    descricao: "Foram identificadas marcas evidentes de caminhamento direto sobre as telhas."
  },
  {
    id: 8,
    titulo: "Balanço Livre do Beiral Incorreto",
    descricao: "O balanço livre do beiral está em desacordo com as especificações técnicas do fabricante."
  },
  {
    id: 9,
    titulo: "Número de Apoios e Vão Livre Inadequados",
    descricao: "A quantidade de apoios e/ou o vão livre entre eles está em desconformidade com as especificações."
  },
  {
    id: 10,
    titulo: "Recobrimento Incorreto",
    descricao: "O recobrimento entre as telhas não atende às especificações mínimas estabelecidas pelo fabricante."
  },
  {
    id: 11,
    titulo: "Sentido de Montagem Incorreto",
    descricao: "A montagem das telhas foi executada em sentido contrário ao tecnicamente recomendado."
  },
  {
    id: 12,
    titulo: "Uso de Cumeeira Cerâmica",
    descricao: "Utilização de cumeeiras cerâmicas em conjunto com as telhas de fibrocimento."
  },
  {
    id: 13,
    titulo: "Uso de Argamassa em Substituição a Peças Complementares",
    descricao: "Uso inadequado de argamassa em substituição às peças complementares originais."
  },
  {
    id: 14,
    titulo: "Fixação de Acessórios Complementares Realizada de Forma Inadequada",
    descricao: "Os acessórios complementares não estão fixados de acordo com as especificações técnicas."
  }
];

export const modelosTelhas = modeloTelhaEnum.options;
export const espessurasTelhas = espessuraTelhaEnum.options;

// Função para criar um novo relatório de vistoria com dados padrão
export function novoRelatorioVistoria(): RelatorioVistoria {
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
    
    espessura: getRandomItem(espessurasTelhas),
    modeloTelha: getRandomItem(modelosTelhas),
    quantidade: quantidade,
    area: area,
    anosGarantia: "5",
    anosGarantiaSistemaCompleto: "10",
    anosGarantiaTotal: "10",
    
    introducao: "Foi realizada vistoria técnica na data supracitada, para análise da reclamação do cliente referente a problemas de vazamento no telhado. Durante a inspeção, foram constatadas diversas não conformidades em relação às especificações técnicas de instalação dos produtos Brasilit.",
    
    analiseTecnica: "Durante a inspeção técnica realizada, foram identificadas as não conformidades listadas neste relatório. As telhas apresentavam instalação inadequada, com recobrimentos insuficientes e fixação irregular, resultando nos problemas relatados pelo cliente. A estrutura de apoio também apresentava irregularidades em relação ao espaçamento e alinhamento.",
    
    conclusao: "Com base nas análises realizadas, concluímos que os problemas apresentados são decorrentes de falhas na instalação e não de defeitos no produto.",
    
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
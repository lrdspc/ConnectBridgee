import { z } from "zod";

// Schema para relatório de Ficha de Atendimento Rápido (FAR)
export const farReportSchema = z.object({
  // Identificação
  id: z.string().optional(),
  dataVistoria: z.string(),
  farProtocolo: z.string(),
  
  // Informações do cliente
  cliente: z.string(),
  empreendimento: z.string(),
  cidade: z.string(),
  uf: z.string(),
  endereco: z.string(),
  
  // Informações do responsável técnico
  elaboradoPor: z.string(),
  departamento: z.string(),
  regional: z.string(),
  unidade: z.string(),
  coordenador: z.string().optional(),
  gerente: z.string().optional(),
  
  // Assunto/reclamação
  assunto: z.string(),
  
  // Informações técnicas das telhas
  telhas: z.array(z.object({
    id: z.string(),
    modelo: z.string(),
    espessura: z.string(),
    comprimento: z.string().optional(),
    largura: z.string().optional(),
    quantidade: z.number().default(0),
    area: z.number().optional()
  })).default([]),
  
  // Problemas identificados
  problemas: z.array(z.object({
    id: z.string(),
    tipo: z.string(),
    descricao: z.string(),
    observacoes: z.string().optional(),
    imagens: z.array(z.string()).default([]),
    selecionado: z.boolean().default(false)
  })).default([]),
  
  // Textos de análise
  introducao: z.string().optional(),
  analiseTecnica: z.string(),
  conclusao: z.string(),
  recomendacao: z.string().optional(),
  observacoesGerais: z.string().optional(),
  
  // Informações de garantia
  anosGarantia: z.string().optional(),
  anosGarantiaSistemaCompleto: z.string().optional(),
  anosGarantiaTotal: z.string().optional(),
  
  // Resultado final
  resultado: z.enum(["PROCEDENTE", "IMPROCEDENTE"]),
  
  // Fotos
  fotos: z.array(z.object({
    id: z.string(),
    dataUrl: z.string(),
    descricao: z.string().optional(),
    timestamp: z.string()
  })).default([]),
  
  // Metadados do relatório
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type FARReport = z.infer<typeof farReportSchema>;

// Schema para inserção de relatório FAR (sem campos automáticos)
export const insertFARReportSchema = farReportSchema.omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertFARReport = z.infer<typeof insertFARReportSchema>;

// Lista de problemas predefinidos para relatórios FAR
export const problemasPredefinidosFAR = [
  {
    id: "PRB-001",
    tipo: "Infiltração",
    descricao: "Infiltração de água na cobertura"
  },
  {
    id: "PRB-002",
    tipo: "Trincas",
    descricao: "Trincas ou rachaduras nas telhas"
  },
  {
    id: "PRB-003",
    tipo: "Fixação",
    descricao: "Problemas de fixação das telhas"
  },
  {
    id: "PRB-004",
    tipo: "Dimensionamento",
    descricao: "Dimensionamento inadequado da estrutura"
  },
  {
    id: "PRB-005",
    tipo: "Instalação",
    descricao: "Instalação incorreta do sistema de cobertura"
  },
  {
    id: "PRB-006",
    tipo: "Armazenamento",
    descricao: "Armazenamento inadequado do material"
  },
  {
    id: "PRB-007",
    tipo: "Manuseio",
    descricao: "Danos por manuseio incorreto"
  },
  {
    id: "PRB-008",
    tipo: "Manutenção",
    descricao: "Falta de manutenção preventiva"
  },
  {
    id: "PRB-009",
    tipo: "Acabamento",
    descricao: "Problemas nos acabamentos (rufos, calhas, etc.)"
  },
  {
    id: "PRB-010",
    tipo: "Qualidade",
    descricao: "Não conformidade na qualidade do produto"
  }
];

// Modelos de telhas disponíveis para FAR
export const modelosTelhasFAR = [
  "ONDULADA",
  "TROPICAL",
  "MAXIPLAC",
  "TOPCOMFORT",
  "KALHETÃO 90",
  "KALHETA",
  "ONDA 50",
  "TOTAL ZINC"
];

// Espessuras de telhas disponíveis para FAR
export const espessurasTelhasFAR = [
  "4mm",
  "5mm",
  "6mm",
  "8mm"
];

// Função para gerar um relatório FAR aleatório (para testes)
export function gerarFARReportAleatorio(): FARReport {
  // Função utilitária para obter um item aleatório de um array
  const getRandomItem = <T>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)];
  };
  
  // Gerar 1 a 3 tipos de telhas aleatórios
  const numTelhas = Math.floor(Math.random() * 3) + 1;
  const telhas = [];
  
  for (let i = 0; i < numTelhas; i++) {
    telhas.push({
      id: crypto.randomUUID(),
      modelo: getRandomItem(modelosTelhasFAR),
      espessura: getRandomItem(espessurasTelhasFAR),
      comprimento: "2,44m",
      largura: "1,10m",
      quantidade: Math.floor(Math.random() * 100) + 10
    });
  }
  
  // Selecionar 1 a 3 problemas aleatórios
  const numProblemas = Math.floor(Math.random() * 3) + 1;
  const problemas = [...problemasPredefinidosFAR]
    .sort(() => 0.5 - Math.random())
    .slice(0, numProblemas)
    .map(p => ({
      ...p,
      observacoes: "Observações de teste para este problema",
      imagens: [],
      selecionado: true
    }));
  
  // Gerar relatório aleatório
  return {
    id: crypto.randomUUID(),
    dataVistoria: new Date().toISOString().split('T')[0],
    farProtocolo: `FAR-${Math.floor(Math.random() * 100000)}`,
    cliente: "Cliente Teste",
    empreendimento: "Empreendimento Teste",
    cidade: getRandomItem(["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Brasília", "Curitiba"]),
    uf: getRandomItem(["SP", "RJ", "MG", "DF", "PR"]),
    endereco: "Rua Teste, 123",
    elaboradoPor: "Técnico Teste",
    departamento: "Assistência Técnica",
    regional: "Regional Sudeste",
    unidade: "Unidade Central",
    coordenador: "Coordenador Teste",
    gerente: "Gerente Teste",
    assunto: "Reclamação relacionada à problemas no telhado",
    telhas,
    problemas,
    introducao: "Introdução do relatório de atendimento",
    analiseTecnica: "Análise técnica detalhada realizada durante a visita",
    conclusao: "Conclusão baseada na análise técnica",
    recomendacao: "Recomendações para resolução dos problemas identificados",
    observacoesGerais: "Observações gerais sobre a visita técnica",
    anosGarantia: "5",
    anosGarantiaSistemaCompleto: "15",
    anosGarantiaTotal: "5",
    resultado: getRandomItem(["PROCEDENTE", "IMPROCEDENTE"]),
    fotos: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
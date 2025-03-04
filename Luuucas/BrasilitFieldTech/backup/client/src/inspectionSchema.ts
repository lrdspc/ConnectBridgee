import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Tipos de Obra
export const constructionTypeEnum = z.enum([
  "Residencial",
  "Comercial", 
  "Industrial", 
  "Mista", 
  "Outro"
]);

// Modelos de Telhas
export const tileModelEnum = z.enum([
  "Ondulada 6mm",
  "Ondulada 8mm",
  "Maxiplac",
  "Kalhetão 90",
  "Kalheta",
  "Colonial",
  "Tropical",
  "Outro"
]);

// Problemas de Telhas
export const roofIssuesEnum = z.enum([
  "Armazenagem Incorreta",
  "Carga Permanente sobre as Telhas",
  "Corte de Canto Incorreto ou Ausente",
  "Estrutura Desalinhada",
  "Fixação Irregular das Telhas",
  "Inclinação da Telha Inferior ao Recomendado",
  "Marcas de Caminhamento sobre o Telhado",
  "Balanço Livre do Beiral Incorreto",
  "Número de Apoios e Vão Livre Inadequados",
  "Recobrimento Incorreto",
  "Sentido de Montagem Incorreto",
  "Uso de Cumeeira Cerâmica",
  "Uso de Argamassa em Substituição a Peças Complementares",
  "Fixação de Acessórios Complementares Realizada de Forma Inadequada"
]);

// Esquema de especificação de telhas
export const tileSpecSchema = z.object({
  id: z.string().default(() => uuidv4()),
  model: tileModelEnum,
  customModel: z.string().optional(),
  thickness: z.string(),
  dimensions: z.string(),
  count: z.string(),
});

// Esquema de inspeção completo
export const inspectionSchema = z.object({
  id: z.string().default(() => uuidv4()),
  visitId: z.string().optional(),
  // Cliente e Obra
  clientName: z.string().min(1, "Nome do cliente é obrigatório"),
  dateInspected: z.date(),
  constructionType: constructionTypeEnum,
  customConstructionType: z.string().optional(),
  address: z.string().min(1, "Endereço é obrigatório"),
  city: z.string().optional(),
  inspectionSubject: z.string().optional(),
  protocolNumber: z.string().optional(),
  
  // Dados do Técnico
  technicianId: z.string(),
  technicianName: z.string(),
  department: z.string().optional(),
  unit: z.string().optional(),
  region: z.string().optional(),
  coordinatorName: z.string().optional(),
  managerName: z.string().optional(),
  
  // Especificações das Telhas
  tileSpecs: z.array(tileSpecSchema).min(1, "Pelo menos uma especificação de telha é necessária"),
  
  // Não Conformidades e Fotos
  issues: z.array(z.string()),
  photos: z.array(z.object({
    id: z.string().default(() => uuidv4()),
    category: z.string(),
    dataUrl: z.string(),
    notes: z.string().optional(),
    timestamp: z.string().default(() => new Date().toISOString()),
  })),
  
  // Conclusão e Recomendações
  conclusion: z.string().optional(),
  recommendations: z.string().optional(),
  
  // Campos de controle
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
  synced: z.boolean().default(false),
});

// Tipo para o formulário de inspeção
export type Inspection = z.infer<typeof inspectionSchema>;
export type TileSpec = z.infer<typeof tileSpecSchema>;
export type ConstructionType = z.infer<typeof constructionTypeEnum>;
export type TileModel = z.infer<typeof tileModelEnum>;
export type RoofIssue = z.infer<typeof roofIssuesEnum>;

// Auxiliares para o formulário
export const constructionTypes = constructionTypeEnum.options;
export const tileModels = tileModelEnum.options;
export const roofIssues = roofIssuesEnum.options;

// Esquema para regiões e estados
export const regions = {
  "Sul": ["PR", "SC", "RS"],
  "Sudeste": ["SP", "RJ", "MG", "ES"],
  "Norte": ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
  "Nordeste": ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
  "Centro-Oeste": ["DF", "GO", "MT", "MS"]
};
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
  protocolo: z.string().min(3, { message: "Protocolo é obrigatório" }),
  dataVistoria: z.string().min(1, { message: "Data da vistoria é obrigatória" }),
  cliente: z.string().min(3, { message: "Nome do cliente é obrigatório" }),
  empreendimento: z.string().min(3, { message: "Nome do empreendimento é obrigatório" }),
  endereco: z.string().min(3, { message: "Endereço é obrigatório" }),
  cidade: z.string().min(2, { message: "Cidade é obrigatória" }),
  uf: z.string().length(2, { message: "UF deve ter 2 caracteres" }),
  assunto: z.string().min(3, { message: "Assunto é obrigatório" }).default("AT - BRA - PERMEABILIDADE - Telhado com vazamento Geral"),
  
  // Responsáveis técnicos
  elaboradoPor: z.string().min(3, { message: "Nome do técnico é obrigatório" }),
  departamento: z.string().min(3, { message: "Departamento é obrigatório" }).default("Assistência Técnica"),
  unidade: z.string().min(2, { message: "Unidade é obrigatória" }),
  coordenador: z.string().min(3, { message: "Nome do coordenador é obrigatório" }),
  gerente: z.string().min(3, { message: "Nome do gerente é obrigatório" }),
  regional: z.string().min(2, { message: "Regional é obrigatória" }),
  numeroRegistro: z.string().min(3, { message: "Número de registro CREA/CAU é obrigatório" }),
  
  // Produto
  espessura: espessuraTelhaEnum,
  modeloTelha: modeloTelhaEnum,
  quantidade: z.number().min(1, { message: "A quantidade deve ser maior que zero" }),
  area: z.number().min(1, { message: "A área deve ser maior que zero" }),
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
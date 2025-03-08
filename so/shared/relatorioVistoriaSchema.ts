import { z } from "zod";

// Enums para o relatório de vistoria
export const resultadoReclamacaoEnum = z.enum([
  "PROCEDENTE",
  "IMPROCEDENTE"
]);

export const modeloTelhaEnum = z.enum([
  "ONDULADA",
  "TROPICAL",
  "MAXIPLAC",
  "TOPCOMFORT",
  "KALHETÃO 90",
  "KALHETA",
  "ONDA 50",
  "TOTAL ZINC"
]);

export const espessuraTelhaEnum = z.enum([
  "4mm",
  "5mm",
  "6mm",
  "8mm"
]);

export const larguraTelhaEnum = z.enum([
  "0,50m",
  "0,90m",
  "1,10m"
]);

export const comprimentoTelhaEnum = z.enum([
  "1,22m",
  "1,53m",
  "1,83m",
  "2,13m",
  "2,44m",
  "3,05m",
  "3,66m"
]);

// Schema para telha
export const telhaSchema = z.object({
  id: z.string(),
  modelo: modeloTelhaEnum,
  espessura: espessuraTelhaEnum,
  comprimento: comprimentoTelhaEnum,
  largura: larguraTelhaEnum,
  quantidade: z.number().min(0).default(0),
  areaEstimada: z.number().optional()
});

export type Telha = z.infer<typeof telhaSchema>;
export type ComprimentoTelha = z.infer<typeof comprimentoTelhaEnum>;

// Schema principal do relatório de vistoria
export const relatorioVistoriaSchema = z.object({
  // Informações gerais
  id: z.string().optional(),
  dataVistoria: z.string(),
  cliente: z.string(),
  empreendimento: z.string(),
  cidade: z.string(),
  uf: z.string(),
  endereco: z.string(),
  protocolo: z.string().optional(),
  reclamacao: z.string(),
  
  // Informações sobre o responsável técnico
  responsavelTecnico: z.string(),
  departamento: z.string(),
  regional: z.string(),
  
  // Informações técnicas
  telhas: z.array(telhaSchema).default([]),
  
  // Informações sobre não conformidades
  naoConformidades: z.array(z.object({
    codigo: z.string(),
    descricao: z.string(),
    detalhes: z.string().optional(),
    selecionada: z.boolean().default(false)
  })).default([]),
  
  // Descrições e análises
  introducao: z.string().optional(),
  analiseTecnica: z.string().optional(),
  conclusao: z.string().optional(),
  
  // Fotos
  fotos: z.array(z.object({
    id: z.string(),
    dataUrl: z.string(),
    descricao: z.string().optional(),
    timestamp: z.string()
  })).default([]),
  
  // Resultado final
  resultado: resultadoReclamacaoEnum,
  
  // Metadados do relatório
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const insertRelatorioVistoriaSchema = relatorioVistoriaSchema;

export type RelatorioVistoria = z.infer<typeof relatorioVistoriaSchema>;
export type InsertRelatorioVistoria = z.infer<typeof insertRelatorioVistoriaSchema>;

// Lista de não conformidades disponíveis
export const naoConformidadesDisponiveis = [
  {
    codigo: "NC-001",
    descricao: "Instalação incorreta das telhas",
    detalhes: "Telhas instaladas em desacordo com as instruções do fabricante (recobrimento lateral ou longitudinal)"
  },
  {
    codigo: "NC-002",
    descricao: "Armazenamento inadequado",
    detalhes: "Material armazenado em local úmido ou em contato direto com o solo"
  },
  {
    codigo: "NC-003",
    descricao: "Fixação incorreta",
    detalhes: "Parafusos ou ganchos instalados de forma inadequada ou em quantidade insuficiente"
  },
  {
    codigo: "NC-004",
    descricao: "Inclinação insuficiente do telhado",
    detalhes: "Inclinação inferior à mínima recomendada para o modelo de telha"
  },
  {
    codigo: "NC-005",
    descricao: "Corte ou furação inadequada",
    detalhes: "Uso de ferramentas inadequadas para corte ou furação, causando trincas ou rachaduras"
  },
  {
    codigo: "NC-006",
    descricao: "Estrutura de apoio inadequada",
    detalhes: "Dimensionamento incorreto ou espaçamento excessivo entre apoios"
  },
  {
    codigo: "NC-007",
    descricao: "Trânsito excessivo sobre o telhado",
    detalhes: "Danos causados por trânsito de pessoas sem utilização de tábuas de apoio"
  },
  {
    codigo: "NC-008",
    descricao: "Uso de produtos químicos não recomendados",
    detalhes: "Aplicação de produtos químicos incompatíveis com o material das telhas"
  },
  {
    codigo: "NC-009",
    descricao: "Instalação de calhas e rufos inadequada",
    detalhes: "Sistema de drenagem mal dimensionado ou instalado incorretamente"
  },
  {
    codigo: "NC-010",
    descricao: "Ausência de acabamentos necessários",
    detalhes: "Falta de rufos, cumeeiras ou outros elementos de acabamento essenciais"
  }
];

// Modelos, espessuras, larguras e comprimentos disponíveis
export const modelosTelhas = modeloTelhaEnum.options;
export const espessurasTelhas = espessuraTelhaEnum.options;
export const largurasTelhas = larguraTelhaEnum.options;
export const comprimentosTelhas = comprimentoTelhaEnum.options;

// Tabela de especificações de telhas
export const telhaEspecificacoes: Record<string, Record<string, Record<string, number | null>>> = {
  "ONDULADA": {
    "4mm": {
      "0,50m": 0.50,
      "0,90m": 0.90,
      "1,10m": 1.10
    },
    "5mm": {
      "0,50m": 0.50,
      "0,90m": 0.90,
      "1,10m": 1.10
    },
    "6mm": {
      "0,50m": 0.50,
      "0,90m": 0.90,
      "1,10m": 1.10
    },
    "8mm": {
      "0,50m": null,
      "0,90m": 0.90,
      "1,10m": 1.10
    }
  },
  "TROPICAL": {
    "4mm": {
      "0,50m": 0.50,
      "0,90m": 0.90,
      "1,10m": null
    },
    "5mm": {
      "0,50m": 0.50,
      "0,90m": 0.90,
      "1,10m": null
    },
    "6mm": {
      "0,50m": 0.50,
      "0,90m": 0.90,
      "1,10m": null
    },
    "8mm": {
      "0,50m": null,
      "0,90m": null,
      "1,10m": null
    }
  },
  "MAXIPLAC": {
    "4mm": {
      "0,50m": null,
      "0,90m": 0.90,
      "1,10m": null
    },
    "5mm": {
      "0,50m": null,
      "0,90m": 0.90,
      "1,10m": null
    },
    "6mm": {
      "0,50m": null,
      "0,90m": 0.90,
      "1,10m": null
    },
    "8mm": {
      "0,50m": null,
      "0,90m": 0.90,
      "1,10m": null
    }
  },
  "TOPCOMFORT": {
    "4mm": {
      "0,50m": null,
      "0,90m": null,
      "1,10m": null
    },
    "5mm": {
      "0,50m": null,
      "0,90m": null,
      "1,10m": null
    },
    "6mm": {
      "0,50m": null,
      "0,90m": null,
      "1,10m": null
    },
    "8mm": {
      "0,50m": null,
      "0,90m": 0.90,
      "1,10m": null
    }
  },
  "KALHETÃO 90": {
    "4mm": {
      "0,50m": null,
      "0,90m": 0.90,
      "1,10m": null
    },
    "5mm": {
      "0,50m": null,
      "0,90m": 0.90,
      "1,10m": null
    },
    "6mm": {
      "0,50m": null,
      "0,90m": 0.90,
      "1,10m": null
    },
    "8mm": {
      "0,50m": null,
      "0,90m": 0.90,
      "1,10m": null
    }
  },
  "KALHETA": {
    "4mm": {
      "0,50m": null,
      "0,90m": null,
      "1,10m": null
    },
    "5mm": {
      "0,50m": null,
      "0,90m": null,
      "1,10m": null
    },
    "6mm": {
      "0,50m": null,
      "0,90m": null,
      "1,10m": null
    },
    "8mm": {
      "0,50m": null,
      "0,90m": null,
      "1,10m": 1.10
    }
  },
  "ONDA 50": {
    "4mm": {
      "0,50m": null,
      "0,90m": null,
      "1,10m": null
    },
    "5mm": {
      "0,50m": null,
      "0,90m": null,
      "1,10m": null
    },
    "6mm": {
      "0,50m": null,
      "0,90m": 0.90,
      "1,10m": null
    },
    "8mm": {
      "0,50m": null,
      "0,90m": 0.90,
      "1,10m": null
    }
  },
  "TOTAL ZINC": {
    "4mm": {
      "0,50m": null,
      "0,90m": 0.90,
      "1,10m": null
    },
    "5mm": {
      "0,50m": null,
      "0,90m": null,
      "1,10m": null
    },
    "6mm": {
      "0,50m": null,
      "0,90m": null,
      "1,10m": null
    },
    "8mm": {
      "0,50m": null,
      "0,90m": null,
      "1,10m": null
    }
  }
};

// Função para criar um novo relatório de vistoria com valores padrão
export function novoRelatorioVistoria(): RelatorioVistoria {
  const telhaInicial: Telha = {
    id: crypto.randomUUID(),
    modelo: "ONDULADA",
    espessura: "6mm",
    comprimento: "2,44m",
    largura: "1,10m",
    quantidade: 0
  };

  return {
    id: crypto.randomUUID(),
    dataVistoria: new Date().toISOString().split('T')[0],
    cliente: "",
    empreendimento: "",
    cidade: "",
    uf: "",
    endereco: "",
    protocolo: "",
    reclamacao: "",
    responsavelTecnico: "",
    departamento: "",
    regional: "",
    telhas: [telhaInicial],
    naoConformidades: [],
    introducao: "",
    analiseTecnica: "",
    conclusao: "",
    fotos: [],
    resultado: "IMPROCEDENTE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Função para obter um item aleatório de um array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Função para gerar um relatório aleatório para testes
export function gerarRelatorioAleatorio(): RelatorioVistoria {
  // Gera um número aleatório de telhas entre 1 e 3
  const numTelhas = Math.floor(Math.random() * 3) + 1;
  const telhas: Telha[] = [];
  
  for (let i = 0; i < numTelhas; i++) {
    const modelo = getRandomItem(modelosTelhas);
    const espessura = getRandomItem(espessurasTelhas);
    const comprimento = getRandomItem(comprimentosTelhas);
    const largura = getRandomItem(largurasTelhas);
    
    telhas.push({
      id: crypto.randomUUID(),
      modelo,
      espessura,
      comprimento,
      largura,
      quantidade: Math.floor(Math.random() * 100) + 10
    });
  }
  
  // Seleciona algumas não conformidades aleatórias
  const numNaoConformidades = Math.floor(Math.random() * 4);
  const naoConformidadesSelecionadas = [...naoConformidadesDisponiveis]
    .sort(() => 0.5 - Math.random())
    .slice(0, numNaoConformidades)
    .map(nc => ({
      ...nc,
      selecionada: true
    }));
  
  // Gera o relatório aleatório
  return {
    id: crypto.randomUUID(),
    dataVistoria: new Date().toISOString().split('T')[0],
    cliente: "Cliente Teste",
    empreendimento: "Empreendimento Teste",
    cidade: getRandomItem(["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Brasília", "Curitiba"]),
    uf: getRandomItem(["SP", "RJ", "MG", "DF", "PR"]),
    endereco: "Rua Teste, 123",
    protocolo: `PROT-${Math.floor(Math.random() * 10000)}`,
    reclamacao: "Reclamação de teste sobre problemas no telhado",
    responsavelTecnico: "Técnico Teste",
    departamento: "Departamento de Qualidade",
    regional: "Regional Sudeste",
    telhas,
    naoConformidades: naoConformidadesSelecionadas,
    introducao: "Introdução de teste para o relatório de vistoria",
    analiseTecnica: "Análise técnica detalhada da situação encontrada durante a vistoria",
    conclusao: "Conclusão da análise técnica e recomendações para resolução dos problemas",
    fotos: [],
    resultado: getRandomItem(["PROCEDENTE", "IMPROCEDENTE"]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
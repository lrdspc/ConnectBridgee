import { v4 as uuidv4 } from "uuid";
import { Inspection, TileSpec, constructionTypes, tileModels, roofIssues, regions } from "../shared/inspectionSchema";

// Lista de nomes de clientes para fins de demonstração
const demoClientNames = [
  "Construtora Horizonte Ltda",
  "Incorporadora Viva Brasil",
  "Condomínio Residencial Aurora",
  "Centro Empresarial São Paulo",
  "Hospital Santa Mônica",
  "Escola Técnica Federal",
  "Indústria Metálica do Sul",
  "Shopping Praça Norte",
  "Supermercados Avenida",
  "Hotel Marina Bay",
];

// Lista de cidades para demonstração
const demoCities = [
  "São Paulo",
  "Rio de Janeiro",
  "Belo Horizonte",
  "Porto Alegre",
  "Curitiba",
  "Salvador",
  "Recife",
  "Fortaleza",
  "Brasília",
  "Goiânia",
];

// Lista de endereços para demonstração
const demoAddresses = [
  "Av. Paulista, 1500",
  "Rua das Flores, 230",
  "Rodovia BR-101, Km 235",
  "Estrada do Contorno, 450",
  "Alameda dos Ipês, 78",
  "Rua Marechal Deodoro, 1100",
  "Av. Beira Mar, 890",
  "Rua Tiradentes, 350",
  "Praça da República, 45",
  "Av. das Indústrias, 7800",
];

// Lista de assuntos para demonstração
const demoSubjects = [
  "Inspeção técnica de telhado em obra residencial",
  "Vistoria para laudo técnico de danos em telhas",
  "Avaliação de telhado para reforma",
  "Inspeção preventiva em cobertura industrial",
  "Vistoria para aprovação de garantia",
  "Inspeção pós-temporal em telhado com danos",
  "Avaliação de instalação de telhas Brasilit",
  "Laudo técnico para seguradora",
  "Vistoria para especificação de materiais",
  "Inspeção para verificação de problemas de infiltração",
];

// Lista de técnicos para demonstração
const demoTechnicians = [
  { name: "Carlos Silva", department: "Assistência Técnica", region: "Sudeste", unit: "São Paulo" },
  { name: "Ana Oliveira", department: "Assistência Técnica", region: "Sul", unit: "Porto Alegre" },
  { name: "Roberto Santos", department: "Engenharia", region: "Nordeste", unit: "Recife" },
  { name: "Juliana Costa", department: "Assistência Técnica", region: "Centro-Oeste", unit: "Brasília" },
  { name: "Marcos Pereira", department: "Projetos", region: "Sudeste", unit: "Rio de Janeiro" },
];

// Lista de coordenadores para demonstração
const demoCoordinators = [
  "Eduardo Martins",
  "Fernanda Rocha",
  "Ricardo Alves",
  "Cristina Lima",
];

// Lista de gerentes para demonstração
const demoManagers = [
  "Paulo Gomes",
  "Patrícia Mendes",
  "Luiz Fernando Costa",
  "Mariana Dias",
];

// Lista de conclusões para demonstração
const demoConclusions = [
  "Com base na inspeção realizada, foi constatado que as telhas Brasilit foram instaladas de acordo com as normas técnicas da empresa e apresentam bom estado de conservação.",
  "Durante a inspeção, foram identificadas não conformidades na instalação das telhas que podem comprometer o desempenho do produto. Recomenda-se correção imediata dos problemas apontados.",
  "Após análise técnica do telhado, concluímos que as telhas apresentam danos decorrentes de eventos climáticos extremos, não relacionados à qualidade do produto ou instalação.",
  "A inspeção revelou que o problema de infiltração está relacionado à instalação inadequada das telhas, com recobrimentos insuficientes e ausência de elementos de vedação.",
  "Verificou-se que as telhas apresentam desgaste natural compatível com o tempo de uso e condições de exposição. Não foram encontrados defeitos de fabricação.",
];

// Lista de recomendações para demonstração
const demoRecommendations = [
  "Recomenda-se a correção imediata dos pontos de fixação irregular das telhas, seguindo as especificações do manual técnico Brasilit.",
  "Sugerimos a substituição das telhas danificadas e o reforço estrutural nos pontos indicados para garantir a segurança e estanqueidade da cobertura.",
  "É recomendável realizar manutenção preventiva anual no telhado, com limpeza adequada e verificação dos elementos de fixação.",
  "Para solucionar o problema de infiltração, recomendamos a revisão completa dos recobrimentos e a instalação de elementos complementares de vedação nos pontos críticos.",
  "Recomenda-se a instalação de calhas e rufos adequados para melhorar o escoamento da água e evitar infiltrações futuras.",
];

// Lista de dados de especificações de telhas para demonstração
const demoTileSpecsData = [
  { model: "Ondulada 6mm", thickness: "6mm", dimensions: "2,13m x 1,10m", count: "85" },
  { model: "Ondulada 8mm", thickness: "8mm", dimensions: "2,44m x 1,10m", count: "64" },
  { model: "Maxiplac", thickness: "8mm", dimensions: "3,70m x 1,06m", count: "32" },
  { model: "Kalhetão 90", thickness: "8mm", dimensions: "3,00m x 0,90m", count: "48" },
  { model: "Kalheta", thickness: "6mm", dimensions: "7,00m x 0,45m", count: "120" },
  { model: "Colonial", thickness: "5mm", dimensions: "2,13m x 0,52m", count: "190" },
  { model: "Tropical", thickness: "5mm", dimensions: "2,13m x 0,52m", count: "170" },
];

// Função para gerar uma especificação de telha aleatória
const getRandomTileSpec = (): TileSpec => {
  const randomSpec = demoTileSpecsData[Math.floor(Math.random() * demoTileSpecsData.length)];
  return {
    id: uuidv4(),
    model: randomSpec.model as any,
    thickness: randomSpec.thickness,
    dimensions: randomSpec.dimensions,
    count: randomSpec.count,
  };
};

// Função para gerar array com qtd aleatória de specs de telhas
const getRandomTileSpecs = (min = 1, max = 3): TileSpec[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const specs: TileSpec[] = [];
  
  for (let i = 0; i < count; i++) {
    specs.push(getRandomTileSpec());
  }
  
  return specs;
};

// Função para gerar um array de problemas aleatórios
const getRandomIssues = (min = 0, max = 5): string[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const selectedIssues = new Set<string>();
  
  while (selectedIssues.size < count && selectedIssues.size < roofIssues.length) {
    const randomIssue = roofIssues[Math.floor(Math.random() * roofIssues.length)];
    selectedIssues.add(randomIssue);
  }
  
  return Array.from(selectedIssues);
};

// Função para gerar uma data aleatória nos últimos 30 dias
const getRandomDate = (): Date => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  now.setDate(now.getDate() - daysAgo);
  return now;
};

// Função para gerar uma inspeção com dados aleatórios
export const generateRandomInspection = (): Inspection => {
  const randomTechnician = demoTechnicians[Math.floor(Math.random() * demoTechnicians.length)];
  
  return {
    id: uuidv4(),
    clientName: demoClientNames[Math.floor(Math.random() * demoClientNames.length)],
    address: demoAddresses[Math.floor(Math.random() * demoAddresses.length)],
    city: demoCities[Math.floor(Math.random() * demoCities.length)],
    dateInspected: getRandomDate(),
    constructionType: constructionTypes[Math.floor(Math.random() * constructionTypes.length)] as any,
    inspectionSubject: demoSubjects[Math.floor(Math.random() * demoSubjects.length)],
    protocolNumber: `FAR-${Math.floor(10000 + Math.random() * 90000)}/2024`,
    
    technicianId: "1",
    technicianName: randomTechnician.name,
    department: randomTechnician.department,
    unit: randomTechnician.unit,
    region: randomTechnician.region,
    coordinatorName: Math.random() > 0.3 ? demoCoordinators[Math.floor(Math.random() * demoCoordinators.length)] : undefined,
    managerName: Math.random() > 0.3 ? demoManagers[Math.floor(Math.random() * demoManagers.length)] : undefined,
    
    tileSpecs: getRandomTileSpecs(),
    issues: getRandomIssues(),
    
    // Placeholder para fotos - na implementação real não teríamos como gerar fotos aleatórias
    photos: [],
    
    conclusion: Math.random() > 0.2 ? demoConclusions[Math.floor(Math.random() * demoConclusions.length)] : undefined,
    recommendations: Math.random() > 0.2 ? demoRecommendations[Math.floor(Math.random() * demoRecommendations.length)] : undefined,
    
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    synced: false
  };
};
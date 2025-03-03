import Dexie, { Table } from 'dexie';

export type VisitStatus = 'scheduled' | 'in-progress' | 'pending' | 'completed' | 'urgent';
export type VisitType = 'installation' | 'maintenance' | 'inspection' | 'repair' | 'emergency';
export type VisitPriority = 'normal' | 'high' | 'urgent';

export interface ChecklistItem {
  id: string;
  text: string;
  description?: string;
  completed: boolean;
}

export interface VisitPhoto {
  id: string;
  dataUrl: string;
  timestamp: string;
  notes?: string;
}

export interface VisitDocument {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
  timestamp: string;
}

export interface Visit {
  id: string;
  clientName: string;
  address: string;
  date: string;
  time?: string;
  type: VisitType;
  status: VisitStatus;
  priority: VisitPriority;
  description?: string;
  contactInfo?: string;
  checklist?: ChecklistItem[];
  photos?: VisitPhoto[];
  documents?: VisitDocument[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  synced: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  photoUrl?: string;
}

export interface WeeklyPerformance {
  day: string;
  visits: number;
  timeSpent: number;
  efficiency: number;
}

class BrasilitDatabase extends Dexie {
  visits!: Table<Visit>;
  userProfile!: Table<User>;
  weeklyPerformance!: Table<WeeklyPerformance>;
  
  constructor() {
    super('brasilitTecnico');
    
    this.version(1).stores({
      visits: 'id, status, date, clientName, type, synced',
      userProfile: 'id, email',
      weeklyPerformance: 'day'
    });
  }
}

export const db = new BrasilitDatabase();

// Initialize DB with checklist templates
export const checklistTemplates = {
  installation: [
    { id: '1', text: 'Verificar integridade das telhas', description: 'Checar por rachaduras, quebras ou outros danos visíveis', completed: false },
    { id: '2', text: 'Inspecionar estrutura de suporte', description: 'Avaliar condições das vigas e caibros', completed: false },
    { id: '3', text: 'Verificar vedação e calhas', description: 'Checar pontos de infiltração potenciais', completed: false },
    { id: '4', text: 'Testar drenagem', description: 'Verificar escoamento adequado da água', completed: false },
    { id: '5', text: 'Instruir cliente sobre manutenção', description: 'Explicar procedimentos de limpeza e cuidados', completed: false },
    { id: '6', text: 'Documentar instalação com fotos', description: 'Capturar imagens do antes e depois', completed: false }
  ],
  maintenance: [
    { id: '1', text: 'Verificar desgaste', description: 'Identificar áreas com desgaste excessivo', completed: false },
    { id: '2', text: 'Checar fixações', description: 'Garantir que todos os elementos estejam bem fixados', completed: false },
    { id: '3', text: 'Limpar calhas e rufos', description: 'Remover folhas e detritos', completed: false },
    { id: '4', text: 'Verificar sinais de infiltração', description: 'Procurar manchas de umidade e mofo', completed: false },
    { id: '5', text: 'Avaliar necessidade de substituições', description: 'Identificar componentes que precisam ser trocados', completed: false }
  ],
  inspection: [
    { id: '1', text: 'Documentar condições atuais', description: 'Fotografar estado atual do local', completed: false },
    { id: '2', text: 'Identificar pontos de infiltração', description: 'Mapear locais com entrada de água', completed: false },
    { id: '3', text: 'Avaliar danos estruturais', description: 'Verificar comprometimento da estrutura', completed: false },
    { id: '4', text: 'Medir níveis de umidade', description: 'Utilizar medidor de umidade em pontos críticos', completed: false },
    { id: '5', text: 'Elaborar relatório detalhado', description: 'Incluir fotos e recomendações técnicas', completed: false }
  ],
  repair: [
    { id: '1', text: 'Avaliar extensão do dano', description: 'Determinar área afetada', completed: false },
    { id: '2', text: 'Remover materiais danificados', description: 'Retirar telhas e componentes comprometidos', completed: false },
    { id: '3', text: 'Instalar novos componentes', description: 'Substituir por materiais Brasilit', completed: false },
    { id: '4', text: 'Verificar vedação', description: 'Garantir impermeabilização adequada', completed: false },
    { id: '5', text: 'Testar reparos', description: 'Verificar eficácia das intervenções realizadas', completed: false },
    { id: '6', text: 'Documentar reparo realizado', description: 'Fotografar antes e depois', completed: false }
  ],
  quality: [
    { id: '1', text: 'Verificar conformidade com normas', description: 'Checar atendimento às especificações técnicas', completed: false },
    { id: '2', text: 'Avaliar qualidade de instalação', description: 'Verificar execução conforme recomendações Brasilit', completed: false },
    { id: '3', text: 'Testar resistência', description: 'Avaliar resistência mecânica da instalação', completed: false },
    { id: '4', text: 'Verificar estanqueidade', description: 'Testar impermeabilização', completed: false },
    { id: '5', text: 'Documentar com relatório detalhado', description: 'Incluir fotos e medições', completed: false }
  ],
  vistoriafar: [
    { id: '1', text: 'Coletar dados básicos', description: 'Data, Cliente, Empreendimento, Cidade, UF, Endereço, Protocolo FAR', completed: false },
    { id: '2', text: 'Registrar responsável e regional', description: 'Nome do técnico, Departamento, Regional, Unidade', completed: false },
    { id: '3', text: 'Documentar especificações das telhas', description: 'Modelo, Espessura, Comprimento, Largura, Quantidade', completed: false },
    { id: '4', text: 'Verificar armazenagem das telhas', description: 'Checar se houve armazenagem incorreta dos materiais', completed: false },
    { id: '5', text: 'Inspecionar cargas sobre telhas', description: 'Verificar presença de carga permanente sobre as telhas', completed: false },
    { id: '6', text: 'Verificar cortes de canto', description: 'Avaliar se há corte de canto incorreto ou ausente', completed: false },
    { id: '7', text: 'Avaliar alinhamento da estrutura', description: 'Verificar se a estrutura está alinhada corretamente', completed: false },
    { id: '8', text: 'Checar fixação das telhas', description: 'Inspecionar se há fixação irregular das telhas', completed: false },
    { id: '9', text: 'Medir inclinação da telha', description: 'Verificar se inclinação é inferior ao recomendado', completed: false },
    { id: '10', text: 'Verificar marcas de caminhamento', description: 'Identificar marcas de caminhamento sobre o telhado', completed: false },
    { id: '11', text: 'Inspecionar balanço do beiral', description: 'Medir se balanço livre do beiral está correto', completed: false },
    { id: '12', text: 'Avaliar número de apoios', description: 'Verificar se número de apoios e vão livre são adequados', completed: false },
    { id: '13', text: 'Verificar recobrimento', description: 'Checar se o recobrimento está correto', completed: false },
    { id: '14', text: 'Avaliar sentido de montagem', description: 'Verificar se o sentido de montagem está correto', completed: false },
    { id: '15', text: 'Inspecionar cumeeira', description: 'Verificar se há uso de cumeeira cerâmica', completed: false },
    { id: '16', text: 'Verificar uso de argamassa', description: 'Checar uso de argamassa em substituição a peças complementares', completed: false },
    { id: '17', text: 'Avaliar fixação de acessórios', description: 'Verificar se fixação de acessórios foi realizada adequadamente', completed: false },
    { id: '18', text: 'Documentar com fotos', description: 'Fotografar todos os problemas identificados', completed: false },
    { id: '19', text: 'Elaborar relatório final', description: 'Gerar relatório padrão com conclusão de "IMPROCEDENTE"', completed: false }
  ]
};

// Function to clear and initialize the database for development
export const initializeDevDatabase = async () => {
  // Sample visits
  const sampleVisits: Omit<Visit, 'id'>[] = [
    // Visitas em São Leopoldo para teste de otimização de rotas
    {
      clientName: 'Condomínio Vale Verde',
      address: 'Av. João Corrêa, 1250, São Leopoldo - RS',
      date: new Date().toISOString().split('T')[0], // Hoje
      time: '09:30',
      type: 'inspection',
      status: 'scheduled',
      priority: 'normal',
      description: 'Inspeção de telhado após chuva forte recente. Cliente relatou possível infiltração.',
      contactInfo: 'Ricardo Muller (51) 99874-3210',
      checklist: checklistTemplates.inspection,
      photos: [],
      documents: [],
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: true
    },
    {
      clientName: 'Escola Municipal Pedro Adams',
      address: 'Rua São Joaquim, 880, São Leopoldo - RS',
      date: new Date().toISOString().split('T')[0], // Hoje
      time: '11:00',
      type: 'maintenance',
      status: 'scheduled',
      priority: 'high',
      description: 'Manutenção preventiva em telhado de escola. Preparação para temporada de chuvas.',
      contactInfo: 'Joana Torres (51) 99765-4433',
      checklist: checklistTemplates.maintenance,
      photos: [],
      documents: [],
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: true
    },
    {
      clientName: 'Shopping Bourbon São Leopoldo',
      address: 'Av. Unisinos, 855, São Leopoldo - RS',
      date: new Date().toISOString().split('T')[0], // Hoje
      time: '14:00',
      type: 'repair',
      status: 'scheduled',
      priority: 'urgent',
      description: 'Reparo de telhas danificadas na área do estacionamento coberto. Cliente relatou goteiras.',
      contactInfo: 'Fernando Mello (51) 99888-7733',
      checklist: checklistTemplates.repair,
      photos: [],
      documents: [],
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: true
    },
    {
      clientName: 'Universidade Unisinos',
      address: 'Av. Unisinos, 950, São Leopoldo - RS',
      date: new Date().toISOString().split('T')[0], // Hoje
      time: '16:30',
      type: 'installation',
      status: 'scheduled',
      priority: 'normal',
      description: 'Instalação de telhas para novo pavilhão do campus. Verificação técnica prévia.',
      contactInfo: 'Prof. Antonio Villas (51) 99632-1478',
      checklist: checklistTemplates.installation,
      photos: [],
      documents: [],
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: true
    },
    // Visitas originais
    {
      clientName: 'Construtora Alves',
      address: 'Av. Paulista, 1000, São Paulo - SP',
      date: '2023-05-15',
      time: '14:30',
      type: 'installation',
      status: 'scheduled',
      priority: 'normal',
      description: 'Instalação de telhas para nova área coberta em obra comercial. Cliente solicitou orientações sobre manutenção preventiva.',
      contactInfo: 'João Silva (11) 98765-4321',
      checklist: checklistTemplates.installation,
      photos: [],
      documents: [],
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: true
    },
    {
      clientName: 'Residencial Palmeiras',
      address: 'Rua das Flores, 123, Campinas - SP',
      date: '2023-05-15',
      time: '16:00',
      type: 'maintenance',
      status: 'pending',
      priority: 'high',
      description: 'Manutenção preventiva em telhado residencial. Cliente relatou preocupação com chuvas fortes previstas.',
      contactInfo: 'Maria Oliveira (19) 98765-1234',
      checklist: checklistTemplates.maintenance,
      photos: [],
      documents: [],
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: true
    },
    {
      clientName: 'Plaza Shopping Center',
      address: 'Rodovia BR-101, Km 30, Rio de Janeiro - RJ',
      date: '2023-05-15',
      time: '09:00',
      type: 'emergency',
      status: 'urgent',
      priority: 'urgent',
      description: 'Infiltração emergencial no teto da praça de alimentação. Área isolada temporariamente.',
      contactInfo: 'Roberto Santos (21) 99876-5432',
      checklist: checklistTemplates.inspection,
      photos: [],
      documents: [],
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: true
    },
    {
      clientName: 'Edifício Corporate Tower',
      address: 'Av. Brigadeiro Faria Lima, 4500, São Paulo - SP',
      date: '2023-05-14',
      time: '11:00',
      type: 'inspection',
      status: 'in-progress',
      priority: 'normal',
      description: 'Inspeção anual de cobertura conforme contrato de manutenção preventiva.',
      contactInfo: 'Carla Mendes (11) 97654-3210',
      checklist: checklistTemplates.inspection,
      photos: [],
      documents: [],
      notes: 'Inspeção iniciada, identificados alguns pontos de atenção na área norte do prédio.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: true
    }
  ];

  // Clear existing data
  await db.visits.clear();
  
  // Add sample visits with IDs
  for (const visit of sampleVisits) {
    await db.visits.add({
      ...visit,
      id: Math.floor(Math.random() * 1000000).toString(),
    });
  }

  // Sample user
  await db.userProfile.clear();
  await db.userProfile.add({
    id: '1',
    name: 'Carlos Silva',
    email: 'carlos.silva@brasilit.com.br',
    role: 'Técnico de Campo',
    photoUrl: ''
  });

  // Sample weekly performance
  await db.weeklyPerformance.clear();
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const sampleData = [
    { day: 'Seg', visits: 3, timeSpent: 360, efficiency: 85 },
    { day: 'Ter', visits: 4, timeSpent: 420, efficiency: 90 },
    { day: 'Qua', visits: 2, timeSpent: 240, efficiency: 80 },
    { day: 'Qui', visits: 5, timeSpent: 480, efficiency: 95 },
    { day: 'Sex', visits: 4, timeSpent: 390, efficiency: 88 },
    { day: 'Sab', visits: 2, timeSpent: 180, efficiency: 85 },
    { day: 'Dom', visits: 0, timeSpent: 0, efficiency: 0 }
  ];
  
  for (const data of sampleData) {
    await db.weeklyPerformance.add(data);
  }

  console.log('Development database initialized with sample data');
};

// Initialize database if in development mode
if (import.meta.env.DEV) {
  initializeDevDatabase();
}

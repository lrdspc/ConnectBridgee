import { 
  User, InsertUser, 
  Visit, InsertVisit,
  WeeklyPerformance, InsertWeeklyPerformance,
  visitStatusEnum, visitTypeEnum, visitPriorityEnum,
  ChecklistItem, VisitPhoto, VisitDocument,
  Report, InsertReport, reportStatusEnum, reportTypeEnum
} from "@shared/schema";

// Define the storage interface for CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Visit operations
  getVisit(id: number): Promise<Visit | undefined>;
  getVisits(userId?: number, filter?: string): Promise<Visit[]>;
  createVisit(visit: InsertVisit): Promise<Visit>;
  updateVisit(id: number, updates: Partial<Visit>): Promise<Visit | undefined>;
  deleteVisit(id: number): Promise<boolean>;
  getVisitsSince(timestamp: string, userId?: number): Promise<Visit[]>;
  
  // Performance operations
  getWeeklyPerformance(userId: number): Promise<WeeklyPerformance[]>;
  updateWeeklyPerformance(userId: number, day: string, data: Partial<WeeklyPerformance>): Promise<WeeklyPerformance | undefined>;
  
  // Report operations
  getReport(id: number): Promise<Report | undefined>;
  getReports(userId?: number, filter?: string): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  updateReport(id: number, updates: Partial<Report>): Promise<Report | undefined>;
  deleteReport(id: number): Promise<boolean>;
  shareReport(id: number, shareData: {email: string, name: string}): Promise<Report | undefined>;
  getReportsByEntity(entityType: string, entityId: number): Promise<Report[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private visits: Map<number, Visit>;
  private weeklyPerformance: Map<string, WeeklyPerformance>; // key format: userId_day
  private reports: Map<number, Report>; // Reports storage
  private userIdCounter: number;
  private visitIdCounter: number;
  private performanceIdCounter: number;
  private reportIdCounter: number;

  constructor() {
    this.users = new Map();
    this.visits = new Map();
    this.weeklyPerformance = new Map();
    this.reports = new Map();
    this.userIdCounter = 1;
    this.visitIdCounter = 1;
    this.performanceIdCounter = 1;
    this.reportIdCounter = 1;
    
    // Initialize with a sample user
    this.createUser({
      username: "tecnico",
      password: "senha123",
      name: "Carlos Silva",
      email: "carlos.silva@brasilit.com.br",
      role: "Técnico de Campo",
      photoUrl: ""
    });
    
    // Initialize sample weekly performance data
    const userId = 1;
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
    
    sampleData.forEach(data => {
      this.updateWeeklyPerformance(userId, data.day, {
        visits: data.visits,
        timeSpent: data.timeSpent,
        efficiency: data.efficiency
      });
    });
    
    // Initialize with sample visits
    const checklistTemplates: Record<string, ChecklistItem[]> = {
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
      ]
    };
    
    // Add sample visits
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
    
    this.createVisit({
      clientName: "Construtora Alves",
      address: "Av. Paulista, 1000, São Paulo - SP",
      date: today,
      time: "14:30",
      type: "installation",
      status: "scheduled",
      priority: "normal",
      description: "Instalação de telhas para nova área coberta em obra comercial. Cliente solicitou orientações sobre manutenção preventiva.",
      contactInfo: "João Silva (11) 98765-4321",
      checklist: checklistTemplates.installation,
      userId: 1
    });
    
    this.createVisit({
      clientName: "Residencial Palmeiras",
      address: "Rua das Flores, 123, Campinas - SP",
      date: today,
      time: "16:00",
      type: "maintenance",
      status: "pending",
      priority: "high",
      description: "Manutenção preventiva em telhado residencial. Cliente relatou preocupação com chuvas fortes previstas.",
      contactInfo: "Maria Oliveira (19) 98765-1234",
      checklist: checklistTemplates.maintenance,
      userId: 1
    });
    
    this.createVisit({
      clientName: "Plaza Shopping Center",
      address: "Rodovia BR-101, Km 30, Rio de Janeiro - RJ",
      date: today,
      time: "09:00",
      type: "emergency",
      status: "urgent",
      priority: "urgent",
      description: "Infiltração emergencial no teto da praça de alimentação. Área isolada temporariamente.",
      contactInfo: "Roberto Santos (21) 99876-5432",
      checklist: [],
      userId: 1
    });
    
    this.createVisit({
      clientName: "Edifício Corporate Tower",
      address: "Av. Brigadeiro Faria Lima, 4500, São Paulo - SP",
      date: tomorrow,
      time: "11:00",
      type: "inspection",
      status: "scheduled",
      priority: "normal",
      description: "Inspeção anual de cobertura conforme contrato de manutenção preventiva.",
      contactInfo: "Carla Mendes (11) 97654-3210",
      checklist: [],
      userId: 1
    });
    
    // Adicionar relatórios de demonstração
    this.createReport({
      title: "Relatório de Inspeção - Construtora Horizonte",
      type: "roof_inspection",
      status: "completed",
      clientName: "Construtora Horizonte LTDA",
      address: "Av. Paulista, 1578, São Paulo, SP",
      relatedEntityId: 1,
      relatedEntityType: "visit",
      content: {
        conclusion: "Telhado em boas condições, com pequenos problemas de vedação na calha norte.",
        recommendations: "Substituição do sistema de vedação da calha norte e monitoramento preventivo a cada 6 meses."
      },
      problemsIdentified: 7,
      recommendations: 5,
      pdfUrl: "/reports/report-1.pdf",
      userId: 1
    });
    
    this.createReport({
      title: "Relatório Parcial - Residencial Parque Sul",
      type: "roof_inspection",
      status: "draft",
      clientName: "Residencial Parque Sul",
      address: "Av. das Nações Unidas, 1200, São Paulo, SP",
      relatedEntityId: 2,
      relatedEntityType: "visit",
      content: {
        conclusion: "Avaliação preliminar identificou problemas de infiltração em 20% da área coberta.",
        recommendations: "Pendente de avaliação final."
      },
      problemsIdentified: 5,
      recommendations: 3,
      userId: 1
    });
    
    this.createReport({
      title: "Avaliação Estrutural - Edifício Comercial Centro",
      type: "structural",
      status: "completed",
      clientName: "Edifício Comercial Centro",
      address: "Rua XV de Novembro, 100, São Paulo, SP",
      relatedEntityId: 3,
      relatedEntityType: "visit",
      content: {
        conclusion: "Estrutura de suporte em boas condições, com pontos de atenção na área oeste.",
        recommendations: "Reforço pontual na estrutura oeste e nova avaliação em 12 meses."
      },
      problemsIdentified: 2,
      recommendations: 4,
      pdfUrl: "/reports/report-3.pdf",
      userId: 1
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const newUser: User = {
      ...user,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      ...updates,
      id,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Visit operations
  async getVisit(id: number): Promise<Visit | undefined> {
    return this.visits.get(id);
  }

  async getVisits(userId?: number, filter?: string): Promise<Visit[]> {
    let visits = Array.from(this.visits.values());
    
    // Filter by user if provided
    if (userId !== undefined) {
      visits = visits.filter(visit => visit.userId === userId);
    }
    
    // Filter by status if provided
    if (filter && filter !== 'all') {
      visits = visits.filter(visit => visit.status === filter);
    }
    
    // Sort by date (most recent first)
    return visits.sort((a, b) => {
      const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateComparison !== 0) return dateComparison;
      
      // If dates are the same, compare by priority (urgent first)
      const priorityOrder: Record<string, number> = { urgent: 0, high: 1, normal: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  async createVisit(visit: InsertVisit): Promise<Visit> {
    const id = this.visitIdCounter++;
    const now = new Date();
    
    // Create a normalized visit object
    const newVisit: Visit = {
      ...visit,
      id,
      checklist: visit.checklist || [],
      photos: visit.photos || [],
      documents: visit.documents || [],
      notes: visit.notes || "",
      createdAt: now,
      updatedAt: now,
      completedAt: undefined
    };
    
    this.visits.set(id, newVisit);
    return newVisit;
  }

  async updateVisit(id: number, updates: Partial<Visit>): Promise<Visit | undefined> {
    const visit = this.visits.get(id);
    if (!visit) return undefined;
    
    const updatedVisit: Visit = {
      ...visit,
      ...updates,
      id,
      updatedAt: new Date()
    };
    
    // Update completedAt if status changed to completed
    if (updates.status === 'completed' && visit.status !== 'completed') {
      updatedVisit.completedAt = new Date();
    }
    
    this.visits.set(id, updatedVisit);
    return updatedVisit;
  }

  async deleteVisit(id: number): Promise<boolean> {
    return this.visits.delete(id);
  }

  async getVisitsSince(timestamp: string, userId?: number): Promise<Visit[]> {
    const since = new Date(timestamp);
    let visits = Array.from(this.visits.values());
    
    // Filter by timestamp and user if provided
    visits = visits.filter(visit => {
      const updatedAt = new Date(visit.updatedAt);
      return updatedAt >= since && (userId === undefined || visit.userId === userId);
    });
    
    return visits;
  }

  // Performance operations
  async getWeeklyPerformance(userId: number): Promise<WeeklyPerformance[]> {
    const performances = Array.from(this.weeklyPerformance.values()).filter(
      perf => perf.userId === userId
    );
    
    // Sort by day of week (Monday first)
    const dayOrder: Record<string, number> = { 
      'Seg': 0, 'Ter': 1, 'Qua': 2, 'Qui': 3, 'Sex': 4, 'Sab': 5, 'Dom': 6 
    };
    
    return performances.sort((a, b) => dayOrder[a.day] - dayOrder[b.day]);
  }

  async updateWeeklyPerformance(userId: number, day: string, data: Partial<WeeklyPerformance>): Promise<WeeklyPerformance | undefined> {
    const key = `${userId}_${day}`;
    let performance = this.weeklyPerformance.get(key);
    
    if (performance) {
      // Update existing performance
      performance = {
        ...performance,
        ...data,
        date: new Date()
      };
    } else {
      // Create new performance
      const id = this.performanceIdCounter++;
      performance = {
        id,
        userId,
        day,
        visits: data.visits || 0,
        timeSpent: data.timeSpent || 0,
        efficiency: data.efficiency || 0,
        date: new Date()
      };
    }
    
    this.weeklyPerformance.set(key, performance);
    return performance;
  }

  // Report operations
  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getReports(userId?: number, filter?: string): Promise<Report[]> {
    let reports = Array.from(this.reports.values());
    
    // Filter by user if provided
    if (userId !== undefined) {
      reports = reports.filter(report => report.userId === userId);
    }
    
    // Filter by status if provided
    if (filter && filter !== 'all') {
      reports = reports.filter(report => report.status === filter);
    }
    
    // Sort by date (most recent first)
    return reports.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async createReport(report: InsertReport): Promise<Report> {
    const id = this.reportIdCounter++;
    const now = new Date();
    
    // Create normalized report object
    const newReport: Report = {
      ...report,
      id,
      status: report.status || "draft",
      problemsIdentified: report.problemsIdentified || 0,
      recommendations: report.recommendations || 0,
      isShared: report.isShared || false,
      sharedWith: report.sharedWith || [],
      createdAt: now,
      updatedAt: now,
      completedAt: null
    };
    
    this.reports.set(id, newReport);
    return newReport;
  }

  async updateReport(id: number, updates: Partial<Report>): Promise<Report | undefined> {
    const report = this.reports.get(id);
    if (!report) return undefined;
    
    const updatedReport: Report = {
      ...report,
      ...updates,
      id,
      updatedAt: new Date()
    };
    
    // Update completedAt if status changed to completed
    if (updates.status === 'completed' && report.status !== 'completed') {
      updatedReport.completedAt = new Date();
    }
    
    this.reports.set(id, updatedReport);
    return updatedReport;
  }

  async deleteReport(id: number): Promise<boolean> {
    return this.reports.delete(id);
  }

  async shareReport(id: number, shareData: {email: string, name: string}): Promise<Report | undefined> {
    const report = this.reports.get(id);
    if (!report) return undefined;
    
    const now = new Date();
    const shareInfo = {
      email: shareData.email,
      name: shareData.name,
      date: now.toISOString()
    };
    
    // Clone sharedWith array to avoid modifying the original
    const sharedWith = [...(report.sharedWith || [])];
    
    // Check if already shared with this email
    const alreadyShared = sharedWith.some(s => s.email === shareData.email);
    if (!alreadyShared) {
      sharedWith.push(shareInfo);
    }
    
    // Update report
    const updatedReport: Report = {
      ...report,
      isShared: true,
      sharedWith,
      updatedAt: now
    };
    
    this.reports.set(id, updatedReport);
    return updatedReport;
  }

  async getReportsByEntity(entityType: string, entityId: number): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(
      report => report.relatedEntityType === entityType && report.relatedEntityId === entityId
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

// Create and export an instance of the storage
export const storage = new MemStorage();

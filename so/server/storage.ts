import { User, InsertUser, Visit, InsertVisit, WeeklyPerformance, Report, InsertReport } from "../shared/schema";

// Interface para as operações de armazenamento
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

// Implementação em memória para armazenamento
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

    // Adicionar alguns usuários de teste
    this.createUser({
      username: "tech1",
      password: "password",
      name: "Carlos Silva",
      email: "carlos.silva@brasilit.com",
      role: "tecnico",
      regional: "Sudeste",
      departamento: "Assistência Técnica"
    });

    this.createUser({
      username: "gerente",
      password: "password",
      name: "Ana Lima",
      email: "ana.lima@brasilit.com",
      role: "gerente",
      regional: "Nacional",
      departamento: "Gestão de Qualidade"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date().toISOString();
    
    const newUser: User = {
      id,
      ...user,
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
      id, // ensure id doesn't change
      updatedAt: new Date().toISOString()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getVisit(id: number): Promise<Visit | undefined> {
    return this.visits.get(id);
  }

  async getVisits(userId?: number, filter?: string): Promise<Visit[]> {
    let visits = Array.from(this.visits.values());
    
    if (userId) {
      visits = visits.filter(visit => visit.userId === userId);
    }
    
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      visits = visits.filter(visit => 
        visit.clientName.toLowerCase().includes(lowerFilter) ||
        visit.address.toLowerCase().includes(lowerFilter) ||
        visit.status.toLowerCase().includes(lowerFilter) ||
        visit.type.toLowerCase().includes(lowerFilter)
      );
    }
    
    return visits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createVisit(visit: InsertVisit): Promise<Visit> {
    const id = this.visitIdCounter++;
    const now = new Date().toISOString();
    
    const newVisit: Visit = {
      id,
      ...visit,
      createdAt: now,
      updatedAt: now,
      completedAt: undefined,
      synced: false
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
      id, // ensure id doesn't change
      updatedAt: new Date().toISOString()
    };
    
    if (updates.status === "concluida" && !visit.completedAt) {
      updatedVisit.completedAt = new Date().toISOString();
    }
    
    this.visits.set(id, updatedVisit);
    return updatedVisit;
  }

  async deleteVisit(id: number): Promise<boolean> {
    return this.visits.delete(id);
  }

  async getVisitsSince(timestamp: string, userId?: number): Promise<Visit[]> {
    const since = new Date(timestamp).getTime();
    let visits = Array.from(this.visits.values()).filter(
      visit => new Date(visit.updatedAt).getTime() > since
    );
    
    if (userId) {
      visits = visits.filter(visit => visit.userId === userId);
    }
    
    return visits;
  }

  async getWeeklyPerformance(userId: number): Promise<WeeklyPerformance[]> {
    const performances: WeeklyPerformance[] = [];
    for (const [key, performance] of this.weeklyPerformance.entries()) {
      if (key.startsWith(`${userId}_`)) {
        performances.push(performance);
      }
    }
    return performances;
  }

  async updateWeeklyPerformance(userId: number, day: string, data: Partial<WeeklyPerformance>): Promise<WeeklyPerformance | undefined> {
    const key = `${userId}_${day}`;
    let performance = this.weeklyPerformance.get(key);
    
    if (!performance) {
      const id = this.performanceIdCounter++;
      const now = new Date().toISOString();
      
      performance = {
        id,
        userId,
        day,
        visits: 0,
        timeSpent: 0,
        efficiency: 0,
        createdAt: now,
        updatedAt: now
      };
    }
    
    const updatedPerformance: WeeklyPerformance = {
      ...performance,
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    this.weeklyPerformance.set(key, updatedPerformance);
    return updatedPerformance;
  }

  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getReports(userId?: number, filter?: string): Promise<Report[]> {
    let reports = Array.from(this.reports.values());
    
    if (userId) {
      reports = reports.filter(report => report.userId === userId);
    }
    
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      reports = reports.filter(report => 
        report.title.toLowerCase().includes(lowerFilter) ||
        report.type.toLowerCase().includes(lowerFilter) ||
        report.status.toLowerCase().includes(lowerFilter)
      );
    }
    
    return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createReport(report: InsertReport): Promise<Report> {
    const id = this.reportIdCounter++;
    const now = new Date().toISOString();
    
    const newReport: Report = {
      id,
      ...report,
      sharedWith: report.sharedWith || [],
      createdAt: now,
      updatedAt: now,
      publishedAt: undefined
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
      id, // ensure id doesn't change
      updatedAt: new Date().toISOString()
    };
    
    if (updates.status === "publicado" && !report.publishedAt) {
      updatedReport.publishedAt = new Date().toISOString();
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
    
    const updatedReport: Report = {
      ...report,
      sharedWith: [...(report.sharedWith || []), shareData],
      updatedAt: new Date().toISOString()
    };
    
    this.reports.set(id, updatedReport);
    return updatedReport;
  }

  async getReportsByEntity(entityType: string, entityId: number): Promise<Report[]> {
    const reports = Array.from(this.reports.values()).filter(
      report => report.entityType === entityType && report.entityId === entityId
    );
    
    return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

// Exportar uma instância singleton do armazenamento em memória
export const storage = new MemStorage();
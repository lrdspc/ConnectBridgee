import express, { Express, Request, Response, Router } from "express";
import { Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { log } from "./vite";

declare module "express-session" {
  interface SessionData {
    userId: number;
    username: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const router = Router();
  
  // Configuração de sessão
  app.use(
    session({
      secret: "brasilit-app-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 horas
    })
  );

  // Middleware de análise de JSON
  app.use(express.json({ limit: "50mb" }));
  
  // Rotas de Autenticação
  router.post("/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: "Nome de usuário e senha são obrigatórios" });
    }
    
    const user = await storage.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    
    // Set session
    req.session.userId = user.id;
    req.session.username = user.username;
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  });
  
  router.post("/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao encerrar sessão" });
      }
      res.status(200).json({ message: "Sessão encerrada com sucesso" });
    });
  });
  
  router.get("/auth/me", async (req: Request, res: Response) => {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  });
  
  // Middleware de autenticação para rotas protegidas
  const requireAuth = async (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Não autenticado" });
    }
    next();
  };
  
  // Rotas de Visitas
  router.get("/visits", async (req: Request, res: Response) => {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const filter = req.query.filter as string | undefined;
    
    const visits = await storage.getVisits(userId, filter);
    return res.status(200).json(visits);
  });
  
  router.get("/visits/:id", async (req: Request, res: Response) => {
    const visitId = Number(req.params.id);
    
    if (isNaN(visitId)) {
      return res.status(400).json({ error: "ID de visita inválido" });
    }
    
    const visit = await storage.getVisit(visitId);
    
    if (!visit) {
      return res.status(404).json({ error: "Visita não encontrada" });
    }
    
    return res.status(200).json(visit);
  });
  
  router.post("/visits", requireAuth, async (req: Request, res: Response) => {
    const visitData = req.body;
    visitData.userId = req.session.userId;
    
    try {
      const newVisit = await storage.createVisit(visitData);
      return res.status(201).json(newVisit);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao criar visita" });
    }
  });
  
  router.patch("/visits/:id", requireAuth, async (req: Request, res: Response) => {
    const visitId = Number(req.params.id);
    
    if (isNaN(visitId)) {
      return res.status(400).json({ error: "ID de visita inválido" });
    }
    
    const updates = req.body;
    
    try {
      const updatedVisit = await storage.updateVisit(visitId, updates);
      
      if (!updatedVisit) {
        return res.status(404).json({ error: "Visita não encontrada" });
      }
      
      return res.status(200).json(updatedVisit);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar visita" });
    }
  });
  
  router.delete("/visits/:id", requireAuth, async (req: Request, res: Response) => {
    const visitId = Number(req.params.id);
    
    if (isNaN(visitId)) {
      return res.status(400).json({ error: "ID de visita inválido" });
    }
    
    const success = await storage.deleteVisit(visitId);
    
    if (!success) {
      return res.status(404).json({ error: "Visita não encontrada" });
    }
    
    return res.status(204).send();
  });
  
  // Rotas de sincronização
  router.post("/visits/sync", requireAuth, async (req: Request, res: Response) => {
    const visits = req.body.visits;
    
    if (!Array.isArray(visits)) {
      return res.status(400).json({ error: "Formato inválido, esperado um array de visitas" });
    }
    
    const results = [];
    
    for (const visitData of visits) {
      if (visitData.id) {
        // Update existing visit
        const { id, ...updates } = visitData;
        const updatedVisit = await storage.updateVisit(Number(id), updates);
        if (updatedVisit) {
          results.push(updatedVisit);
        }
      } else {
        // Create new visit
        visitData.userId = req.session.userId;
        const newVisit = await storage.createVisit(visitData);
        results.push(newVisit);
      }
    }
    
    return res.status(200).json(results);
  });
  
  router.get("/visits/sync", requireAuth, async (req: Request, res: Response) => {
    const timestamp = req.query.since as string;
    const userId = req.session.userId;
    
    if (!timestamp) {
      return res.status(400).json({ error: "Parâmetro 'since' é obrigatório" });
    }
    
    try {
      const visits = await storage.getVisitsSince(timestamp, userId);
      return res.status(200).json(visits);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao buscar visitas modificadas" });
    }
  });
  
  // Rotas de desempenho
  router.get("/performance/:userId", requireAuth, async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: "ID de usuário inválido" });
    }
    
    const performance = await storage.getWeeklyPerformance(userId);
    return res.status(200).json(performance);
  });
  
  router.patch("/performance/:userId/:day", requireAuth, async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const day = req.params.day;
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: "ID de usuário inválido" });
    }
    
    const updates = req.body;
    
    try {
      const updatedPerformance = await storage.updateWeeklyPerformance(userId, day, updates);
      return res.status(200).json(updatedPerformance);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar desempenho" });
    }
  });
  
  // Rotas de Relatórios
  router.get("/reports", async (req: Request, res: Response) => {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const filter = req.query.filter as string | undefined;
    
    const reports = await storage.getReports(userId, filter);
    return res.status(200).json(reports);
  });
  
  router.get("/reports/:id", async (req: Request, res: Response) => {
    const reportId = Number(req.params.id);
    
    if (isNaN(reportId)) {
      return res.status(400).json({ error: "ID de relatório inválido" });
    }
    
    const report = await storage.getReport(reportId);
    
    if (!report) {
      return res.status(404).json({ error: "Relatório não encontrado" });
    }
    
    return res.status(200).json(report);
  });
  
  router.post("/reports", requireAuth, async (req: Request, res: Response) => {
    const reportData = req.body;
    reportData.userId = req.session.userId;
    
    try {
      const newReport = await storage.createReport(reportData);
      return res.status(201).json(newReport);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao criar relatório" });
    }
  });
  
  router.patch("/reports/:id", requireAuth, async (req: Request, res: Response) => {
    const reportId = Number(req.params.id);
    
    if (isNaN(reportId)) {
      return res.status(400).json({ error: "ID de relatório inválido" });
    }
    
    const updates = req.body;
    
    try {
      const updatedReport = await storage.updateReport(reportId, updates);
      
      if (!updatedReport) {
        return res.status(404).json({ error: "Relatório não encontrado" });
      }
      
      return res.status(200).json(updatedReport);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar relatório" });
    }
  });
  
  router.delete("/reports/:id", requireAuth, async (req: Request, res: Response) => {
    const reportId = Number(req.params.id);
    
    if (isNaN(reportId)) {
      return res.status(400).json({ error: "ID de relatório inválido" });
    }
    
    const success = await storage.deleteReport(reportId);
    
    if (!success) {
      return res.status(404).json({ error: "Relatório não encontrado" });
    }
    
    return res.status(204).send();
  });
  
  router.post("/reports/:id/share", requireAuth, async (req: Request, res: Response) => {
    const reportId = Number(req.params.id);
    
    if (isNaN(reportId)) {
      return res.status(400).json({ error: "ID de relatório inválido" });
    }
    
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: "Email e nome são obrigatórios" });
    }
    
    try {
      const updatedReport = await storage.shareReport(reportId, { email, name });
      
      if (!updatedReport) {
        return res.status(404).json({ error: "Relatório não encontrado" });
      }
      
      return res.status(200).json(updatedReport);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao compartilhar relatório" });
    }
  });
  
  router.get("/entity/:type/:id/reports", async (req: Request, res: Response) => {
    const entityType = req.params.type;
    const entityId = Number(req.params.id);
    
    if (isNaN(entityId)) {
      return res.status(400).json({ error: "ID de entidade inválido" });
    }
    
    const reports = await storage.getReportsByEntity(entityType, entityId);
    return res.status(200).json(reports);
  });
  
  // Rota para download de documentos
  router.post("/download-document", async (req: Request, res: Response) => {
    const { htmlContent, fileName } = req.body;
    
    if (!htmlContent) {
      return res.status(400).json({ error: "Conteúdo HTML é obrigatório" });
    }
    
    try {
      // Simulando a conversão HTML para DOCX
      // No ambiente real, seria usado alguma biblioteca como html-to-docx
      
      // Para teste, apenas retornamos um status de sucesso
      return res.status(200).json({ 
        success: true, 
        message: "Download simulado com sucesso",
        fileName: fileName || "documento.docx"
      });
    } catch (error) {
      console.error("Erro ao gerar documento:", error);
      return res.status(500).json({ error: "Erro ao gerar documento" });
    }
  });

  // Registrar as rotas
  app.use("/api", router);
  
  return app.listen(5000, "0.0.0.0", () => {
    log(`serving on port 5000 (http://0.0.0.0:5000)`);
  });
}
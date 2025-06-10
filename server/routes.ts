import express, { Request, Response } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, insertVisitSchema, insertReportSchema,
  visitStatusEnum, visitTypeEnum, visitPriorityEnum,
  reportStatusEnum, reportTypeEnum
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();
  
  // Middleware to parse request body
  router.use(express.json());
  
  // Authentication routes
  router.post("/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Create a sanitized user object (without password)
      const sanitizedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoUrl: user.photoUrl
      };
      
      // In a real app, set up a session here
      return res.status(200).json(sanitizedUser);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.post("/auth/logout", (req: Request, res: Response) => {
    // In a real app, destroy the session here
    return res.status(200).json({ message: "Logged out successfully" });
  });
  
  router.get("/auth/me", async (req: Request, res: Response) => {
    // In a real app, get the user from the session
    // For now, we'll return a mock user
    try {
      const user = await storage.getUser(1);
      
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Create a sanitized user object (without password)
      const sanitizedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoUrl: user.photoUrl
      };
      
      return res.status(200).json(sanitizedUser);
    } catch (error) {
      console.error("Get me error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Visit routes
  router.get("/visits", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const filter = req.query.filter as string | undefined;
      
      const visits = await storage.getVisits(userId, filter);
      return res.status(200).json(visits);
    } catch (error) {
      console.error("Get visits error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.get("/visits/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid visit ID" });
      }
      
      const visit = await storage.getVisit(id);
      
      if (!visit) {
        return res.status(404).json({ message: "Visit not found" });
      }
      
      return res.status(200).json(visit);
    } catch (error) {
      console.error("Get visit error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.post("/visits", async (req: Request, res: Response) => {
    try {
      // Validate request body against schema
      const validationResult = insertVisitSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid visit data",
          errors: validationResult.error.errors
        });
      }
      
      const visit = await storage.createVisit(validationResult.data);
      return res.status(201).json(visit);
    } catch (error) {
      console.error("Create visit error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.patch("/visits/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid visit ID" });
      }
      
      // Get existing visit
      const existingVisit = await storage.getVisit(id);
      
      if (!existingVisit) {
        return res.status(404).json({ message: "Visit not found" });
      }
      
      // Validate request body (partially)
      const updateSchema = z.object({
        clientName: z.string().optional(),
        address: z.string().optional(),
        date: z.string().optional(),
        time: z.string().optional(),
        type: visitTypeEnum.optional(),
        status: visitStatusEnum.optional(),
        priority: visitPriorityEnum.optional(),
        description: z.string().optional(),
        contactInfo: z.string().optional(),
        checklist: z.array(z.object({
          id: z.string(),
          text: z.string(),
          description: z.string().optional(),
          completed: z.boolean()
        })).optional(),
        photos: z.array(z.object({
          id: z.string(),
          dataUrl: z.string(),
          timestamp: z.string(),
          notes: z.string().optional()
        })).optional(),
        documents: z.array(z.object({
          id: z.string(),
          name: z.string(),
          type: z.string(),
          dataUrl: z.string(),
          timestamp: z.string()
        })).optional(),
        notes: z.string().optional()
      });
      
      const validationResult = updateSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid update data",
          errors: validationResult.error.errors
        });
      }
      
      const updatedVisit = await storage.updateVisit(id, validationResult.data);
      return res.status(200).json(updatedVisit);
    } catch (error) {
      console.error("Update visit error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.delete("/visits/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid visit ID" });
      }
      
      const success = await storage.deleteVisit(id);
      
      if (!success) {
        return res.status(404).json({ message: "Visit not found" });
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error("Delete visit error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Sync routes
  router.post("/visits/sync", async (req: Request, res: Response) => {
    try {
      // Create or update visit from sync data
      const visit = req.body;
      
      if (!visit || !visit.id) {
        return res.status(400).json({ message: "Invalid sync data" });
      }
      
      // Validando os campos obrigatórios mínimos
      const requiredFields = ['clientName', 'address', 'date', 'type', 'status', 'priority'];
      const missingFields = requiredFields.filter(field => !visit[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          message: "Missing required fields", 
          fields: missingFields 
        });
      }
      
      if (typeof visit.id === 'string') {
        // This could be a new visit from the client with a temporary ID
        // In a real app, you would create a new visit with a proper ID
        const newVisit = await storage.createVisit({
          ...visit,
          id: undefined // Let the server assign the ID
        });
        
        return res.status(201).json(newVisit);
      } else {
        // Update existing visit
        const updatedVisit = await storage.updateVisit(visit.id, visit);
        
        if (!updatedVisit) {
          return res.status(404).json({ message: "Visit not found" });
        }
        
        return res.status(200).json(updatedVisit);
      }
    } catch (error) {
      console.error("Sync error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.get("/visits/sync", async (req: Request, res: Response) => {
    try {
      const since = req.query.since as string || new Date(0).toISOString();
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      
      const visits = await storage.getVisitsSince(since, userId);
      return res.status(200).json(visits);
    } catch (error) {
      console.error("Get sync error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Weekly performance routes
  router.get("/performance/:userId", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const performance = await storage.getWeeklyPerformance(userId);
      return res.status(200).json(performance);
    } catch (error) {
      console.error("Get performance error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.patch("/performance/:userId/:day", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      const day = req.params.day;
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      if (!['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].includes(day)) {
        return res.status(400).json({ message: "Invalid day" });
      }
      
      // Validate request body
      const updateSchema = z.object({
        visits: z.number().optional(),
        timeSpent: z.number().optional(),
        efficiency: z.number().optional()
      });
      
      const validationResult = updateSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid update data",
          errors: validationResult.error.errors
        });
      }
      
      const updatedPerformance = await storage.updateWeeklyPerformance(
        userId, day, validationResult.data
      );
      
      return res.status(200).json(updatedPerformance);
    } catch (error) {
      console.error("Update performance error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Report routes
  router.get("/reports", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const filter = req.query.filter as string | undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      
      // Validar parâmetros de paginação
      if (isNaN(page) || page < 1) {
        return res.status(400).json({ message: "Invalid page parameter" });
      }
      
      if (isNaN(limit) || limit < 1 || limit > 100) {
        return res.status(400).json({ message: "Invalid limit parameter (must be between 1 and 100)" });
      }
      
      const reports = await storage.getReports(userId, filter);
      
      // Calcular paginação
      const totalReports = reports.length;
      const totalPages = Math.ceil(totalReports / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedReports = reports.slice(startIndex, endIndex);
      
      return res.status(200).json({
        data: paginatedReports,
        pagination: {
          total: totalReports,
          page,
          limit,
          totalPages
        }
      });
    } catch (error) {
      console.error("Get reports error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.get("/reports/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      
      const report = await storage.getReport(id);
      
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      return res.status(200).json(report);
    } catch (error) {
      console.error("Get report error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.post("/reports", async (req: Request, res: Response) => {
    try {
      // Validate request body against schema
      const validationResult = insertReportSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid report data",
          errors: validationResult.error.errors
        });
      }
      
      const report = await storage.createReport(validationResult.data);
      return res.status(201).json(report);
    } catch (error) {
      console.error("Create report error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.patch("/reports/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      
      // Get existing report
      const existingReport = await storage.getReport(id);
      
      if (!existingReport) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      // Validate request body (partially)
      const updateSchema = z.object({
        title: z.string().optional(),
        type: reportTypeEnum.optional(),
        status: reportStatusEnum.optional(),
        clientName: z.string().optional(),
        address: z.string().optional(),
        relatedEntityId: z.number().optional(),
        relatedEntityType: z.string().optional(),
        content: z.any().optional(),
        problemsIdentified: z.number().optional(),
        recommendations: z.number().optional(),
        isShared: z.boolean().optional(),
        pdfUrl: z.string().optional(),
      });
      
      const validationResult = updateSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid update data",
          errors: validationResult.error.errors
        });
      }
      
      const updatedReport = await storage.updateReport(id, validationResult.data);
      return res.status(200).json(updatedReport);
    } catch (error) {
      console.error("Update report error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.delete("/reports/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      
      const success = await storage.deleteReport(id);
      
      if (!success) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error("Delete report error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.post("/reports/:id/share", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      
      // Validate request body
      const shareSchema = z.object({
        email: z.string().email(),
        name: z.string()
      });
      
      const validationResult = shareSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid share data",
          errors: validationResult.error.errors
        });
      }
      
      const updatedReport = await storage.shareReport(id, validationResult.data);
      
      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      return res.status(200).json(updatedReport);
    } catch (error) {
      console.error("Share report error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.get("/entity/:type/:id/reports", async (req: Request, res: Response) => {
    try {
      const entityType = req.params.type;
      const entityId = Number(req.params.id);
      
      if (!entityType || isNaN(entityId)) {
        return res.status(400).json({ message: "Invalid entity type or ID" });
      }
      
      const reports = await storage.getReportsByEntity(entityType, entityId);
      return res.status(200).json(reports);
    } catch (error) {
      console.error("Get entity reports error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Rota auxiliar para download de documentos
  router.post("/download-document", async (req: Request, res: Response) => {
    try {
      const { docBuffer, fileName, mimeType } = req.body;
      
      if (!docBuffer || !fileName) {
        return res.status(400).json({ message: "Dados inválidos para download" });
      }
      
      // Decodificar o documento Base64
      const buffer = Buffer.from(docBuffer, 'base64');
      
      // Configurar cabeçalhos para download
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', mimeType || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Length', buffer.length);
      
      // Enviar o documento como resposta para download
      return res.send(buffer);
    } catch (error) {
      console.error("Erro ao processar download:", error);
      return res.status(500).json({ message: "Erro ao processar o download do documento" });
    }
  });

  // Mount router on /api prefix
  app.use("/api", router);

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}

import express, { NextFunction, Request, Response } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

async function main() {
  const app = express();

  // Configurar middleware de CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    
    next();
  });

  // Configurar Vite para desenvolvimento
  const server = await registerRoutes(app);
  await setupVite(app, server);
  serveStatic(app);

  // Middleware de manipulação de erros
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Erro no servidor:", err);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: err.message || "Algo deu errado"
    });
  });
}

main().catch((err) => {
  log(`Erro ao iniciar o servidor: ${err}`, "error");
  process.exit(1);
});
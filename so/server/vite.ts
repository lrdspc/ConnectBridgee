import { Express } from "express";
import { Server } from "http";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

export function log(message: string, source = "express") {
  console.log(`${new Date().toLocaleTimeString()} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // Este ambiente já tem um servidor Vite configurado
  log("Vite development server já está configurado no ambiente Replit");
  
  // Não é necessário configurar o servidor Vite aqui,
  // pois o Replit já faz isso automaticamente
  
  return { vite: null, close: async () => {} };
}

export function serveStatic(app: Express) {
  // Este é apenas um espaço reservado no ambiente Replit
  // A configuração real é feita automaticamente
  log("Arquivos estáticos serão servidos automaticamente pelo Replit");
}
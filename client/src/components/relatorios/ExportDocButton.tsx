import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, FileDown, AlertTriangle, Loader2 } from "lucide-react";
import type { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { toast } from "sonner";
import { gerarRelatorioSimples } from "@/lib/relatorioVistoriaSimpleGenerator";

// Logs para debug - Habilitado para ajudar na diagnóstico de problemas
const DEBUG = true;
function log(...args: any[]) {
  if (DEBUG) console.log("[ExportDocButton]", ...args);
}

// Interface estendida para compatibilidade com versões anteriores do código
interface ExtendedRelatorioVistoria extends RelatorioVistoria {
  [key: string]: any; // Para permitir propriedades adicionais
}

interface ExportDocButtonProps {
  relatorio: ExtendedRelatorioVistoria;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  useNewGenerator?: boolean; // Determina qual gerador usar
}

export function ExportDocButton({ 
  relatorio,
  variant = "outline",
  size = "default",
  className = "",
  useNewGenerator = true
}: ExportDocButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Função para salvar o arquivo DOCX a partir de um blob
  const saveDocFile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    log("Download iniciado para arquivo:", fileName);
    
    // Limpar recursos
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };
  
  // Função para gerar o relatório e salvar
  const handleExportDoc = async () => {
    try {
      setIsGenerating(true);
      toast.info("Preparando relatório com formatação ABNT...");
      
      // Preparar dados do relatório (garantir padrões)
      const relatorioPreparado = {
        ...relatorio,
        // Forçar resultado como IMPROCEDENTE
        resultado: "IMPROCEDENTE" as "IMPROCEDENTE"
      };
      
      log("Relatório preparado:", {
        protocolo: relatorioPreparado.protocolo,
        cliente: relatorioPreparado.cliente,
        naoConformidades: relatorioPreparado.naoConformidades?.length || 0
      });
      
      // Definir nome do arquivo
      const fileName = `Relatório-${relatorioPreparado.protocolo || 'Vistoria'}-ABNT.docx`;
      
      // Usar o gerador que funciona corretamente
      log("Gerando relatório com o gerador simplificado");
      const blob = await gerarRelatorioSimples(relatorioPreparado);
      saveDocFile(blob, fileName);
      toast.success("Relatório ABNT exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar documento:", error);
      toast.error(`Erro ao exportar documento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Button 
      onClick={handleExportDoc} 
      variant={variant} 
      size={size}
      className={`gap-2 ${className}`}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Gerando ABNT...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          Exportar DOC (ABNT)
        </>
      )}
    </Button>
  );
}
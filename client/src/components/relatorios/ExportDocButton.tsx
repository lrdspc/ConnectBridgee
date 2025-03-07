import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, FileDown, Printer } from "lucide-react";
import type { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { toast } from "sonner";
import { generateRelatorioVistoriaBrasil } from "@/lib/relatorioVistoriaBrasilGenerator";
import { gerarRelatorioVistoriaDoc as gerarRelatorioVistoriaDocOriginal } from "@/lib/relatorioVistoriaDocGenerator";
import { gerarRelatorioVistoriaDoc as gerarRelatorioVistoriaDocSimples } from "@/lib/relatorioVistoriaDocGeneratorSimple";
import { gerarRelatorioVistoriaHTML } from "@/lib/relatorioVistoriaFallbackGenerator";

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
  
  // Função para gerar o relatório e salvar
  const handleExportDoc = async () => {
    try {
      setIsGenerating(true);
      toast.info("Gerando documento...");
      
      // Tentar gerar o documento usando várias estratégias
      try {
        // Estratégia 1: HTML como fallback de emergência
        // Este método é garantido que funciona em todos os navegadores
        console.log("Tentando geração com HTML fallback");
        await gerarRelatorioVistoriaHTML(relatorio);
        toast.success("Relatório exportado em formato HTML!");
        return; // Sai da função após sucesso
      } catch (htmlError) {
        console.error("Erro na geração HTML:", htmlError);
        toast.error(`Não foi possível gerar o relatório. Tente novamente.`);
      }
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
          <FileText className="h-4 w-4 animate-pulse" />
          Gerando...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          Exportar DOC
        </>
      )}
    </Button>
  );
}
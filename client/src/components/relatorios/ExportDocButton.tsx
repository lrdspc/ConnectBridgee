import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, FileDown } from "lucide-react";
import type { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { toast } from "sonner";
import { generateRelatorioVistoriaBrasil } from "@/lib/relatorioVistoriaBrasilGenerator";
import { gerarRelatorioVistoriaDoc } from "@/lib/relatorioVistoriaDocGenerator";

interface ExportDocButtonProps {
  relatorio: RelatorioVistoria;
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
      
      // Usar o gerador específico com base na flag
      const blob = useNewGenerator 
        ? await generateRelatorioVistoriaBrasil(relatorio)
        : await gerarRelatorioVistoriaDoc(relatorio);
      
      // Criar e clicar em um link temporário para fazer o download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Relatório-${relatorio.protocolo || 'Vistoria'}.docx`;
      document.body.appendChild(link);
      link.click();
      
      // Limpar recursos
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success("Documento exportado com sucesso!");
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
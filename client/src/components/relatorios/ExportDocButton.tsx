import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, FileDown, AlertTriangle, Loader2 } from "lucide-react";
import type { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { toast } from "sonner";
import { generateRelatorioVistoriaBrasil } from "@/lib/relatorioVistoriaBrasilGenerator";
import { gerarRelatorioVistoriaDoc as gerarRelatorioVistoriaDocOriginal } from "@/lib/relatorioVistoriaDocGenerator";
import { gerarRelatorioVistoriaDoc as gerarRelatorioVistoriaDocSimples } from "@/lib/relatorioVistoriaDocGeneratorSimple";
import { gerarRelatorioVistoriaHTML } from "@/lib/relatorioVistoriaFallbackGenerator";
import { gerarRelatorioVistoriaMinimal } from "@/lib/relatorioVistoriaMinimalGenerator";

// Logs para debug
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
  
  // Função para gerar o relatório e salvar
  const handleExportDoc = async () => {
    try {
      setIsGenerating(true);
      toast.info("Gerando documento DOCX...");
      
      // Tentar gerar o documento usando várias estratégias em sequência
      try {
        // Estratégia 1: Gerador DOCX minimalista com formatação ABNT
        log("Tentando geração com o gerador minimalista (formatação ABNT)");
        const blob = await gerarRelatorioVistoriaMinimal(relatorio);
        
        // Salvar o arquivo DOCX
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = `Relatório-${relatorio.protocolo || 'Vistoria'}.docx`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        log("Download iniciado para arquivo:", fileName);
        
        // Limpar recursos
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
        
        toast.success("Relatório exportado com sucesso!");
        return; // Sair da função após sucesso
      } catch (minimalError) {
        console.error("Erro na geração minimalista:", minimalError);
        
        // Se falhar, tentar próxima estratégia
        try {
          // Estratégia 2: Gerador DOCX simples
          console.log("Tentando geração com o gerador simples");
          const blob = await gerarRelatorioVistoriaDocSimples(relatorio);
          
          // Salvar o arquivo DOCX
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
          
          toast.success("Relatório exportado com sucesso!");
          return; // Sair da função após sucesso
        } catch (simplesError) {
          console.error("Erro na geração simples:", simplesError);
          
          // Se falhar, tentar última estratégia
          try {
            // Estratégia 3: Gerador DOCX completo
            console.log("Tentando geração com o gerador completo");
            const blob = await gerarRelatorioVistoriaDocOriginal(relatorio);
            
            // Salvar o arquivo DOCX
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
            
            toast.success("Relatório exportado com sucesso!");
            return; // Sair da função após sucesso
          } catch (originalError) {
            console.error("Erro na geração original:", originalError);
            
            // Se todas as tentativas DOCX falharem, mostrar mensagem de erro
            throw new Error("Não foi possível gerar o documento DOCX após múltiplas tentativas");
          }
        }
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
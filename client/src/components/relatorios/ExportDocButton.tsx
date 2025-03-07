import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, FileDown, AlertTriangle, Loader2 } from "lucide-react";
import type { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { toast } from "sonner";
import { generateRelatorioVistoriaBrasil } from "@/lib/relatorioVistoriaBrasilGenerator";
import { gerarRelatorioVistoriaDoc as gerarRelatorioVistoriaDocOriginal } from "@/lib/relatorioVistoriaDocGenerator";
import { gerarRelatorioVistoriaDoc as gerarRelatorioVistoriaDocSimples } from "@/lib/relatorioVistoriaDocGeneratorSimple";
import { gerarRelatorioVistoriaHTML } from "@/lib/relatorioVistoriaFallbackGenerator";
import { gerarRelatorioVistoriaBasico } from "@/lib/relatorioVistoriaBasicGenerator";

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
      
      // Tentar gerar o documento usando várias estratégias em sequência
      try {
        // Estratégia 1: Gerador DOCX básico com formatação ABNT
        log("▶️ TENTATIVA 1: Usando gerador básico otimizado (formatação ABNT)");
        const blob = await gerarRelatorioVistoriaBasico(relatorioPreparado);
        saveDocFile(blob, fileName);
        toast.success("Relatório ABNT exportado com sucesso!");
        return; // Sair da função após sucesso
      } catch (basicError) {
        console.error("❌ Erro na geração básica:", basicError);
        
        // Notificar o usuário do problema na primeira tentativa
        toast.warning("Tentando método alternativo...", {duration: 2000});
        
        // Se falhar, tentar próxima estratégia
        try {
          // Estratégia 2: Gerador DOCX simples
          log("▶️ TENTATIVA 2: Usando gerador simples com formatação ABNT");
          const blob = await gerarRelatorioVistoriaDocSimples(relatorioPreparado);
          saveDocFile(blob, fileName);
          toast.success("Relatório ABNT exportado com sucesso!");
          return; // Sair da função após sucesso
        } catch (simplesError) {
          console.error("❌ Erro na geração simples:", simplesError);
          
          // Notificar o usuário da segunda falha
          toast.warning("Tentando método de emergência...", {duration: 2000});
          
          // Se falhar, tentar última estratégia
          try {
            // Estratégia 3: Gerador DOCX completo (original)
            log("▶️ TENTATIVA 3: Usando gerador completo com formatação ABNT");
            const blob = await gerarRelatorioVistoriaDocOriginal(relatorioPreparado);
            saveDocFile(blob, fileName);
            toast.success("Relatório ABNT exportado com sucesso!");
            return; // Sair da função após sucesso
          } catch (originalError) {
            console.error("❌ Erro na geração original:", originalError);
            
            // Se todas as tentativas DOCX falharem, tentar HTML como último recurso
            try {
              log("▶️ TENTATIVA FINAL: Exportando como HTML (fallback de emergência)");
              await gerarRelatorioVistoriaHTML(relatorioPreparado);
              toast.success("Relatório exportado como HTML para visualização!");
              return;
            } catch (htmlError) {
              console.error("❌ Todas as tentativas falharam:", htmlError);
              throw new Error("Não foi possível gerar o documento após múltiplas tentativas");
            }
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
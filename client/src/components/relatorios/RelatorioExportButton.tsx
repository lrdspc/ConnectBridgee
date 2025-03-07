import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import type { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { toast } from "sonner";
import { gerarRelatorioSimples } from "@/lib/relatorioVistoriaSimpleGenerator";

// Logs para debug
const DEBUG = true;
function log(...args: any[]) {
  if (DEBUG) console.log("[RelatorioExportButton]", ...args);
}

// Interface estendida para compatibilidade com versões anteriores do código
export interface ExtendedRelatorioVistoria extends RelatorioVistoria {
  [key: string]: any; // Para permitir propriedades adicionais
}

export interface RelatorioExportButtonProps {
  /**
   * Dados do relatório a ser exportado
   */
  relatorio: ExtendedRelatorioVistoria;
  
  /**
   * Estilo do botão
   * @default "outline"
   */
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  
  /**
   * Tamanho do botão
   * @default "default"
   */
  size?: "default" | "sm" | "lg" | "icon";
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
  
  /**
   * Rótulo personalizado para o botão
   * @default "Exportar DOC (ABNT)"
   */
  label?: string;
  
  /**
   * Texto durante o carregamento
   * @default "Gerando ABNT..."
   */
  loadingLabel?: string;
  
  /**
   * Callback executado após a exportação bem-sucedida
   */
  onExportSuccess?: (fileName: string) => void;
  
  /**
   * Callback executado em caso de erro
   */
  onExportError?: (error: unknown) => void;
  
  /**
   * Prefixo para o nome do arquivo
   * @default "Relatório"
   */
  fileNamePrefix?: string;
}

/**
 * Componente unificado para exportação de relatórios em formato DOCX com padrão ABNT
 * 
 * Consolida as funcionalidades dos componentes ExportDocButton e ExportDocButtonNew,
 * além de implementar a lógica de exportação presente na página RelatorioVistoriaPage.
 */
export function RelatorioExportButton({ 
  relatorio,
  variant = "outline",
  size = "default",
  className = "",
  label = "Exportar DOC (ABNT)",
  loadingLabel = "Gerando ABNT...",
  onExportSuccess,
  onExportError,
  fileNamePrefix = "Relatório"
}: RelatorioExportButtonProps) {
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
      
      // Filtrar não conformidades selecionadas se necessário
      if (relatorioPreparado.naoConformidades) {
        // Se as não conformidades não tiverem informações detalhadas (apenas IDs e seleção),
        // buscar as informações completas da lista de disponíveis
        const naoConformidadesTemDetalhes = relatorioPreparado.naoConformidades.some(
          nc => nc.titulo && nc.descricao
        );
        
        if (!naoConformidadesTemDetalhes && typeof window !== 'undefined') {
          // Importação dinâmica para evitar problemas com SSR
          const { naoConformidadesDisponiveis } = await import('@shared/relatorioVistoriaSchema');
          
          relatorioPreparado.naoConformidades = relatorioPreparado.naoConformidades
            .filter(nc => nc.selecionado)
            .map(nc => {
              const completa = naoConformidadesDisponiveis.find(item => item.id === nc.id);
              return {
                id: nc.id,
                titulo: completa?.titulo || '',
                descricao: completa?.descricao || '',
                selecionado: true
              };
            });
        }
      }
      
      log("Relatório preparado:", {
        protocolo: relatorioPreparado.protocolo,
        cliente: relatorioPreparado.cliente,
        naoConformidades: relatorioPreparado.naoConformidades?.length || 0
      });
      
      // Definir nome do arquivo
      const fileName = `${fileNamePrefix}-${relatorioPreparado.protocolo || 'Vistoria'}-ABNT.docx`;
      
      // Gerar o relatório com o gerador padrão
      log("Gerando relatório com formatação ABNT exata");
      const blob = await gerarRelatorioSimples(relatorioPreparado);
      saveDocFile(blob, fileName);
      
      toast.success("Relatório ABNT exportado com sucesso!");
      onExportSuccess?.(fileName);
    } catch (error) {
      console.error("Erro ao exportar documento:", error);
      toast.error(`Erro ao exportar documento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      onExportError?.(error);
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
          {loadingLabel}
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
}
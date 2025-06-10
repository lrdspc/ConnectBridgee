import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import type { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { toast } from "sonner";
import { gerarRelatorioSimples } from "@/lib/relatorioVistoriaSimpleGeneratorNew";
import { downloadBlob, createUniqueFileName } from "@/lib/docDownloadUtils";

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
  const saveDocFile = async (blob: Blob, fileName: string) => {
    log("Iniciando download do arquivo:", fileName);
    
    try {
      // Usar nossa nova função de utilidade com múltiplos fallbacks
      const success = await downloadBlob(blob, fileName);
      
      if (success) {
        log("Download iniciado com sucesso");
      } else {
        log("Falha em todos os métodos de download");
        toast.error("Não foi possível fazer o download do arquivo");
      }
    } catch (error) {
      console.error("Erro ao tentar download:", error);
      toast.error(`Erro no download: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };
  
  // Função para gerar o relatório e salvar
  const handleExportDoc = async () => {
    try {
      setIsGenerating(true);
      toast.info("Preparando relatório com formatação ABNT...");
      
      // Verificar se temos dados suficientes
      if (!relatorio.cliente || !relatorio.dataVistoria) {
        toast.error("Preencha ao menos os campos básicos (cliente e data de vistoria)");
        setIsGenerating(false);
        return;
      }
      
      log("Dados recebidos para relatório:", {
        cliente: relatorio.cliente,
        dataVistoria: relatorio.dataVistoria,
        protocolo: relatorio.protocolo,
        modeloTelha: relatorio.modeloTelha,
        espessura: relatorio.espessura,
        resultado: relatorio.resultado,
      });
      
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
      
      // Definir nome do arquivo com timestamp para evitar problemas de cache
      const fileName = createUniqueFileName(
        `${fileNamePrefix}-${relatorioPreparado.protocolo || 'Vistoria'}-ABNT`,
        "docx"
      );
      
      // Gerar o relatório com o gerador padrão
      log("Gerando relatório com formatação ABNT exata");
      const blob = await gerarRelatorioSimples(relatorioPreparado);
      await saveDocFile(blob, fileName);
      
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
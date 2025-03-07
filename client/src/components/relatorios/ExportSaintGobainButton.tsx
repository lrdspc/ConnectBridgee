import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RelatorioVistoria } from "../../../shared/relatorioVistoriaSchema";
import { gerarRelatorioSaintGobain } from "@/lib/relatorioVistoriaSaintGobainGenerator";
import { FileDown, FileCheck } from "lucide-react";
import { download } from 'filefy';

function log(...args: any[]) {
  console.log("[ExportSaintGobainButton]", ...args);
}

export interface ExtendedRelatorioVistoria extends RelatorioVistoria {
  [key: string]: any; // Para permitir propriedades adicionais
}

export interface ExportSaintGobainButtonProps {
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
   * @default "Exportar DOC (Saint-Gobain)"
   */
  label?: string;
  
  /**
   * Texto durante o carregamento
   * @default "Gerando documento..."
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
 * Botão para exportação de relatórios com o layout exato do Saint-Gobain Brasil
 * 
 * Gera um documento DOCX com tabelas, formatação e elementos visuais
 * que correspondem exatamente ao modelo de relatório da Saint-Gobain Brasil.
 */
export function ExportSaintGobainButton({ 
  relatorio,
  variant = "outline",
  size = "default", 
  className = "",
  label = "Exportar DOC (Saint-Gobain)",
  loadingLabel = "Gerando documento...",
  onExportSuccess,
  onExportError,
  fileNamePrefix = "Relatório"
}: ExportSaintGobainButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleExport = async () => {
    try {
      setIsLoading(true);
      log("Iniciando exportação Saint-Gobain para", relatorio);
      
      // Gerar o blob do documento
      const blob = await gerarRelatorioSaintGobain(relatorio);
      log("Documento gerado com sucesso");
      
      // Criar nome de arquivo com timestamp
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const fileName = `${fileNamePrefix || "Relatório"}_${relatorio.protocolo || dateStr}.docx`;
      
      // Salvar o documento
      try {
        log("Salvando documento como", fileName);
        download(blob, fileName, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        log("Documento salvo com sucesso");
        
        // Notificar sucesso
        toast({
          title: "Documento exportado com sucesso",
          description: `O arquivo ${fileName} foi gerado no formato Saint-Gobain.`,
          variant: "default",
        });
        
        if (onExportSuccess) {
          onExportSuccess(fileName);
        }
      } catch (downloadError) {
        log("Erro ao salvar o documento:", downloadError);
        
        toast({
          title: "Erro ao salvar o documento",
          description: "Não foi possível salvar o documento. Verifique as permissões do navegador.",
          variant: "destructive",
        });
        
        if (onExportError) {
          onExportError(downloadError);
        }
      }
    } catch (error) {
      log("Erro ao gerar o documento:", error);
      
      toast({
        title: "Erro ao gerar o documento",
        description: "Ocorreu um erro ao gerar o documento. Por favor, tente novamente.",
        variant: "destructive",
      });
      
      if (onExportError) {
        onExportError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleExport}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <FileDown className="mr-2 h-4 w-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          <FileCheck className="mr-2 h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
}
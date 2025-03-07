import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RelatorioVistoria } from '@shared/relatorioVistoriaSchema';
import { Download, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { gerarRelatorioSaintGobainFix } from '@/lib/relatorioVistoriaSaintGobainGeneratorFix';

function log(...args: any[]) {
  console.log("[ExportSaintGobainFix]", ...args);
}

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  
  // Limpar recursos
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};

export interface ExtendedRelatorioVistoria extends RelatorioVistoria {
  [key: string]: any; // Para permitir propriedades adicionais
}

export interface ExportSaintGobainFixButtonProps {
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
 * Botão para exportação de relatórios com o layout exato do Saint-Gobain Brasil (VERSÃO CORRIGIDA)
 * 
 * Gera um documento DOCX com tabelas, formatação e elementos visuais
 * exatamente conforme o modelo fornecido.
 * 
 * @param props Propriedades do componente
 * @returns Componente React
 */
export function ExportSaintGobainButtonFix({ 
  relatorio,
  variant = "outline",
  size = "default",
  className = "",
  label = "Exportar DOC (Saint-Gobain)",
  loadingLabel = "Gerando documento...",
  onExportSuccess,
  onExportError,
  fileNamePrefix = "Relatório"
}: ExportSaintGobainFixButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (!relatorio) {
      toast({
        title: "Erro ao exportar",
        description: "Dados do relatório não disponíveis.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      log("Iniciando geração do relatório");
      const blob = await gerarRelatorioSaintGobainFix(relatorio);
      
      // Criar nome do arquivo com data
      const now = new Date();
      const dateStr = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
      const fileName = `${fileNamePrefix}_SaintGobain_${relatorio.cliente || 'Cliente'}_${dateStr}.docx`;
      
      // Download do arquivo
      downloadBlob(blob, fileName);
      
      toast({
        title: "Documento gerado com sucesso",
        description: `O arquivo "${fileName}" está pronto para download.`,
        variant: "default"
      });
      
      // Callback de sucesso
      if (onExportSuccess) {
        onExportSuccess(fileName);
      }
      
      log("Documento gerado com sucesso:", fileName);
    } catch (error) {
      console.error("Erro ao gerar documento:", error);
      
      toast({
        title: "Erro ao gerar o documento",
        description: String(error) || "Ocorreu um problema ao gerar o documento. Tente novamente.",
        variant: "destructive"
      });
      
      // Callback de erro
      if (onExportError) {
        onExportError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleExport}
      disabled={loading}
    >
      {loading ? (
        <>
          <FileText className="mr-2 h-4 w-4 animate-pulse" />
          {loadingLabel}
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
}
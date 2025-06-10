/**
 * Botão Unificado de Exportação de Relatórios - ConnectBridge
 * 
 * Este componente substitui todos os botões de exportação anteriores,
 * oferecendo uma interface única e confiável para gerar relatórios.
 * 
 * Características:
 * - Sistema de fallback automático
 * - Múltiplos templates (Brasilit, Saint-Gobain, Simple)
 * - Feedback visual aprimorado
 * - Tratamento robusto de erros
 * - Logs detalhados para diagnóstico
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { 
  generateUnifiedReport, 
  ReportGenerationOptions,
  ReportFormat 
} from "@/lib/unifiedReportGenerator";
import { 
  FileDown, 
  FileCheck, 
  Loader2, 
  AlertTriangle,
  CheckCircle,
  Download
} from "lucide-react";

// Configuração de logs
const DEBUG = true;
function log(...args: any[]) {
  if (DEBUG) console.log("[UnifiedExportButton]", ...args);
}

// Função para download de blob
const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Interface estendida para compatibilidade
export interface ExtendedRelatorioVistoria extends RelatorioVistoria {
  [key: string]: any;
}

// Props do componente
export interface UnifiedExportButtonProps {
  /**
   * Dados do relatório a ser exportado
   */
  relatorio: ExtendedRelatorioVistoria;
  
  /**
   * Template do relatório
   * @default "brasilit"
   */
  template?: 'brasilit' | 'saint-gobain' | 'simple';
  
  /**
   * Formato de saída
   * @default "docx"
   */
  format?: ReportFormat;
  
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
   */
  label?: string;
  
  /**
   * Texto durante o carregamento
   * @default "Gerando documento..."
   */
  loadingLabel?: string;
  
  /**
   * Prefixo do nome do arquivo
   * @default "Relatório"
   */
  fileNamePrefix?: string;
  
  /**
   * Incluir fotos no relatório
   * @default true
   */
  includePhotos?: boolean;
  
  /**
   * Incluir assinaturas no relatório
   * @default true
   */
  includeSignatures?: boolean;
  
  /**
   * Callback executado após a exportação bem-sucedida
   */
  onExportSuccess?: (fileName: string) => void;
  
  /**
   * Callback executado em caso de erro
   */
  onExportError?: (error: any) => void;
  
  /**
   * Conteúdo personalizado do botão
   */
  children?: React.ReactNode;
}

/**
 * Botão Unificado para exportação de relatórios
 * 
 * Substitui todos os geradores anteriores com uma solução robusta e confiável
 */
export function UnifiedExportButton({
  relatorio,
  template = "brasilit",
  format = "docx",
  variant = "outline",
  size = "default",
  className = "",
  label,
  loadingLabel = "Gerando documento...",
  fileNamePrefix = "Relatório",
  includePhotos = true,
  includeSignatures = true,
  onExportSuccess,
  onExportError,
  children
}: UnifiedExportButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Determinar label baseado no template se não fornecido
  const getDefaultLabel = () => {
    switch (template) {
      case 'brasilit':
        return "Exportar Brasilit";
      case 'saint-gobain':
        return "Exportar Saint-Gobain";
      case 'simple':
        return "Exportar Simples";
      default:
        return "Exportar Relatório";
    }
  };

  const buttonLabel = label || getDefaultLabel();

  // Gerar nome do arquivo
  const generateFileName = (): string => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const cliente = relatorio.cliente ? `-${relatorio.cliente.replace(/[^a-zA-Z0-9]/g, '')}` : '';
    const protocolo = relatorio.protocolo ? `-${relatorio.protocolo}` : '';
    const extension = format === 'pdf' ? 'pdf' : 'docx';
    
    return `${fileNamePrefix}${cliente}${protocolo}-${timestamp}.${extension}`;
  };

  // Handler principal de exportação
  const handleExport = async () => {
    try {
      setIsLoading(true);
      log("Iniciando exportação unificada", { template, format, cliente: relatorio.cliente });

      // Validar dados básicos
      if (!relatorio) {
        throw new Error("Dados do relatório são obrigatórios");
      }

      // Configurar opções de geração
      const options: ReportGenerationOptions = {
        format,
        template,
        includePhotos,
        includeSignatures
      };

      // Gerar relatório usando o gerador unificado
      const blob = await generateUnifiedReport(relatorio, options);
      
      if (!blob || blob.size === 0) {
        throw new Error("Documento gerado está vazio");
      }

      // Fazer download
      const fileName = generateFileName();
      downloadBlob(blob, fileName);

      log("Exportação concluída com sucesso", { fileName, size: blob.size });

      // Feedback de sucesso
      toast({
        title: "Documento gerado com sucesso!",
        description: `${buttonLabel} exportado como ${fileName}`,
        variant: "default",
      });

      // Callback de sucesso
      if (onExportSuccess) {
        onExportSuccess(fileName);
      }

    } catch (error) {
      log("Erro na exportação:", error);
      
      // Feedback de erro
      toast({
        title: "Erro ao gerar documento",
        description: error instanceof Error ? error.message : "Erro desconhecido na geração do relatório",
        variant: "destructive",
      });
      
      // Callback de erro
      if (onExportError) {
        onExportError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Determinar ícone baseado no estado e template
  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
    }
    
    switch (template) {
      case 'brasilit':
        return <CheckCircle className="mr-2 h-4 w-4" />;
      case 'saint-gobain':
        return <FileCheck className="mr-2 h-4 w-4" />;
      case 'simple':
        return <Download className="mr-2 h-4 w-4" />;
      default:
        return <FileDown className="mr-2 h-4 w-4" />;
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
      {children || (
        <>
          {getIcon()}
          {isLoading ? loadingLabel : buttonLabel}
        </>
      )}
    </Button>
  );
}

/**
 * Variações pré-configuradas do botão unificado
 */

// Botão Brasilit (recomendado)
export function BrasiliteExportButton(props: Omit<UnifiedExportButtonProps, 'template'>) {
  return (
    <UnifiedExportButton
      {...props}
      template="brasilit"
      variant={props.variant || "default"}
      className={`bg-green-600 hover:bg-green-700 text-white ${props.className || ""}`}
      label={props.label || "Exportar Brasilit (Recomendado)"}
    />
  );
}

// Botão Saint-Gobain
export function SaintGobainExportButton(props: Omit<UnifiedExportButtonProps, 'template'>) {
  return (
    <UnifiedExportButton
      {...props}
      template="saint-gobain"
      variant={props.variant || "outline"}
      className={`border-blue-600 text-blue-600 hover:bg-blue-50 ${props.className || ""}`}
      label={props.label || "Exportar Saint-Gobain"}
    />
  );
}

// Botão Simples
export function SimpleExportButton(props: Omit<UnifiedExportButtonProps, 'template'>) {
  return (
    <UnifiedExportButton
      {...props}
      template="simple"
      variant={props.variant || "secondary"}
      label={props.label || "Exportar Simples"}
    />
  );
}

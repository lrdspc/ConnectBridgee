import { useState } from "react";
import { Visit } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { generateVisitReport } from "@/lib/reportGenerator";
import { Loader2, FileText } from "lucide-react";

interface GenerateReportModalProps {
  visit: Visit;
  isOpen: boolean;
  onClose: () => void;
}

export function GenerateReportModal({ visit, isOpen, onClose }: GenerateReportModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    try {
      const blob = await generateVisitReport(visit);
      
      // Criar URL para download
      const url = URL.createObjectURL(blob);
      
      // Criar link de download
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio-visita-${visit.clientName.replace(/\s+/g, "-").toLowerCase()}-${new Date().getTime()}.docx`;
      document.body.appendChild(link);
      
      // Simular clique para iniciar o download
      link.click();
      
      // Limpar e remover o link
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Relatório gerado com sucesso",
        description: "O download do relatório foi iniciado.",
      });
      
      onClose();
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Ocorreu um erro ao gerar o relatório. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerar Relatório</DialogTitle>
          <DialogDescription>
            Gere um relatório detalhado para esta visita em formato Word (.docx).
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm">
              O relatório incluirá:
            </p>
            <ul className="list-disc list-inside ml-2 text-sm">
              <li>Informações da visita</li>
              <li>Dados do cliente</li>
              <li>Checklist de inspeção</li>
              {visit.photos && visit.photos.length > 0 && (
                <li>Registro fotográfico ({visit.photos.length} fotos)</li>
              )}
              {visit.notes && <li>Observações</li>}
            </ul>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between flex flex-col sm:flex-row gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          
          <Button 
            type="button" 
            onClick={handleGenerateReport} 
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Gerar Relatório
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
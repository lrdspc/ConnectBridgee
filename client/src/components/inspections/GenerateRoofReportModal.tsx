import { useState } from "react";
import { generateRoofInspectionReport } from "../../lib/roofInspectionReportGenerator";
import { Inspection } from "../../shared/inspectionSchema";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileDown, Loader2 } from "lucide-react";

interface GenerateRoofReportModalProps {
  inspection: Inspection;
  isOpen: boolean;
  onClose: () => void;
}

export function GenerateRoofReportModal({ inspection, isOpen, onClose }: GenerateRoofReportModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      const reportBlob = await generateRoofInspectionReport(inspection);
      
      // Criar URL para o blob e iniciar download
      const url = URL.createObjectURL(reportBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inspeção_telhado_${inspection.clientName || "cliente"}_${new Date().toISOString().split("T")[0]}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Relatório gerado",
        description: "O download do relatório foi iniciado.",
      });
      
      onClose();
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Não foi possível gerar o relatório. Tente novamente.",
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
          <DialogTitle>Gerar Relatório de Inspeção</DialogTitle>
          <DialogDescription>
            O relatório será gerado em formato Word (.docx) com todas as informações da inspeção, incluindo fotos e detalhes técnicos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="bg-slate-50 p-3 rounded-lg">
            <h3 className="font-medium mb-2">O relatório incluirá:</h3>
            <ul className="space-y-1 list-disc list-inside text-sm text-slate-700">
              <li>Dados do cliente e da obra</li>
              <li>Informações do técnico responsável</li>
              <li>Especificações das telhas inspecionadas</li>
              <li>Não conformidades identificadas</li>
              <li>Registro fotográfico com anotações</li>
              <li>Conclusão e recomendações técnicas</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isGenerating}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="mt-2 sm:mt-0"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4 mr-2" />
                Gerar Relatório
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
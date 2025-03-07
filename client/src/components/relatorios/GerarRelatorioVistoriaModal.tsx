
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RelatorioVistoria } from "@/shared/relatorioVistoriaSchema";
import { generateRelatorioVistoriaDocx } from "@/lib/relatorioVistoriaGenerator";
import { formatDate } from "@/lib/dateUtils";
import { useToast } from "@/components/ui/use-toast";

interface GerarRelatorioVistoriaModalProps {
  relatorio: RelatorioVistoria;
  isOpen: boolean;
  onClose: () => void;
}

export function GerarRelatorioVistoriaModal({
  relatorio,
  isOpen,
  onClose,
}: GerarRelatorioVistoriaModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);

      // Gerar o documento DOCX
      const docxBlob = await generateRelatorioVistoriaDocx(relatorio);

      // Criar URL para download
      const url = URL.createObjectURL(docxBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio_vistoria_${relatorio.protocolo || formatDate(relatorio.dataVistoria)}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Relatório gerado com sucesso",
        description: "O download do arquivo foi iniciado.",
      });

      onClose();
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast({
        title: "Erro ao gerar relatório",
        description:
          "Ocorreu um erro ao gerar o relatório. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Verificar se há não conformidades selecionadas
  const naoConformidadesSelecionadas = relatorio.naoConformidades.filter(
    (nc) => nc.selecionado
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerar Relatório de Vistoria</DialogTitle>
          <DialogDescription>
            O relatório será gerado em formato Word (.docx) com todas as
            informações preenchidas.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="bg-slate-50 p-3 rounded-lg">
            <h3 className="font-medium mb-2">O relatório incluirá:</h3>
            <ul className="space-y-1 list-disc list-inside text-sm text-slate-700">
              <li>Dados do cliente e da obra</li>
              <li>Informações dos responsáveis técnicos</li>
              <li>Especificações do produto</li>
              {relatorio.introducao && <li>Introdução</li>}
              {relatorio.analiseTecnica && <li>Análise técnica</li>}
              <li>
                Não conformidades identificadas{" "}
                <span className="text-xs text-slate-500">
                  ({naoConformidadesSelecionadas.length} selecionadas)
                </span>
              </li>
              {relatorio.conclusao && <li>Conclusão</li>}
              {relatorio.recomendacao && <li>Recomendações</li>}
              {relatorio.observacoesGerais && <li>Observações gerais</li>}
              <li>Resultado da análise</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isGenerating}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? "Gerando..." : "Gerar Relatório"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

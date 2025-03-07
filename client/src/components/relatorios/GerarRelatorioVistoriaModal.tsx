import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { RelatorioVistoria } from 'shared/relatorioVistoriaSchema';
import { gerarRelatorioVistoria } from '@/lib/relatorioVistoriaGenerator';
import { Loader2 } from 'lucide-react';

interface GerarRelatorioVistoriaModalProps {
  relatorio: RelatorioVistoria;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GerarRelatorioVistoriaModal({
  relatorio,
  isOpen,
  onOpenChange
}: GerarRelatorioVistoriaModalProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGerarRelatorio = async () => {
    try {
      setIsGenerating(true);
      const blob = await gerarRelatorioVistoria(relatorio);

      // Criar URL para download
      const url = URL.createObjectURL(blob);

      // Criar elemento de link para download
      const a = document.createElement('a');
      a.href = url;
      a.download = `Relatório de Vistoria - ${relatorio.cliente} - ${relatorio.protocolo}.docx`;
      document.body.appendChild(a);
      a.click();

      // Limpar
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Relatório gerado com sucesso",
        description: "O download do arquivo foi iniciado",
      });

      onOpenChange(false);
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gerar Relatório de Vistoria</DialogTitle>
          <DialogDescription>
            Gerar um relatório em formato DOCX com os dados preenchidos.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-2">
            Os seguintes dados serão utilizados:
          </p>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li><strong>Cliente:</strong> {relatorio.cliente || "Não informado"}</li>
            <li><strong>Protocolo:</strong> {relatorio.protocolo || "Não informado"}</li>
            <li><strong>Data de vistoria:</strong> {relatorio.dataVistoria || "Não informada"}</li>
            <li><strong>Não conformidades:</strong> {relatorio.naoConformidades.filter(nc => nc.selecionado).length} selecionadas</li>
          </ul>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Cancelar
          </Button>
          <Button onClick={handleGerarRelatorio} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              "Gerar Relatório"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
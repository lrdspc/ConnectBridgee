
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { RelatorioVistoria } from 'shared/relatorioVistoriaSchema';
import { GerarRelatorioVistoriaModal } from './GerarRelatorioVistoriaModal';
import { useToast } from "@/components/ui/use-toast";

interface GerarRelatorioVistoriaButtonProps {
  relatorio: RelatorioVistoria;
  disabled?: boolean;
}

export function GerarRelatorioVistoriaButton({
  relatorio,
  disabled = false
}: GerarRelatorioVistoriaButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenModal = () => {
    // Verificações básicas antes de abrir o modal
    if (!relatorio.cliente) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, informe o nome do cliente antes de gerar o relatório.",
        variant: "destructive",
      });
      return;
    }

    if (!relatorio.dataVistoria) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, informe a data da vistoria antes de gerar o relatório.",
        variant: "destructive",
      });
      return;
    }

    if (relatorio.naoConformidades.filter(nc => nc.selecionado).length === 0) {
      toast({
        title: "Nenhuma não conformidade selecionada",
        description: "Selecione pelo menos uma não conformidade ou confirme que não há não conformidades.",
        variant: "warning",
      });
      // Permitimos continuar mesmo sem não conformidades
    }

    setIsModalOpen(true);
  };

  return (
    <>
      <Button 
        variant="default" 
        className="flex items-center gap-2"
        onClick={handleOpenModal}
        disabled={disabled}
      >
        <FileText className="h-4 w-4" />
        Gerar Relatório
      </Button>

      <GerarRelatorioVistoriaModal 
        relatorio={relatorio}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

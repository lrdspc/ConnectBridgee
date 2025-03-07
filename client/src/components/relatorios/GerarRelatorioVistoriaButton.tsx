import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FilePenLine } from 'lucide-react';
import GerarRelatorioVistoriaModal from './GerarRelatorioVistoriaModal';
import { novoRelatorioVistoria, RelatorioVistoria } from '../../../shared/relatorioVistoriaSchema';

interface GerarRelatorioVistoriaButtonProps {
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  relatorio?: RelatorioVistoria;
}

const GerarRelatorioVistoriaButton: React.FC<GerarRelatorioVistoriaButtonProps> = ({ 
  variant = "default",
  relatorio: relatorioInicial 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [relatorio, setRelatorio] = useState<RelatorioVistoria | undefined>(relatorioInicial);

  const handleOpenModal = () => {
    // Se não houver um relatório inicial, criar um novo
    if (!relatorio) {
      setRelatorio(novoRelatorioVistoria());
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <Button variant={variant} onClick={handleOpenModal}>
        <FilePenLine className="mr-2 h-4 w-4" />
        Gerar Relatório de Vistoria
      </Button>

      <GerarRelatorioVistoriaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        relatorio={relatorio}
      />
    </>
  );
};

export default GerarRelatorioVistoriaButton;
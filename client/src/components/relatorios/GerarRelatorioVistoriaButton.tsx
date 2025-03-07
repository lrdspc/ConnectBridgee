
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useState } from "react";
import GerarRelatorioVistoriaModal from "./GerarRelatorioVistoriaModal";
import { RelatorioVistoria } from "../../../shared/relatorioVistoriaSchema";
import { useMutation } from "@tanstack/react-query";
import { atualizarRelatorioVistoria } from "@/lib/api";

interface GerarRelatorioVistoriaButtonProps {
  relatorio: RelatorioVistoria;
  onSave?: (relatorio: RelatorioVistoria) => void;
}

export default function GerarRelatorioVistoriaButton({
  relatorio,
  onSave
}: GerarRelatorioVistoriaButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const salvarRelatorioMutation = useMutation({
    mutationFn: (data: RelatorioVistoria) => atualizarRelatorioVistoria(data),
    onSuccess: (data) => {
      if (onSave) {
        onSave(data);
      }
    },
  });

  const handleSaveRelatorio = (relatorioAtualizado: RelatorioVistoria) => {
    salvarRelatorioMutation.mutate(relatorioAtualizado);
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="default"
        size="sm"
        className="gap-1"
      >
        <FileText size={16} /> Gerar Relatório
      </Button>

      <GerarRelatorioVistoriaModal
        relatorio={relatorio}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRelatorio}
      />
    </>
  );
}

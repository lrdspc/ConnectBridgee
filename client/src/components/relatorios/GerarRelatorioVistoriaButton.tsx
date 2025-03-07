
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { GerarRelatorioVistoriaModal } from "./GerarRelatorioVistoriaModal";
import { RelatorioVistoria } from "@/shared/relatorioVistoriaSchema";

interface GerarRelatorioVistoriaButtonProps {
  relatorio: RelatorioVistoria;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function GerarRelatorioVistoriaButton({
  relatorio,
  variant = "default",
  size = "default",
  className = "",
}: GerarRelatorioVistoriaButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isRelatorioValido = () => {
    // Validação básica - verificando apenas os campos essenciais
    const camposObrigatorios = [
      relatorio.cliente,
      relatorio.empreendimento,
      relatorio.dataVistoria,
      relatorio.elaboradoPor,
    ];

    return camposObrigatorios.every((campo) => campo && campo.trim() !== "");
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`gap-2 ${className}`}
        onClick={() => setIsModalOpen(true)}
        disabled={!isRelatorioValido()}
      >
        <FileText className="h-4 w-4" />
        Gerar Relatório
      </Button>

      {isModalOpen && (
        <GerarRelatorioVistoriaModal
          relatorio={relatorio}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

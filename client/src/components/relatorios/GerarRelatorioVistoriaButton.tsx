
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { GerarRelatorioVistoriaModal } from "./GerarRelatorioVistoriaModal";
import { RelatorioVistoria, novoRelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { toast } from "sonner";

// Interface estendida para compatibilidade com versões anteriores do código
interface ExtendedRelatorioVistoria extends RelatorioVistoria {
  [key: string]: any; // Para permitir propriedades adicionais
}

interface GerarRelatorioVistoriaButtonProps {
  relatorio?: ExtendedRelatorioVistoria;
  onSave?: (relatorio: ExtendedRelatorioVistoria) => void;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function GerarRelatorioVistoriaButton({ 
  relatorio,
  onSave,
  variant = "default",
  size = "default",
  className = ""
}: GerarRelatorioVistoriaButtonProps) {
  const [open, setOpen] = useState(false);
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };
  
  const handleSave = (savedRelatorio: ExtendedRelatorioVistoria) => {
    if (onSave) {
      onSave(savedRelatorio);
    } else {
      // Se não tiver callback de salvamento, apenas informa o usuário
      toast.info("Relatório gerado com sucesso!");
    }
  };
  
  // Se não for fornecido um relatório, criar um novo
  const initialRelatorio = relatorio || novoRelatorioVistoria();
  
  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        variant={variant} 
        size={size}
        className={`gap-2 ${className}`}
      >
        <FileText className="h-4 w-4" />
        Gerar Relatório
      </Button>
      
      <GerarRelatorioVistoriaModal
        open={open}
        onOpenChange={handleOpenChange}
        relatorio={initialRelatorio}
        onSave={handleSave}
      />
    </>
  );
}

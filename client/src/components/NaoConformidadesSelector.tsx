
import React from "react";
import { naoConformidadesDisponiveis } from "../../../shared/relatorioVistoriaSchema";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface NaoConformidadesSelectorProps {
  selecionadas: number[];
  onChange: (selecionadas: number[]) => void;
}

export const NaoConformidadesSelector: React.FC<NaoConformidadesSelectorProps> = ({
  selecionadas,
  onChange
}) => {
  // Função para alternar a seleção de uma não conformidade
  const toggleSelection = (id: number) => {
    if (selecionadas.includes(id)) {
      onChange(selecionadas.filter(itemId => itemId !== id));
    } else {
      onChange([...selecionadas, id]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Não Conformidades</h3>
      <p className="text-sm text-gray-500">
        Selecione as não conformidades identificadas durante a vistoria:
      </p>
      
      <div className="space-y-2">
        {naoConformidadesDisponiveis.map((nc) => (
          <Accordion type="single" collapsible key={nc.id} className="border rounded-lg">
            <AccordionItem value={`item-${nc.id}`} className="border-none">
              <div className="flex items-start p-2">
                <Checkbox 
                  id={`nc-${nc.id}`}
                  checked={selecionadas.includes(nc.id)}
                  onCheckedChange={() => toggleSelection(nc.id)}
                  className="mt-1 mr-3"
                />
                <div className="flex-1">
                  <AccordionTrigger className="py-0 hover:no-underline">
                    <Label 
                      htmlFor={`nc-${nc.id}`}
                      className="font-medium text-left cursor-pointer flex-1"
                    >
                      {nc.id}. {nc.titulo}
                    </Label>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-700 pt-2">
                    {nc.descricao}
                  </AccordionContent>
                </div>
              </div>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

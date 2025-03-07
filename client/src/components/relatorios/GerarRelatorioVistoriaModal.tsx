
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateRelatorioVistoria } from "@/lib/relatorioVistoriaGenerator";
import { RelatorioVistoria } from "../../../shared/relatorioVistoriaSchema";
import { Loader2 } from "lucide-react";
import IdentificacaoProjetoForm from "./forms/IdentificacaoProjetoForm";
import ResponsaveisTecnicosForm from "./forms/ResponsaveisTecnicosForm";
import DadosProdutoForm from "./forms/DadosProdutoForm";
import AnaliseTecnicaForm from "./forms/AnaliseTecnicaForm";
import NaoConformidadesForm from "./forms/NaoConformidadesForm";

interface GerarRelatorioVistoriaModalProps {
  relatorio: RelatorioVistoria;
  isOpen: boolean;
  onClose: () => void;
  onSave: (relatorio: RelatorioVistoria) => void;
}

export default function GerarRelatorioVistoriaModal({
  relatorio,
  isOpen,
  onClose,
  onSave
}: GerarRelatorioVistoriaModalProps) {
  const [relatorioAtual, setRelatorioAtual] = useState<RelatorioVistoria>(relatorio);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("identificacao");

  const handleSaveRelatorio = () => {
    onSave(relatorioAtual);
  };

  const handleGenerateRelatorio = async () => {
    try {
      setIsGenerating(true);
      await generateRelatorioVistoria(relatorioAtual);
      setIsGenerating(false);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      setIsGenerating(false);
    }
  };

  const updateRelatorio = (field: string, value: any) => {
    setRelatorioAtual((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Gerar Relatório de Vistoria</DialogTitle>
          <DialogDescription>
            Preencha as informações necessárias para gerar o relatório de vistoria.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid grid-cols-5 gap-1">
            <TabsTrigger value="identificacao">Identificação</TabsTrigger>
            <TabsTrigger value="responsaveis">Responsáveis</TabsTrigger>
            <TabsTrigger value="produto">Produto</TabsTrigger>
            <TabsTrigger value="analise">Análise</TabsTrigger>
            <TabsTrigger value="nao-conformidades">Não Conformidades</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 px-1">
            <TabsContent value="identificacao" className="mt-4">
              <IdentificacaoProjetoForm 
                relatorio={relatorioAtual} 
                updateRelatorio={updateRelatorio} 
              />
            </TabsContent>

            <TabsContent value="responsaveis" className="mt-4">
              <ResponsaveisTecnicosForm 
                relatorio={relatorioAtual} 
                updateRelatorio={updateRelatorio} 
              />
            </TabsContent>

            <TabsContent value="produto" className="mt-4">
              <DadosProdutoForm 
                relatorio={relatorioAtual} 
                updateRelatorio={updateRelatorio} 
              />
            </TabsContent>

            <TabsContent value="analise" className="mt-4">
              <AnaliseTecnicaForm 
                relatorio={relatorioAtual} 
                updateRelatorio={updateRelatorio} 
              />
            </TabsContent>

            <TabsContent value="nao-conformidades" className="mt-4">
              <NaoConformidadesForm 
                relatorio={relatorioAtual} 
                updateRelatorio={(naoConformidades) => {
                  setRelatorioAtual((prev) => ({
                    ...prev,
                    naoConformidades
                  }));
                }} 
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="flex flex-wrap sm:flex-nowrap gap-2">
          <div className="flex w-full sm:w-auto gap-2">
            <Button
              variant="outline"
              disabled={activeTab === "identificacao"}
              onClick={() => {
                const tabs = ["identificacao", "responsaveis", "produto", "analise", "nao-conformidades"];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1]);
                }
              }}
            >
              Anterior
            </Button>

            <Button
              variant="outline"
              disabled={activeTab === "nao-conformidades"}
              onClick={() => {
                const tabs = ["identificacao", "responsaveis", "produto", "analise", "nao-conformidades"];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1]);
                }
              }}
            >
              Próximo
            </Button>
          </div>

          <div className="flex w-full sm:w-auto gap-2">
            <Button variant="secondary" onClick={handleSaveRelatorio}>
              Salvar
            </Button>

            <Button 
              disabled={isGenerating} 
              onClick={handleGenerateRelatorio}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                "Gerar Relatório"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

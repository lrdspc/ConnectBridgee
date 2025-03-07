
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { generateRelatorioVistoriaPDF } from '@/lib/relatorioVistoriaGenerator';
import { RelatorioVistoria, naoConformidadesDisponiveis, resultadoReclamacaoEnum } from '../../../shared/relatorioVistoriaSchema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { modelosTelhas, espessurasTelhas } from '../../../shared/relatorioVistoriaSchema';

interface GerarRelatorioVistoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  relatorio?: RelatorioVistoria;
}

const GerarRelatorioVistoriaModal: React.FC<GerarRelatorioVistoriaModalProps> = ({
  isOpen,
  onClose,
  relatorio: relatorioInicial
}) => {
  const [relatorio, setRelatorio] = useState<RelatorioVistoria | null>(null);
  const [activeTab, setActiveTab] = useState("identificacao");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (relatorioInicial) {
      setRelatorio(relatorioInicial);
    }
  }, [relatorioInicial]);

  if (!relatorio) {
    return null;
  }

  const handleChange = (field: keyof RelatorioVistoria, value: any) => {
    setRelatorio({
      ...relatorio,
      [field]: value
    });
  };

  const handleNaoConformidadeToggle = (id: number) => {
    const updatedNaoConformidades = relatorio.naoConformidades.map(nc => {
      if (nc.id === id) {
        return { ...nc, selecionado: !nc.selecionado };
      }
      return nc;
    });

    setRelatorio({
      ...relatorio,
      naoConformidades: updatedNaoConformidades
    });
  };

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      await generateRelatorioVistoriaPDF(relatorio);
      onClose();
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerar Relatório de Vistoria Técnica</DialogTitle>
          <DialogDescription>
            Preencha os dados para gerar o relatório de vistoria técnica.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="identificacao">Identificação</TabsTrigger>
            <TabsTrigger value="responsaveis">Responsáveis</TabsTrigger>
            <TabsTrigger value="produto">Produto</TabsTrigger>
            <TabsTrigger value="analise">Análise</TabsTrigger>
          </TabsList>

          {/* Tab: Identificação do Projeto */}
          <TabsContent value="identificacao" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="protocolo">Protocolo (FAR)</Label>
                <Input
                  id="protocolo"
                  value={relatorio.protocolo}
                  onChange={(e) => handleChange('protocolo', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataVistoria">Data de Vistoria</Label>
                <Input
                  id="dataVistoria"
                  type="date"
                  value={relatorio.dataVistoria}
                  onChange={(e) => handleChange('dataVistoria', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Input
                id="cliente"
                value={relatorio.cliente}
                onChange={(e) => handleChange('cliente', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="empreendimento">Empreendimento</Label>
              <Input
                id="empreendimento"
                value={relatorio.empreendimento}
                onChange={(e) => handleChange('empreendimento', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={relatorio.cidade}
                  onChange={(e) => handleChange('cidade', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uf">UF</Label>
                <Input
                  id="uf"
                  value={relatorio.uf}
                  onChange={(e) => handleChange('uf', e.target.value)}
                  maxLength={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={relatorio.endereco}
                onChange={(e) => handleChange('endereco', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assunto">Assunto</Label>
              <Input
                id="assunto"
                value={relatorio.assunto}
                onChange={(e) => handleChange('assunto', e.target.value)}
              />
            </div>
          </TabsContent>

          {/* Tab: Responsáveis Técnicos */}
          <TabsContent value="responsaveis" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="elaboradoPor">Elaborado por</Label>
                <Input
                  id="elaboradoPor"
                  value={relatorio.elaboradoPor}
                  onChange={(e) => handleChange('elaboradoPor', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento</Label>
                <Input
                  id="departamento"
                  value={relatorio.departamento}
                  onChange={(e) => handleChange('departamento', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade</Label>
                <Input
                  id="unidade"
                  value={relatorio.unidade}
                  onChange={(e) => handleChange('unidade', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regional">Regional</Label>
                <Input
                  id="regional"
                  value={relatorio.regional}
                  onChange={(e) => handleChange('regional', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coordenador">Coordenador Responsável</Label>
                <Input
                  id="coordenador"
                  value={relatorio.coordenador}
                  onChange={(e) => handleChange('coordenador', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gerente">Gerente Responsável</Label>
                <Input
                  id="gerente"
                  value={relatorio.gerente}
                  onChange={(e) => handleChange('gerente', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab: Dados do Produto */}
          <TabsContent value="produto" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modeloTelha">Modelo da Telha</Label>
                <Select
                  value={relatorio.modeloTelha}
                  onValueChange={(value) => handleChange('modeloTelha', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelosTelhas.map((modelo) => (
                      <SelectItem key={modelo} value={modelo}>
                        {modelo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="espessura">Espessura (mm)</Label>
                <Select
                  value={relatorio.espessura}
                  onValueChange={(value) => handleChange('espessura', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a espessura" />
                  </SelectTrigger>
                  <SelectContent>
                    {espessurasTelhas.map((espessura) => (
                      <SelectItem key={espessura} value={espessura}>
                        {espessura}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  value={relatorio.quantidade.toString()}
                  onChange={(e) => handleChange('quantidade', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Área coberta (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  value={relatorio.area.toString()}
                  onChange={(e) => handleChange('area', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab: Análise Técnica */}
          <TabsContent value="analise" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resultado">Resultado da Análise</Label>
                <RadioGroup
                  value={relatorio.resultado}
                  onValueChange={(value) => handleChange('resultado', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PROCEDENTE" id="procedente" />
                    <Label htmlFor="procedente">PROCEDENTE</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="IMPROCEDENTE" id="improcedente" />
                    <Label htmlFor="improcedente">IMPROCEDENTE</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Não Conformidades</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Selecione as não conformidades identificadas:
                </p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto p-2 border rounded-md">
                  {relatorio.naoConformidades.map((nc) => (
                    <div key={nc.id} className="flex items-start space-x-2 py-2 border-b last:border-b-0">
                      <Checkbox
                        id={`nc-${nc.id}`}
                        checked={nc.selecionado}
                        onCheckedChange={() => handleNaoConformidadeToggle(nc.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor={`nc-${nc.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {nc.id}. {nc.titulo}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? "Gerando..." : "Gerar Relatório"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GerarRelatorioVistoriaModal;

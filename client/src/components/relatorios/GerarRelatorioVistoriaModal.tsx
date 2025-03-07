
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader, Save, X } from "lucide-react";
import { toast } from "sonner";
import { RelatorioVistoria, modelosTelhas, espessurasTelhas, resultadoReclamacaoEnum } from "../../../shared/relatorioVistoriaSchema";
import { generateRelatorioVistoria } from "@/lib/relatorioVistoriaGenerator";
import { generateRelatorioVistoriaBrasil } from "@/lib/relatorioVistoriaBrasilGenerator";

interface GerarRelatorioVistoriaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relatorio: RelatorioVistoria;
  onSave: (relatorio: RelatorioVistoria) => void;
}

export function GerarRelatorioVistoriaModal({ 
  open, 
  onOpenChange, 
  relatorio: initialRelatorio,
  onSave
}: GerarRelatorioVistoriaModalProps) {
  const [relatorio, setRelatorio] = useState<RelatorioVistoria>(initialRelatorio);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("informacoes-basicas");
  
  // Refs para rolagem
  const naoConformidadesRef = useRef<HTMLDivElement>(null);
  
  // Handler para atualizar os campos básicos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRelatorio(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handler para selecionar/deselecionar não conformidades
  const handleNaoConformidadeToggle = (id: number) => {
    setRelatorio(prev => {
      const updatedNaoConformidades = prev.naoConformidades.map(nc => 
        nc.id === id ? { ...nc, selecionado: !nc.selecionado } : nc
      );
      return {
        ...prev,
        naoConformidades: updatedNaoConformidades
      };
    });
  };
  
  // Handler para atualizar o resultado
  const handleResultadoChange = (value: string) => {
    if (value === "PROCEDENTE" || value === "IMPROCEDENTE") {
      setRelatorio(prev => ({
        ...prev,
        resultado: value as "PROCEDENTE" | "IMPROCEDENTE"
      }));
    }
  };
  
  // Handler para atualizar modelo de telha
  const handleModeloTelhaChange = (value: string) => {
    setRelatorio(prev => ({
      ...prev,
      modeloTelha: value as typeof modelosTelhas[number]
    }));
  };
  
  // Handler para atualizar espessura da telha
  const handleEspessuraTelhaChange = (value: string) => {
    setRelatorio(prev => ({
      ...prev,
      espessura: value as typeof espessurasTelhas[number]
    }));
  };
  
  // Função para gerar o relatório
  const handleGerarRelatorio = async () => {
    try {
      setIsGenerating(true);
      
      // Validar dados mínimos
      if (!relatorio.cliente || !relatorio.protocolo) {
        toast.error("Cliente e protocolo são obrigatórios");
        setActiveTab("informacoes-basicas");
        return;
      }
      
      // Verificar se pelo menos uma não conformidade está selecionada
      const temNaoConformidadeSelecionada = relatorio.naoConformidades.some(nc => nc.selecionado);
      if (!temNaoConformidadeSelecionada) {
        toast.error("Selecione pelo menos uma não conformidade");
        setActiveTab("nao-conformidades");
        if (naoConformidadesRef.current) {
          naoConformidadesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
      
      // Gerar o relatório
      const blob = await generateRelatorioVistoria(relatorio);
      
      // Criar URL para download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Relatório-${relatorio.protocolo || 'Vistoria'}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Salvar relatório
      onSave(relatorio);
      
      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Gerar Relatório de Vistoria Técnica</DialogTitle>
          <DialogDescription>
            Preencha as informações para gerar o relatório de vistoria técnica.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="informacoes-basicas">Informações Básicas</TabsTrigger>
            <TabsTrigger value="responsaveis">Responsáveis</TabsTrigger>
            <TabsTrigger value="produto">Produto</TabsTrigger>
            <TabsTrigger value="nao-conformidades">Não Conformidades</TabsTrigger>
            <TabsTrigger value="conclusao">Conclusão</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 pr-4">
            <TabsContent value="informacoes-basicas" className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="protocolo">Protocolo/FAR*</Label>
                  <Input
                    id="protocolo"
                    name="protocolo"
                    value={relatorio.protocolo}
                    onChange={handleInputChange}
                    placeholder="Ex: TST-1739869627147"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataVistoria">Data da Vistoria</Label>
                  <Input
                    id="dataVistoria"
                    name="dataVistoria"
                    type="date"
                    value={relatorio.dataVistoria}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente*</Label>
                <Input
                  id="cliente"
                  name="cliente"
                  value={relatorio.cliente}
                  onChange={handleInputChange}
                  placeholder="Nome do cliente"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="empreendimento">Empreendimento</Label>
                <Input
                  id="empreendimento"
                  name="empreendimento"
                  value={relatorio.empreendimento}
                  onChange={handleInputChange}
                  placeholder="Nome do empreendimento"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    value={relatorio.endereco}
                    onChange={handleInputChange}
                    placeholder="Endereço completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    name="cidade"
                    value={relatorio.cidade}
                    onChange={handleInputChange}
                    placeholder="Cidade"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uf">UF</Label>
                  <Input
                    id="uf"
                    name="uf"
                    value={relatorio.uf}
                    onChange={handleInputChange}
                    placeholder="UF"
                    maxLength={2}
                  />
                </div>
                <div className="space-y-2 col-span-3">
                  <Label htmlFor="assunto">Assunto</Label>
                  <Input
                    id="assunto"
                    name="assunto"
                    value={relatorio.assunto}
                    onChange={handleInputChange}
                    placeholder="Assunto da vistoria"
                  />
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground pt-2">
                * Campos obrigatórios
              </div>
            </TabsContent>
            
            <TabsContent value="responsaveis" className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="elaboradoPor">Elaborado por</Label>
                  <Input
                    id="elaboradoPor"
                    name="elaboradoPor"
                    value={relatorio.elaboradoPor}
                    onChange={handleInputChange}
                    placeholder="Nome do técnico"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Input
                    id="departamento"
                    name="departamento"
                    value={relatorio.departamento}
                    onChange={handleInputChange}
                    placeholder="Departamento"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unidade">Unidade</Label>
                  <Input
                    id="unidade"
                    name="unidade"
                    value={relatorio.unidade}
                    onChange={handleInputChange}
                    placeholder="Unidade"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regional">Regional</Label>
                  <Input
                    id="regional"
                    name="regional"
                    value={relatorio.regional}
                    onChange={handleInputChange}
                    placeholder="Regional"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coordenador">Coordenador Responsável</Label>
                  <Input
                    id="coordenador"
                    name="coordenador"
                    value={relatorio.coordenador}
                    onChange={handleInputChange}
                    placeholder="Nome do coordenador"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gerente">Gerente Responsável</Label>
                  <Input
                    id="gerente"
                    name="gerente"
                    value={relatorio.gerente}
                    onChange={handleInputChange}
                    placeholder="Nome do gerente"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="numeroRegistro">Número de Registro (se houver)</Label>
                <Input
                  id="numeroRegistro"
                  name="numeroRegistro"
                  value={relatorio.numeroRegistro}
                  onChange={handleInputChange}
                  placeholder="Número de registro profissional"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="produto" className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modeloTelha">Modelo da Telha</Label>
                  <Select 
                    value={relatorio.modeloTelha} 
                    onValueChange={handleModeloTelhaChange}
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
                    onValueChange={handleEspessuraTelhaChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a espessura" />
                    </SelectTrigger>
                    <SelectContent>
                      {espessurasTelhas.map((espessura) => (
                        <SelectItem key={espessura} value={espessura}>
                          {espessura} mm
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
                    name="quantidade"
                    type="number"
                    value={relatorio.quantidade === 0 ? "" : relatorio.quantidade.toString()}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : 0;
                      setRelatorio(prev => ({
                        ...prev,
                        quantidade: value
                      }));
                    }}
                    placeholder="Quantidade de telhas"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Área Coberta (m²)</Label>
                  <Input
                    id="area"
                    name="area"
                    type="number"
                    value={relatorio.area === 0 ? "" : relatorio.area.toString()}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : 0;
                      setRelatorio(prev => ({
                        ...prev,
                        area: value
                      }));
                    }}
                    placeholder="Área em m²"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="anosGarantia">Anos de Garantia</Label>
                  <Input
                    id="anosGarantia"
                    name="anosGarantia"
                    value={relatorio.anosGarantia}
                    onChange={handleInputChange}
                    placeholder="Ex: 5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anosGarantiaSistemaCompleto">Anos de Garantia (Sistema Completo)</Label>
                  <Input
                    id="anosGarantiaSistemaCompleto"
                    name="anosGarantiaSistemaCompleto"
                    value={relatorio.anosGarantiaSistemaCompleto}
                    onChange={handleInputChange}
                    placeholder="Ex: 10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anosGarantiaTotal">Anos de Garantia Total</Label>
                  <Input
                    id="anosGarantiaTotal"
                    name="anosGarantiaTotal"
                    value={relatorio.anosGarantiaTotal}
                    onChange={handleInputChange}
                    placeholder="Ex: 10"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="nao-conformidades" className="space-y-4 mt-2" ref={naoConformidadesRef}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium">Não Conformidades</h3>
                  <p className="text-sm text-muted-foreground">
                    Selecione as não conformidades identificadas na vistoria.
                  </p>
                </div>
                <Badge variant="outline" className="ml-2">
                  {relatorio.naoConformidades.filter(nc => nc.selecionado).length} selecionadas
                </Badge>
              </div>
              
              <div className="space-y-4">
                {relatorio.naoConformidades.map((nc) => (
                  <Card key={nc.id} className={nc.selecionado ? "border-primary" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Checkbox 
                          id={`nc-${nc.id}`} 
                          checked={nc.selecionado}
                          onCheckedChange={() => handleNaoConformidadeToggle(nc.id)}
                          className="mt-1"
                        />
                        <div className="space-y-2 flex-1">
                          <Label 
                            htmlFor={`nc-${nc.id}`}
                            className="text-base font-medium cursor-pointer"
                          >
                            {nc.id}. {nc.titulo}
                          </Label>
                          <p className="text-sm text-muted-foreground">{nc.descricao}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="conclusao" className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="resultado">Resultado da Reclamação</Label>
                <Select 
                  value={relatorio.resultado} 
                  onValueChange={handleResultadoChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o resultado" />
                  </SelectTrigger>
                  <SelectContent>
                    {resultadoReclamacaoEnum.options.map((resultado) => (
                      <SelectItem key={resultado} value={resultado}>
                        {resultado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  {relatorio.resultado === "PROCEDENTE" 
                    ? "A reclamação é válida e o problema é relacionado à qualidade do material." 
                    : "A reclamação não procede, pois o problema é decorrente de instalação ou manuseio incorreto."}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="introducao">Introdução (opcional)</Label>
                <Textarea
                  id="introducao"
                  name="introducao"
                  value={relatorio.introducao || ""}
                  onChange={handleInputChange}
                  placeholder="Texto personalizado para a introdução"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="analiseTecnica">Análise Técnica (opcional)</Label>
                <Textarea
                  id="analiseTecnica"
                  name="analiseTecnica"
                  value={relatorio.analiseTecnica || ""}
                  onChange={handleInputChange}
                  placeholder="Texto personalizado para a análise técnica"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="conclusao">Conclusão (opcional)</Label>
                <Textarea
                  id="conclusao"
                  name="conclusao"
                  value={relatorio.conclusao || ""}
                  onChange={handleInputChange}
                  placeholder="Texto personalizado para a conclusão"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recomendacao">Recomendações (opcional)</Label>
                <Textarea
                  id="recomendacao"
                  name="recomendacao"
                  value={relatorio.recomendacao || ""}
                  onChange={handleInputChange}
                  placeholder="Recomendações técnicas específicas"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observacoesGerais">Observações Gerais (opcional)</Label>
                <Textarea
                  id="observacoesGerais"
                  name="observacoesGerais"
                  value={relatorio.observacoesGerais || ""}
                  onChange={handleInputChange}
                  placeholder="Observações gerais sobre a vistoria"
                  rows={4}
                />
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>
              {activeTab === "informacoes-basicas" && "1"}
              {activeTab === "responsaveis" && "2"}
              {activeTab === "produto" && "3"}
              {activeTab === "nao-conformidades" && "4"}
              {activeTab === "conclusao" && "5"}
            </span>
            <span className="mx-1">/</span>
            <span>5</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleGerarRelatorio}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

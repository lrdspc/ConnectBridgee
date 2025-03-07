import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileDown, Loader2, FileText, FileCheck, User, Building, MapPin, Calendar, ClipboardList, Sparkles, Save } from 'lucide-react';
import { 
  novoRelatorioVistoria, 
  gerarRelatorioAleatorio, 
  naoConformidadesDisponiveis, 
  modelosTelhas, 
  espessurasTelhas,
  RelatorioVistoria 
} from "@shared/relatorioVistoriaSchema";
import { gerarRelatorioSimples } from "@/lib/relatorioVistoriaSimpleGenerator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Página completa para criação de relatórios de vistoria
 * Esta versão utiliza o novo gerador simplificado que funciona corretamente
 */
export default function TesteRelatorioPageSimple() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [relatorio, setRelatorio] = useState<RelatorioVistoria>(novoRelatorioVistoria());
  const [activeTab, setActiveTab] = useState("informacoes");
  
  // Atualiza um campo específico do relatório
  const updateField = (field: string, value: any) => {
    setRelatorio(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Atualiza um campo de não conformidade
  const updateNaoConformidade = (id: number, field: string, value: any) => {
    setRelatorio(prev => ({
      ...prev,
      naoConformidades: prev.naoConformidades.map(nc => 
        nc.id === id ? { ...nc, [field]: value } : nc
      )
    }));
  };

  // Função para gerar dados de teste
  const gerarDadosTeste = () => {
    const dados = gerarRelatorioAleatorio();
    setRelatorio(dados);
    
    toast({
      title: "Dados gerados",
      description: "Relatório de teste carregado com dados aleatórios.",
    });
  };
  
  // Salvar os dados do formulário
  const handleSaveForm = () => {
    setIsSaving(true);
    
    // Simulação de salvamento
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Dados salvos",
        description: "Os dados do relatório foram salvos com sucesso.",
      });
    }, 1000);
  };

  // Função para salvar o arquivo DOCX a partir de um blob
  const saveDocFile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Limpar recursos
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };
  
  // Função que implementa a nova versão do gerador de relatórios
  const gerarRelatorio = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Gerando relatório...",
        description: "Aguarde enquanto o documento é preparado.",
      });

      // Utilizar nosso novo gerador simplificado
      const fileName = `Relatório-${relatorio.protocolo || 'Vistoria'}-ABNT.docx`;
      const blob = await gerarRelatorioSimples(relatorio);
      
      // Salvar o arquivo
      saveDocFile(blob, fileName);

      toast({
        title: "Relatório gerado com sucesso!",
        description: "O documento DOCX foi salvo com formatação ABNT.",
        variant: "default"
      });
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast({
        title: "Erro ao gerar relatório",
        description: String(error),
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Verifica se existem dados suficientes para gerar o relatório
  const canGenerateReport = () => {
    return (
      relatorio.cliente && 
      relatorio.protocolo && 
      relatorio.dataVistoria && 
      relatorio.elaboradoPor
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Relatório de Vistoria Técnica</h1>
          <p className="text-muted-foreground">
            Preencha o formulário para gerar um relatório com formatação ABNT
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={gerarDadosTeste}>
            Preencher com Teste
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSaveForm}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Salvar
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="informacoes" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="informacoes">Informações Básicas</TabsTrigger>
          <TabsTrigger value="responsaveis">Responsáveis</TabsTrigger>
          <TabsTrigger value="telhas">Telhas</TabsTrigger>
          <TabsTrigger value="naoconformidades">Não Conformidades</TabsTrigger>
          <TabsTrigger value="conclusao">Conclusão</TabsTrigger>
        </TabsList>
        
        {/* Informações Básicas */}
        <TabsContent value="informacoes" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados do Cliente</CardTitle>
                <CardDescription>Informações sobre o cliente e protocolo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="protocolo">Protocolo/FAR</Label>
                    <Input 
                      id="protocolo" 
                      placeholder="Ex: FAR-123456" 
                      value={relatorio.protocolo || ''}
                      onChange={(e) => updateField('protocolo', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataVistoria">Data da Vistoria</Label>
                    <Input 
                      id="dataVistoria" 
                      type="date" 
                      value={relatorio.dataVistoria || ''}
                      onChange={(e) => updateField('dataVistoria', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cliente">Nome do Cliente</Label>
                  <Input 
                    id="cliente" 
                    placeholder="Nome do cliente ou empresa" 
                    value={relatorio.cliente || ''}
                    onChange={(e) => updateField('cliente', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="empreendimento">Empreendimento</Label>
                  <Input 
                    id="empreendimento" 
                    placeholder="Nome do empreendimento" 
                    value={relatorio.empreendimento || ''}
                    onChange={(e) => updateField('empreendimento', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Localização</CardTitle>
                <CardDescription>Dados de endereço da vistoria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço Completo</Label>
                  <Input 
                    id="endereco" 
                    placeholder="Rua, número, complemento" 
                    value={relatorio.endereco || ''}
                    onChange={(e) => updateField('endereco', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input 
                      id="cidade" 
                      placeholder="Cidade" 
                      value={relatorio.cidade || ''}
                      onChange={(e) => updateField('cidade', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uf">UF</Label>
                    <Select 
                      value={relatorio.uf || ''} 
                      onValueChange={(value) => updateField('uf', value)}
                    >
                      <SelectTrigger id="uf">
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
                          'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
                          'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
                          <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assunto">Assunto da Vistoria</Label>
                  <Input 
                    id="assunto" 
                    placeholder="Ex: Avaliação técnica de telhas" 
                    value={relatorio.assunto || ''}
                    onChange={(e) => updateField('assunto', e.target.value)}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => setActiveTab('responsaveis')}
                >
                  Próximo: Responsáveis
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Responsáveis */}
        <TabsContent value="responsaveis" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Responsável Técnico</CardTitle>
                <CardDescription>Dados do responsável pela vistoria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="elaboradoPor">Nome do Responsável</Label>
                  <Input 
                    id="elaboradoPor" 
                    placeholder="Nome completo" 
                    value={relatorio.elaboradoPor || ''}
                    onChange={(e) => updateField('elaboradoPor', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Input 
                    id="departamento" 
                    placeholder="Ex: Assistência Técnica" 
                    value={relatorio.departamento || ''}
                    onChange={(e) => updateField('departamento', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unidade">Unidade</Label>
                  <Input 
                    id="unidade" 
                    placeholder="Ex: Filial SP" 
                    value={relatorio.unidade || ''}
                    onChange={(e) => updateField('unidade', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Gerência</CardTitle>
                <CardDescription>Dados da gestão responsável</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coordenador">Coordenador</Label>
                  <Input 
                    id="coordenador" 
                    placeholder="Nome do coordenador" 
                    value={relatorio.coordenador || ''}
                    onChange={(e) => updateField('coordenador', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gerente">Gerente</Label>
                  <Input 
                    id="gerente" 
                    placeholder="Nome do gerente" 
                    value={relatorio.gerente || ''}
                    onChange={(e) => updateField('gerente', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="regional">Regional</Label>
                  <Input 
                    id="regional" 
                    placeholder="Ex: Sudeste" 
                    value={relatorio.regional || ''}
                    onChange={(e) => updateField('regional', e.target.value)}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => setActiveTab('telhas')}
                >
                  Próximo: Telhas
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Telhas */}
        <TabsContent value="telhas" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Especificações das Telhas</CardTitle>
              <CardDescription>Informações sobre as telhas Brasilit inspecionadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="modeloTelha">Modelo da Telha</Label>
                  <Select 
                    value={relatorio.modeloTelha || ''} 
                    onValueChange={(value) => updateField('modeloTelha', value)}
                  >
                    <SelectTrigger id="modeloTelha">
                      <SelectValue placeholder="Selecione o modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {modelosTelhas.map(modelo => (
                        <SelectItem key={modelo} value={modelo}>{modelo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="espessura">Espessura (mm)</Label>
                  <Select 
                    value={relatorio.espessura || ''} 
                    onValueChange={(value) => updateField('espessura', value)}
                  >
                    <SelectTrigger id="espessura">
                      <SelectValue placeholder="Selecione a espessura" />
                    </SelectTrigger>
                    <SelectContent>
                      {espessurasTelhas.map(espessura => (
                        <SelectItem key={espessura} value={espessura}>{espessura}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input 
                    id="quantidade" 
                    type="number" 
                    placeholder="Quantidade de telhas" 
                    value={relatorio.quantidade?.toString() || ''}
                    onChange={(e) => updateField('quantidade', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Área Coberta (m²)</Label>
                  <Input 
                    id="area" 
                    type="number" 
                    placeholder="Área aproximada" 
                    value={relatorio.area?.toString() || ''}
                    onChange={(e) => updateField('area', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="observacoesGerais">Observações sobre o produto</Label>
                  <Textarea 
                    id="observacoesGerais" 
                    placeholder="Observações adicionais sobre as telhas" 
                    value={relatorio.observacoesGerais || ''}
                    onChange={(e) => updateField('observacoesGerais', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('naoconformidades')}
                >
                  Próximo: Não Conformidades
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Não Conformidades */}
        <TabsContent value="naoconformidades" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Não Conformidades</CardTitle>
              <CardDescription>Selecione as não conformidades encontradas durante a vistoria</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {relatorio.naoConformidades?.map((nc, index) => (
                    <div key={nc.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id={`nc-${nc.id}`} 
                            checked={nc.selecionado} 
                            onCheckedChange={(checked) => 
                              updateNaoConformidade(nc.id, 'selecionado', checked === true)
                            }
                          />
                          <Label 
                            htmlFor={`nc-${nc.id}`}
                            className="font-medium text-base"
                          >
                            {nc.titulo}
                          </Label>
                        </div>
                        <Badge variant={nc.selecionado ? "default" : "outline"}>
                          {nc.categoria}
                        </Badge>
                      </div>
                      
                      <div className="ml-6 space-y-3">
                        <p className="text-sm text-muted-foreground">{nc.descricao}</p>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`obs-${nc.id}`} className="text-xs">Observações específicas</Label>
                          <Textarea 
                            id={`obs-${nc.id}`} 
                            placeholder="Observações específicas desta não conformidade"
                            value={nc.observacoes || ''}
                            onChange={(e) => updateNaoConformidade(nc.id, 'observacoes', e.target.value)}
                            disabled={!nc.selecionado}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="flex justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Itens selecionados: {relatorio.naoConformidades?.filter(nc => nc.selecionado).length || 0} de {relatorio.naoConformidades?.length || 0}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('conclusao')}
                >
                  Próximo: Conclusão
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Conclusão */}
        <TabsContent value="conclusao" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conclusão e Observações Finais</CardTitle>
                <CardDescription>Finalize o relatório com suas observações e conclusão</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resultado">Resultado da Avaliação</Label>
                  <Select 
                    value={relatorio.resultado || ''} 
                    onValueChange={(value) => updateField('resultado', value)}
                  >
                    <SelectTrigger id="resultado">
                      <SelectValue placeholder="Selecione o resultado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROCEDENTE">PROCEDENTE</SelectItem>
                      <SelectItem value="IMPROCEDENTE">IMPROCEDENTE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recomendacao">Recomendações Técnicas</Label>
                  <Textarea 
                    id="recomendacao" 
                    placeholder="Recomendações técnicas baseadas na análise"
                    value={relatorio.recomendacao || ''}
                    onChange={(e) => updateField('recomendacao', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="observacoesGerais">Observações Gerais</Label>
                  <Textarea 
                    id="observacoesGerais" 
                    placeholder="Observações finais e comentários adicionais"
                    value={relatorio.observacoesGerais || ''}
                    onChange={(e) => updateField('observacoesGerais', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Gerar Relatório</CardTitle>
                <CardDescription>
                  Revise os dados e gere o relatório em formato DOCX
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h3 className="font-medium mb-2">Resumo do Relatório</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Cliente:</strong> {relatorio.cliente || "Não informado"}</p>
                    <p><strong>Protocolo:</strong> {relatorio.protocolo || "Não informado"}</p>
                    <p><strong>Data:</strong> {relatorio.dataVistoria || "Não informada"}</p>
                    <p><strong>Resp. Técnico:</strong> {relatorio.elaboradoPor || "Não informado"}</p>
                    <p><strong>Modelo Telha:</strong> {relatorio.modeloTelha} {relatorio.espessura}mm</p>
                    <p><strong>Não Conformidades:</strong> {relatorio.naoConformidades?.filter(nc => nc.selecionado).length || 0} selecionadas</p>
                    <p><strong>Resultado:</strong> <Badge className="ml-1" variant={relatorio.resultado === "IMPROCEDENTE" ? "destructive" : "default"}>{relatorio.resultado || "Não definido"}</Badge></p>
                  </div>
                </div>
                
                <div className="rounded-md border bg-primary/5 p-6 flex flex-col items-center justify-center">
                  <FileText className="h-12 w-12 text-primary mb-2" />
                  <h3 className="font-semibold">Relatório ABNT</h3>
                  <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
                    Documento DOCX com formatação seguindo normas ABNT
                  </p>
                  
                  <Button 
                    onClick={gerarRelatorio} 
                    disabled={isGenerating || !canGenerateReport()}
                    className="w-full gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Gerando Documento...
                      </>
                    ) : (
                      <>
                        <FileDown className="h-4 w-4" />
                        Gerar Relatório DOCX
                      </>
                    )}
                  </Button>
                  
                  {!canGenerateReport() && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Preencha os dados básicos do cliente e responsável técnico para gerar o relatório
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleSaveForm}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Salvar Rascunho
                </Button>
                
                <Button 
                  onClick={gerarRelatorio} 
                  disabled={isGenerating || !canGenerateReport()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <FileDown className="h-4 w-4 mr-2" />
                      Gerar DOCX
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center">
        <a href="/" className="text-blue-500 hover:underline">
          Voltar para a página inicial
        </a>
      </div>
    </div>
  );
}
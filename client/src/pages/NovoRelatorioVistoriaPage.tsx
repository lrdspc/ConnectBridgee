import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileDown, Loader2, FileText, FileCheck, User, Building, MapPin, Calendar, ClipboardList, FileSparkles, Save } from 'lucide-react';
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
import { DashboardLayoutNew } from "@/layouts/DashboardLayoutNew";
import { PageTransition } from "@/components/ui/loading-animation";

/**
 * Página oficial para criação de relatórios de vistoria
 * Utiliza o gerador simplificado que produz documentos com formatação ABNT
 */
export default function NovoRelatorioVistoriaPage() {
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
  const updateNaoConformidade = (id: string, field: string, value: any) => {
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
    
    // Simulação de salvamento - aqui você pode adicionar a conexão com o backend
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
  
  // Função que implementa a geração do relatório
  const gerarRelatorio = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Gerando relatório...",
        description: "Aguarde enquanto o documento é preparado.",
      });

      // Utilizar o gerador simplificado
      const fileName = `Relatório-${relatorio.protocolo || 'Vistoria'}-${new Date().toISOString().slice(0, 10)}.docx`;
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
    <DashboardLayoutNew>
      <PageTransition>
        <div className="container mx-auto py-4 px-2">
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
              <Button 
                onClick={gerarRelatorio}
                disabled={isGenerating || !canGenerateReport()}
              >
                {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}
                Gerar Relatório
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
                            <SelectItem key={espessura} value={espessura}>{espessura}mm</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="quantidade">Quantidade</Label>
                      <Input 
                        id="quantidade" 
                        type="number" 
                        placeholder="Ex: 100" 
                        value={relatorio.quantidade || ''}
                        onChange={(e) => updateField('quantidade', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="comprimento">Comprimento (m)</Label>
                      <Input 
                        id="comprimento" 
                        type="number" 
                        step="0.01"
                        placeholder="Ex: 2.44" 
                        value={relatorio.comprimento || ''}
                        onChange={(e) => updateField('comprimento', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="largura">Largura (m)</Label>
                      <Input 
                        id="largura" 
                        type="number" 
                        step="0.01"
                        placeholder="Ex: 1.10" 
                        value={relatorio.largura || ''}
                        onChange={(e) => updateField('largura', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="area">Área Estimada (m²)</Label>
                      <Input 
                        id="area" 
                        type="number" 
                        step="0.01"
                        placeholder="Ex: 300" 
                        value={relatorio.area || ''}
                        onChange={(e) => updateField('area', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="anosGarantia">Anos de Garantia</Label>
                      <Input 
                        id="anosGarantia" 
                        placeholder="Ex: 5" 
                        value={relatorio.anosGarantia || ''}
                        onChange={(e) => updateField('anosGarantia', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="anosGarantiaSistemaCompleto">Anos de Garantia (Sistema Completo)</Label>
                      <Input 
                        id="anosGarantiaSistemaCompleto" 
                        placeholder="Ex: 7" 
                        value={relatorio.anosGarantiaSistemaCompleto || ''}
                        onChange={(e) => updateField('anosGarantiaSistemaCompleto', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="anosGarantiaTotal">Anos de Garantia Total</Label>
                      <Input 
                        id="anosGarantiaTotal" 
                        placeholder="Ex: 10" 
                        value={relatorio.anosGarantiaTotal || ''}
                        onChange={(e) => updateField('anosGarantiaTotal', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => setActiveTab('naoconformidades')}
                  >
                    Próximo: Não Conformidades
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Não Conformidades */}
            <TabsContent value="naoconformidades" className="pt-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Não Conformidades Identificadas</CardTitle>
                      <CardDescription>Selecione os problemas encontrados durante a vistoria</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-6">
                      {naoConformidadesDisponiveis.map((nc) => (
                        <div key={nc.id} className="p-4 border rounded-lg">
                          <div className="flex items-start gap-3 mb-2">
                            <Checkbox 
                              id={`nc-${nc.id}`} 
                              checked={relatorio.naoConformidades.some(item => item.id === nc.id && item.selecionado)}
                              onCheckedChange={(checked) => {
                                const isChecked = !!checked;
                                if (isChecked) {
                                  // Adicionar à lista se não existir
                                  if (!relatorio.naoConformidades.some(item => item.id === nc.id)) {
                                    setRelatorio(prev => ({
                                      ...prev,
                                      naoConformidades: [
                                        ...prev.naoConformidades,
                                        { ...nc, selecionado: true }
                                      ]
                                    }));
                                  } else {
                                    // Atualizar o existente
                                    updateNaoConformidade(nc.id, 'selecionado', true);
                                  }
                                } else {
                                  // Desmarcar o existente
                                  updateNaoConformidade(nc.id, 'selecionado', false);
                                }
                              }}
                            />
                            <div>
                              <Label 
                                htmlFor={`nc-${nc.id}`}
                                className="text-base font-medium"
                              >
                                {nc.tipo}
                              </Label>
                              <p className="text-sm text-muted-foreground mt-1">{nc.descricao}</p>
                            </div>
                          </div>
                          
                          {relatorio.naoConformidades.some(item => item.id === nc.id && item.selecionado) && (
                            <div className="mt-4 ml-8">
                              <div className="space-y-2">
                                <Label htmlFor={`obs-${nc.id}`}>Observações Adicionais</Label>
                                <Textarea 
                                  id={`obs-${nc.id}`} 
                                  placeholder="Descreva detalhes adicionais sobre esta não conformidade..."
                                  value={relatorio.naoConformidades.find(item => item.id === nc.id)?.observacoes || ''}
                                  onChange={(e) => updateNaoConformidade(nc.id, 'observacoes', e.target.value)}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab('conclusao')}
                  >
                    Próximo: Conclusão
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Conclusão */}
            <TabsContent value="conclusao" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Conclusão e Recomendações</CardTitle>
                  <CardDescription>Finalize o relatório com suas conclusões</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="conclusao">Conclusão da Análise</Label>
                    <Textarea 
                      id="conclusao" 
                      placeholder="Descreva a conclusão da sua análise técnica..." 
                      rows={3}
                      value={relatorio.conclusao || ''}
                      onChange={(e) => updateField('conclusao', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recomendacao">Recomendações</Label>
                    <Textarea 
                      id="recomendacao" 
                      placeholder="Descreva as recomendações técnicas..." 
                      rows={3}
                      value={relatorio.recomendacao || ''}
                      onChange={(e) => updateField('recomendacao', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="observacoesGerais">Observações Gerais</Label>
                    <Textarea 
                      id="observacoesGerais" 
                      placeholder="Outras informações relevantes..." 
                      rows={3}
                      value={relatorio.observacoesGerais || ''}
                      onChange={(e) => updateField('observacoesGerais', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <Label htmlFor="resultado">Resultado da Análise</Label>
                    <div className="flex space-x-4 pt-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="resultado-procedente" 
                          value="PROCEDENTE"
                          checked={relatorio.resultado === "PROCEDENTE"}
                          onChange={() => updateField('resultado', "PROCEDENTE")}
                        />
                        <Label htmlFor="resultado-procedente">PROCEDENTE</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="resultado-improcedente" 
                          value="IMPROCEDENTE"
                          checked={relatorio.resultado === "IMPROCEDENTE"}
                          onChange={() => updateField('resultado', "IMPROCEDENTE")}
                        />
                        <Label htmlFor="resultado-improcedente">IMPROCEDENTE</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <Button 
                      className="w-full" 
                      onClick={gerarRelatorio}
                      disabled={isGenerating || !canGenerateReport()}
                    >
                      {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}
                      Gerar Relatório de Vistoria Técnica
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </DashboardLayoutNew>
  );
}
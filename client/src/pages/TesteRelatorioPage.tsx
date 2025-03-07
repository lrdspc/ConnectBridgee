import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileDown, File, Award, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { novoRelatorioVistoria, gerarRelatorioAleatorio } from "@shared/relatorioVistoriaSchema";
import { RelatorioVistoria } from "@shared/relatorioVistoriaSchema";
import { TestLayout } from "@/layouts/TestLayout";
import { PageTransition } from "@/components/ui/loading-animation";
import { gerarRelatorioSimples } from "@/lib/relatorioVistoriaSimpleGenerator";

/**
 * Página de teste para o gerador de relatórios
 * Isolada do resto do sistema para facilitar desenvolvimento e testes
 */
export default function TesteRelatorioPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [relatorio, setRelatorio] = useState<RelatorioVistoria>(novoRelatorioVistoria());

  // Função para gerar dados de teste
  const gerarDadosTeste = () => {
    const dados = gerarRelatorioAleatorio();
    // Forçar resultado como IMPROCEDENTE para testes
    dados.resultado = "IMPROCEDENTE";
    setRelatorio(dados);
    
    toast({
      title: "Dados gerados",
      description: "Relatório de teste carregado com dados aleatórios.",
    });
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

  return (
    <PageTransition>
      <TestLayout>
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-amber-100 border-amber-200 text-amber-700">Experimental</Badge>
                <Badge variant="outline">Versão de Teste</Badge>
              </div>
              <h1 className="text-2xl font-bold tracking-tight mt-1">Gerador de Relatórios (Nova Versão)</h1>
              <p className="text-muted-foreground text-sm">
                Versão simplificada do gerador de relatórios com suporte ABNT
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Configuração do Relatório</CardTitle>
                <CardDescription>
                  Use os botões abaixo para preparar os dados do relatório
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Cliente:</span>
                    <span className="text-muted-foreground">{relatorio.cliente || "Não definido"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Protocolo:</span>
                    <span className="text-muted-foreground">{relatorio.protocolo || "Não definido"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Data:</span>
                    <span className="text-muted-foreground">{relatorio.dataVistoria || "Não definido"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Modelo Telha:</span>
                    <span className="text-muted-foreground">{relatorio.modeloTelha || "Não definido"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Não Conformidades:</span>
                    <span className="text-muted-foreground">
                      {relatorio.naoConformidades?.filter((nc: any) => nc.selecionado).length || 0} selecionadas
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Resultado:</span>
                    <Badge 
                      variant={relatorio.resultado === "IMPROCEDENTE" ? "destructive" : "default"}
                      className="text-xs"
                    >
                      {relatorio.resultado || "Não definido"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setRelatorio(novoRelatorioVistoria())}
                >
                  Limpar Dados
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={gerarDadosTeste}
                >
                  Gerar Dados Teste
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gerar Relatório</CardTitle>
                <CardDescription>
                  Escolha o formato de exportação do relatório
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-md border bg-muted/50 p-6 flex flex-col items-center justify-center">
                  <File className="h-10 w-10 text-primary mb-2" />
                  <h3 className="font-semibold">Relatório ABNT</h3>
                  <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
                    Documento DOCX formato ABNT com margens corretas e fonte Arial
                  </p>
                  
                  <div className="flex justify-center w-full">
                    <Button 
                      onClick={gerarRelatorio} 
                      disabled={isGenerating}
                      className="w-full md:w-auto gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <FileDown className="h-4 w-4" />
                          Gerar DOCX (ABNT)
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-sm font-semibold mb-2">Informações Adicionais</h3>
                  <p className="text-xs text-muted-foreground">
                    Esta é uma versão experimental que será implementada do zero para resolver 
                    problemas com a geração de documentos no formato ABNT.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled
                >
                  <Award className="h-4 w-4 mr-2" />
                  Certificar ABNT (Em breve)
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </TestLayout>
    </PageTransition>
  );
}
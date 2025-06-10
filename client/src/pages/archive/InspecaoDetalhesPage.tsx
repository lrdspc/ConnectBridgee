import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { DashboardLayoutNew } from '../../layouts/DashboardLayoutNew';
import { PageTransition, LoadingAnimation } from '@/components/ui/loading-animation';
import { useToast } from "@/hooks/use-toast";
import { GenerateRoofReportModal } from "@/components/inspections/GenerateRoofReportModal";
import { Inspection } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatDate } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Building, Calendar, Download, Edit, FileText, Globe, MapPin, User, Camera } from "lucide-react";

// Dados mockados para teste
const mockInspections: Record<string, Inspection> = {
  "insp-1": {
    id: "insp-1",
    visitId: "visit-1",
    clientName: "Construtora Horizonte LTDA",
    dateInspected: new Date("2025-02-15"),
    constructionType: "Comercial",
    address: "Av. Paulista, 1578, São Paulo, SP",
    city: "São Paulo",
    technicianId: "1",
    technicianName: "Carlos Silva",
    department: "Assistência Técnica",
    unit: "Unidade São Paulo",
    region: "Sudeste",
    tileSpecs: [
      { 
        id: "tile-1", 
        model: "Ondulada 6mm", 
        thickness: "6mm", 
        dimensions: "2,44 x 1,10m", 
        count: "120" 
      }
    ],
    issues: [
      "Fixação Irregular das Telhas",
      "Recobrimento Incorreto",
      "Estrutura Desalinhada"
    ],
    photos: [
      {
        id: "photo-1",
        category: "general",
        dataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        timestamp: new Date().toISOString(),
        notes: "Vista geral do telhado"
      }
    ],
    conclusion: "Telhado com múltiplos problemas de instalação que precisam ser corrigidos para evitar infiltrações.",
    recommendations: "Refazer a fixação das telhas seguindo o manual técnico Brasilit. Corrigir recobrimento longitudinal e transversal.",
    createdAt: new Date("2025-02-15").toISOString(),
    updatedAt: new Date("2025-02-15").toISOString(),
    synced: true
  },
  "insp-2": {
    id: "insp-2",
    visitId: "visit-2",
    clientName: "Residencial Parque Sul",
    dateInspected: new Date("2025-02-22"),
    constructionType: "Residencial",
    address: "Av. das Nações Unidas, 1200, São Paulo, SP",
    city: "São Paulo",
    technicianId: "1",
    technicianName: "Carlos Silva",
    department: "Assistência Técnica",
    unit: "Unidade São Paulo",
    region: "Sudeste",
    tileSpecs: [
      { 
        id: "tile-2", 
        model: "Tropical", 
        thickness: "8mm", 
        dimensions: "2,13 x 1,10m", 
        count: "85" 
      }
    ],
    issues: [
      "Inclinação da Telha Inferior ao Recomendado",
      "Marcas de Caminhamento sobre o Telhado"
    ],
    photos: [],
    conclusion: "",
    recommendations: "",
    createdAt: new Date("2025-02-22").toISOString(),
    updatedAt: new Date("2025-02-22").toISOString(),
    synced: false
  }
};

export default function InspecaoDetalhesPage() {
  const [, params] = useRoute<{ id: string }>("/inspecoes/:id");
  const inspectionId = params?.id;
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulação de carregamento de dados
    const loadInspection = async () => {
      setIsLoading(true);
      try {
        // Em uma aplicação real, isso seria uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const foundInspection = mockInspections[inspectionId || ""];
        if (foundInspection) {
          setInspection(foundInspection);
        } else {
          toast({
            title: "Inspeção não encontrada",
            description: "Não foi possível carregar os dados da inspeção solicitada.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Erro ao carregar inspeção:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar os dados da inspeção. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (inspectionId) {
      loadInspection();
    }
  }, [inspectionId, toast]);

  const handleGenerateReport = () => {
    if (inspection) {
      setIsReportModalOpen(true);
    }
  };

  // Renderização condicional para carregamento
  if (isLoading) {
    return (
      <DashboardLayoutNew>
        <div className="container mx-auto px-4 py-6 flex justify-center items-center min-h-[50vh]">
          <LoadingAnimation />
        </div>
      </DashboardLayoutNew>
    );
  }
  
  // Renderização condicional quando a inspeção não foi encontrada
  if (!inspection) {
    return (
      <DashboardLayoutNew>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Inspeção não encontrada</h2>
            <p className="text-muted-foreground mb-6">A inspeção solicitada não foi encontrada ou pode ter sido removida.</p>
            <Button variant="default" onClick={() => window.history.back()}>Voltar</Button>
          </div>
        </div>
      </DashboardLayoutNew>
    );
  }

  return (
    <PageTransition>
      <DashboardLayoutNew>
        <div className="container mx-auto px-4 py-6">
          {/* Cabeçalho com título e ações */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">
                Inspeção: {inspection.clientName}
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant={inspection.synced ? "default" : "outline"} className={`${inspection.synced ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                  {inspection.synced ? "Sincronizada" : "Pendente"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ID: {inspection.id}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1">
                <Edit className="h-4 w-4" /> Editar
              </Button>
              <Button onClick={handleGenerateReport} className="gap-1">
                <FileText className="h-4 w-4" /> Gerar Relatório
              </Button>
            </div>
          </div>
          
          {/* Conteúdo principal */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="tiles">Telhas</TabsTrigger>
              <TabsTrigger value="issues">Não Conformidades</TabsTrigger>
              <TabsTrigger value="photos">Fotos ({inspection.photos.length})</TabsTrigger>
            </TabsList>
            
            {/* Aba de Visão Geral */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dados do Cliente e Obra */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" /> Cliente e Obra
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nome do Cliente</p>
                      <p>{inspection.clientName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Data da Inspeção</p>
                      <p>{format(new Date(inspection.dateInspected), "PPP", { locale: ptBR })}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tipo de Construção</p>
                      <p>{inspection.constructionType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                      <p>{inspection.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cidade</p>
                      <p>{inspection.city}</p>
                    </div>
                    {inspection.protocolNumber && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Protocolo</p>
                        <p>{inspection.protocolNumber}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Dados do Técnico */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" /> Técnico Responsável
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nome</p>
                      <p>{inspection.technicianName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Departamento</p>
                      <p>{inspection.department}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Unidade</p>
                      <p>{inspection.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Região</p>
                      <p>{inspection.region}</p>
                    </div>
                    {inspection.coordinatorName && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Coordenador</p>
                        <p>{inspection.coordinatorName}</p>
                      </div>
                    )}
                    {inspection.managerName && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Gerente</p>
                        <p>{inspection.managerName}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Conclusão e Recomendações */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" /> Conclusão e Recomendações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Conclusão</h3>
                    <p className="text-muted-foreground">
                      {inspection.conclusion || "Nenhuma conclusão registrada."}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Recomendações</h3>
                    <p className="text-muted-foreground">
                      {inspection.recommendations || "Nenhuma recomendação registrada."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Aba de Telhas */}
            <TabsContent value="tiles">
              <Card>
                <CardHeader>
                  <CardTitle>Especificações das Telhas</CardTitle>
                </CardHeader>
                <CardContent>
                  {inspection.tileSpecs.length === 0 ? (
                    <p className="text-muted-foreground">Nenhuma especificação de telha registrada.</p>
                  ) : (
                    <div className="grid gap-6">
                      {inspection.tileSpecs.map((spec) => (
                        <div key={spec.id} className="border rounded-lg p-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Modelo</p>
                              <p className="font-medium">{spec.model}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Espessura</p>
                              <p>{spec.thickness}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Dimensões</p>
                              <p>{spec.dimensions}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Quantidade</p>
                              <p>{spec.count} unidades</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Aba de Não Conformidades */}
            <TabsContent value="issues">
              <Card>
                <CardHeader>
                  <CardTitle>Não Conformidades Identificadas</CardTitle>
                </CardHeader>
                <CardContent>
                  {inspection.issues.length === 0 ? (
                    <p className="text-muted-foreground">Nenhuma não conformidade registrada.</p>
                  ) : (
                    <ul className="space-y-2 pl-6 list-disc">
                      {inspection.issues.map((issue, index) => (
                        <li key={index} className="text-base">
                          {issue}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Aba de Fotos */}
            <TabsContent value="photos">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" /> Registro Fotográfico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {inspection.photos.length === 0 ? (
                    <p className="text-muted-foreground">Nenhuma foto registrada.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {inspection.photos.map((photo) => (
                        <div key={photo.id} className="border rounded-lg overflow-hidden">
                          <img
                            src={photo.dataUrl}
                            alt={`Foto ${photo.id}`}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-3">
                            <p className="text-sm text-muted-foreground">
                              {photo.category === "general" ? "Foto Geral" : 
                               photo.category === "tiles" ? "Foto de Telhas" : 
                               photo.category === "issues" ? "Foto de Problema" : photo.category}
                            </p>
                            {photo.notes && (
                              <p className="mt-1 text-sm">{photo.notes}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDate(new Date(photo.timestamp), "dd/MM/yyyy, HH:mm")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Modal de geração de relatório */}
          <GenerateRoofReportModal
            inspection={inspection}
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
          />
        </div>
      </DashboardLayoutNew>
    </PageTransition>
  );
}
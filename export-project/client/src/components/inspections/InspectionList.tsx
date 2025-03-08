import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Inspection } from "../../shared/inspectionSchema";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { formatDate } from "@/lib/utils";
import { GenerateRoofReportModal } from "./GenerateRoofReportModal";
import { 
  Search, 
  Plus, 
  Filter, 
  FileText, 
  ChevronDown, 
  Calendar, 
  MapPin, 
  Building, 
  FileImage, 
  AlertTriangle, 
  CheckCircle2, 
  Eye 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

// Dados mockados para demonstração
const mockInspections: Inspection[] = [
  {
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
        timestamp: new Date().toISOString()
      }
    ],
    conclusion: "Telhado com múltiplos problemas de instalação que precisam ser corrigidos para evitar infiltrações.",
    recommendations: "Refazer a fixação das telhas seguindo o manual técnico Brasilit. Corrigir recobrimento longitudinal e transversal.",
    createdAt: new Date("2025-02-15").toISOString(),
    updatedAt: new Date("2025-02-15").toISOString(),
    synced: true
  },
  {
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
];

interface InspectionListProps {
  userId?: string;
}

export function InspectionList({ userId }: InspectionListProps) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  
  // Simulação de query para carregar inspeções
  const { data: inspections, isLoading } = useQuery({
    queryKey: ["inspections"],
    queryFn: async () => {
      // Em uma aplicação real, isto seria uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay da rede
      return mockInspections;
    }
  });
  
  // Filtragem das inspeções baseada na busca e tabs
  const filteredInspections = inspections?.filter(inspection => {
    const matchesSearch = 
      inspection.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === "synced") {
      matchesTab = inspection.synced;
    } else if (activeTab === "pending") {
      matchesTab = !inspection.synced;
    }
    
    return matchesSearch && matchesTab;
  });
  
  // Função para gerar relatório
  const handleGenerateReport = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setIsReportModalOpen(true);
  };
  
  // Validação de conclusão da inspeção (para habilitar botão de relatório)
  const isInspectionComplete = (inspection: Inspection): boolean => {
    return (
      !!inspection.clientName &&
      !!inspection.address &&
      inspection.tileSpecs.length > 0 &&
      inspection.issues.length > 0
    );
  };
  
  if (isLoading) {
    return <LoadingAnimation />;
  }
  
  return (
    <div className="space-y-6">
      {/* Cabeçalho com título e botão de nova inspeção */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Inspeções de Telhados</h2>
        <Button onClick={() => setLocation('/inspecoes/nova')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Inspeção
        </Button>
      </div>
      
      {/* Barra de pesquisa e filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar por cliente ou endereço..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter size={16} /> Filtrar <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Calendar size={16} className="mr-2" /> Último mês
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Building size={16} className="mr-2" /> Por cliente
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <CheckCircle2 size={16} className="mr-2" /> Concluídas
              </DropdownMenuItem>
              <DropdownMenuItem>
                <AlertTriangle size={16} className="mr-2" /> Pendentes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Tabs para filtrar inspeções */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="synced">Sincronizadas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Lista de inspeções */}
      {filteredInspections?.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Nenhuma inspeção encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredInspections?.map((inspection) => (
            <Card key={inspection.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 md:p-6 grid gap-4 md:grid-cols-[2fr_1fr_auto]">
                  {/* Informações da inspeção */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{inspection.clientName}</h3>
                      <Badge variant={inspection.synced ? "default" : "outline"} className={`${inspection.synced ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                        {inspection.synced ? "Sincronizada" : "Pendente"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2 space-y-1">
                      <div className="flex items-center gap-1">
                        <Building size={14} />
                        <span>Tipo: {inspection.constructionType}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{inspection.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Data da Inspeção: {formatDate(inspection.dateInspected, "dd/MM/yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertTriangle size={14} />
                        <span>Problemas identificados: {inspection.issues.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Telhas e fotos */}
                  <div className="text-sm">
                    <p className="font-medium mb-1">Telhas:</p>
                    <ul className="list-disc pl-5">
                      {inspection.tileSpecs.map((spec) => (
                        <li key={spec.id}>
                          {spec.model} - {spec.thickness} - {spec.count} unidades
                        </li>
                      ))}
                    </ul>
                    <p className="font-medium mt-2 mb-1">
                      Fotos: <span className="font-normal">{inspection.photos.length}</span>
                    </p>
                  </div>
                  
                  {/* Ações */}
                  <div className="flex md:flex-col gap-2 justify-end items-end">
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-1"
                      disabled={!isInspectionComplete(inspection)}
                      onClick={() => handleGenerateReport(inspection)}
                    >
                      <FileText size={16} /> Gerar Relatório
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="gap-1"
                      onClick={() => setLocation(`/inspecoes/${inspection.id}`)}
                    >
                      <Eye size={16} /> Visualizar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Modal de geração de relatório */}
      {selectedInspection && (
        <GenerateRoofReportModal
          inspection={selectedInspection}
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
}
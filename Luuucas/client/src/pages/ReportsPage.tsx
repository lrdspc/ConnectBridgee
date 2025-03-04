import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useVisits } from "../hooks/useVisits";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useOfflineStatus } from "../hooks/useOfflineStatus";
import Header from "../components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { VisitStatus, VisitType, Visit, db } from "../lib/db";
import { formatDate } from "../lib/utils";
import { generateVisitReport } from "../lib/reportGenerator";
import { syncData } from "../lib/sync";
import { Download, FileText, Edit, Search, Calendar, Eye, FileSearch } from "lucide-react";

const ReportsPage = () => {
  const { visits, isLoading, error } = useVisits();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isOffline } = useOfflineStatus();
  const [searchQuery, setSearchQuery] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  // Forçar recarregamento dos dados quando o componente montar
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("ReportsPage montado - forçando atualização dos dados");
        
        // Primeiro invalida a query para forçar uma nova busca
        await queryClient.invalidateQueries({ queryKey: ["visits"] });
        
        // Verifica se existem visitas no IndexedDB
        const visitsCount = await db.visits.count();
        console.log(`Visitas no IndexedDB: ${visitsCount}`);
        
        if (visitsCount === 0) {
          console.log("Nenhuma visita encontrada, pode ser necessário inicializar o banco novamente");
          // Opcionalmente, poderia reinicializar o banco aqui
        }
        
        // Sincroniza com o servidor se estiver online
        if (!isOffline) {
          await syncData();
          console.log("Sincronização concluída");
        }
      } catch (error) {
        console.error("Erro ao carregar dados na ReportsPage:", error);
      }
    };
    
    loadData();
  }, [queryClient, isOffline]);
  
  // Helper function to get status display name
  const getStatusName = (status: VisitStatus): string => {
    switch (status) {
      case "scheduled": return "Agendada";
      case "in-progress": return "Em Andamento";
      case "pending": return "Pendente";
      case "completed": return "Concluída";
      case "urgent": return "Urgente";
      default: return status;
    }
  };
  
  // Helper function to get type display name
  const getTypeName = (type: VisitType): string => {
    switch (type) {
      case "installation": return "Instalação";
      case "maintenance": return "Manutenção";
      case "inspection": return "Inspeção";
      case "repair": return "Reparo";
      case "emergency": return "Emergência";
      default: return type;
    }
  };
  
  // Helper function to get status badge color
  const getStatusColor = (status: VisitStatus): string => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-orange-100 text-orange-800";
      case "completed": return "bg-green-100 text-green-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Generate and download report
  const handleGenerateReport = async (visit: Visit) => {
    setIsGeneratingReport(true);
    try {
      const reportBlob = await generateVisitReport(visit);
      const url = URL.createObjectURL(reportBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_${visit.clientName.replace(/\s+/g, '_')}_${visit.date}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Relatório gerado",
        description: "O relatório foi baixado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };
  
  // Filter visits based on search query
  const filteredVisits = visits.filter(visit => {
    const searchLower = searchQuery.toLowerCase();
    return (
      visit.clientName.toLowerCase().includes(searchLower) ||
      visit.address.toLowerCase().includes(searchLower) ||
      visit.description?.toLowerCase().includes(searchLower) ||
      getTypeName(visit.type).toLowerCase().includes(searchLower) ||
      getStatusName(visit.status).toLowerCase().includes(searchLower)
    );
  });
  
  // Sort visits by date (most recent first)
  const sortedVisits = [...filteredVisits].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="page page-transition" id="reports">
      <Header title="Relatórios de Visitas" showBackButton={true} />
      
      <div className="p-4">
        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10 pr-4 py-2"
            placeholder="Buscar por cliente, endereço, tipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2">Carregando relatórios...</span>
          </div>
        ) : sortedVisits.length === 0 ? (
          <Card className="mb-4">
            <CardContent className="p-6 text-center">
              <FileSearch className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <h3 className="text-lg font-medium">Nenhum relatório encontrado</h3>
              <p className="text-gray-500 mt-1">
                {searchQuery
                  ? "Não há relatórios correspondentes à sua busca."
                  : "Não há relatórios disponíveis. Realize visitas para gerar relatórios."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="mb-8">
            <Card className="mb-4">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-1">Relatórios de Vistoria FAR</h3>
                <p className="text-sm text-gray-600">
                  Visualize e baixe os relatórios das vistorias técnicas de telhas
                </p>
              </CardContent>
            </Card>
            {renderVisitsList(sortedVisits)}
          </div>
        )}

      </div>
    </div>
  );
  
  // Helper function to render visits list
  function renderVisitsList(visitsList: Visit[]) {
    return (
      <div className="space-y-3">
        {visitsList.map(visit => (
          <Card key={visit.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg">{visit.clientName}</h3>
                    <div className="text-sm text-gray-600 mt-1 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(visit.date)}
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(visit.status)}`}>
                    {getStatusName(visit.status)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {visit.address}
                </p>
                {visit.description && (
                  <p className="text-sm mt-1 text-gray-700 line-clamp-1">
                    {visit.description}
                  </p>
                )}
              </div>
              <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-between">
                <span className="text-sm font-medium">{getTypeName(visit.type)}</span>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Visualizar</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle>Detalhes do Relatório</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="mb-4">
                          <h3 className="font-bold text-lg">{visit.clientName}</h3>
                          <div className="mt-1 flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(visit.date)}</span>
                          </div>
                          <p className="mt-2">{visit.address}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="bg-gray-50 p-3 rounded">
                            <span className="text-xs text-gray-500">Tipo</span>
                            <p className="font-medium">{getTypeName(visit.type)}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <span className="text-xs text-gray-500">Status</span>
                            <p className="font-medium">{getStatusName(visit.status)}</p>
                          </div>
                        </div>
                        
                        {visit.description && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-1">Descrição</h4>
                            <p className="text-gray-700">{visit.description}</p>
                          </div>
                        )}
                        
                        {visit.notes && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-1">Observações</h4>
                            <p className="text-gray-700 whitespace-pre-line">{visit.notes}</p>
                          </div>
                        )}
                        
                        <div className="mt-6 flex space-x-3">
                          <Button 
                            onClick={() => handleGenerateReport(visit)}
                            className="flex-1"
                            disabled={isGeneratingReport}
                          >
                            {isGeneratingReport ? (
                              <>
                                <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Gerando...
                              </>
                            ) : (
                              <>
                                <Download className="mr-2 h-4 w-4" />
                                Baixar Relatório
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setLocation(`/visits/${visit.id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleGenerateReport(visit)}
                    disabled={isGeneratingReport}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Baixar</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => setLocation(`/visits/${visit.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Editar</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
};

export default ReportsPage;

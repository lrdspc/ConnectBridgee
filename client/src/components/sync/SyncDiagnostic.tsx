import { useState, useEffect } from "react";
import { getSyncHealth, syncData, getConflictingVisits, getSyncErrors, resolveConflict } from "../../lib/sync";
import type { ConflictInfo, SyncErrorInfo } from "../../lib/sync";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, RefreshCw, WifiOff, Clock, Database } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Componente de diagnóstico de sincronização
export function SyncDiagnostic() {
  const [healthData, setHealthData] = useState<{
    status: 'healthy' | 'warning' | 'error';
    stats: {
      lastSuccessfulSync: string;
      syncAttempts: number;
      successfulSyncs: number;
      failedSyncs: number;
    };
    pendingItems: number;
    offline: boolean;
    conflictsCount: number;
    errorsCount: number;
    lastSuccessfulSync: string;
  } | null>(null);
  
  const [conflicts, setConflicts] = useState<ConflictInfo[]>([]);
  const [errors, setErrors] = useState<SyncErrorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const { toast } = useToast();

  // Função para atualizar os dados de diagnóstico
  const refreshDiagnostics = async () => {
    setIsLoading(true);
    try {
      const health = await getSyncHealth();
      setHealthData(health);
      
      // Se houver conflitos, busque os detalhes
      if (health.conflictsCount > 0) {
        const conflictDetails = await getConflictingVisits();
        setConflicts(conflictDetails);
      } else {
        setConflicts([]);
      }
      
      // Se houver erros, busque os detalhes
      if (health.errorsCount > 0) {
        const errorDetails = await getSyncErrors();
        setErrors(errorDetails);
      } else {
        setErrors([]);
      }
    } catch (error) {
      console.error("Erro ao obter diagnóstico de sincronização:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível obter informações de sincronização.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Forçar sincronização
  const handleForceSyncClick = async () => {
    setIsSyncing(true);
    try {
      await syncData();
      toast({
        title: "Sincronização iniciada",
        description: "Os dados estão sendo sincronizados com o servidor.",
      });
      
      // Atualizar os diagnósticos após sincronização
      setTimeout(refreshDiagnostics, 2000);
    } catch (error) {
      console.error("Erro na sincronização forçada:", error);
      toast({
        variant: "destructive",
        title: "Erro de sincronização",
        description: "Não foi possível sincronizar os dados. Verifique sua conexão.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Resolver um conflito
  const handleResolveConflict = async (visitId: string, useLocalVersion: boolean) => {
    try {
      await resolveConflict(visitId, useLocalVersion);
      toast({
        title: "Conflito resolvido",
        description: `Conflito resolvido usando a versão ${useLocalVersion ? "local" : "do servidor"}.`,
      });
      
      // Atualizar a lista de conflitos
      refreshDiagnostics();
    } catch (error) {
      console.error("Erro ao resolver conflito:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível resolver o conflito.",
      });
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    refreshDiagnostics();
    
    // Atualizar a cada 30 segundos
    const intervalId = setInterval(refreshDiagnostics, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Indicador de status de saúde da sincronização
  const getStatusIndicator = () => {
    if (!healthData) return null;
    
    switch (healthData.status) {
      case "healthy":
        return (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700">Sincronização saudável</AlertTitle>
            <AlertDescription className="text-green-600">
              Todos os dados estão sincronizados corretamente.
            </AlertDescription>
          </Alert>
        );
      case "warning":
        return (
          <Alert variant="default" className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-700">Atenção</AlertTitle>
            <AlertDescription className="text-yellow-600">
              Existem {healthData.pendingItems} itens pendentes de sincronização.
              {healthData.errorsCount > 0 && ` Foram detectados ${healthData.errorsCount} erros.`}
            </AlertDescription>
          </Alert>
        );
      case "error":
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Problemas de sincronização</AlertTitle>
            <AlertDescription>
              {healthData.conflictsCount > 0 && `${healthData.conflictsCount} conflitos precisam ser resolvidos. `}
              {healthData.errorsCount > 0 && `${healthData.errorsCount} erros foram encontrados. `}
              Clique em "Detalhes" para verificar.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  // Taxa de sucesso de sincronização
  const getSuccessRate = () => {
    if (!healthData || healthData.stats.syncAttempts === 0) return 100;
    
    return Math.round(
      (healthData.stats.successfulSyncs / healthData.stats.syncAttempts) * 100
    );
  };

  // Renderização do componente
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Diagnóstico de Sincronização</span>
          {healthData?.offline && (
            <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
              <WifiOff className="h-3 w-3 mr-1" />
              Offline
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Verifique o estado da sincronização de dados entre o aplicativo e o servidor
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {getStatusIndicator()}
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Taxa de Sucesso</span>
            <span className="text-sm">{getSuccessRate()}%</span>
          </div>
          <Progress value={getSuccessRate()} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="border rounded-md p-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium">Última Sincronização</span>
            </div>
            <p className="text-sm mt-1">
              {healthData?.lastSuccessfulSync || "Nunca"}
            </p>
          </div>
          
          <div className="border rounded-md p-3">
            <div className="flex items-center">
              <Database className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium">Pendentes</span>
            </div>
            <p className="text-sm mt-1">
              {healthData?.pendingItems || 0} itens
            </p>
          </div>
        </div>
        
        {(conflicts.length > 0 || errors.length > 0) && (
          <Accordion type="single" collapsible className="mt-4">
            {conflicts.length > 0 && (
              <AccordionItem value="conflicts">
                <AccordionTrigger>
                  Conflitos ({conflicts.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {conflicts.map((conflict) => (
                      <div key={conflict.visitId} className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{conflict.clientName}</p>
                            <p className="text-xs text-gray-500">
                              Local: {new Date(conflict.localTimestamp).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              Servidor: {conflict.serverTimestamp === 'N/A' ? 'N/A' : new Date(conflict.serverTimestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleResolveConflict(conflict.visitId, true)}
                            >
                              Usar Local
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleResolveConflict(conflict.visitId, false)}
                            >
                              Usar Servidor
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {errors.length > 0 && (
              <AccordionItem value="errors">
                <AccordionTrigger>
                  Erros ({errors.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {errors.map((error) => (
                      <div key={error.visitId} className="border rounded-md p-3">
                        <p className="font-medium">{error.clientName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(error.timestamp).toLocaleString()}
                        </p>
                        <p className="text-sm text-red-600 mt-1">
                          {error.errorMessage}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Tentativas: {error.attempts}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={refreshDiagnostics}
          disabled={isLoading}
        >
          {isLoading ? 'Carregando...' : 'Atualizar'}
        </Button>
        
        <Button 
          onClick={handleForceSyncClick}
          disabled={isSyncing || healthData?.offline}
        >
          {isSyncing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Sincronizando...
            </>
          ) : (
            'Forçar Sincronização'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
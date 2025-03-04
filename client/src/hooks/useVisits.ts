import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Visit, db } from "../lib/db";
import { syncVisitsToServer } from "../lib/sync";
import { useOfflineStatus } from "./useOfflineStatus";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Definição do tipo de filtro para melhorar a segurança de tipos
type VisitFilter = "all" | "scheduled" | "in-progress" | "pending" | "completed" | "urgent";

export const useVisits = (filter: VisitFilter | string = "all") => {
  const { isOffline } = useOfflineStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Tempo de cache otimizado para diferentes situações
  const staleTime = isOffline ? Infinity : 5 * 60 * 1000; // 5 minutos online, infinito offline

  // Fetch visits from IndexedDB with improved error handling
  const fetchVisits = async (): Promise<Visit[]> => {
    try {
      let visits = await db.visits.toArray();
      
      // Filter visits based on filter parameter
      if (filter !== "all") {
        visits = visits.filter(visit => visit.status === filter);
      }
      
      // Sort visits by date (most recent first)
      return visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error("Error fetching visits:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar visitas",
        description: "Não foi possível carregar a lista de visitas. Tente novamente mais tarde."
      });
      return [];
    }
  };

  // Função para obter uma visita pelo ID com caching
  const getVisitById = async (id: string): Promise<Visit | undefined> => {
    try {
      return await db.visits.get(id);
    } catch (error) {
      console.error("Error fetching visit by ID:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar visita",
        description: "Não foi possível carregar os detalhes da visita. Tente novamente mais tarde."
      });
      return undefined;
    }
  };

  // Query para lista de visitas com otimização de cache
  const { data: visits = [], isLoading, error, refetch } = useQuery<Visit[], Error>({
    queryKey: ["visits", filter],
    queryFn: fetchVisits,
    staleTime,
    refetchOnWindowFocus: !isOffline,
    retry: isOffline ? false : 3
  });

  // Query function para obter uma visita específica
  const useVisitById = (id: string | undefined) => {
    return useQuery({
      queryKey: ["visit", id],
      queryFn: () => id ? getVisitById(id) : Promise.resolve(undefined),
      enabled: !!id,
      staleTime
    });
  };

  // Create a new visit with optimistic updates
  const createVisit = useMutation({
    mutationFn: async (visit: Omit<Visit, "id">) => {
      const id = Date.now().toString();
      const synced = !isOffline;
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;
      
      const newVisit: Visit = { 
        ...visit, 
        id, 
        synced, 
        createdAt, 
        updatedAt 
      };
      
      try {
        // Save to IndexedDB
        await db.visits.add(newVisit);
        
        // If online, sync to server
        if (!isOffline) {
          await syncVisitsToServer([newVisit]);
        }
        
        return newVisit;
      } catch (error) {
        console.error('Erro ao criar visita:', error);
        throw error;
      }
    },
    onMutate: async (newVisitData) => {
      // Otimizando a experiência do usuário com atualizações imediatas
      await queryClient.cancelQueries({ queryKey: ["visits"] });
      
      // Snapshot do estado anterior
      const previousVisits = queryClient.getQueryData<Visit[]>(["visits", filter]);
      
      // Optimistic update
      if (previousVisits) {
        // Criar a nova visita para atualização otimista
        const id = Date.now().toString();
        const optimisticVisit: Visit = { 
          ...(newVisitData as any), 
          id,
          synced: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        queryClient.setQueryData<Visit[]>(["visits", filter], 
          [optimisticVisit, ...previousVisits].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
      }
      
      return { previousVisits };
    },
    onSuccess: (newVisit) => {
      toast({
        title: "Visita criada",
        description: "A visita foi criada com sucesso."
      });
      
      // Update the cache with the server response
      queryClient.invalidateQueries({ queryKey: ["visits"] });
    },
    onError: (error, _, context) => {
      if (context?.previousVisits) {
        // Reverter para os dados anteriores em caso de erro
        queryClient.setQueryData(["visits", filter], context.previousVisits);
      }
      
      console.error('Erro na mutation createVisit:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar visita",
        description: "Não foi possível criar a visita. Tente novamente mais tarde."
      });
    }
  });

  // Update a visit with optimistic updates
  const updateVisit = useMutation({
    mutationFn: async (updatedVisit: Visit) => {
      // Atualizar o campo updatedAt
      const visitToUpdate = {
        ...updatedVisit,
        updatedAt: new Date().toISOString(),
        synced: !isOffline
      };
      
      // Save to IndexedDB
      await db.visits.update(visitToUpdate.id, visitToUpdate);
      
      // If online, sync to server
      if (!isOffline) {
        await syncVisitsToServer([visitToUpdate]);
      }
      
      return visitToUpdate;
    },
    onMutate: async (updatedVisit) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ["visits"] });
      await queryClient.cancelQueries({ queryKey: ["visit", updatedVisit.id] });
      
      // Snapshot dos estados anteriores
      const previousVisits = queryClient.getQueryData<Visit[]>(["visits", filter]);
      const previousVisit = queryClient.getQueryData<Visit>(["visit", updatedVisit.id]);
      
      // Otimistic updates
      if (previousVisits) {
        const updatedVisits = previousVisits.map(visit => 
          visit.id === updatedVisit.id ? {...updatedVisit, updatedAt: new Date().toISOString()} : visit
        );
        
        queryClient.setQueryData<Visit[]>(["visits", filter], updatedVisits);
      }
      
      if (previousVisit) {
        queryClient.setQueryData<Visit>(
          ["visit", updatedVisit.id], 
          {...updatedVisit, updatedAt: new Date().toISOString()}
        );
      }
      
      return { previousVisits, previousVisit };
    },
    onSuccess: (updatedVisit) => {
      toast({
        title: "Visita atualizada",
        description: "As alterações foram salvas com sucesso."
      });
      
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["visit", updatedVisit.id] });
    },
    onError: (error, updatedVisit, context) => {
      // Reverter para os dados anteriores em caso de erro
      if (context?.previousVisits) {
        queryClient.setQueryData(["visits", filter], context.previousVisits);
      }
      
      if (context?.previousVisit) {
        queryClient.setQueryData(["visit", updatedVisit.id], context.previousVisit);
      }
      
      console.error('Erro ao atualizar visita:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar visita",
        description: "Não foi possível salvar as alterações. Tente novamente mais tarde."
      });
    }
  });

  // Delete a visit with optimistic updates
  const deleteVisit = useMutation({
    mutationFn: async (id: string) => {
      // Delete from IndexedDB
      await db.visits.delete(id);
      
      // If online, delete from server
      if (!isOffline) {
        await apiRequest("DELETE", `/api/visits/${id}`);
      }
      
      return id;
    },
    onMutate: async (id) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ["visits"] });
      await queryClient.cancelQueries({ queryKey: ["visit", id] });
      
      // Snapshot do estado anterior
      const previousVisits = queryClient.getQueryData<Visit[]>(["visits", filter]);
      
      // Optimistic delete
      if (previousVisits) {
        queryClient.setQueryData<Visit[]>(
          ["visits", filter], 
          previousVisits.filter(visit => visit.id !== id)
        );
      }
      
      // Limpar o cache da visita específica
      queryClient.removeQueries({ queryKey: ["visit", id] });
      
      return { previousVisits };
    },
    onSuccess: (id) => {
      toast({
        title: "Visita excluída",
        description: "A visita foi excluída com sucesso."
      });
      
      queryClient.invalidateQueries({ queryKey: ["visits"] });
    },
    onError: (error, id, context) => {
      if (context?.previousVisits) {
        // Reverter para os dados anteriores em caso de erro
        queryClient.setQueryData(["visits", filter], context.previousVisits);
      }
      
      console.error('Erro ao excluir visita:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir visita",
        description: "Não foi possível excluir a visita. Tente novamente mais tarde."
      });
    }
  });

  return {
    visits,
    isLoading,
    error,
    refetch,
    createVisit,
    updateVisit,
    deleteVisit,
    useVisitById
  };
};

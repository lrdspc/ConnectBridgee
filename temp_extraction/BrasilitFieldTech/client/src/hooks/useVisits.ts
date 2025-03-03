import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Visit, VisitStatus, db } from "../lib/db";
import { syncVisitsToServer } from "../lib/sync";
import { useOfflineStatus } from "./useOfflineStatus";
import { apiRequest } from "../lib/queryClient";

export const useVisits = (filter: string = "all") => {
  const { isOffline } = useOfflineStatus();
  const queryClient = useQueryClient();

  // Fetch visits from IndexedDB
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
      return [];
    }
  };

  // Query for visits
  const { data: visits = [], isLoading, error } = useQuery({
    queryKey: ["visits", filter],
    queryFn: fetchVisits
  });

  // Create a new visit
  const createVisit = useMutation({
    mutationFn: async (visit: Omit<Visit, "id">) => {
      const id = Date.now().toString();
      const newVisit: Visit = { ...visit, id };
      
      try {
        // Save to IndexedDB
        await db.visits.add(newVisit);
        
        // If online, sync to server
        if (!isOffline) {
          await syncVisitsToServer([newVisit]);
        }
        
        console.log('Visita criada com sucesso:', newVisit);
        return newVisit;
      } catch (error) {
        console.error('Erro ao criar visita:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Mutation concluída com sucesso, invalidando queries');
      queryClient.invalidateQueries({ queryKey: ["visits"] });
    },
    onError: (error) => {
      console.error('Erro na mutation createVisit:', error);
    }
  });

  // Update a visit
  const updateVisit = useMutation({
    mutationFn: async (updatedVisit: Visit) => {
      // Save to IndexedDB
      await db.visits.update(updatedVisit.id, updatedVisit);
      
      // If online, sync to server
      if (!isOffline) {
        await syncVisitsToServer([updatedVisit]);
      }
      
      return updatedVisit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
    }
  });

  // Delete a visit
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
    }
  });

  // Get visit by ID
  const getVisit = async (id: string): Promise<Visit | undefined> => {
    try {
      return await db.visits.get(id);
    } catch (error) {
      console.error("Error fetching visit:", error);
      return undefined;
    }
  };

  return {
    visits,
    isLoading,
    error,
    createVisit,
    updateVisit,
    deleteVisit,
    getVisit
  };
};

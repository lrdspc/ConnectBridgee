import { Visit } from "./db";
import { apiRequest } from "./queryClient";
import { db } from "./db";

// Function to sync visits to server
export const syncVisitsToServer = async (visits: Visit[]): Promise<void> => {
  try {
    // Filter out visits that are already synced
    const unsynced = visits.filter(visit => !visit.synced);
    
    if (unsynced.length === 0) {
      return;
    }

    console.log(`Tentando sincronizar ${unsynced.length} visitas com o servidor...`);

    // Verificar tamanho de cada visita antes de enviar
    for (const visit of unsynced) {
      try {
        // Verificar se o objeto é serializável e seu tamanho
        const jsonString = JSON.stringify(visit);
        const sizeMB = jsonString.length / (1024 * 1024);
        
        console.log(`Tamanho da visita ${visit.id}: ${sizeMB.toFixed(2)}MB`);
        
        // Se for muito grande, pular esta visita
        if (sizeMB > 15) {
          console.warn(`Visita ${visit.id} é muito grande (${sizeMB.toFixed(2)}MB). Pulando sincronização.`);
          continue;
        }
        
        // Tentar sincronizar com o servidor
        await apiRequest("POST", "/api/visits/sync", visit);
        
        // Mark visit as synced in local database
        await db.visits.update(visit.id, { ...visit, synced: true });
        console.log(`Visita ${visit.id} sincronizada com sucesso`);
      } catch (visitError) {
        console.error(`Erro ao sincronizar visita ${visit.id}:`, visitError);
        // Continuar com as próximas visitas mesmo se uma falhar
      }
    }

    console.log(`Processo de sincronização concluído`);
  } catch (error) {
    console.error("Erro geral na sincronização de visitas:", error);
    throw error;
  }
};

// Function to sync visits from server
export const syncVisitsFromServer = async (): Promise<void> => {
  try {
    // Get last sync timestamp
    const lastSync = localStorage.getItem("lastSyncTimestamp") || "0";
    
    // Fetch new or updated visits from server
    const response = await apiRequest("GET", `/api/visits/sync?since=${lastSync}`);
    const serverVisits: Visit[] = await response.json();
    
    if (serverVisits.length === 0) {
      return;
    }

    // Update local database with server data
    for (const serverVisit of serverVisits) {
      const localVisit = await db.visits.get(serverVisit.id);
      
      if (!localVisit) {
        // Add new visit
        await db.visits.add({ ...serverVisit, synced: true });
      } else if (new Date(serverVisit.updatedAt) > new Date(localVisit.updatedAt)) {
        // Update visit if server version is newer
        await db.visits.update(serverVisit.id, { ...serverVisit, synced: true });
      }
    }

    // Update last sync timestamp
    localStorage.setItem("lastSyncTimestamp", new Date().toISOString());
    console.log(`Successfully synced ${serverVisits.length} visits from server`);
  } catch (error) {
    console.error("Error syncing visits from server:", error);
    throw error;
  }
};

// Main function to perform two-way sync
export const syncData = async (): Promise<void> => {
  if (!navigator.onLine) {
    console.log("Cannot sync: device is offline");
    return;
  }

  try {
    // First, sync local changes to server
    const unsyncedVisits = await db.visits.where({ synced: false }).toArray();
    await syncVisitsToServer(unsyncedVisits);
    
    // Then, get changes from server
    await syncVisitsFromServer();
    
    console.log("Data synchronization completed successfully");
  } catch (error) {
    console.error("Error during data synchronization:", error);
    throw error;
  }
};

// Setup background sync if supported
export const setupBackgroundSync = () => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
      // Register a sync event that will be triggered when online
      registration.sync.register('sync-visits');
    }).catch(err => {
      console.error('Background sync could not be registered:', err);
    });
  }
};

// Try to sync when app comes online
window.addEventListener('online', () => {
  console.log('App is online. Attempting to sync data...');
  syncData().catch(console.error);
});

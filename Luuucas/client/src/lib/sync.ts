import { Visit } from "./db";
import { apiRequest } from "./queryClient";
import { db } from "./db";

// Interface para armazenar métricas de sincronização
interface SyncStats {
  lastSuccessfulSync: string;
  syncAttempts: number;
  successfulSyncs: number;
  failedSyncs: number;
  lastError: string | null;
}

// Inicialização das estatísticas de sincronização
const initSyncStats = (): SyncStats => {
  const savedStats = localStorage.getItem("syncStats");
  
  if (savedStats) {
    try {
      return JSON.parse(savedStats);
    } catch (e) {
      console.error("Erro ao carregar estatísticas de sincronização:", e);
    }
  }
  
  // Valores padrão
  return {
    lastSuccessfulSync: "0",
    syncAttempts: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
    lastError: null
  };
};

// Estatísticas de sincronização
let syncStats = initSyncStats();

// Função para salvar as estatísticas de sincronização
const saveSyncStats = () => {
  localStorage.setItem("syncStats", JSON.stringify(syncStats));
};

// Função auxiliar para compressão de dados de imagem em dataURLs
const compressDataUrl = async (dataUrl: string, maxSizeKB: number = 500): Promise<string> => {
  // Se não for uma dataURL de imagem, retorna sem alteração
  if (!dataUrl.startsWith('data:image')) {
    return dataUrl;
  }
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Redimensionar se a imagem for muito grande
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      
      if (width > MAX_WIDTH) {
        height = Math.floor(height * (MAX_WIDTH / width));
        width = MAX_WIDTH;
      }
      
      if (height > MAX_HEIGHT) {
        width = Math.floor(width * (MAX_HEIGHT / height));
        height = MAX_HEIGHT;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl); // Fallback para o original se não conseguir o contexto
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Começar com alta qualidade e reduzi-la se necessário
      let quality = 0.9;
      let compressed = canvas.toDataURL('image/jpeg', quality);
      let iterations = 0;
      const MAX_ITERATIONS = 5;
      
      // Tentar reduzir a qualidade até atingir o tamanho desejado
      while (compressed.length > maxSizeKB * 1024 && iterations < MAX_ITERATIONS) {
        quality -= 0.1;
        if (quality < 0.3) quality = 0.3; // Limite mínimo de qualidade
        compressed = canvas.toDataURL('image/jpeg', quality);
        iterations++;
      }
      
      resolve(compressed);
    };
    
    img.onerror = () => resolve(dataUrl); // Fallback para o original em caso de erro
    img.src = dataUrl;
  });
};

// Função para otimizar o tamanho de uma visita (comprime fotos grandes)
const optimizeVisitSize = async (visit: Visit): Promise<Visit> => {
  if (!visit.photos || visit.photos.length === 0) {
    return visit;
  }
  
  try {
    // Criar uma cópia profunda da visita para não modificar o original
    const optimizedVisit = JSON.parse(JSON.stringify(visit)) as Visit;
    
    // Garantir que photos existe
    if (optimizedVisit.photos && optimizedVisit.photos.length > 0) {
      // Processar cada foto para comprimir
      for (let i = 0; i < optimizedVisit.photos.length; i++) {
        const photo = optimizedVisit.photos[i];
        if (photo && photo.dataUrl) {
          // Verifica tamanho aproximado em KB
          const sizeKB = Math.round(photo.dataUrl.length / 1024);
          
          // Se a foto for grande, comprimir
          if (sizeKB > 500) {
            if (optimizedVisit.photos[i]) {
              optimizedVisit.photos[i].dataUrl = await compressDataUrl(photo.dataUrl);
            }
          }
        }
      }
    }
    
    return optimizedVisit;
  } catch (error) {
    console.error("Erro ao otimizar visita:", error);
    return visit; // Retornar a original em caso de erro
  }
};

// Função para dividir objetos grandes em partes menores para sincronização
const chunkObject = (obj: any, maxChunkSizeMB: number = 5): any[] => {
  const jsonString = JSON.stringify(obj);
  const totalSizeMB = jsonString.length / (1024 * 1024);
  
  // Se o objeto já for pequeno o suficiente, retorná-lo diretamente
  if (totalSizeMB <= maxChunkSizeMB) {
    return [obj];
  }
  
  // Para objetos muito grandes, dividir (principalmente para fotos e documentos)
  const result = [];
  
  // Criar uma cópia básica sem os arrays grandes
  const baseObject = { ...obj };
  
  // Remover arrays grandes que podem ser divididos
  const photos = baseObject.photos || [];
  const documents = baseObject.documents || [];
  delete baseObject.photos;
  delete baseObject.documents;
  
  // Adicionar objeto base sem os arrays grandes
  result.push({
    ...baseObject,
    photos: [],
    documents: []
  });
  
  // Adicionar fotos em chunks separados
  const CHUNK_SIZE = 2; // Número de itens por chunk
  for (let i = 0; i < photos.length; i += CHUNK_SIZE) {
    const photoChunk = photos.slice(i, i + CHUNK_SIZE);
    result.push({
      id: baseObject.id,
      _chunkType: 'photos',
      _chunkIndex: Math.floor(i / CHUNK_SIZE),
      _totalChunks: Math.ceil(photos.length / CHUNK_SIZE),
      photos: photoChunk
    });
  }
  
  // Adicionar documentos em chunks separados
  for (let i = 0; i < documents.length; i += CHUNK_SIZE) {
    const docChunk = documents.slice(i, i + CHUNK_SIZE);
    result.push({
      id: baseObject.id,
      _chunkType: 'documents',
      _chunkIndex: Math.floor(i / CHUNK_SIZE),
      _totalChunks: Math.ceil(documents.length / CHUNK_SIZE),
      documents: docChunk
    });
  }
  
  return result;
};

// Função para adicionar solicitação de sincronização à fila de sincronização
const addToSyncQueue = async (visitId: string): Promise<void> => {
  const syncQueue = JSON.parse(localStorage.getItem("syncQueue") || "[]");
  
  if (!syncQueue.includes(visitId)) {
    syncQueue.push(visitId);
    localStorage.setItem("syncQueue", JSON.stringify(syncQueue));
  }
};

// Função para remover uma visita da fila de sincronização
const removeFromSyncQueue = async (visitId: string): Promise<void> => {
  const syncQueue = JSON.parse(localStorage.getItem("syncQueue") || "[]");
  const newQueue = syncQueue.filter((id: string) => id !== visitId);
  localStorage.setItem("syncQueue", JSON.stringify(newQueue));
};

// Função para obter a fila de sincronização
const getSyncQueue = (): string[] => {
  return JSON.parse(localStorage.getItem("syncQueue") || "[]");
};

// Function to sync visits to server with improved error handling and retry logic
export const syncVisitsToServer = async (visits: Visit[]): Promise<void> => {
  // Atualizar estatísticas
  syncStats.syncAttempts++;
  
  try {
    // Filter out visits that are already synced
    const unsynced = visits.filter(visit => !visit.synced);
    
    if (unsynced.length === 0) {
      saveSyncStats();
      return;
    }

    console.log(`Tentando sincronizar ${unsynced.length} visitas com o servidor...`);
    let syncedCount = 0;

    // Processar cada visita não sincronizada
    for (const visit of unsynced) {
      try {
        // Primeiro otimizar o tamanho da visita
        const optimizedVisit = await optimizeVisitSize(visit);
        
        // Verificar o tamanho da visita otimizada
        const jsonString = JSON.stringify(optimizedVisit);
        const sizeMB = jsonString.length / (1024 * 1024);
        
        if (sizeMB > 10) {
          console.warn(`Visita ${visit.id} ainda é muito grande (${sizeMB.toFixed(2)}MB) mesmo após otimização.`);
          
          // Para objetos muito grandes, usar a estratégia de divisão em chunks
          const chunks = chunkObject(optimizedVisit);
          console.log(`Dividindo visita em ${chunks.length} partes para sincronização`);
          
          // Sincronizar cada chunk sequencialmente
          for (let i = 0; i < chunks.length; i++) {
            await apiRequest("POST", "/api/visits/sync", chunks[i]);
            console.log(`Chunk ${i+1}/${chunks.length} da visita ${visit.id} sincronizado com sucesso`);
          }
        } else {
          // Para objetos de tamanho normal, sincronizar normalmente
          await apiRequest("POST", "/api/visits/sync", optimizedVisit);
        }
        
        // Marcar como sincronizada no banco de dados local
        await db.visits.update(visit.id, { ...visit, synced: true });
        
        // Remover da fila de sincronização pendente
        await removeFromSyncQueue(visit.id);
        
        syncedCount++;
        console.log(`Visita ${visit.id} sincronizada com sucesso`);
      } catch (visitError) {
        console.error(`Erro ao sincronizar visita ${visit.id}:`, visitError);
        
        // Adicionar à fila de sincronização para tentar novamente mais tarde
        await addToSyncQueue(visit.id);
        
        // Atualizar estatísticas de falha
        syncStats.failedSyncs++;
        syncStats.lastError = `Erro ao sincronizar visita ${visit.id}: ${(visitError as Error).message}`;
      }
    }

    // Atualizar estatísticas de sucesso
    if (syncedCount > 0) {
      syncStats.successfulSyncs += syncedCount;
      syncStats.lastSuccessfulSync = new Date().toISOString();
    }
    
    saveSyncStats();
    console.log(`Processo de sincronização concluído. ${syncedCount} visitas sincronizadas com sucesso.`);
  } catch (error) {
    // Atualizar estatísticas de erro
    syncStats.failedSyncs++;
    syncStats.lastError = `Erro geral: ${(error as Error).message}`;
    saveSyncStats();
    
    console.error("Erro geral na sincronização de visitas:", error);
    throw error;
  }
};

// Function to sync visits from server with conflict resolution
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

    // Manter registro de conflitos detectados
    const conflicts: Visit[] = [];

    // Update local database with server data
    for (const serverVisit of serverVisits) {
      const localVisit = await db.visits.get(serverVisit.id);
      
      if (!localVisit) {
        // Add new visit
        await db.visits.add({ ...serverVisit, synced: true });
      } else {
        // Verificar se há um conflito (ambas as versões foram modificadas)
        const serverDate = new Date(serverVisit.updatedAt);
        const localDate = new Date(localVisit.updatedAt);
        
        if (serverDate > localDate) {
          // Update visit if server version is newer
          await db.visits.update(serverVisit.id, { ...serverVisit, synced: true });
        } else if (!localVisit.synced) {
          // Temos um conflito: a versão local foi modificada mas não está sincronizada,
          // e a versão do servidor também foi modificada
          conflicts.push(localVisit);
          
          // Armazenar a versão do servidor como _serverVersion
          // Criando uma versão sem os campos extras para evitar erros de tipo
          const serverVersion = { 
            ...serverVisit,
            _conflictDetected: undefined,
            _serverVersion: undefined,
            _syncAttempts: undefined,
            _lastSyncError: undefined
          };
          
          // Atualizar o objeto local com as flags de conflito
          await db.visits.update(serverVisit.id, { 
            ...localVisit, 
            _conflictDetected: true,
            _syncAttempts: (localVisit._syncAttempts || 0) + 1,
            _lastSyncError: "Conflito de sincronização detectado",
            // Usando any para contornar problema de tipagem circular
            _serverVersion: serverVersion as any
          });
        }
      }
    }

    // Atualizar estatísticas
    syncStats.successfulSyncs++;
    syncStats.lastSuccessfulSync = new Date().toISOString();
    saveSyncStats();

    // Update last sync timestamp
    localStorage.setItem("lastSyncTimestamp", new Date().toISOString());
    
    // Logs
    console.log(`Sincronização com o servidor concluída: ${serverVisits.length} visitas recebidas`);
    if (conflicts.length > 0) {
      console.warn(`Detectados ${conflicts.length} conflitos de sincronização que precisam ser resolvidos manualmente`);
    }
  } catch (error) {
    // Atualizar estatísticas de erro
    syncStats.failedSyncs++;
    syncStats.lastError = `Erro ao sincronizar do servidor: ${(error as Error).message}`;
    saveSyncStats();
    
    console.error("Erro ao sincronizar do servidor:", error);
    throw error;
  }
};

// Função para resolver conflitos de sincronização
export const resolveConflict = async (visitId: string, useLocalVersion: boolean): Promise<void> => {
  try {
    const visit = await db.visits.get(visitId);
    
    if (!visit) {
      throw new Error("Visita não encontrada");
    }
    
    if (!visit._conflictDetected) {
      console.warn(`Visita ${visitId} não tem conflito marcado para resolver`);
      return;
    }
    
    if (useLocalVersion) {
      // Criar uma nova versão mesclada com as informações locais
      const resolvedVisit = {
        ...visit,
        _conflictDetected: false,
        _serverVersion: undefined,
        _syncAttempts: 0,
        _lastSyncError: undefined,
        synced: false,
        updatedAt: new Date().toISOString() // Atualizar timestamp para garantir sincronização
      };
      
      // Atualizar o banco de dados
      await db.visits.update(visitId, resolvedVisit);
      console.log(`Conflito resolvido para a visita ${visitId} usando versão local`);
      
      // Tentar sincronizar imediatamente se estiver online
      if (navigator.onLine) {
        try {
          await syncVisitsToServer([resolvedVisit]);
          console.log(`Visita ${visitId} resincronizada com sucesso após resolução de conflito`);
        } catch (syncError) {
          console.warn(`Não foi possível sincronizar a visita ${visitId} após resolução: ${syncError}`);
          // Não lançar erro aqui, pois a resolução foi bem-sucedida
        }
      }
    } else {
      // Usar a versão do servidor
      if (!visit._serverVersion) {
        throw new Error("Versão do servidor não disponível para resolução de conflito");
      }
      
      // Criar uma nova versão mesclada com as informações do servidor
      const serverVersion = visit._serverVersion as Visit;
      const resolvedVisit = {
        ...serverVersion,
        _conflictDetected: false,
        _serverVersion: undefined,
        _syncAttempts: 0,
        _lastSyncError: undefined,
        synced: true
      };
      
      // Atualizar o banco de dados
      await db.visits.update(visitId, resolvedVisit);
      console.log(`Conflito resolvido para a visita ${visitId} usando versão do servidor`);
    }
    
    // Notificar o sucesso da operação
    return Promise.resolve();
  } catch (error) {
    console.error(`Erro ao resolver conflito para visita ${visitId}:`, error);
    throw error;
  }
};

// Main function to perform two-way sync with improved reliability
export const syncData = async (): Promise<void> => {
  if (!navigator.onLine) {
    console.log("Dispositivo offline. Sincronização adiada.");
    return;
  }

  // Evitar múltiplas sincronizações simultâneas
  if (localStorage.getItem("isSyncing") === "true") {
    console.log("Sincronização já em andamento");
    return;
  }
  
  try {
    // Marcar início da sincronização
    localStorage.setItem("isSyncing", "true");
    
    // Processar a fila de sincronização pendente primeiro
    const syncQueue = getSyncQueue();
    if (syncQueue.length > 0) {
      console.log(`Processando fila de sincronização com ${syncQueue.length} itens pendentes`);
      
      const pendingVisits = await Promise.all(
        syncQueue.map(id => db.visits.get(id))
      );
      
      // Filtrar resultados nulos (caso alguma visita tenha sido excluída)
      const validPendingVisits = pendingVisits.filter(visit => visit !== undefined) as Visit[];
      
      if (validPendingVisits.length > 0) {
        await syncVisitsToServer(validPendingVisits);
      }
    }
    
    // Buscar todas as visitas não sincronizadas
    const unsyncedVisits = await db.visits.where({ synced: false }).toArray();
    if (unsyncedVisits.length > 0) {
      console.log(`Sincronizando ${unsyncedVisits.length} visitas não sincronizadas`);
      await syncVisitsToServer(unsyncedVisits);
    }
    
    // Obter atualizações do servidor
    await syncVisitsFromServer();
    
    console.log("Sincronização de dados concluída com sucesso");
  } catch (error) {
    console.error("Erro durante a sincronização de dados:", error);
  } finally {
    // Marcar fim da sincronização independente do resultado
    localStorage.setItem("isSyncing", "false");
  }
};

// Interface para informações de conflito
export interface ConflictInfo {
  visitId: string;
  localTimestamp: string;
  serverTimestamp: string;
  clientName: string; 
  conflictDate: string;
}

// Função para buscar visitas com conflitos
export const getConflictingVisits = async (): Promise<ConflictInfo[]> => {
  try {
    // Buscar todas as visitas com a flag _conflictDetected
    const conflictingVisits = await db.visits
      .filter(visit => visit._conflictDetected === true)
      .toArray();
    
    // Converter em informações mais concisas para a UI
    return conflictingVisits.map(visit => {
      const serverVersion = visit._serverVersion as Visit | undefined;
      
      return {
        visitId: visit.id,
        localTimestamp: visit.updatedAt,
        serverTimestamp: serverVersion?.updatedAt || 'N/A',
        clientName: visit.clientName,
        conflictDate: new Date().toISOString() // Data atual como data de detecção do conflito
      };
    });
  } catch (error) {
    console.error("Erro ao buscar visitas com conflitos:", error);
    return [];
  }
};

// Interface para informações de erro de sincronização
export interface SyncErrorInfo {
  visitId: string;
  errorMessage: string;
  timestamp: string;
  attempts: number;
  clientName: string;
}

// Função para buscar visitas com erros de sincronização
export const getSyncErrors = async (): Promise<SyncErrorInfo[]> => {
  try {
    // Buscar visitas que tiveram erros de sincronização
    const errorVisits = await db.visits
      .filter(visit => visit._lastSyncError !== undefined && visit._lastSyncError !== null)
      .toArray();
    
    // Converter em informações para a UI
    return errorVisits.map(visit => ({
      visitId: visit.id,
      errorMessage: visit._lastSyncError || 'Erro desconhecido',
      timestamp: visit.updatedAt,
      attempts: visit._syncAttempts || 0,
      clientName: visit.clientName
    }));
  } catch (error) {
    console.error("Erro ao buscar erros de sincronização:", error);
    return [];
  }
};

// Interface para compatibilidade do Service Worker
interface ExtendedServiceWorkerRegistration extends ServiceWorkerRegistration {
  sync?: {
    register(tag: string): Promise<void>;
  };
  periodicSync?: {
    register(tag: string, options: { minInterval: number }): Promise<void>;
  };
}

// Função para verificar a saúde da sincronização
export const getSyncHealth = async (): Promise<{
  status: 'healthy' | 'warning' | 'error';
  stats: SyncStats;
  pendingItems: number;
  offline: boolean;
  conflictsCount: number;
  errorsCount: number;
  lastSuccessfulSync: string;
}> => {
  const pendingItems = getSyncQueue().length;
  const stats = syncStats;
  const offline = !navigator.onLine;
  
  // Obter contagem de conflitos
  const conflicts = await getConflictingVisits();
  const conflictsCount = conflicts.length;
  
  // Obter contagem de erros
  const errors = await getSyncErrors();
  const errorsCount = errors.length;
  
  // Decidir o status com base nas estatísticas
  let status: 'healthy' | 'warning' | 'error' = 'healthy';
  
  if (stats.failedSyncs > stats.successfulSyncs * 0.5 || conflictsCount > 0) {
    status = 'error'; // Mais de 50% das sincronizações falham ou há conflitos
  } else if (pendingItems > 10 || stats.failedSyncs > stats.successfulSyncs * 0.2 || errorsCount > 0) {
    status = 'warning'; // Muitos itens pendentes ou mais de 20% de falhas ou há erros
  }
  
  // Formatar horário da última sincronização bem-sucedida
  const lastSuccessfulSync = stats.lastSuccessfulSync === '0' 
    ? 'Nunca'
    : new Date(stats.lastSuccessfulSync).toLocaleString();
  
  return { 
    status, 
    stats, 
    pendingItems, 
    offline,
    conflictsCount,
    errorsCount,
    lastSuccessfulSync
  };
};

// Setup enhanced background sync
export const setupBackgroundSync = () => {
  // Registrar para sincronização periódica (a cada 15 minutos quando o app estiver aberto)
  const SYNC_INTERVAL = 15 * 60 * 1000; // 15 minutos
  
  // Configurar intervalo de sincronização
  const intervalId = setInterval(() => {
    if (navigator.onLine) {
      console.log('Executando sincronização periódica');
      syncData().catch(error => console.error("Erro na sincronização periódica:", error));
    }
  }, SYNC_INTERVAL);
  
  // Verificar se o Service Worker está disponível
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then((registration: ExtendedServiceWorkerRegistration) => {
      try {
        // Registrar um evento de sincronização que será acionado quando online
        if (registration.sync) {
          registration.sync.register('sync-visits')
            .then(() => console.log('Background sync registrado com sucesso'))
            .catch((error: Error) => console.error('Erro ao registrar background sync:', error));
        }
        
        // Registrar para sincronização periódica via Service Worker
        if (registration.periodicSync) {
          registration.periodicSync.register('periodic-sync-visits', {
            minInterval: 2 * 60 * 60 * 1000 // 2 horas (mínimo permitido)
          }).catch((error: Error) => {
            console.warn('Periodic sync não suportado ou falhou:', error);
          });
        }
      } catch (error) {
        console.warn('Erro ao configurar sincronização em segundo plano:', error);
      }
    }).catch(error => {
      console.warn('Service Worker não está pronto:', error);
    });
  } else {
    console.info('Sincronização em segundo plano não suportada por este navegador');
  }
  
  // Limpar o intervalo quando a página for descarregada
  window.addEventListener('unload', () => {
    clearInterval(intervalId);
  });
};

// Monitorar mudanças no estado da rede
window.addEventListener('online', () => {
  console.log('Dispositivo online. Iniciando sincronização...');
  syncData().catch(console.error);
});

window.addEventListener('offline', () => {
  console.log('Dispositivo offline. Operações de sincronização pausadas.');
});

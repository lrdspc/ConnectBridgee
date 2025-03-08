import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    // Verificar se os dados são JSON serializáveis
    if (data) {
      try {
        const jsonString = JSON.stringify(data);
        const sizeInMB = jsonString.length / (1024 * 1024);
        console.log(`Tamanho da requisição: ${sizeInMB.toFixed(2)}MB`);
        
        // Se os dados forem muito grandes, rejeitar
        if (sizeInMB > 15) {
          throw new Error(`Dados muito grandes: ${sizeInMB.toFixed(2)}MB (máximo: 15MB)`);
        }
      } catch (jsonError) {
        console.error('Erro ao serializar dados para JSON:', jsonError);
        throw new Error('Dados não podem ser serializados para JSON. Verifique tipos complexos ou circulares.');
      }
    }
    
    // Realizar a requisição
    const res = await fetch(url, {
      method,
      headers: data ? { 
        "Content-Type": "application/json",
        "X-Request-Size": data ? JSON.stringify(data).length.toString() : "0"
      } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    // Melhorar o diagnóstico de erros comuns
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('Erro de rede na requisição:', error);
      throw new Error(`Falha na conexão com o servidor. Verifique sua conexão de internet.`);
    }
    
    if (error instanceof Error && error.message.includes('Unexpected token')) {
      console.error('Erro de parsing JSON:', error);
      throw new Error(`Erro ao processar resposta do servidor. Resposta não é um JSON válido.`);
    }
    
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

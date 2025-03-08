import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({
      error: "Erro desconhecido",
      message: `Status: ${res.status}`
    }));
    throw new Error(error.message || error.error || "Erro desconhecido");
  }
}

export async function apiRequest(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  body?: unknown
) {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);

  // Para DELETE, pode não retornar nada (204 No Content)
  if (method === "DELETE") {
    return { success: true };
  }

  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (key: { queryKey: string[] }) => Promise<T> = (options) => {
  return async ({ queryKey }: { queryKey: string[] }) => {
    try {
      // Se queryKey[0] começa com /, é uma rota de API
      const url = queryKey[0].startsWith("/") ? `/api${queryKey[0]}` : queryKey[0];
      
      const res = await fetch(url, {
        credentials: "include",
      });

      if (res.status === 401) {
        if (options.on401 === "throw") {
          throw new Error("Não autenticado");
        }
        return null as T;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      console.error("Erro na consulta:", error);
      throw error;
    }
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      queryFn: getQueryFn<unknown>({ on401: "throw" }),
    },
  },
});
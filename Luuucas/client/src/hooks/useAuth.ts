import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { db } from "../lib/db";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  photoUrl?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated from local storage
  const { data: user, refetch } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      // First check IndexedDB
      const cachedUser = await db.userProfile.toArray();
      if (cachedUser.length > 0) {
        return cachedUser[0];
      }

      // If not in IndexedDB, try to fetch from server
      try {
        const res = await apiRequest("GET", "/api/auth/me");
        const userData = await res.json();
        
        // Cache user data in IndexedDB
        await db.userProfile.clear();
        await db.userProfile.add(userData);
        
        return userData;
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    },
    // Don't retry if unauthorized
    retry: false,
  });

  // Login mutation
  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return res.json();
    },
    onSuccess: (data) => {
      // Cache user data in IndexedDB
      db.userProfile.clear().then(() => {
        db.userProfile.add(data);
      });
      refetch();
    },
  });

  // Logout mutation
  const logout = useMutation({
    mutationFn: async () => {
      // Try to logout from server if online
      try {
        await apiRequest("POST", "/api/auth/logout");
      } catch (error) {
        console.error("Error logging out:", error);
      }
      
      // Clear local storage and IndexedDB user data
      await db.userProfile.clear();
      return true;
    },
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      await refetch();
      setIsLoading(false);
    };
    
    checkAuth();
  }, [refetch]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };
};

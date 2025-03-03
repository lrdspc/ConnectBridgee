import { useState, useEffect } from "react";

export const useOfflineStatus = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    // Add event listeners for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("app-online", handleOnline);
    document.addEventListener("app-offline", handleOffline);

    // Clean up event listeners
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("app-online", handleOnline);
      document.removeEventListener("app-offline", handleOffline);
    };
  }, []);

  return { isOffline };
};

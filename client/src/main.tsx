import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/map.css";
import "./css/responsive.css"; // Global responsive CSS
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ToastProvider } from "./components/ui/Toaster";
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Register event listeners for online/offline status
window.addEventListener('online', () => {
  document.dispatchEvent(new CustomEvent('app-online'));
});

window.addEventListener('offline', () => {
  document.dispatchEvent(new CustomEvent('app-offline'));
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <App />
    </ToastProvider>
  </QueryClientProvider>
);

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/map.css";
import "./styles/exact-reference.css"; // Novo design exatamente como na referência
import "./main.css"; // Dashboard moderno
import "./styles/dashboard-widgets.css"; // Estilos específicos para widgets

// Importando Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Scripts do Bootstrap (para componentes interativos)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Importando ícones do Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';

import "./css/responsive.css"; // CSS responsivo global
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
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
    <App />
    <Toaster />
  </QueryClientProvider>
);

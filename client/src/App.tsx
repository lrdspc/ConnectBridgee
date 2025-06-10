import { Switch, Route } from 'wouter';
import { Suspense, lazy } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from './components/ui/Toaster';
import { LoadingAnimation } from './components/ui/LoadingAnimation';

// Lazy loading imports for better initial performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const RouteMapPage = lazy(() => import('./pages/RouteMapPage'));
const NotFound = lazy(() => import('./pages/not-found'));
const VisitListPage = lazy(() => import('./pages/VisitListPage'));
const NewVisitPage = lazy(() => import('./pages/NewVisitPage'));
const VisitDetailsPage = lazy(() => import('./pages/VisitDetailsPage'));

// Client pages
const ClientesPage = lazy(() => import('./pages/ClientesPage'));
const ClienteDetalhesPage = lazy(() => import('./pages/ClienteDetalhesPage'));

// Report pages - consolidated into a single main page
const RelatoriosPage = lazy(() => import('./pages/RelatoriosPage'));
const RelatorioVistoriaPage = lazy(() => import('./pages/RelatorioVistoriaPage'));
const VistoriaFARPage = lazy(() => import('./pages/VistoriaFARPage'));
const TestDownloadPage = lazy(() => import('./pages/TestDownloadPage'));

// Settings and inspection pages
const ConfiguracoesPage = lazy(() => import('./pages/ConfiguracoesPage'));
const InspecoesPage = lazy(() => import('./pages/archive/InspecoesPage'));
const InspecaoDetalhesPage = lazy(() => import('./pages/archive/InspecaoDetalhesPage'));
const NovaInspecaoPage = lazy(() => import('./pages/archive/NovaInspecaoPage'));

// Loading component to show during page loads
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <LoadingAnimation size="lg" text="Carregando..." />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <Suspense fallback={<PageLoading />}>
          <Switch>
            {/* Authentication and main pages */}
            <Route path="/login" component={LoginPage} />
            <Route path="/" component={DashboardPage} />
            <Route path="/perfil" component={ProfilePage} />
            <Route path="/rotas" component={RouteMapPage} />
            <Route path="/configuracoes" component={ConfiguracoesPage} />
            
            {/* Visits */}
            <Route path="/visitas" component={VisitListPage} />
            <Route path="/visitas/nova" component={NewVisitPage} />
            <Route path="/visitas/:id" component={VisitDetailsPage} />
            
            {/* Clients */}
            <Route path="/clientes" component={ClientesPage} />
            <Route path="/clientes/:id" component={ClienteDetalhesPage} />
            
            {/* Reports and Inspections */}
            <Route path="/relatorios" component={RelatoriosPage} />
            <Route path="/relatorio-vistoria" component={RelatorioVistoriaPage} />
            <Route path="/teste-download" component={TestDownloadPage} />
            
            {/* Inspections */}
            <Route path="/inspecoes" component={InspecoesPage} />
            <Route path="/inspecoes/novo" component={NovaInspecaoPage} />
            <Route path="/inspecoes/:id" component={InspecaoDetalhesPage} />
            
            {/* Fallback for not found route */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
        <Toaster position="bottom-right" />
      </div>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route } from 'wouter';
import { Suspense, lazy } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { LoadingAnimation } from '@/components/ui/loading-animation';

// Importações com lazy loading para melhorar o desempenho inicial
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const RouteMapPage = lazy(() => import('./pages/RouteMapPage'));
const NotFound = lazy(() => import('./pages/not-found'));
const VisitListPage = lazy(() => import('./pages/VisitListPage'));
const NewVisitPage = lazy(() => import('./pages/NewVisitPage'));
const VisitDetailsPage = lazy(() => import('./pages/VisitDetailsPage'));

// Novas páginas para o fluxo revisado
const ClientesPage = lazy(() => import('./pages/ClientesPage'));
const ClienteDetalhesPage = lazy(() => import('./pages/ClienteDetalhesPage'));
const RelatorioVistoriaPage = lazy(() => import('./pages/RelatorioVistoriaPage'));
const RelatoriosPage = lazy(() => import('./pages/RelatoriosPage'));
const VistoriaFARPage = lazy(() => import('./pages/VistoriaFARPage'));

// Componente de loading para mostrar durante o carregamento das páginas
const PageLoading = () => (
  <div className="flex items-center justify-center h-screen">
    <LoadingAnimation size="lg" text="Carregando..." />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Suspense fallback={<PageLoading />}>
          <Switch>
            {/* Autenticação e páginas principais */}
            <Route path="/login" component={LoginPage} />
            <Route path="/" component={DashboardPage} />
            <Route path="/perfil" component={ProfilePage} />
            <Route path="/rotas" component={RouteMapPage} />
            
            {/* Visitas */}
            <Route path="/visitas" component={VisitListPage} />
            <Route path="/visitas/nova" component={NewVisitPage} />
            <Route path="/visitas/:id" component={VisitDetailsPage} />
            
            {/* Clientes */}
            <Route path="/clientes" component={ClientesPage} />
            <Route path="/clientes/:id" component={ClienteDetalhesPage} />
            
            {/* Relatórios e Vistorias */}
            <Route path="/relatorios" component={RelatoriosPage} />
            <Route path="/nova-vistoria" component={RelatorioVistoriaPage} />
            <Route path="/vistoria-far" component={VistoriaFARPage} />
            
            {/* Fallback para rota não encontrada */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
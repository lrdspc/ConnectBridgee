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

// Páginas de clientes
const ClientesPage = lazy(() => import('./pages/ClientesPage'));
const ClienteDetalhesPage = lazy(() => import('./pages/ClienteDetalhesPage'));

// Páginas de relatórios - consolidadas em uma única página principal
const RelatoriosPage = lazy(() => import('./pages/RelatoriosPage'));
const RelatorioVistoriaPage = lazy(() => import('./pages/RelatorioVistoriaPage'));
const VistoriaFARPage = lazy(() => import('./pages/VistoriaFARPage'));

// Páginas de configurações e inspeções
const ConfiguracoesPage = lazy(() => import('./pages/ConfiguracoesPage'));
const InspecoesPage = lazy(() => import('./pages/archive/InspecoesPage'));
const InspecaoDetalhesPage = lazy(() => import('./pages/archive/InspecaoDetalhesPage'));
const NovaInspecaoPage = lazy(() => import('./pages/archive/NovaInspecaoPage'));

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
            <Route path="/configuracoes" component={ConfiguracoesPage} />
            
            {/* Visitas */}
            <Route path="/visitas" component={VisitListPage} />
            <Route path="/visitas/nova" component={NewVisitPage} />
            <Route path="/visitas/:id" component={VisitDetailsPage} />
            
            {/* Clientes */}
            <Route path="/clientes" component={ClientesPage} />
            <Route path="/clientes/:id" component={ClienteDetalhesPage} />
            
            {/* Relatórios e Vistorias */}
            <Route path="/relatorios" component={RelatoriosPage} />
            <Route path="/relatorio-vistoria" component={RelatorioVistoriaPage} />
            
            {/* Inspeções */}
            <Route path="/inspecoes" component={InspecoesPage} />
            <Route path="/inspecoes/novo" component={NovaInspecaoPage} />
            <Route path="/inspecoes/:id" component={InspecaoDetalhesPage} />
            
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
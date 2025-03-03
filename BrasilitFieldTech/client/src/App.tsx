import { Switch, Route } from 'wouter';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RouteMapPage from './pages/RouteMapPage';
import NotFound from './pages/not-found';
import VisitListPage from './pages/VisitListPage';
import NewVisitPage from './pages/NewVisitPage';
import VisitDetailsPage from './pages/VisitDetailsPage';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from '@/components/ui/toaster';

// Novas páginas para o fluxo revisado
import ClientesPage from './pages/ClientesPage';
import ClienteDetalhesPage from './pages/ClienteDetalhesPage';
import InspecoesPage from './pages/InspecoesPage';
import NovaInspecaoPage from './pages/NovaInspecaoPage';
import InspecoesTelhadosPage from './pages/InspecoesTelhadosPage';
import InspecaoDetalhesPage from './pages/InspecaoDetalhesPage';
import RelatoriosPage from './pages/RelatoriosPage';
import VistoriaFARPage from './pages/VistoriaFARPage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/" component={DashboardPage} />
          <Route path="/perfil" component={ProfilePage} />
          <Route path="/rotas" component={RouteMapPage} />
          
          {/* Páginas antigas de visitas - serão gradualmente migradas para o novo fluxo */}
          <Route path="/visitas" component={VisitListPage} />
          <Route path="/visitas/nova" component={NewVisitPage} />
          <Route path="/visitas/:id" component={VisitDetailsPage} />
          
          {/* Novas páginas do fluxo revisado */}
          <Route path="/clientes" component={ClientesPage} />
          <Route path="/clientes/:id" component={ClienteDetalhesPage} />
          <Route path="/inspecoes" component={InspecoesPage} />
          <Route path="/inspecoes/novo" component={NovaInspecaoPage} />
          <Route path="/inspecoes/telhados" component={InspecoesTelhadosPage} />
          <Route path="/inspecoes/:id" component={InspecaoDetalhesPage} />
          
          {/* Página de relatórios */}
          <Route path="/relatorios" component={RelatoriosPage} />
          
          {/* Página de vistoria FAR */}
          <Route path="/vistoria-far" component={VistoriaFARPage} />
          
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
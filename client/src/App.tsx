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

// Páginas do sistema
import ClientesPage from './pages/ClientesPage';
import ClienteDetalhesPage from './pages/ClienteDetalhesPage';
import RelatoriosPage from './pages/RelatoriosPage';
import VistoriaFARPage from './pages/VistoriaFARPage';

// Importação de folhas de estilo
import './styles/smart-dashboard.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="smart-app-container">
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/" component={DashboardPage} />
          <Route path="/perfil" component={ProfilePage} />
          <Route path="/rotas" component={RouteMapPage} />
          
          {/* Páginas de Visitas */}
          <Route path="/visitas" component={VisitListPage} />
          <Route path="/visitas/nova" component={NewVisitPage} />
          <Route path="/visitas/:id" component={VisitDetailsPage} />
          
          {/* Páginas de Clientes */}
          <Route path="/clientes" component={ClientesPage} />
          <Route path="/clientes/:id" component={ClienteDetalhesPage} />
          
          {/* Relatórios */}
          <Route path="/relatorios" component={RelatoriosPage} />
          <Route path="/vistoria-far" component={VistoriaFARPage} />
          <Route path="/relatorio-vistoria" component={VistoriaFARPage} />
          
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
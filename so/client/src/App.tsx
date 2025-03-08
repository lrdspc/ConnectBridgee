import { Route, Switch } from "wouter";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { TestLayout } from "./layouts/TestLayout";
import DashboardPage from "./pages/DashboardPage";
import VisitListPage from "./pages/VisitListPage";
import VisitDetailsPage from "./pages/VisitDetailsPage";
import NewVisitPage from "./pages/NewVisitPage";
import RouteMapPage from "./pages/RouteMapPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ReportsPage from "./pages/ReportsPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import ClientesPage from "./pages/ClientesPage";
import ClienteDetalhesPage from "./pages/ClienteDetalhesPage";
import RelatoriosPage from "./pages/RelatoriosPage";
import RelatorioVistoriaPage from "./pages/RelatorioVistoriaPage";
import VistoriaFARPage from "./pages/VistoriaFARPage";
import TesteRelatorioPage from "./pages/TesteRelatorioPage";
import TestDownloadPage from "./pages/TestDownloadPage";
import NotFound from "./pages/not-found";

function App() {
  return (
    <Switch>
      {/* Rota de login */}
      <Route path="/login" component={LoginPage} />
      
      {/* Rotas principais com layout de dashboard */}
      <Route path="/">
        <DashboardLayout>
          <DashboardPage />
        </DashboardLayout>
      </Route>
      
      <Route path="/visitas">
        <DashboardLayout>
          <VisitListPage />
        </DashboardLayout>
      </Route>
      
      <Route path="/visitas/:id">
        {(params) => (
          <DashboardLayout>
            <VisitDetailsPage id={params.id} />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path="/nova-visita">
        <DashboardLayout>
          <NewVisitPage />
        </DashboardLayout>
      </Route>
      
      <Route path="/mapa-rotas">
        <DashboardLayout>
          <RouteMapPage />
        </DashboardLayout>
      </Route>
      
      <Route path="/relatorios">
        <DashboardLayout>
          <ReportsPage />
        </DashboardLayout>
      </Route>
      
      <Route path="/perfil">
        <DashboardLayout>
          <ProfilePage />
        </DashboardLayout>
      </Route>
      
      <Route path="/configuracoes">
        <DashboardLayout>
          <ConfiguracoesPage />
        </DashboardLayout>
      </Route>
      
      <Route path="/clientes">
        <DashboardLayout>
          <ClientesPage />
        </DashboardLayout>
      </Route>
      
      <Route path="/clientes/:id">
        {(params) => (
          <DashboardLayout>
            <ClienteDetalhesPage id={params.id} />
          </DashboardLayout>
        )}
      </Route>
      
      {/* Relatórios */}
      <Route path="/relatorios-tecnicos">
        <DashboardLayout>
          <RelatoriosPage />
        </DashboardLayout>
      </Route>
      
      <Route path="/relatorio-vistoria">
        <DashboardLayout>
          <RelatorioVistoriaPage />
        </DashboardLayout>
      </Route>
      
      <Route path="/relatorio-far">
        <DashboardLayout>
          <VistoriaFARPage />
        </DashboardLayout>
      </Route>
      
      {/* Páginas de teste */}
      <Route path="/teste-relatorio">
        <TestLayout>
          <TesteRelatorioPage />
        </TestLayout>
      </Route>
      
      <Route path="/teste-download">
        <TestLayout>
          <TestDownloadPage />
        </TestLayout>
      </Route>
      
      {/* Página 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
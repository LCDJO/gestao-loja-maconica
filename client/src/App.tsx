import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Secretaria from "./pages/Secretaria";
import Chancelaria from "./pages/Chancelaria";
import Tesouraria from "./pages/Tesouraria";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Conciliacao from "./pages/Conciliacao";
import MemberLogin from "./pages/MemberLogin";
import MemberDashboard from "./pages/MemberDashboard";
import MemberPendencias from "./pages/MemberPendencias";
import MemberHistorico from "./pages/MemberHistorico";
import NotificacoesEmail from "./pages/NotificacoesEmail";
import MemberNotificacoes from "./pages/MemberNotificacoes";
import ConfiguracoesPush from "./pages/ConfiguracoesPush";
import AnalyticsNotificacoes from "./pages/AnalyticsNotificacoes";
import TemplatesNotificacao from "./pages/TemplatesNotificacao";
import AgendamentoCampanhas from "./pages/AgendamentoCampanhas";
import RelatorioROI from "./pages/RelatorioROI";
import Parametrizacao from "./pages/Parametrizacao";
import EditorTemplates from "./pages/EditorTemplates";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AutomacaoCampanhas from "./pages/AutomacaoCampanhas";
import IntegracaoPagamentos from "./pages/IntegracaoPagamentos";
import RelatorioChurn from "./pages/RelatorioChurn";
import Auditoria from "./pages/Auditoria";
import Backup from "./pages/Backup";
import Permissoes from "./pages/Permissoes";
import DashboardExecutivo from "./pages/DashboardExecutivo";
import Comunicados from "./pages/Comunicados";
import GoogleCalendarIntegracao from "./pages/GoogleCalendarIntegracao";
import AgendamentoRelatorios from "./pages/AgendamentoRelatorios";
import ConfiguracaoEmail from "./pages/ConfiguracaoEmail";
import AnalyticsPush from "./pages/AnalyticsPush";
import GerenciamentoUsuarios from "./pages/GerenciamentoUsuarios";
import AuditoriaAcesso from "./pages/AuditoriaAcesso";
import ConfiguracoesLoja from "./pages/ConfiguracoesLoja";
import Changelog from '@/pages/Changelog';
import HistoricoTestesEvolution from '@/pages/HistoricoTestesEvolution';
import ProtectedRoute from "./components/ProtectedRoute";
import { MemberAuthProvider } from "./contexts/MemberAuthContext";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/secretaria"} component={Secretaria} />
      <Route path={"/chancelaria"} component={Chancelaria} />
      <Route path={"/tesouraria"} component={Tesouraria} />
      <Route path={"/relatorios"} component={Relatorios} />
      <Route path={"/configuracoes"} component={Configuracoes} />
      <Route path={"/conciliacao"} component={Conciliacao} />
      <Route path={"/membro/login"} component={MemberLogin} />
      <Route path={"/membro/dashboard"} component={MemberDashboard} />
      <Route path={"/membro/pendencias"} component={MemberPendencias} />
      <Route path={"/membro/historico"} component={MemberHistorico} />
      <Route path={"/membro/notificacoes"} component={MemberNotificacoes} />
      <Route path={"/notificacoes"} component={NotificacoesEmail} />
      <Route path={"/configuracoes-push"} component={ConfiguracoesPush} />
      <Route path={"/analytics-notificacoes"} component={AnalyticsNotificacoes} />
      <Route path={"/templates-notificacao"} component={TemplatesNotificacao} />
      <Route path={"/agendamento-campanhas"} component={AgendamentoCampanhas} />
      <Route path={"/relatorio-roi"} component={RelatorioROI} />
      <Route path={"/parametrizacao"} component={Parametrizacao} />
      <Route path={"/editor-templates"} component={EditorTemplates} />
         <Route path="/super-admin" component={SuperAdminDashboard} />
      <Route path="/automacao-campanhas" component={AutomacaoCampanhas} />
      <Route path="/integracao-pagamentos" component={IntegracaoPagamentos} />
      <Route path="/relatorio-churn" component={RelatorioChurn} />
      <Route path="/auditoria" component={Auditoria} />
      <Route path="/backup" component={Backup} />
      <Route path="/permissoes" component={Permissoes} />
      <Route path="/dashboard-executivo" component={DashboardExecutivo} />
      <Route path="/comunicados" component={Comunicados} />
      <Route path="/google-calendar" component={GoogleCalendarIntegracao} />
      <Route path="/agendamento-relatorios" component={AgendamentoRelatorios} />
      <Route path="/configuracao-email" component={ConfiguracaoEmail} />
      <Route path="/analytics-push" component={AnalyticsPush} />
      <Route path="/gerenciamento-usuarios" component={GerenciamentoUsuarios} />
      <Route path="/auditoria-acesso" component={AuditoriaAcesso} />
      <Route path="/configuracoes-loja" component={ConfiguracoesLoja} />
      <Route path="/changelog" component={Changelog} />
      <Route path="/historico-testes-evolution" component={HistoricoTestesEvolution} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <MemberAuthProvider>
            <Toaster />
            <Router />
          </MemberAuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

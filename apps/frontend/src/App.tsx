import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { MemberAuthProvider } from "./contexts/MemberAuthContext";

// Auth
import MemberLogin from "./pages/auth/MemberLogin";
import SuperAdminLogin from "./pages/auth/SuperAdminLogin";

// Portal do Irmão
import MemberPortalLogin from "./pages/member-portal/auth/MemberLogin";
import MemberPortalDashboard from "./pages/member-portal/dashboard/Dashboard";
import PersonalData from "./pages/member-portal/personal-data/PersonalData";
import FinancialHistory from "./pages/member-portal/financial-history/FinancialHistory";
import Documents from "./pages/member-portal/documents/Documents";
import Attendance from "./pages/member-portal/attendance/Attendance";

// Dashboards
import Home from "./pages/dashboards/Home";
import MemberDashboard from "./pages/dashboards/MemberDashboard";
import SuperAdminDashboard from "./pages/dashboards/SuperAdminDashboard";
import DashboardExecutivo from "./pages/dashboards/DashboardExecutivo";

// MÓDULO SECRETARIA
import SecretariaDashboard from "./pages/modules/secretaria/Secretaria";
import IrmaosList from "./pages/modules/secretaria/members/IrmaosList";
import Aniversariantes from "./pages/modules/secretaria/members/Aniversariantes";
import Cronograma from "./pages/modules/secretaria/schedule/Cronograma";

// MÓDULO CHANCELARIA
import ChancelariaDashboard from "./pages/modules/chancelaria/Chancelaria";
import VidaMaconica from "./pages/modules/chancelaria/records/VidaMaconica";
import ComissoesList from "./pages/modules/chancelaria/commissions/ComissoesList";
import Caridade from "./pages/modules/chancelaria/charity/Caridade";

// MÓDULO TESOURARIA
import TesourariaDashboard from "./pages/modules/tesouraria/Tesouraria";
import MinhasFinancas from "./pages/modules/tesouraria/flow/MinhasFinancas";
import Conciliacao from "./pages/modules/tesouraria/accounts/Conciliacao";
import DashboardFinanceiro from "./pages/modules/tesouraria/reports/DashboardFinanceiro";

// PÁGINAS ANTIGAS (ainda não movidas)
// Member
import MemberPendencias from "./pages/member/MemberPendencias";
import MemberHistorico from "./pages/member/MemberHistorico";
import MemberNotificacoes from "./pages/member/MemberNotificacoes";

// Reports
import Relatorios from "./pages/reports/Relatorios";
import RelatorioROI from "./pages/reports/RelatorioROI";
import RelatorioChurn from "./pages/reports/RelatorioChurn";
import HistoricoTestesEvolution from "./pages/reports/HistoricoTestesEvolution";

// Config
import Configuracoes from "./pages/config/Configuracoes";
import ConfiguracoesPush from "./pages/config/ConfiguracoesPush";
import ConfiguracoesLoja from "./pages/config/ConfiguracoesLoja";
import ConfiguracaoEmail from "./pages/config/ConfiguracaoEmail";
import Parametrizacao from "./pages/config/Parametrizacao";

// Admin
import Auditoria from "./pages/admin/Auditoria";
import AuditoriaAcesso from "./pages/admin/AuditoriaAcesso";
import Permissoes from "./pages/admin/Permissoes";
import GerenciamentoUsuarios from "./pages/admin/GerenciamentoUsuarios";
import Backup from "./pages/admin/Backup";
import Comunicados from "./pages/admin/Comunicados";
import Changelog from "./pages/admin/Changelog";

// Pages antigas não movidas ainda
import Sistema from "./pages/domains/Sistema";
import Biblioteca from "./pages/domains/Biblioteca";
import Comissoes from "./pages/domains/Comissoes";
import Pranchas from "./pages/domains/Pranchas";
import Administracao from "./pages/domains/Administracao";

// Integrations
import IntegracaoPagamentos from "./pages/integrations/IntegracaoPagamentos";
import GoogleCalendarIntegracao from "./pages/integrations/GoogleCalendarIntegracao";
import EditorTemplates from "./pages/integrations/EditorTemplates";

// Notifications
import NotificacoesEmail from "./pages/notifications/NotificacoesEmail";
import AnalyticsNotificacoes from "./pages/notifications/AnalyticsNotificacoes";
import AnalyticsPush from "./pages/notifications/AnalyticsPush";
import TemplatesNotificacao from "./pages/notifications/TemplatesNotificacao";
import AgendamentoCampanhas from "./pages/notifications/AgendamentoCampanhas";
import AutomacaoCampanhas from "./pages/notifications/AutomacaoCampanhas";
import AgendamentoRelatorios from "./pages/notifications/AgendamentoRelatorios";


function Router() {
  return (
    <Switch>
      {/* Auth Routes */}
      <Route path={"/"} component={Home} />
      <Route path={"/membro/login"} component={MemberLogin} />
      <Route path={"/super-admin/login"} component={SuperAdminLogin} />

      {/* ===== PORTAL DO IRMÃO ===== */}
      <Route path={"/member/login"} component={MemberPortalLogin} />
      <Route path={"/member-portal/dashboard"} component={MemberPortalDashboard} />
      <Route path={"/member-portal/personal-data"} component={PersonalData} />
      <Route path={"/member-portal/financial-history"} component={FinancialHistory} />
      <Route path={"/member-portal/documents"} component={Documents} />
      <Route path={"/member-portal/attendance"} component={Attendance} />

      {/* Dashboards */}
      <Route path={"/membro/dashboard"} component={MemberDashboard} />
      <Route path={"/super-admin"} component={SuperAdminDashboard} />
      <Route path={"/dashboard-executivo"} component={DashboardExecutivo} />

      {/* ===== MÓDULO SECRETARIA ===== */}
      <Route path={"/secretaria"} component={SecretariaDashboard} />
      <Route path={"/secretaria/irmaos"} component={IrmaosList} />
      <Route path={"/secretaria/aniversariantes"} component={Aniversariantes} />
      <Route path={"/secretaria/cronograma"} component={Cronograma} />

      {/* ===== MÓDULO CHANCELARIA ===== */}
      <Route path={"/chancelaria"} component={ChancelariaDashboard} />
      <Route path={"/chancelaria/vida-maconica"} component={VidaMaconica} />
      <Route path={"/chancelaria/comissoes"} component={ComissoesList} />
      <Route path={"/chancelaria/caridade"} component={Caridade} />

      {/* ===== MÓDULO TESOURARIA ===== */}
      <Route path={"/tesouraria"} component={TesourariaDashboard} />
      <Route path={"/tesouraria/minhas-financas"} component={MinhasFinancas} />
      <Route path={"/tesouraria/conciliacao"} component={Conciliacao} />
      <Route path={"/tesouraria/dashboard"} component={DashboardFinanceiro} />

      {/* Member */}
      <Route path={"/membro/pendencias"} component={MemberPendencias} />
      <Route path={"/membro/historico"} component={MemberHistorico} />
      <Route path={"/membro/notificacoes"} component={MemberNotificacoes} />

      {/* Reports - TODO: Mover para tesouraria/reports */}
      <Route path={"/relatorios"} component={Relatorios} />
      <Route path={"/relatorio-roi"} component={RelatorioROI} />
      <Route path={"/relatorio-churn"} component={RelatorioChurn} />
      <Route path={"/historico-testes-evolution"} component={HistoricoTestesEvolution} />

      {/* Config */}
      <Route path={"/configuracoes"} component={Configuracoes} />
      <Route path={"/configuracoes-push"} component={ConfiguracoesPush} />
      <Route path={"/configuracoes-loja"} component={ConfiguracoesLoja} />
      <Route path={"/configuracao-email"} component={ConfiguracaoEmail} />
      <Route path={"/parametrizacao"} component={Parametrizacao} />

      {/* Admin */}
      <Route path={"/auditoria"} component={Auditoria} />
      <Route path={"/auditoria-acesso"} component={AuditoriaAcesso} />
      <Route path={"/permissoes"} component={Permissoes} />
      <Route path={"/gerenciamento-usuarios"} component={GerenciamentoUsuarios} />
      <Route path={"/backup"} component={Backup} />
      <Route path={"/comunicados"} component={Comunicados} />
      <Route path={"/changelog"} component={Changelog} />

      {/* Domains - TODO: Mover páginas antigas */}
      <Route path={"/sistema"} component={Sistema} />
      <Route path={"/biblioteca"} component={Biblioteca} />
      <Route path={"/comissoes"} component={Comissoes} />
      <Route path={"/pranchas"} component={Pranchas} />
      <Route path={"/administracao"} component={Administracao} />

      {/* Integrations */}
      <Route path={"/integracao-pagamentos"} component={IntegracaoPagamentos} />
      <Route path={"/google-calendar"} component={GoogleCalendarIntegracao} />
      <Route path={"/editor-templates"} component={EditorTemplates} />

      {/* Notifications */}
      <Route path={"/notificacoes"} component={NotificacoesEmail} />
      <Route path={"/analytics-notificacoes"} component={AnalyticsNotificacoes} />
      <Route path={"/analytics-push"} component={AnalyticsPush} />
      <Route path={"/templates-notificacao"} component={TemplatesNotificacao} />
      <Route path={"/agendamento-campanhas"} component={AgendamentoCampanhas} />
      <Route path={"/automacao-campanhas"} component={AutomacaoCampanhas} />
      <Route path={"/agendamento-relatorios"} component={AgendamentoRelatorios} />

      {/* Error & Fallback */}
      <Route path="/404" component={NotFound} />
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

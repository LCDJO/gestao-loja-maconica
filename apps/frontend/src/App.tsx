import { Toaster } from "sonner";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SuperAdminProtectedRoute from "./components/SuperAdminProtectedRoute";
import { MemberAuthProvider } from "./contexts/MemberAuthContext";

// Auth
import SuperAdminLogin from "./pages/auth/SuperAdminLogin";

// Admin - Novo módulo reorganizado
import AdminDashboard from "./pages/admin/AdminDashboard";
import SecretariaDashboard from "./pages/admin/secretaria/SecretariaDashboard";
import ChancelariaDashboard from "./pages/admin/chancelaria/ChancelariaDashboard";
import TesouariaDashboard from "./pages/admin/tesouraria/TesouariaDashboard";
import PresidenciaDashboard from "./pages/admin/presidencia/PresidenciaDashboard";
import RelatoriosDashboard from "./pages/admin/relatorios/RelatoriosDashboard";
import ConfiguracoesDashboard from "./pages/admin/configuracoes/ConfiguracoesDashboard";
import IntegracoesDashboard from "./pages/admin/integracoes/IntegracoesDashboard";

// Portal do Irmão
import MemberPortalLogin from "./pages/member-portal/auth/MemberLogin";
import MemberPortalDashboard from "./pages/member-portal/dashboard/Dashboard";
import PersonalData from "./pages/member-portal/personal-data/PersonalData";
import FinancialHistory from "./pages/member-portal/financial-history/FinancialHistory";
import Documents from "./pages/member-portal/documents/Documents";
import Attendance from "./pages/member-portal/attendance/Attendance";

// Dashboards
import Home from "./pages/dashboards/Home";

import SuperAdminDashboard from "./pages/dashboards/SuperAdminDashboard";
import DashboardExecutivo from "./pages/dashboards/DashboardExecutivo";

// MÓDULO SECRETARIA
import IrmaosList from "./pages/modules/secretaria/members/IrmaosList";
import Aniversariantes from "./pages/modules/secretaria/members/Aniversariantes";
import Cronograma from "./pages/modules/secretaria/schedule/Cronograma";

// MÓDULO CHANCELARIA
import VidaMaconica from "./pages/modules/chancelaria/records/VidaMaconica";
import ComissoesList from "./pages/modules/chancelaria/commissions/ComissoesList";
import Caridade from "./pages/modules/chancelaria/charity/Caridade";

// MÓDULO TESOURARIA
import MinhasFinancas from "./pages/modules/tesouraria/flow/MinhasFinancas";
import Conciliacao from "./pages/modules/tesouraria/accounts/Conciliacao";
import DashboardFinanceiro from "./pages/modules/tesouraria/reports/DashboardFinanceiro";

// PÁGINAS ANTIGAS (ainda não movidas)
// Reports
import Relatorios from "./pages/reports/Relatorios";
import RelatorioROI from "./pages/reports/RelatorioROI";
import RelatorioChurn from "./pages/reports/RelatorioChurn";
import HistoricoTestesEvolution from "./pages/reports/HistoricoTestesEvolution";

// Config - Configurações da Loja
import Configuracoes from "./pages/config/Configuracoes";
import GerenciamentoUsuarios from "./pages/admin/GerenciamentoUsuarios";
import Permissoes from "./pages/admin/Permissoes";
import Auditoria from "./pages/admin/Auditoria";
import AuditoriaAcesso from "./pages/admin/AuditoriaAcesso";
import Backup from "./pages/admin/Backup";
import Comunicados from "./pages/admin/Comunicados";
import Changelog from "./pages/admin/Changelog";

// Pages antigas não movidas ainda
import Sistema from "./pages/domains/Sistema";
import Biblioteca from "./pages/domains/Biblioteca";
import Comissoes from "./pages/domains/Comissoes";
import Pranchas from "./pages/domains/Pranchas";
import Administracao from "./pages/domains/Administracao";

// Integrações de Sistema
import { IntegracoesSystemaDashboard, IntegracoesPagamentos } from "./pages/integrations";

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
      <Route path={"/super-admin/login"} component={SuperAdminLogin} />

      {/* ===== PORTAL DO IRMÃO ===== */}
      <Route path={"/member-portal/auth/login"} component={MemberPortalLogin} />
      <Route path={"/member-portal/dashboard"} component={MemberPortalDashboard} />
      <Route path={"/member-portal/personal-data"} component={PersonalData} />
      <Route path={"/member-portal/financial-history"} component={FinancialHistory} />
      <Route path={"/member-portal/documents"} component={Documents} />
      <Route path={"/member-portal/attendance"} component={Attendance} />

      {/* Dashboards */}
      <Route path={"/super-admin"}>
        {() => (
          <SuperAdminProtectedRoute>
            <AdminDashboard />
          </SuperAdminProtectedRoute>
        )}
      </Route>
      <Route path={"/dashboard-executivo"} component={DashboardExecutivo} />

      {/* ===== ADMIN - Super Admin Dashboard ===== */}
      <Route path={"/admin"}>
        {() => (
          <SuperAdminProtectedRoute>
            <AdminDashboard />
          </SuperAdminProtectedRoute>
        )}
      </Route>

      {/* ===== ADMIN - Secretaria ===== */}
      <Route path={"/admin/secretaria"}>
        {() => (
          <SuperAdminProtectedRoute>
            <SecretariaDashboard />
          </SuperAdminProtectedRoute>
        )}
      </Route>
      <Route path={"/admin/secretaria/membros"}>
        {() => (
          <SuperAdminProtectedRoute>
            <SecretariaDashboard />
          </SuperAdminProtectedRoute>
        )}
      </Route>

      {/* ===== ADMIN - Chancelaria ===== */}
      <Route path={"/admin/chancelaria"}>
        {() => (
          <SuperAdminProtectedRoute>
            <ChancelariaDashboard />
          </SuperAdminProtectedRoute>
        )}
      </Route>
      <Route path={"/admin/chancelaria/frequencias"}>
        {() => (
          <SuperAdminProtectedRoute>
            <ChancelariaDashboard />
          </SuperAdminProtectedRoute>
        )}
      </Route>

      {/* ===== ADMIN - Tesouraria ===== */}
      <Route path={"/admin/tesouraria"}>
        {() => (
          <SuperAdminProtectedRoute>
            <TesouariaDashboard />
          </SuperAdminProtectedRoute>
        )}
      </Route>
      <Route path={"/admin/tesouraria/receitas"}>
        {() => (
          <SuperAdminProtectedRoute>
            <TesouariaDashboard />
          </SuperAdminProtectedRoute>
        )}
      </Route>

      {/* ===== ADMIN - Presidência ===== */}
      <Route path={"/admin/presidencia"}>
        {() => (
          <SuperAdminProtectedRoute>
            <PresidenciaDashboard />
          </SuperAdminProtectedRoute>
        )}
      </Route>
      <Route path={"/admin/presidencia/administracoes"}>
        {() => (
          <SuperAdminProtectedRoute>
            <PresidenciaDashboard />
          </SuperAdminProtectedRoute>
        )}
      </Route>

      {/* ===== ADMIN - Relatórios ===== */}
      <Route path={"/admin/relatorios"}>
        {() => (
          <SuperAdminProtectedRoute>
            <RelatoriosDashboard />
          </SuperAdminProtectedRoute>
        )}
      </Route>

      {/* ===== ADMIN - Configurações ===== */}
      <Route path={"/admin/configuracoes"}>
        {() => (
          <SuperAdminProtectedRoute>
            <ConfiguracoesDashboard />
          </SuperAdminProtectedRoute>
        )}
      </Route>
      <Route path={"/admin/configuracoes/geral"}>
        {() => (
          <SuperAdminProtectedRoute>
            <ConfiguracoesDashboard />
          </SuperAdminProtectedRoute>
        )}
      </Route>

      {/* ===== ADMIN - Integrações ===== */}
      <Route path={"/admin/integracoes"}>
        {() => (
          <SuperAdminProtectedRoute>
            <IntegracoesDashboard />
          </SuperAdminProtectedRoute>
        )}
      </Route>
      <Route path={"/admin/integracoes/email"}>
        {() => (
          <SuperAdminProtectedRoute>
            <IntegracoesDashboard />
          </SuperAdminProtectedRoute>
        )}
      </Route>

      {/* ===== MÓDULO SECRETARIA ===== */}

      {/* ===== MÓDULO CHANCELARIA ===== */}

      {/* ===== MÓDULO TESOURARIA ===== */}

      {/* Reports - TODO: Mover para tesouraria/reports */}
      <Route path={"/relatorios"} component={Relatorios} />
      <Route path={"/relatorio-roi"} component={RelatorioROI} />
      <Route path={"/relatorio-churn"} component={RelatorioChurn} />
      <Route path={"/historico-testes-evolution"} component={HistoricoTestesEvolution} />

      {/* ===== CONFIGURAÇÕES DA LOJA ===== */}
      <Route path={"/config"} component={Configuracoes} />

      {/* ===== ADMINISTRAÇÃO (deprecated - moved to /admin/*) ===== */}

      {/* ===== INTEGRAÇÕES DE SISTEMA ===== */}
      <Route path={"/integracao"} component={IntegracoesSystemaDashboard} />
      <Route path={"/integracao/pagamentos"} component={IntegracoesPagamentos} />

      {/* Domains - TODO: Mover páginas antigas */}
      <Route path={"/sistema"} component={Sistema} />
      <Route path={"/biblioteca"} component={Biblioteca} />
      <Route path={"/comissoes"} component={Comissoes} />
      <Route path={"/pranchas"} component={Pranchas} />
      <Route path={"/administracao"} component={Administracao} />

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
        <MemberAuthProvider>
          <Toaster />
          <Router />
        </MemberAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

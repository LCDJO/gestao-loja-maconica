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
      <Route path={"/404"} component={NotFound} />
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

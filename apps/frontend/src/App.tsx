import { Toaster } from "sonner";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MemberAuthProvider } from "./contexts/MemberAuthContext";
import { SuperAdminProvider } from "./contexts/SuperAdminContext";
import { AdminProvider } from "./contexts/AdminContext";

// Auth Pages
import SuperAdminLogin from "./pages/auth/SuperAdminLogin";
import AdminLogin from "./pages/auth/AdminLogin";

// Super-Admin Pages
import SuperAdminDashboard from "./pages/super-admin/dashboard/SuperAdminDashboard";

// Admin Pages
import AdminLodgeDashboard from "./pages/admin/dashboard/AdminLodgeDashboard";

// Member Portal Pages
import Dashboard from "./pages/member-portal/dashboard/Dashboard";

function Router() {
  return (
    <Switch>
      {/* Home */}
      <Route path="/">
        {() => (
          <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>✅ Gestão Loja Maçônica</h1>
            <ul>
              <li><a href="/super-admin/login">Super-Admin Login</a></li>
              <li><a href="/admin/login">Admin Login</a></li>
              <li><a href="/member-portal/dashboard">Member Portal</a></li>
            </ul>
          </div>
        )}
      </Route>

      {/* Auth Routes */}
      <Route path="/super-admin/login" component={SuperAdminLogin} />
      <Route path="/admin/login" component={AdminLogin} />

      {/* Super-Admin Routes */}
      <Route path="/super-admin/dashboard" component={SuperAdminDashboard} />
      <Route path="/super-admin" component={SuperAdminDashboard} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" component={AdminLodgeDashboard} />
      <Route path="/admin" component={AdminLodgeDashboard} />

      {/* Member Portal Routes */}
      <Route path="/member-portal/dashboard" component={Dashboard} />
      <Route path="/member-portal" component={Dashboard} />

      {/* 404 */}
      <Route>
        {() => (
          <div style={{ padding: "20px" }}>
            <h2>404 - Página não encontrada</h2>
          </div>
        )}
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SuperAdminProvider>
          <AdminProvider>
            <MemberAuthProvider>
              <Toaster />
              <Router />
            </MemberAuthProvider>
          </AdminProvider>
        </SuperAdminProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

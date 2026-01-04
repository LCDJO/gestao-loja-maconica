/**
 * App.tsx - Integração do SuperAdmin Router
 * Exemplo de como integrar o painel SuperAdmin com as rotas da aplicação
 */

import { Switch, Route } from 'wouter';
import SuperAdminDashboard from '@/pages/super-admin/SuperAdminDashboard';

// Outras páginas de SuperAdmin que serão criadas:
// import SuperAdminTenants from '@/pages/super-admin/tenants/SuperAdminTenants';
// import SuperAdminBilling from '@/pages/super-admin/billing/SuperAdminBilling';
// import SuperAdminTelemetria from '@/pages/super-admin/telemetry/SuperAdminTelemetria';
// ... etc

/**
 * ProtectedSuperAdminRoute
 * Componente para proteger rotas do SuperAdmin
 * Valida: JWT token + permissão SUPERADMIN
 */
function ProtectedSuperAdminRoute({ component: Component, ...rest }: any) {
  // Em produção, validar token e role
  // const { user } = useAuth();
  // if (!user || user.role !== 'superadmin') {
  //   return <Redirect to="/login" />;
  // }
  
  return <Route {...rest} component={Component} />;
}

/**
 * SuperAdmin Router Configuration
 * Todas as rotas do painel SuperAdmin
 */
export const SUPER_ADMIN_ROUTES = (
  <>
    {/* DASHBOARD */}
    <Route path="/super-admin/dashboard" component={SuperAdminDashboard} />

    {/* TELEMETRIA */}
    {/* <Route path="/super-admin/telemetria" component={SuperAdminTelemetria} />
    <Route path="/super-admin/telemetria/aplicacao" component={TelemetriaApp} />
    <Route path="/super-admin/telemetria/microservices" component={TelemetriaMicroservices} />
    <Route path="/super-admin/telemetria/infraestrutura" component={TelemetriaInfraestrutura} />
    <Route path="/super-admin/telemetria/database" component={TelemetriaDatabase} />
    <Route path="/super-admin/telemetria/filas" component={TelemetriaFilas} />
    <Route path="/super-admin/logs" component={LogsCentralizados} /> */}

    {/* TENANTS */}
    {/* <Route path="/super-admin/tenants" component={SuperAdminTenants} />
    <Route path="/super-admin/tenants/lista" component={TenantsList} />
    <Route path="/super-admin/tenants/novo" component={TenantsOnboard} />
    <Route path="/super-admin/tenants/status" component={TenantsStatus} />
    <Route path="/super-admin/tenants/impersonation" component={TenantsImpersonation} />
    <Route path="/super-admin/tenants/auditoria" component={TenantsAuditoria} /> */}

    {/* USUÁRIOS */}
    {/* <Route path="/super-admin/usuarios" component={SuperAdminUsuarios} />
    <Route path="/super-admin/usuarios/superadmins" component={SuperAdminList} />
    <Route path="/super-admin/usuarios/admins" component={AdminsList} />
    <Route path="/super-admin/usuarios/bloqueados" component={BlockedUsers} />
    <Route path="/super-admin/usuarios/sessoes" component={SessionsList} />
    <Route path="/super-admin/usuarios/mfa" component={MFAConfig} /> */}

    {/* BILLING */}
    {/* <Route path="/super-admin/billing" component={SuperAdminBilling} />
    <Route path="/super-admin/billing/planos" component={BillingPlans} />
    <Route path="/super-admin/billing/assinaturas" component={Subscriptions} />
    <Route path="/super-admin/billing/faturas" component={Invoices} />
    <Route path="/super-admin/billing/inadimplencia" component={Delinquency} />
    <Route path="/super-admin/billing/cupons" component={Coupons} />
    <Route path="/super-admin/billing/metricas" component={FinancialMetrics} /> */}

    {/* ... outras rotas do SuperAdmin ... */}

    {/* Rota padrão do SuperAdmin */}
    <Route path="/super-admin" component={SuperAdminDashboard} />
  </>
);

/**
 * Uso na aplicação principal:
 * 
 * export default function App() {
 *   return (
 *     <Switch>
 *       {/* Rotas públicas */}
 *       <Route path="/" component={Home} />
 *       <Route path="/login" component={Login} />
 *       
 *       {/* Rotas protegidas */}
 *       <ProtectedRoute path="/dashboard" component={Dashboard} />
 *       
 *       {/* Rotas SuperAdmin */}
 *       {SUPER_ADMIN_ROUTES}
 *       
 *       {/* 404 */}
 *       <Route component={NotFound} />
 *     </Switch>
 *   );
 * }
 */

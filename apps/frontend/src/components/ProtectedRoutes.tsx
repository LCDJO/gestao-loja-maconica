import React from 'react';
import { ReactNode } from 'react';
import { Navigate } from 'wouter';
import { RoleType, isAdminContext, isSuperAdminContext, isMemberContext } from 'shared';

/**
 * COMPONENTES PROTEGIDOS POR ROLE
 * 
 * Implementação clara de Admin vs Super-Admin
 * Integrados com o contexto de autenticação global
 */

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: RoleType;
  fallback?: React.ComponentType;
}

// =====================================================================
// ADMIN PROTECTED ROUTE - Protege rotas de admin (UMA loja)
// =====================================================================
export function AdminProtectedRoute({ 
  children, 
  fallback: Fallback 
}: Omit<ProtectedRouteProps, 'requiredRole'>) {
  
  // Obter contexto de auth (você precisa ter um contexto global)
  // Por enquanto, ler do localStorage como fallback
  const token = localStorage.getItem('MEMBER_TOKEN_KEY');
  const role = localStorage.getItem('ADMIN_ROLE');
  const lodgeId = localStorage.getItem('ADMIN_LODGE_ID');

  // Validar que é admin
  if (!token || role !== 'admin' || !lodgeId) {
    if (Fallback) {
      return <Fallback />;
    }
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

// =====================================================================
// SUPER-ADMIN PROTECTED ROUTE - Protege rotas de super-admin (TODO SaaS)
// =====================================================================
export function SuperAdminProtectedRoute({ 
  children,
  fallback: Fallback
}: Omit<ProtectedRouteProps, 'requiredRole'>) {
  
  const token = localStorage.getItem('MEMBER_TOKEN_KEY');
  const role = localStorage.getItem('ADMIN_ROLE');

  // Validar que é super-admin
  if (!token || role !== 'super_admin') {
    if (Fallback) {
      return <Fallback />;
    }
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

// =====================================================================
// MEMBER PROTECTED ROUTE - Protege rotas de member (dados pessoais)
// =====================================================================
export function MemberProtectedRoute({ 
  children,
  fallback: Fallback
}: Omit<ProtectedRouteProps, 'requiredRole'>) {
  
  const token = localStorage.getItem('MEMBER_TOKEN_KEY');
  const role = localStorage.getItem('MEMBER_ROLE');

  // Validar que é member
  if (!token || role !== 'member') {
    if (Fallback) {
      return <Fallback />;
    }
    return <Navigate to="/member-portal/login" />;
  }

  return <>{children}</>;
}

// =====================================================================
// GENERIC PROTECTED ROUTE - Protege por qualquer role
// =====================================================================
export function ProtectedRoute({ 
  children,
  requiredRole,
  fallback: Fallback
}: ProtectedRouteProps) {
  
  const token = localStorage.getItem('MEMBER_TOKEN_KEY');
  const role = localStorage.getItem('ADMIN_ROLE') || localStorage.getItem('MEMBER_ROLE');

  // Validar role
  if (!token || role !== requiredRole) {
    if (Fallback) {
      return <Fallback />;
    }
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

// =====================================================================
// HELPER: Hook para obter contexto de auth atual
// =====================================================================
export function useAuthContext() {
  const token = localStorage.getItem('MEMBER_TOKEN_KEY');
  const role = localStorage.getItem('ADMIN_ROLE') || localStorage.getItem('MEMBER_ROLE');
  const lodgeId = localStorage.getItem('ADMIN_LODGE_ID');
  const memberId = localStorage.getItem('MEMBER_ID');
  const email = localStorage.getItem('MEMBER_EMAIL');

  return {
    token,
    role,
    lodgeId,
    memberId,
    email,
    isLoggedIn: !!token,
    isAdmin: role === 'admin' && !!lodgeId,
    isSuperAdmin: role === 'super_admin',
    isMember: role === 'member',
  };
}

// =====================================================================
// HELPER: Logout que limpa localStorage e redireciona
// =====================================================================
export function useLogout() {
  return () => {
    localStorage.removeItem('MEMBER_TOKEN_KEY');
    localStorage.removeItem('MEMBER_REFRESH_TOKEN_KEY');
    localStorage.removeItem('ADMIN_ROLE');
    localStorage.removeItem('ADMIN_LODGE_ID');
    localStorage.removeItem('MEMBER_ROLE');
    localStorage.removeItem('MEMBER_ID');
    localStorage.removeItem('MEMBER_EMAIL');
    localStorage.removeItem('MEMBER_PROFILE_KEY');
    
    // Redirecionar para login apropriado
    window.location.href = '/login';
  };
}

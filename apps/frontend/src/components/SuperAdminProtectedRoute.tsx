import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useSuperAdminAuth } from '@/contexts/SuperAdminContext';

interface SuperAdminProtectedRouteProps {
  children: ReactNode;
}

/**
 * Componente que protege rotas do Super Admin
 * Verifica se o usuário tem token válido antes de renderizar
 * 
 * Uso:
 * <SuperAdminProtectedRoute>
 *   <SuperAdminDashboard />
 * </SuperAdminProtectedRoute>
 */
export default function SuperAdminProtectedRoute({
  children,
}: SuperAdminProtectedRouteProps) {
  const { isLoggedIn } = useSuperAdminAuth();
  const [, navigate] = useLocation();

  if (!isLoggedIn) {
    navigate('/super-admin/login');
    return null;
  }

  return <>{children}</>;
}

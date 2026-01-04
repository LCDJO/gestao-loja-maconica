import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useSuperAdminAuth } from '@/contexts/SuperAdminContext';

interface SuperAdminProtectedRouteProps {
  children: ReactNode;
}

/**
 * Componente que protege rotas do Super Admin
 * Verifica se o usuário tem token válido antes de renderizar
 * Mostra loading enquanto valida o token com o backend
 * 
 * Uso:
 * <SuperAdminProtectedRoute>
 *   <SuperAdminDashboard />
 * </SuperAdminProtectedRoute>
 */
export default function SuperAdminProtectedRoute({
  children,
}: SuperAdminProtectedRouteProps) {
  const { isLoggedIn, isInitialized } = useSuperAdminAuth();
  const [, navigate] = useLocation();

  // Enquanto o context está sendo inicializado, mostra loading
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Validando acesso...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    navigate('/super-admin/login');
    return null;
  }

  return <>{children}</>;
}

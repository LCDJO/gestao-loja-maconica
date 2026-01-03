import { ReactNode } from 'react';
import { useLocation } from 'wouter';

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
  const [, navigate] = useLocation();

  // Verificar se token existe
  const token = localStorage.getItem('superAdminToken');
  
  if (!token) {
    // Redirecionar para login se sem token
    navigate('/super-admin/login');
    return null;
  }

  try {
    // Tentar fazer parse do token (é um JSON no momento)
    const parsedToken = JSON.parse(token);
    
    // Verificar se tem campos obrigatórios
    if (!parsedToken.email || !parsedToken.role) {
      throw new Error('Token inválido');
    }

    // Token válido, renderizar página protegida
    return <>{children}</>;
  } catch (error) {
    // Token inválido, fazer logout
    console.error('Token inválido:', error);
    localStorage.removeItem('superAdminToken');
    navigate('/super-admin/login');
    return null;
  }
}

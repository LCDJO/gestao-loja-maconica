import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { userPermissionsStore } from '@/lib/store';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: keyof ReturnType<typeof userPermissionsStore.getCurrentUser>['permissions'];
  requiredRole?: 'admin' | 'tesoureiro' | 'secretario' | 'visualizador' | 'membro';
  fallback?: ReactNode;
}

export default function ProtectedRoute({
  children,
  requiredPermission,
  requiredRole,
  fallback,
}: ProtectedRouteProps) {
  const [, navigate] = useLocation();
  const user = userPermissionsStore.getCurrentUser();

  // Verificar role
  if (requiredRole && user.role !== requiredRole) {
    if (requiredRole === 'admin' && user.role !== 'admin') {
      // Redirecionar para home se não for admin
      navigate('/');
      return fallback || (
        <div className="p-8 text-center">
          <p className="text-red-600">Acesso negado. Você não tem permissão para acessar esta página.</p>
        </div>
      );
    }
  }

  // Verificar permissão específica
  if (requiredPermission && !user.permissions[requiredPermission]) {
    navigate('/');
    return fallback || (
      <div className="p-8 text-center">
        <p className="text-red-600">Acesso negado. Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return <>{children}</>;
}

import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useMemberAuth } from '@/contexts/MemberAuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'aprendiz' | 'companheiro' | 'mestre';
}

/**
 * Componente que protege rotas do Portal do Irmão
 * Verifica se o usuário está autenticado antes de permitir acesso
 */
export function ProtectedMemberRoute({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { isLoggedIn, currentMember, isLoading } = useMemberAuth();

  // Em localhost, não validar - permitir acesso direto
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Enquanto carrega a sessão (exceto localhost)
  if (isLoading && !isLocalhost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-blue-200 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, redireciona para login (exceto localhost)
  if (!isLoggedIn && !isLocalhost) {
    setLocation('/member-portal/auth/login');
    return null;
  }

  // Se requer role específica e não possui (exceto localhost)
  if (requiredRole && currentMember?.degree !== requiredRole && !isLocalhost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-medium">Acesso não autorizado</p>
          <p className="text-gray-600 text-sm mt-2">Você não possui permissão para acessar esta página</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedMemberRoute;

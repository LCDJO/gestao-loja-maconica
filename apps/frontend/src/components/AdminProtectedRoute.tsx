import { ReactNode } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/contexts/AdminContext";

interface AdminProtectedRouteProps {
  children: ReactNode;
}

/**
 * Componente que protege rotas do Admin da loja
 * Verifica se o usuário tem token válido antes de renderizar
 * Mostra loading enquanto valida o token com o backend
 * 
 * Uso:
 * <AdminProtectedRoute>
 *   <AdminDashboard />
 * </AdminProtectedRoute>
 */
export default function AdminProtectedRoute({
  children,
}: AdminProtectedRouteProps) {
  const { isLoggedIn, isInitialized } = useAdminAuth();
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
    navigate("/admin/login");
    return null;
  }

  return <>{children}</>;
}

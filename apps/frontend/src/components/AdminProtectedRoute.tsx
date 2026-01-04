import { ReactNode } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/contexts/AdminContext";

interface AdminProtectedRouteProps {
  children: ReactNode;
}

/**
 * Componente que protege rotas do Admin da loja
 * Verifica se o usuário tem token válido antes de renderizar
 * 
 * Uso:
 * <AdminProtectedRoute>
 *   <AdminDashboard />
 * </AdminProtectedRoute>
 */
export default function AdminProtectedRoute({
  children,
}: AdminProtectedRouteProps) {
  const { isLoggedIn } = useAdminAuth();
  const [, navigate] = useLocation();

  if (!isLoggedIn) {
    navigate("/admin/login");
    return null;
  }

  return <>{children}</>;
}

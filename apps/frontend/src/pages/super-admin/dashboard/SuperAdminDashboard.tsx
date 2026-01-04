import { useEffect } from "react";
import { useSuperAdminAuth } from "@/contexts/SuperAdminContext";
import { useLocation } from "wouter";

export default function SuperAdminDashboard() {
  const { isLoggedIn, user, logout } = useSuperAdminAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/super-admin/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/super-admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super-Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Painel de Controle SaaS</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{user?.email}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total de Lojas</h3>
            <p className="text-3xl font-bold text-purple-600">12</p>
            <p className="text-sm text-gray-600 mt-2">Gerenciadas pelo SaaS</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Super-Admins</h3>
            <p className="text-3xl font-bold text-blue-600">3</p>
            <p className="text-sm text-gray-600 mt-2">Usuários com acesso total</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Membros Totais</h3>
            <p className="text-3xl font-bold text-green-600">1,850</p>
            <p className="text-sm text-gray-600 mt-2">Em todas as lojas</p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">✅ Autenticação OK</h3>
          <p className="text-blue-800">
            Você está logado como <strong>{user?.email}</strong> com permissões de{" "}
            <strong>Super-Admin</strong>.
          </p>
          <p className="text-blue-800 mt-2">
            Pode gerenciar todas as lojas, usuários e configurações do SaaS.
          </p>
        </div>

        {/* Features */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Funcionalidades Disponíveis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="font-semibold text-gray-900">📊 Gerenciar Lojas</p>
              <p className="text-sm text-gray-600">Criar, editar e deletar lojas</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="font-semibold text-gray-900">👥 Gerenciar Admins</p>
              <p className="text-sm text-gray-600">Criar e gerenciar admins de lojas</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="font-semibold text-gray-900">📈 Analytics Global</p>
              <p className="text-sm text-gray-600">Ver métricas de todas as lojas</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="font-semibold text-gray-900">⚙️ Configurações</p>
              <p className="text-sm text-gray-600">Configurar sistema globalmente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

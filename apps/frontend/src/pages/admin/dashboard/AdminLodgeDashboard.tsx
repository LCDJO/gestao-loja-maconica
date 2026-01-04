import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/contexts/AdminContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Users, DollarSign, FileText, Settings } from "lucide-react";

export default function AdminLodgeDashboard() {
  const { isLoggedIn, user, logout } = useAdminAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/admin/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{user.lodgeName}</h1>
            <p className="text-blue-100">Painel Administrativo da Loja</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-blue-100">Logado como</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-red-500 hover:bg-red-600 text-white border-none"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Info Box */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">✅ Autenticação de Administrador</CardTitle>
            <CardDescription>Você está logado como administrador desta loja</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Loja</p>
                <p className="font-semibold text-gray-900">{user.lodgeName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ID da Loja</p>
                <p className="font-mono text-gray-900">{user.lodgeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Perfil</p>
                <p className="font-semibold text-blue-600">ADMINISTRADOR</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Membros Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">287</div>
              <p className="text-xs text-gray-500 mt-1">↑ 12% este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Receita Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">R$ 8.450</div>
              <p className="text-xs text-gray-500 mt-1">Até 29 de janeiro</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">R$ 2.150</div>
              <p className="text-xs text-gray-500 mt-1">Este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">45</div>
              <p className="text-xs text-gray-500 mt-1">Arquivos armazenados</p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle className="text-base">Membros</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Gerenciar membros e permissões</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <DollarSign className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle className="text-base">Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Receitas, despesas e relatórios</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <FileText className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle className="text-base">Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Arquivos e registro de atas</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Settings className="w-8 h-8 text-gray-600 mb-2" />
              <CardTitle className="text-base">Configurações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Dados e integrações da loja</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <FileText className="w-8 h-8 text-orange-600 mb-2" />
              <CardTitle className="text-base">Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Análises e estatísticas</p>
            </CardContent>
          </Card>
        </div>

        {/* Development Note */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Nota de Desenvolvimento:</strong> Este é um dashboard de protótipo. Funcionalidades completas serão implementadas nas próximas fases. Todas as páginas estão vinculadas ao contexto de autenticação AdminContext.
          </p>
        </div>
      </div>
    </div>
  );
}

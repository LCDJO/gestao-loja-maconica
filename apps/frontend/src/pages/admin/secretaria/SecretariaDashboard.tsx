import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Users, Plus, Search, Eye } from "lucide-react";

export default function SecretariaDashboard() {
  return (
    <DashboardLayout title="Secretaria" subtitle="Gestão de membros, candidatos, sessões e usuários">
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Membros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,234</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Candidatos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">45</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Sessões Marcadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Usuários do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">89</div>
            </CardContent>
          </Card>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Membros da Loja
              </CardTitle>
              <CardDescription>Gestão de irmãos e membros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/admin/secretaria/membros"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Listar Membros</span>
                </a>
                <a
                  href="/admin/secretaria/membros/novo"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4 text-green-600" />
                  <span>Novo Membro</span>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Candidatos
              </CardTitle>
              <CardDescription>Gerenciar candidatos à iniciação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/admin/secretaria/candidatos"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4 text-orange-600" />
                  <span>Ver Candidatos</span>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessões</CardTitle>
              <CardDescription>Agenda de sessões maçônicas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/admin/secretaria/sessoes"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <span>Gerenciar Sessões</span>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usuários</CardTitle>
              <CardDescription>Gestão de usuários do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/admin/secretaria/usuarios"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>Gerenciar Usuários</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Landmark, Users } from "lucide-react";

export default function PresidenciaDashboard() {
  return (
    <DashboardLayout title="Presidência" subtitle="Administrações e comissões">
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Administrações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Comissões Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Membros em Cargos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">156</div>
            </CardContent>
          </Card>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark className="w-5 h-5" />
                Administrações
              </CardTitle>
              <CardDescription>Histórico de administrações e mandatos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/admin/presidencia/administracoes"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <span>Gerenciar Administrações</span>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Comissões
              </CardTitle>
              <CardDescription>Gestão de comissões e suas atividades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/admin/presidencia/comissoes"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <span>Gerenciar Comissões</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

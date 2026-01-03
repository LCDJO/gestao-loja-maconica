import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CheckCircle, Calendar, Globe } from "lucide-react";

export default function ChancelariaDashboard() {
  return (
    <DashboardLayout title="Chancelaria" subtitle="Frequências, visitas e registros maçônicos">
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Taxa de Frequência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">87%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Presente Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,072</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Visitas Realizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">234</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Visitas Recebidas
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
                <CheckCircle className="w-5 h-5" />
                Frequências
              </CardTitle>
              <CardDescription>Controle de presença nas sessões</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/admin/chancelaria/frequencias"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <span>Registrar Frequência</span>
                </a>
                <a
                  href="/admin/chancelaria/diario"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <span>Diário de Frequência</span>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Visitas
              </CardTitle>
              <CardDescription>Gestão de visitas interlojas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/admin/chancelaria/visitas-realizadas"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <span>Visitas Realizadas</span>
                </a>
                <a
                  href="/admin/chancelaria/visitas-recebidas"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <span>Visitas Recebidas</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

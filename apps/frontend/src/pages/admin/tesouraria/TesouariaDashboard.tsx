import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { TrendingUp, TrendingDown, Landmark, LineChart } from "lucide-react";

export default function TesouariaDashboard() {
  return (
    <DashboardLayout title="Tesouraria" subtitle="Receitas, despesas, contas e extratos">
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Receitas (Mês)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">R$ 12.500</div>
              <p className="text-xs text-gray-500 mt-1">+15% vs. mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Despesas (Mês)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">R$ 8.750</div>
              <p className="text-xs text-gray-500 mt-1">-5% vs. mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Saldo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">R$ 45.230</div>
              <p className="text-xs text-gray-500 mt-1">Todas as contas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Taxa de Lucro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">30%</div>
              <p className="text-xs text-gray-500 mt-1">Meta: 35%</p>
            </CardContent>
          </Card>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Receitas
              </CardTitle>
              <CardDescription>Entrada de recursos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/admin/tesouraria/receitas"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <span>Gerenciar Receitas</span>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                Despesas
              </CardTitle>
              <CardDescription>Saída de recursos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/admin/tesouraria/despesas"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <span>Gerenciar Despesas</span>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark className="w-5 h-5" />
                Contas
              </CardTitle>
              <CardDescription>Gestão de contas bancárias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/admin/tesouraria/contas"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <span>Gerenciar Contas</span>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Extrato
              </CardTitle>
              <CardDescription>Histórico de movimentações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/admin/tesouraria/extrato"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <span>Ver Extrato</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardFinanceiro() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Dashboard Financeiro
            </h1>
            <p className="text-gray-600 mt-1">Visualize os dados financeiros de forma consolidada</p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="p-8">
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-blue-50 rounded-full">
              <BarChart3 className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Financeiro em Desenvolvimento</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Este módulo está sendo desenvolvido para exibir análises financeiras consolidadas.
            </p>
            <div className="pt-4">
              <p className="text-sm text-gray-500">Recursos planejados:</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>✓ Gráficos de receita e despesa</li>
                <li>✓ KPIs financeiros</li>
                <li>✓ Análise de tendências</li>
                <li>✓ Previsões e metas</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

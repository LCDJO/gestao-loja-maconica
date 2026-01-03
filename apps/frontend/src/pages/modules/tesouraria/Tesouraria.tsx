import { Banknote, TrendingUp, Landmark, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Link } from 'wouter';

export default function TesourariaDashboard() {
  const modules = [
    {
      title: "Fluxo Financeiro",
      description: "Acompanhe transações e movimentação de caixa",
      icon: TrendingUp,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      href: "/tesouraria/minhas-financas",
      items: ["Minhas Finanças", "Transações", "Movimentação", "Fluxo de Caixa"],
    },
    {
      title: "Gestão de Contas",
      description: "Gerencie contas bancárias e reconciliação",
      icon: Landmark,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      href: "/tesouraria/caixa",
      items: ["Tesouraria Geral", "Contas Bancárias", "Conciliação", "Contas a Pagar/Receber"],
    },
    {
      title: "Análise & Relatórios",
      description: "Visualize análises e previsões financeiras",
      icon: BarChart3,
      color: "bg-orange-50",
      iconColor: "text-orange-600",
      href: "/tesouraria/dashboard",
      items: ["Dashboard", "Relatórios", "ROI", "Análise de Churn", "Previsões"],
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 p-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Banknote className="h-8 w-8 text-purple-600" />
            </div>
            Tesouraria
          </h1>
          <p className="text-gray-600 mt-2">Gestão financeira, contas e análise de dados</p>
        </div>

        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Link key={module.title} href={module.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className={`${module.color} p-6 rounded-t-lg`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">{module.title}</h2>
                        <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                      </div>
                      <IconComponent className={`h-10 w-10 ${module.iconColor}`} />
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-2">
                      {module.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6" variant="outline">
                      Acessar →
                    </Button>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Resumo Rápido */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-purple-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo Financeiro</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Saldo Total</p>
              <p className="text-2xl font-bold text-purple-600">--</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Receitas (Mês)</p>
              <p className="text-2xl font-bold text-purple-600">--</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Despesas (Mês)</p>
              <p className="text-2xl font-bold text-purple-600">--</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

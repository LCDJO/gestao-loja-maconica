import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingDown,
  AlertTriangle,
  Users,
  DollarSign,
  Calendar,
  MessageSquare,
} from 'lucide-react';

interface ChurnedLodge {
  id: string;
  name: string;
  churnDate: Date;
  reason: string;
  monthsActive: number;
  totalSpent: number;
  plan: string;
  lastPaymentStatus: string;
}

interface ChurnData {
  month: string;
  churnRate: number;
  churnedLojas: number;
  activeLojas: number;
  revenue: number;
}

export default function RelatorioChurn() {
  const [activeTab, setActiveTab] = useState('overview');

  const churnData: ChurnData[] = [
    { month: 'Jan', churnRate: 2.1, churnedLojas: 3, activeLojas: 142, revenue: 28500 },
    { month: 'Fev', churnRate: 2.8, churnedLojas: 4, activeLojas: 141, revenue: 27800 },
    { month: 'Mar', churnRate: 1.9, churnedLojas: 3, activeLojas: 141, revenue: 28200 },
    { month: 'Abr', churnRate: 3.5, churnedLojas: 5, activeLojas: 139, revenue: 27100 },
    { month: 'Mai', churnRate: 2.2, churnedLojas: 3, activeLojas: 139, revenue: 27900 },
    { month: 'Jun', churnRate: 1.5, churnedLojas: 2, activeLojas: 140, revenue: 28600 },
  ];

  const churnReasons = [
    { name: 'Falta de uso', value: 35, color: '#ef4444' },
    { name: 'Custo elevado', value: 28, color: '#f97316' },
    { name: 'Mudança de plataforma', value: 18, color: '#eab308' },
    { name: 'Problemas técnicos', value: 12, color: '#3b82f6' },
    { name: 'Outros', value: 7, color: '#8b5cf6' },
  ];

  const churnedLojas: ChurnedLodge[] = [
    {
      id: '1',
      name: 'Loja Maçônica São Paulo',
      churnDate: new Date('2024-06-15'),
      reason: 'Falta de uso',
      monthsActive: 8,
      totalSpent: 2392,
      plan: 'Professional',
      lastPaymentStatus: 'Pago',
    },
    {
      id: '2',
      name: 'Loja Maçônica Rio de Janeiro',
      churnDate: new Date('2024-06-10'),
      reason: 'Custo elevado',
      monthsActive: 12,
      totalSpent: 3598,
      plan: 'Enterprise',
      lastPaymentStatus: 'Pago',
    },
    {
      id: '3',
      name: 'Loja Maçônica Minas Gerais',
      churnDate: new Date('2024-05-28'),
      reason: 'Mudança de plataforma',
      monthsActive: 5,
      totalSpent: 1495,
      plan: 'Basic',
      lastPaymentStatus: 'Pago',
    },
    {
      id: '4',
      name: 'Loja Maçônica Bahia',
      churnDate: new Date('2024-05-20'),
      reason: 'Problemas técnicos',
      monthsActive: 3,
      totalSpent: 897,
      plan: 'Basic',
      lastPaymentStatus: 'Atrasado',
    },
    {
      id: '5',
      name: 'Loja Maçônica Ceará',
      churnDate: new Date('2024-04-15'),
      reason: 'Falta de uso',
      monthsActive: 6,
      totalSpent: 1794,
      plan: 'Professional',
      lastPaymentStatus: 'Pago',
    },
  ];

  const riskLojas = [
    {
      id: '101',
      name: 'Loja Maçônica Pernambuco',
      daysWithoutLogin: 45,
      lastPaymentStatus: 'Atrasado',
      riskScore: 85,
      plan: 'Professional',
    },
    {
      id: '102',
      name: 'Loja Maçônica Paraná',
      daysWithoutLogin: 32,
      lastPaymentStatus: 'Pendente',
      riskScore: 72,
      plan: 'Basic',
    },
    {
      id: '103',
      name: 'Loja Maçônica Santa Catarina',
      daysWithoutLogin: 28,
      lastPaymentStatus: 'Pago',
      riskScore: 65,
      plan: 'Professional',
    },
  ];

  const totalChurned = churnedLojas.length;
  const totalRevenueLost = churnedLojas.reduce((sum, lodge) => sum + lodge.totalSpent, 0);
  const avgChurnMonths = Math.round(churnedLojas.reduce((sum, lodge) => sum + lodge.monthsActive, 0) / totalChurned);
  const currentChurnRate = churnData[churnData.length - 1].churnRate;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingDown className="h-8 w-8 text-red-600" />
              Relatório de Churn
            </h1>
            <p className="text-gray-600 text-sm mt-1">Análise de cancelamentos e lojas em risco</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Lojas Canceladas</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalChurned}</p>
                </div>
                <Users className="h-10 w-10 text-red-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Taxa de Churn (Mês)</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{currentChurnRate}%</p>
                </div>
                <TrendingDown className="h-10 w-10 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Receita Perdida</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">R$ {(totalRevenueLost / 1000).toFixed(1)}k</p>
                </div>
                <DollarSign className="h-10 w-10 text-red-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Tempo Médio (Meses)</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{avgChurnMonths}</p>
                </div>
                <Calendar className="h-10 w-10 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="motivos" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              Motivos de Cancelamento
            </TabsTrigger>
            <TabsTrigger value="risco" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              Lojas em Risco
            </TabsTrigger>
          </TabsList>

          {/* Aba Overview */}
          <TabsContent value="overview" className="space-y-6">
            {/* Gráfico de Churn ao Longo do Tempo */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Taxa de Churn ao Longo do Tempo</CardTitle>
                <CardDescription>Evolução mensal da taxa de cancelamento</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={churnData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="churnRate"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: '#ef4444', r: 4 }}
                      name="Taxa de Churn (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Lojas Ativas vs Canceladas */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Lojas Ativas vs Canceladas</CardTitle>
                <CardDescription>Comparação mensal</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={churnData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="activeLojas" fill="#3b82f6" name="Lojas Ativas" />
                    <Bar dataKey="churnedLojas" fill="#ef4444" name="Lojas Canceladas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tabela de Lojas Canceladas */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Lojas Canceladas Recentemente</CardTitle>
                <CardDescription>Últimas 5 lojas que cancelaram o serviço</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Loja</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Motivo</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Plano</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Meses</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Gasto Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {churnedLojas.map(lodge => (
                        <tr key={lodge.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{lodge.name}</td>
                          <td className="py-3 px-4 text-gray-600">{lodge.churnDate.toLocaleDateString('pt-BR')}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              {lodge.reason}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{lodge.plan}</td>
                          <td className="py-3 px-4 text-gray-600">{lodge.monthsActive}</td>
                          <td className="py-3 px-4 font-medium text-gray-900">R$ {lodge.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Motivos */}
          <TabsContent value="motivos" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Distribuição de Motivos de Cancelamento</CardTitle>
                <CardDescription>Análise dos principais motivos de churn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={churnReasons}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {churnReasons.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="space-y-4">
                    {churnReasons.map((reason, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: reason.color }}
                        ></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{reason.name}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${reason.value}%`,
                                backgroundColor: reason.color,
                              }}
                            ></div>
                          </div>
                        </div>
                        <p className="font-medium text-gray-900">{reason.value}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Lojas em Risco */}
          <TabsContent value="risco" className="space-y-6">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900">Atenção</h3>
                    <p className="text-sm text-yellow-800 mt-1">
                      {riskLojas.length} lojas apresentam alto risco de cancelamento. Recomendamos entrar em contato para oferecer suporte.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Lojas em Risco de Cancelamento</CardTitle>
                <CardDescription>Lojas com inatividade ou pagamentos atrasados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskLojas.map(lodge => (
                    <div key={lodge.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{lodge.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{lodge.plan}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-600">{lodge.riskScore}</div>
                          <p className="text-xs text-gray-600">Risco</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Sem login</p>
                          <p className="font-medium text-gray-900">{lodge.daysWithoutLogin} dias</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Pagamento</p>
                          <p className={`font-medium ${lodge.lastPaymentStatus === 'Atrasado' ? 'text-red-600' : lodge.lastPaymentStatus === 'Pendente' ? 'text-yellow-600' : 'text-green-600'}`}>
                            {lodge.lastPaymentStatus}
                          </p>
                        </div>
                        <div className="text-right">
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                            Contatar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

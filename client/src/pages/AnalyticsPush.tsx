import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Send, CheckCircle, Eye, MousePointer, AlertCircle } from "lucide-react";
import { pushNotificationEventStore, pushNotificationCampaignStore } from "@/lib/store";

export default function AnalyticsPush() {
  const stats = pushNotificationEventStore.getRecentStats(30);
  const campaigns = pushNotificationCampaignStore.getAll();

  // Dados para gráfico de tendência
  const trendData = [
    { day: 'Seg', sent: 45, delivered: 42, opened: 28, clicked: 12 },
    { day: 'Ter', sent: 52, delivered: 50, opened: 35, clicked: 18 },
    { day: 'Qua', sent: 48, delivered: 46, opened: 32, clicked: 16 },
    { day: 'Qui', sent: 61, delivered: 59, opened: 42, clicked: 24 },
    { day: 'Sex', sent: 55, delivered: 53, opened: 38, clicked: 20 },
    { day: 'Sab', sent: 38, delivered: 35, opened: 22, clicked: 10 },
    { day: 'Dom', sent: 32, delivered: 30, opened: 18, clicked: 8 },
  ];

  // Dados para gráfico de funil
  const funnelData = [
    { name: 'Enviadas', value: stats.sent, fill: '#3b82f6' },
    { name: 'Entregues', value: stats.delivered, fill: '#10b981' },
    { name: 'Abertas', value: stats.opened, fill: '#f59e0b' },
    { name: 'Clicadas', value: stats.clicked, fill: '#8b5cf6' },
  ];

  // Dados por tipo de notificação
  const typeData = [
    { name: 'Comunicados', value: 45, color: '#3b82f6' },
    { name: 'Reuniões', value: 30, color: '#8b5cf6' },
    { name: 'Sistema', value: 25, color: '#ef4444' },
  ];

  const KPICard = ({ icon: Icon, label, value, change }: any) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {change && (
              <p className={`text-xs mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '↑' : '↓'} {Math.abs(change)}% vs semana anterior
              </p>
            )}
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics de Notificações Push</h1>
            <p className="text-slate-600 mt-2">Rastreamento de entrega, abertura e engajamento</p>
          </div>
          <TrendingUp className="h-12 w-12 text-blue-600 opacity-20" />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard 
            icon={Send} 
            label="Notificações Enviadas" 
            value={stats.sent}
            change={12}
          />
          <KPICard 
            icon={CheckCircle} 
            label="Taxa de Entrega" 
            value={`${stats.deliveryRate}%`}
            change={5}
          />
          <KPICard 
            icon={Eye} 
            label="Taxa de Abertura" 
            value={`${stats.openRate}%`}
            change={-3}
          />
          <KPICard 
            icon={MousePointer} 
            label="Taxa de Cliques" 
            value={`${stats.clickRate}%`}
            change={8}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tendência */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Engajamento</CardTitle>
              <CardDescription>Últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sent" stroke="#3b82f6" name="Enviadas" />
                  <Line type="monotone" dataKey="delivered" stroke="#10b981" name="Entregues" />
                  <Line type="monotone" dataKey="opened" stroke="#f59e0b" name="Abertas" />
                  <Line type="monotone" dataKey="clicked" stroke="#8b5cf6" name="Clicadas" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Funil de Conversão */}
          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão</CardTitle>
              <CardDescription>Distribuição de eventos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição por Tipo */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Tipo</CardTitle>
              <CardDescription>Notificações por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resumo de Campanhas */}
          <Card>
            <CardHeader>
              <CardTitle>Campanhas Recentes</CardTitle>
              <CardDescription>{campaigns.length} campanhas no total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {campaigns.slice(0, 5).map(campaign => {
                  const campaignStats = pushNotificationCampaignStore.getCampaignStats(campaign.id);
                  return (
                    <div key={campaign.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{campaign.name}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {campaign.totalRecipients} destinatários
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-blue-600">
                            {campaignStats?.deliveryRate || 0}%
                          </p>
                          <p className="text-xs text-gray-500">entrega</p>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${campaignStats?.deliveryRate || 0}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes de Eventos */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Eventos</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Enviadas</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.sent}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Entregues</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.delivered}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600">Abertas</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.opened}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Clicadas</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.clicked}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Falhas</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

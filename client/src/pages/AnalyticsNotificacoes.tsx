import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Mail, Bell, MessageCircle, Phone, TrendingUp, Eye } from 'lucide-react';
import { notificationMetricsStore } from '@/lib/store';
import { NotificationAnalytics } from '@/lib/types';

const COLORS = ['#1e3a8a', '#d4af37', '#059669', '#dc2626'];

export default function AnalyticsNotificacoes() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [analytics, setAnalytics] = useState<NotificationAnalytics | null>(null);

  useEffect(() => {
    const data = notificationMetricsStore.getAnalytics(startDate, endDate);
    setAnalytics(data);
  }, [startDate, endDate]);

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Carregando...</div>
      </DashboardLayout>
    );
  }

  // Dados para gráficos
  const channelData = [
    { name: 'Email', ...analytics.channels.email },
    { name: 'Push', ...analytics.channels.push },
    { name: 'WhatsApp', ...analytics.channels.whatsapp },
    { name: 'SMS', ...analytics.channels.sms },
  ];

  const billTypeData = [
    { name: 'Mensalidade', value: analytics.byBillType.mensalidade.sent },
    { name: 'Mútua', value: analytics.byBillType.mutua.sent },
    { name: 'Taxa', value: analytics.byBillType.taxa.sent },
    { name: 'Outro', value: analytics.byBillType.outro.sent },
  ];

  const deliveryRateData = [
    { name: 'Email', rate: analytics.channels.email.deliveryRate },
    { name: 'Push', rate: analytics.channels.push.deliveryRate },
    { name: 'WhatsApp', rate: analytics.channels.whatsapp.deliveryRate },
    { name: 'SMS', rate: analytics.channels.sms.deliveryRate },
  ];

  const openRateData = [
    { name: 'Email', rate: analytics.channels.email.openRate },
    { name: 'Push', rate: analytics.channels.push.openRate },
    { name: 'WhatsApp', rate: analytics.channels.whatsapp.openRate },
    { name: 'SMS', rate: analytics.channels.sms.openRate },
  ];

  const clickRateData = [
    { name: 'Email', rate: analytics.channels.email.clickRate },
    { name: 'Push', rate: analytics.channels.push.clickRate },
    { name: 'WhatsApp', rate: analytics.channels.whatsapp.clickRate },
    { name: 'SMS', rate: analytics.channels.sms.clickRate },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">
            Analytics de Notificações
          </h1>
          <p className="text-muted-foreground font-serif italic mt-1">
            Acompanhe o desempenho de suas notificações por canal e tipo de cobrança
          </p>
        </div>

        {/* Filtros de Data */}
        <Card>
          <CardHeader>
            <CardTitle>Período de Análise</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data Inicial</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data Final</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Enviado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalNotificationsSent}</div>
              <p className="text-xs text-muted-foreground mt-1">notificações</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.totalNotificationsSent > 0
                  ? ((analytics.totalDelivered / analytics.totalNotificationsSent) * 100).toFixed(1)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.totalDelivered} entregues
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Abertura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.totalDelivered > 0
                  ? ((analytics.totalOpened / analytics.totalDelivered) * 100).toFixed(1)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.totalOpened} abertos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Cliques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.totalOpened > 0
                  ? ((analytics.totalClicked / analytics.totalOpened) * 100).toFixed(1)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.totalClicked} cliques
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="canais" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="canais">Por Canal</TabsTrigger>
            <TabsTrigger value="tiposCobranca">Por Tipo de Cobrança</TabsTrigger>
            <TabsTrigger value="taxas">Taxas de Conversão</TabsTrigger>
          </TabsList>

          <TabsContent value="canais" className="space-y-6">
            {/* Gráfico de Notificações por Canal */}
            <Card>
              <CardHeader>
                <CardTitle>Notificações Enviadas por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={channelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sent" fill="#1e3a8a" name="Enviados" />
                    <Bar dataKey="delivered" fill="#059669" name="Entregues" />
                    <Bar dataKey="failed" fill="#dc2626" name="Falhados" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tabela de Métricas por Canal */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channelData.map((channel) => (
                    <div key={channel.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground">{channel.name}</h3>
                        <span className="text-sm text-muted-foreground">
                          {channel.sent} enviados
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Taxa Entrega</p>
                          <p className="text-lg font-semibold text-primary">
                            {channel.deliveryRate.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Taxa Abertura</p>
                          <p className="text-lg font-semibold text-primary">
                            {channel.openRate.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Taxa Cliques</p>
                          <p className="text-lg font-semibold text-primary">
                            {channel.clickRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tiposCobranca" className="space-y-6">
            {/* Gráfico Pizza de Tipos de Cobrança */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Tipo de Cobrança</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={billTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {billTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tabela de Métricas por Tipo de Cobrança */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes por Tipo de Cobrança</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.byBillType).map(([type, metrics]) => (
                    <div key={type} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground capitalize">{type}</h3>
                        <span className="text-sm text-muted-foreground">
                          {metrics.sent} enviados
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Taxa Entrega</p>
                          <p className="text-lg font-semibold text-primary">
                            {metrics.deliveryRate.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Taxa Abertura</p>
                          <p className="text-lg font-semibold text-primary">
                            {metrics.openRate.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Taxa Cliques</p>
                          <p className="text-lg font-semibold text-primary">
                            {metrics.clickRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="taxas" className="space-y-6">
            {/* Gráfico de Taxa de Entrega */}
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Entrega por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={deliveryRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value: any) => `${Number(value).toFixed(1)}%`} />
                    <Bar dataKey="rate" fill="#059669" name="Taxa (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Taxa de Abertura */}
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Abertura por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={openRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value: any) => `${Number(value).toFixed(1)}%`} />
                    <Bar dataKey="rate" fill="#1e3a8a" name="Taxa (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Taxa de Cliques */}
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Cliques por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clickRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value: any) => `${Number(value).toFixed(1)}%`} />
                    <Bar dataKey="rate" fill="#d4af37" name="Taxa (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

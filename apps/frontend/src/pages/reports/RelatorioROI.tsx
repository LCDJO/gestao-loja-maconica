import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { TrendingUp, DollarSign, Target, Zap } from 'lucide-react';
import { roiStore } from '@/lib/store';
import { NotificationROI } from '@/lib/types';

const COLORS = ['#1e3a8a', '#d4af37', '#059669', '#dc2626'];

export default function RelatorioROI() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [roi, setROI] = useState<NotificationROI | null>(null);

  useEffect(() => {
    const data = roiStore.calculateROI(startDate, endDate);
    setROI(data);
  }, [startDate, endDate]);

  if (!roi) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Carregando...</div>
      </DashboardLayout>
    );
  }

  // Dados para gráficos
  const channelROIData = [
    { name: 'Email', roi: roi.channels.email.roi, revenue: roi.channels.email.revenue },
    { name: 'Push', roi: roi.channels.push.roi, revenue: roi.channels.push.revenue },
    { name: 'WhatsApp', roi: roi.channels.whatsapp.roi, revenue: roi.channels.whatsapp.revenue },
    { name: 'SMS', roi: roi.channels.sms.roi, revenue: roi.channels.sms.revenue },
  ];

  const conversionData = [
    { name: 'Email', conversion: roi.channels.email.conversionRate },
    { name: 'Push', conversion: roi.channels.push.conversionRate },
    { name: 'WhatsApp', conversion: roi.channels.whatsapp.conversionRate },
    { name: 'SMS', conversion: roi.channels.sms.conversionRate },
  ];

  const costData = [
    { name: 'Email', cost: roi.channels.email.cost, revenue: roi.channels.email.revenue },
    { name: 'Push', cost: roi.channels.push.cost, revenue: roi.channels.push.revenue },
    { name: 'WhatsApp', cost: roi.channels.whatsapp.cost, revenue: roi.channels.whatsapp.revenue },
    { name: 'SMS', cost: roi.channels.sms.cost, revenue: roi.channels.sms.revenue },
  ];

  const revenueData = [
    { name: 'Email', value: roi.channels.email.revenue },
    { name: 'Push', value: roi.channels.push.revenue },
    { name: 'WhatsApp', value: roi.channels.whatsapp.revenue },
    { name: 'SMS', value: roi.channels.sms.revenue },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">
            Relatório de ROI
          </h1>
          <p className="text-muted-foreground font-serif italic mt-1">
            Análise de retorno sobre investimento em campanhas de notificação
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
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Receita Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {roi.totalRevenue.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {roi.totalCampaigns} campanhas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Custo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {roi.totalCost.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {roi.totalSent} notificações
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Conversões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roi.totalConverted}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {roi.totalSent > 0 ? ((roi.totalConverted / roi.totalSent) * 100).toFixed(2) : 0}% de taxa
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                ROI Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +{roi.overallROI.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Melhor canal: {roi.bestPerformingChannel}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="roi" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="roi">ROI por Canal</TabsTrigger>
            <TabsTrigger value="conversao">Taxa de Conversão</TabsTrigger>
            <TabsTrigger value="receita">Análise de Receita</TabsTrigger>
          </TabsList>

          <TabsContent value="roi" className="space-y-6">
            {/* Gráfico de ROI */}
            <Card>
              <CardHeader>
                <CardTitle>ROI por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={channelROIData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => `${value.toFixed(1)}%`} />
                    <Bar dataKey="roi" fill="#059669" name="ROI (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tabela de ROI Detalhado */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes de ROI por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(roi.channels).map(([channel, metrics]) => (
                    <div key={channel} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground capitalize">{channel}</h3>
                        <span className={`text-lg font-bold ${metrics.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {metrics.roi >= 0 ? '+' : ''}{metrics.roi.toFixed(1)}%
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Campanhas</p>
                          <p className="font-semibold">{metrics.campaigns}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Receita</p>
                          <p className="font-semibold">R$ {metrics.revenue.toLocaleString('pt-BR')}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Custo</p>
                          <p className="font-semibold">R$ {metrics.cost.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Lucro</p>
                          <p className="font-semibold text-green-600">
                            R$ {(metrics.revenue - metrics.cost).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversao" className="space-y-6">
            {/* Gráfico de Taxa de Conversão */}
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Conversão por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conversionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value: any) => `${value.toFixed(2)}%`} />
                    <Bar dataKey="conversion" fill="#1e3a8a" name="Taxa (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Custo por Conversão */}
            <Card>
              <CardHeader>
                <CardTitle>Custo por Conversão</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(roi.channels).map(([name, metrics]) => ({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    cost: metrics.costPerConversion,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => `R$ ${value.toFixed(2)}`} />
                    <Bar dataKey="cost" fill="#dc2626" name="Custo (R$)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receita" className="space-y-6">
            {/* Gráfico Pizza de Receita */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Receita por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: R$ ${value.toLocaleString('pt-BR')}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `R$ ${value.toLocaleString('pt-BR')}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Custo vs Receita */}
            <Card>
              <CardHeader>
                <CardTitle>Custo vs Receita por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={costData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => `R$ ${value.toLocaleString('pt-BR')}`} />
                    <Legend />
                    <Bar dataKey="cost" fill="#dc2626" name="Custo" />
                    <Bar dataKey="revenue" fill="#059669" name="Receita" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Resumo de Receita */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo de Receita por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(roi.channels).map(([channel, metrics]) => (
                    <div key={channel} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground capitalize">{channel}</h3>
                        <span className="text-lg font-bold text-green-600">
                          R$ {metrics.revenue.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Enviados</p>
                          <p className="font-semibold">{metrics.sent}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Conversões</p>
                          <p className="font-semibold">{metrics.converted}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Receita/Enviado</p>
                          <p className="font-semibold">R$ {metrics.revenuePerSent.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, DollarSign, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { memberStore, billingStore, meetingStore } from "@/lib/store";
import { exportDashboardReport, exportToCSV } from "@/lib/exportUtils";
import { Download } from "lucide-react";

export default function DashboardExecutivo() {
  const [members, setMembers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    monthlyRevenue: 0,
    complianceRate: 0,
    nextMeetings: [] as any[]
  });

  useEffect(() => {
    const allMembers = memberStore.getAll();
    setMembers(allMembers);

    const activeMembers = allMembers.filter(m => m.status === 'ativo').length;
    const monthlyRevenue = 15000; // Simulado
    const complianceRate = (activeMembers / allMembers.length) * 100;
    const nextMeetings = [
      { date: '2024-06-15', title: 'Sessão Magna de Iniciação', time: '19:00' },
      { date: '2024-06-22', title: 'Reunião Administrativa', time: '20:00' },
      { date: '2024-06-29', title: 'Sessão Ordinária', time: '19:30' }
    ];

    setStats({
      totalMembers: allMembers.length,
      activeMembers,
      monthlyRevenue,
      complianceRate,
      nextMeetings
    });
  }, []);

  // Dados de receita dos últimos 6 meses
  const revenueData = [
    { month: 'Jan', revenue: 12000, target: 15000 },
    { month: 'Fev', revenue: 13500, target: 15000 },
    { month: 'Mar', revenue: 14200, target: 15000 },
    { month: 'Abr', revenue: 15000, target: 15000 },
    { month: 'Mai', revenue: 14800, target: 15000 },
    { month: 'Jun', revenue: 15000, target: 15000 }
  ];

  // Dados de conformidade de pagamentos
  const complianceData = [
    { name: 'Adimplentes', value: Math.round(stats.activeMembers * 0.85), fill: '#10b981' },
    { name: 'Inadimplentes', value: Math.round(stats.activeMembers * 0.15), fill: '#ef4444' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard Executivo</h1>
            <p className="text-slate-600 mt-2">Visão geral dos indicadores-chave da loja</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => exportDashboardReport(stats, 'dashboard-executivo')}
              className="gap-2"
            >
              <Download className="h-4 w-4" /> Exportar PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const data = [
                  { metrica: 'Total de Membros', valor: stats.totalMembers },
                  { metrica: 'Membros Ativos', valor: stats.activeMembers },
                  { metrica: 'Receita Mensal', valor: `R$ ${stats.monthlyRevenue.toLocaleString('pt-BR')}` },
                  { metrica: 'Taxa de Conformidade', valor: `${stats.complianceRate.toFixed(1)}%` }
                ];
                exportToCSV(data, 'dashboard-executivo');
              }}
              className="gap-2"
            >
              <Download className="h-4 w-4" /> Exportar Excel
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" /> Total de Membros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-green-600">+{stats.activeMembers} ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" /> Arrecadação Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.monthlyRevenue.toLocaleString('pt-BR')}</div>
              <p className="text-xs text-green-600">Meta atingida</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Taxa Adimplência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.complianceRate.toFixed(1)}%</div>
              <p className="text-xs text-green-600">Excelente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Próxima Reunião
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">15 de Junho</div>
              <p className="text-xs text-muted-foreground">Sessão Magna</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="revenue">Arrecadação</TabsTrigger>
            <TabsTrigger value="compliance">Adimplência</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Arrecadação vs Meta</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Arrecadação" />
                    <Line type="monotone" dataKey="target" stroke="#10b981" name="Meta" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Status de Adimplência</CardTitle>
                <CardDescription>Membros ativos</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={complianceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {complianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Próximas Reuniões */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Próximas Reuniões
            </CardTitle>
            <CardDescription>Sessões agendadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.nextMeetings.map((meeting, idx) => (
                <div key={idx} className="flex items-start justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{meeting.title}</p>
                    <p className="text-sm text-muted-foreground">{meeting.date} às {meeting.time}</p>
                  </div>
                  <Button variant="outline" size="sm">Detalhes</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <AlertCircle className="h-5 w-5" /> Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-yellow-800">3 membros com mensalidade atrasada</p>
            <p className="text-sm text-yellow-800">Próxima reunião em 5 dias</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

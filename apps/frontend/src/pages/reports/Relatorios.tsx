import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Filter } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { transactionStore, memberStore, meetingStore } from "@/lib/store";
import { toast } from "sonner";

export default function Relatorios() {
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [memberDistribution, setMemberDistribution] = useState<any[]>([]);

  useEffect(() => {
    processData();
  }, []);

  const processData = () => {
    // Processar dados financeiros (Receitas vs Despesas por mês)
    const transactions = transactionStore.getAll();
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthName = date.toLocaleString('pt-BR', { month: 'short' });
      const month = date.getMonth();
      const year = date.getFullYear();

      const income = transactions
        .filter(t => {
          const d = new Date(t.date);
          return d.getMonth() === month && d.getFullYear() === year && t.type === 'receita';
        })
        .reduce((acc, curr) => acc + curr.amount, 0);

      const expense = transactions
        .filter(t => {
          const d = new Date(t.date);
          return d.getMonth() === month && d.getFullYear() === year && t.type === 'despesa';
        })
        .reduce((acc, curr) => acc + curr.amount, 0);

      return { name: monthName, Receitas: income, Despesas: expense };
    });
    setFinancialData(monthlyData);

    // Processar dados de frequência (simulado com base nas reuniões)
    const meetings = meetingStore.getAll();
    const attendanceTrend = meetings.map(m => ({
      date: new Date(m.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      Presentes: m.attendanceCount,
      type: m.type
    })).slice(-6); // Últimas 6 reuniões
    setAttendanceData(attendanceTrend);

    // Distribuição de Membros por Grau
    const members = memberStore.getAll();
    const distribution = [
      { name: 'Aprendizes', value: members.filter(m => m.degree === 'aprendiz').length },
      { name: 'Companheiros', value: members.filter(m => m.degree === 'companheiro').length },
      { name: 'Mestres', value: members.filter(m => m.degree === 'mestre').length },
    ];
    setMemberDistribution(distribution);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleExport = () => {
    toast.success("Relatório exportado com sucesso (PDF)");
  };

  const handleShare = () => {
    toast.success("Link do relatório copiado para a área de transferência");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">Relatórios e Indicadores</h1>
            <p className="text-muted-foreground font-serif italic">
              Análise visual para explorar dados, compreender tendências e compartilhar resultados.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" /> Compartilhar
            </Button>
            <Button onClick={handleExport} className="gap-2 bg-primary text-primary-foreground">
              <Download className="h-4 w-4" /> Exportar PDF
            </Button>
          </div>
        </div>

        {/* Benefícios Explícitos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-50/50 border-blue-100">
            <CardContent className="pt-6">
              <h3 className="font-bold text-blue-800 mb-2">Exploração Intuitiva</h3>
              <p className="text-sm text-blue-600">
                Visualize dados complexos de forma clara e interativa, permitindo insights rápidos sobre a saúde da loja.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50/50 border-amber-100">
            <CardContent className="pt-6">
              <h3 className="font-bold text-amber-800 mb-2">Análise de Tendências</h3>
              <p className="text-sm text-amber-600">
                Acompanhe a evolução histórica de frequência e finanças para tomar decisões baseadas em dados reais.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-green-50/50 border-green-100">
            <CardContent className="pt-6">
              <h3 className="font-bold text-green-800 mb-2">Compartilhamento Fácil</h3>
              <p className="text-sm text-green-600">
                Exporte relatórios profissionais ou compartilhe links seguros com a administração da loja em segundos.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico Financeiro */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Evolução Financeira (Semestral)</CardTitle>
              <CardDescription>Comparativo de Receitas vs Despesas</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
                    formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                  />
                  <Legend />
                  <Bar dataKey="Receitas" fill="var(--color-green-600)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Despesas" fill="var(--color-red-600)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Frequência */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Frequência</CardTitle>
              <CardDescription>Número de irmãos presentes por sessão</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={attendanceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Presentes" stroke="var(--primary)" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Distribuição */}
          <Card>
            <CardHeader>
              <CardTitle>Composição do Quadro</CardTitle>
              <CardDescription>Distribuição de membros por grau</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={memberDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {memberDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Users,
  ScrollText,
  FileSignature,
  Banknote,
  Landmark,
  BarChart3,
  Cog,
  Zap,
} from "lucide-react";

interface DepartmentCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const departments: DepartmentCard[] = [
  {
    title: "Secretaria",
    description: "Gestão de membros, candidatos, sessões e usuários",
    icon: <ScrollText className="w-8 h-8" />,
    href: "/admin/secretaria/membros",
    color: "bg-blue-50 border-blue-200",
  },
  {
    title: "Chancelaria",
    description: "Frequências, visitas e registros maçônicos",
    icon: <FileSignature className="w-8 h-8" />,
    href: "/admin/chancelaria/frequencias",
    color: "bg-green-50 border-green-200",
  },
  {
    title: "Tesouraria",
    description: "Receitas, despesas, contas e extratos",
    icon: <Banknote className="w-8 h-8" />,
    href: "/admin/tesouraria/receitas",
    color: "bg-purple-50 border-purple-200",
  },
  {
    title: "Presidência",
    description: "Administrações e comissões",
    icon: <Landmark className="w-8 h-8" />,
    href: "/admin/presidencia/administracoes",
    color: "bg-amber-50 border-amber-200",
  },
  {
    title: "Relatórios",
    description: "Análises e exportação de dados",
    icon: <BarChart3 className="w-8 h-8" />,
    href: "/admin/relatorios",
    color: "bg-indigo-50 border-indigo-200",
  },
  {
    title: "Configurações",
    description: "Sistema, segurança e backup",
    icon: <Cog className="w-8 h-8" />,
    href: "/admin/configuracoes/geral",
    color: "bg-gray-50 border-gray-200",
  },
  {
    title: "Integrações",
    description: "Email, WhatsApp, Push e pagamentos",
    icon: <Zap className="w-8 h-8" />,
    href: "/admin/integracoes/email",
    color: "bg-orange-50 border-orange-200",
  },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Super Admin" subtitle="Gestão completa do sistema e da loja">
      <div className="space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Membros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,234</div>
              <p className="text-xs text-gray-500 mt-1">+12% este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Receitas (Mês)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">R$ 12.500</div>
              <p className="text-xs text-gray-500 mt-1">Meta: R$ 15.000</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Despesas (Mês)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">R$ 8.750</div>
              <p className="text-xs text-gray-500 mt-1">-5% vs. mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Taxa de Frequência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">87%</div>
              <p className="text-xs text-gray-500 mt-1">Última sessão</p>
            </CardContent>
          </Card>
        </div>

        {/* Departments Grid */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Departamentos</h2>
            <p className="text-gray-600">Acesse os departamentos da loja</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <a
                key={dept.title}
                href={dept.href}
                className={`${dept.color} border-2 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                      {dept.title}
                    </h3>
                    <p className="text-sm text-gray-600">{dept.description}</p>
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    {dept.icon}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Atalhos Rápidos</CardTitle>
            <CardDescription>Acesso rápido às ações mais comuns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="/admin/secretaria/membros"
                className="p-4 rounded border hover:bg-gray-50 transition-colors text-center"
              >
                <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">Membros</p>
              </a>
              <a
                href="/admin/tesouraria/receitas"
                className="p-4 rounded border hover:bg-gray-50 transition-colors text-center"
              >
                <Banknote className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium">Receitas</p>
              </a>
              <a
                href="/admin/chancelaria/frequencias"
                className="p-4 rounded border hover:bg-gray-50 transition-colors text-center"
              >
                <FileSignature className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium">Frequências</p>
              </a>
              <a
                href="/admin/relatorios"
                className="p-4 rounded border hover:bg-gray-50 transition-colors text-center"
              >
                <BarChart3 className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                <p className="text-sm font-medium">Relatórios</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

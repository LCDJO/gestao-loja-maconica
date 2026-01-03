import { ScrollText, Users, Calendar, Mail, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Link } from 'wouter';

export default function SecretariaDashboard() {
  const modules = [
    {
      title: "Membros & Cadastros",
      description: "Gerencie cadastros de irmãos, cunhadas e sobrinhos",
      icon: Users,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      href: "/secretaria/irmaos",
      items: ["Lista de Irmãos", "Cunhadas", "Sobrinhos", "Aniversariantes"],
    },
    {
      title: "Cronograma & Datas",
      description: "Acompanhe eventos e datas importantes",
      icon: Calendar,
      color: "bg-green-50",
      iconColor: "text-green-600",
      href: "/secretaria/cronograma",
      items: ["Cronograma de Eventos", "Sessões Marcadas", "Datas Importantes"],
    },
    {
      title: "Comunicação Interna",
      description: "Envie comunicados e campanhas",
      icon: Mail,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      href: "/secretaria/comunicados",
      items: ["Comunicados", "Campanhas", "Templates", "Analytics"],
    },
    {
      title: "Documentação",
      description: "Acesse biblioteca, pranchas e arquivos",
      icon: BookOpen,
      color: "bg-orange-50",
      iconColor: "text-orange-600",
      href: "/secretaria/biblioteca",
      items: ["Biblioteca", "Pranchas", "Arquivo de Documentos"],
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 p-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ScrollText className="h-8 w-8 text-blue-600" />
            </div>
            Secretaria
          </h1>
          <p className="text-gray-600 mt-2">Gestão de pessoal, cadastros, cronograma e comunicação interna</p>
        </div>

        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Link key={module.title} href={module.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className={`${module.color} p-6 rounded-t-lg`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{module.title}</h2>
                        <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                      </div>
                      <IconComponent className={`h-12 w-12 ${module.iconColor}`} />
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">Itens principais:</p>
                    <ul className="space-y-2">
                      {module.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
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
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo Rápido</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Total de Irmãos</p>
              <p className="text-2xl font-bold text-blue-600">--</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Próximas Sessões</p>
              <p className="text-2xl font-bold text-blue-600">--</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Comunicados Não Lidos</p>
              <p className="text-2xl font-bold text-blue-600">--</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

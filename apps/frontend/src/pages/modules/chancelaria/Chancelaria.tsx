import { FileSignature, Trophy, Users, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Link } from 'wouter';

export default function ChancelariaDashboard() {
  const modules = [
    {
      title: "Registros Maçônicos",
      description: "Acompanhe vida maçônica e histórico dos irmãos",
      icon: Trophy,
      color: "bg-yellow-50",
      iconColor: "text-yellow-600",
      href: "/chancelaria/vida-maconica",
      items: ["Vida Maçônica", "Histórico", "Graus e Promoções", "Iniciações"],
    },
    {
      title: "Comissões & Órgãos",
      description: "Gerencie comissões e estrutura hierárquica",
      icon: Users,
      color: "bg-green-50",
      iconColor: "text-green-600",
      href: "/chancelaria/comissoes",
      items: ["Lista de Comissões", "Membros", "Hierarquia", "Cargos"],
    },
    {
      title: "Caridade & Ações Sociais",
      description: "Registre e acompanhe ações caritativas",
      icon: Heart,
      color: "bg-red-50",
      iconColor: "text-red-600",
      href: "/chancelaria/caridade",
      items: ["Registros de Caridade", "Projetos Sociais", "Beneficiários"],
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 p-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileSignature className="h-8 w-8 text-green-600" />
            </div>
            Chancelaria
          </h1>
          <p className="text-gray-600 mt-2">Registros maçônicos, comissões e ações sociais</p>
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
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
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
        <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo Rápido</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Comissões Ativas</p>
              <p className="text-2xl font-bold text-green-600">--</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Ações Sociais</p>
              <p className="text-2xl font-bold text-green-600">--</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Beneficiários</p>
              <p className="text-2xl font-bold text-green-600">--</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

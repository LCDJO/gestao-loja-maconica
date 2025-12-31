import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Plus, Bug, Zap, Shield, Search, X } from 'lucide-react';
import { toast } from 'sonner';

interface ChangelogEntry {
  version: string;
  date: string;
  type: 'feature' | 'bugfix' | 'improvement' | 'security';
  title: string;
  description: string;
  changes: string[];
}

const changelog: ChangelogEntry[] = [
  {
    version: '2.5.0',
    date: '30 de Dezembro de 2024',
    type: 'feature',
    title: 'Reorganização de Menu e Configurações',
    description: 'Consolidação completa do menu de Parâmetros em Configurações com nova página de Configurações da Loja.',
    changes: [
      'Menu de Parâmetros renomeado para Configurações',
      'Nova página Configurações da Loja com upload de logo',
      'Remoção de itens desnecessários (Tesouraria, Secretaria)',
      'Submenus aninhados para melhor organização',
      'Correção de rotas e navegação'
    ]
  },
  {
    version: '2.4.5',
    date: '30 de Dezembro de 2024',
    type: 'bugfix',
    title: 'Correção de Comportamento do Menu',
    description: 'Submenus agora permanecem abertos ao clicar em itens.',
    changes: [
      'Menu lateral não recolhe ao navegar entre itens',
      'Submenus permanecem expandidos para melhor UX',
      'Apenas ícone de chevron recolhe o submenu'
    ]
  },
  {
    version: '2.4.0',
    date: '30 de Dezembro de 2024',
    type: 'feature',
    title: 'Sistema de Gerenciamento de Usuários e Auditoria',
    description: 'Implementação completa de controle de acesso, gerenciamento de usuários e auditoria de acesso.',
    changes: [
      'Página de Gerenciamento de Usuários com CRUD completo',
      'Atribuição de Roles (Admin, Tesoureiro, Secretário, Visualizador, Membro)',
      'Componente ProtectedRoute para proteção de rotas',
      'Dashboard de Auditoria com filtros avançados',
      'Exportação de logs em CSV',
      'Estatísticas de acesso e atividades'
    ]
  },
  {
    version: '2.3.0',
    date: '30 de Dezembro de 2024',
    type: 'feature',
    title: 'Integração com Email Real e Analytics Push',
    description: 'Integração com SendGrid/Mailgun e rastreamento de status de notificações push.',
    changes: [
      'Integração com SendGrid e Mailgun para envio de emails',
      'Página de Configuração de Email',
      'Dashboard de Analytics Push com KPIs',
      'Rastreamento de status de entrega e abertura',
      'Gráficos de tendência e funil de conversão'
    ]
  },
  {
    version: '2.2.0',
    date: '30 de Dezembro de 2024',
    type: 'feature',
    title: 'Webhooks OneSignal e Agendamento de Relatórios',
    description: 'Notificações push com OneSignal e agendamento automático de relatórios por email.',
    changes: [
      'Utilitário para integração com OneSignal',
      'Página de Agendamento de Relatórios',
      'Suporte para frequências diárias, semanais e mensais',
      'Filtros avançados no Centro de Notificações',
      'Persistência de preferências de filtros'
    ]
  },
  {
    version: '2.1.0',
    date: '30 de Dezembro de 2024',
    type: 'feature',
    title: 'Notificações em Tempo Real e Exportação de Relatórios',
    description: 'Sistema completo de notificações em tempo real e exportação de relatórios em PDF e Excel.',
    changes: [
      'Centro de Notificações no header com dropdown',
      'Notificações automáticas para comunicados e reuniões',
      'Contador de notificações não lidas',
      'Exportação de Dashboard Executivo em PDF/Excel',
      'Exportação de Comunicados em PDF/Excel',
      'Suporte para CSV'
    ]
  },
  {
    version: '2.0.0',
    date: '30 de Dezembro de 2024',
    type: 'feature',
    title: 'Dashboard Executivo e Integrações',
    description: 'Implementação de Dashboard Executivo para Venerável Mestre com KPIs e integrações.',
    changes: [
      'Dashboard Executivo com KPIs (membros, receita, conformidade)',
      'Módulo de Comunicados Internos com grupos específicos',
      'Integração com Google Calendar para sincronização de reuniões',
      'Menu reorganizado no estilo Facebook Business',
      'Separação clara entre Ações e Parâmetros'
    ]
  },
  {
    version: '1.0.0',
    date: '30 de Dezembro de 2024',
    type: 'feature',
    title: 'Lançamento Inicial do Sistema',
    description: 'Versão inicial do Sistema de Gestão de Lojas Maçônicas com módulos principais.',
    changes: [
      'Módulo de Secretaria com gestão de membros e reuniões',
      'Módulo de Chancelaria com frequência e visitas',
      'Módulo de Tesouraria com controle financeiro',
      'Dashboard interativo com visualizações',
      'Menu lateral com navegação intuitiva'
    ]
  }
];

const getTypeIcon = (type: string) => {
  switch(type) {
    case 'feature':
      return <Plus className="h-4 w-4" />;
    case 'bugfix':
      return <Bug className="h-4 w-4" />;
    case 'improvement':
      return <Zap className="h-4 w-4" />;
    case 'security':
      return <Shield className="h-4 w-4" />;
    default:
      return <ArrowRight className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch(type) {
    case 'feature':
      return 'bg-blue-100 text-blue-800';
    case 'bugfix':
      return 'bg-red-100 text-red-800';
    case 'improvement':
      return 'bg-yellow-100 text-yellow-800';
    case 'security':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTypeLabel = (type: string) => {
  switch(type) {
    case 'feature':
      return 'Novo';
    case 'bugfix':
      return 'Correção';
    case 'improvement':
      return 'Melhoria';
    case 'security':
      return 'Segurança';
    default:
      return 'Atualização';
  }
};

export default function Changelog() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar changelog baseado em tipo e busca
  const filteredChangelog = useMemo(() => {
    return changelog.filter(entry => {
      const matchesType = !selectedType || entry.type === selectedType;
      const matchesSearch = !searchQuery || 
        entry.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.changes.some(change => change.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [selectedType, searchQuery]);

  const handleCheckForUpdates = () => {
    toast.success('Você está usando a versão mais recente (v2.5.0)');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Histórico de Alterações</h1>
          <p className="text-gray-600">
            Acompanhe todas as melhorias e novidades do Sistema de Gestão de Lojas Maçônicas
          </p>
        </div>

        {/* Busca e Filtros */}
        <Card className="border-gray-200">
          <CardContent className="pt-6 space-y-4">
            {/* Campo de Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por versão, título ou palavra-chave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filtros por Tipo */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Filtrar por tipo:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedType === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(null)}
                  className="text-xs"
                >
                  Todos
                </Button>
                <Button
                  variant={selectedType === 'feature' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType('feature')}
                  className="text-xs gap-1"
                >
                  <Plus className="h-3 w-3" /> Novo
                </Button>
                <Button
                  variant={selectedType === 'bugfix' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType('bugfix')}
                  className="text-xs gap-1"
                >
                  <Bug className="h-3 w-3" /> Correção
                </Button>
                <Button
                  variant={selectedType === 'improvement' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType('improvement')}
                  className="text-xs gap-1"
                >
                  <Zap className="h-3 w-3" /> Melhoria
                </Button>
                <Button
                  variant={selectedType === 'security' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType('security')}
                  className="text-xs gap-1"
                >
                  <Shield className="h-3 w-3" /> Segurança
                </Button>
              </div>
            </div>

            {/* Botão Verificar Atualizações */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {filteredChangelog.length} resultado{filteredChangelog.length !== 1 ? 's' : ''}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCheckForUpdates}
                className="text-xs"
              >
                Verificar Atualizações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Versão Atual */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-blue-900">Versão Atual</CardTitle>
                <p className="text-sm text-blue-700 mt-1">Você está usando a versão mais recente</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">v{changelog[0].version}</div>
                <p className="text-sm text-blue-600">{changelog[0].date}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Timeline de Alterações */}
        <div className="space-y-6">
          {filteredChangelog.length === 0 ? (
            <Card className="border-gray-200">
              <CardContent className="py-12 text-center">
                <p className="text-gray-600">Nenhum resultado encontrado para sua busca.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Limpar filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredChangelog.map((entry, index) => (
              <Card key={entry.version} className="border-gray-200 hover:border-gray-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">v{entry.version}</h3>
                        <Badge className={`${getTypeColor(entry.type)} border-0`}>
                          <span className="mr-1">{getTypeIcon(entry.type)}</span>
                          {getTypeLabel(entry.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{entry.date}</p>
                    </div>
                    {index === 0 && (
                      <Badge className="bg-green-100 text-green-800 border-0">Atual</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{entry.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">O que mudou:</p>
                    <ul className="space-y-1">
                      {entry.changes.map((change, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Rodapé */}
        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Última atualização: {changelog[0].date}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Para reportar bugs ou sugerir melhorias, entre em contato com o suporte
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

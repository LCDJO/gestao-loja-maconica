/**
 * Dashboard de Integrações de Sistema
 * 
 * Página principal que lista todas as integrações disponíveis e seu status.
 * Cada integração é uma conexão com um serviço externo.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  MessageCircle,
  Bell,
  Calendar,
  HardDrive,
  BarChart3,
  Users,
  Database,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
} from 'lucide-react';

interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  icon: React.ReactNode;
  lastSync?: Date;
  href: string;
  color: string;
}

export default function IntegracoesSystemaDashboard() {
  const [integrations] = useState<IntegrationItem[]>([
    // FINANCEIRAS
    {
      id: 'pagamentos',
      name: 'Pagamentos',
      description: 'Stripe, PagSeguro, Pix - Processe pagamentos de mensalidades',
      category: 'Financeiras',
      status: 'connected',
      icon: <CreditCard className="h-6 w-6" />,
      lastSync: new Date(),
      href: '/integracao/pagamentos',
      color: 'bg-blue-50 border-blue-200',
    },

    // COMUNICAÇÃO
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Envie mensagens e notificações via WhatsApp',
      category: 'Comunicação',
      status: 'disconnected',
      icon: <MessageCircle className="h-6 w-6" />,
      href: '/integracao/whatsapp',
      color: 'bg-green-50 border-green-200',
    },

    // NOTIFICAÇÕES
    {
      id: 'onesignal',
      name: 'OneSignal',
      description: 'Push notifications - Envie notificações para apps mobile',
      category: 'Notificações',
      status: 'pending',
      icon: <Bell className="h-6 w-6" />,
      href: '/integracao/onesignal',
      color: 'bg-purple-50 border-purple-200',
    },

    // AGENDAMENTO
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sincronize eventos e agendamentos com Google Calendar',
      category: 'Agendamento',
      status: 'connected',
      icon: <Calendar className="h-6 w-6" />,
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
      href: '/integracao/google-calendar',
      color: 'bg-red-50 border-red-200',
    },

    // ARMAZENAMENTO
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: 'Armazene documentos e arquivos na nuvem',
      category: 'Armazenamento',
      status: 'disconnected',
      icon: <HardDrive className="h-6 w-6" />,
      href: '/integracao/google-drive',
      color: 'bg-yellow-50 border-yellow-200',
    },

    // ANALYTICS
    {
      id: 'analytics',
      name: 'Google Analytics',
      description: 'Acompanhe métricas e comportamento de usuários',
      category: 'Analytics',
      status: 'connected',
      icon: <BarChart3 className="h-6 w-6" />,
      lastSync: new Date(),
      href: '/integracao/analytics',
      color: 'bg-indigo-50 border-indigo-200',
    },

    // RH
    {
      id: 'guia-pontos',
      name: 'Guia de Pontos',
      description: 'Controle folha de ponto e frequência',
      category: 'RH',
      status: 'error',
      icon: <Users className="h-6 w-6" />,
      href: '/integracao/guia-pontos',
      color: 'bg-pink-50 border-pink-200',
    },

    // ERP
    {
      id: 'erp',
      name: 'Sistemas ERP',
      description: 'Integre com SAP, TOTVS, Odoo ou outro ERP',
      category: 'ERP',
      status: 'disconnected',
      icon: <Database className="h-6 w-6" />,
      href: '/integracao/erp',
      color: 'bg-gray-50 border-gray-200',
    },
  ]);

  const categories = Array.from(new Set(integrations.map(i => i.category)));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">✓ Conectado</Badge>;
      case 'disconnected':
        return <Badge className="bg-gray-100 text-gray-800">○ Desconectado</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">✗ Erro</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">◐ Pendente</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="h-8 w-8 text-blue-600" />
              Integrações de Sistema
            </h1>
            <p className="text-gray-600 text-sm mt-2">
              Gerencie conexões com serviços externos: pagamentos, comunicação, notificações e mais
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Resumo Geral */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Total de Integrações</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{integrations.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Conectadas</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {integrations.filter(i => i.status === 'connected').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Erros</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {integrations.filter(i => i.status === 'error').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Desconectadas</p>
                <p className="text-3xl font-bold text-gray-600 mt-2">
                  {integrations.filter(i => i.status === 'disconnected').length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integrações por Categoria */}
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations
                .filter(i => i.category === category)
                .map((integration) => (
                  <Card key={integration.id} className={`border ${integration.color} hover:shadow-lg transition-shadow`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-gray-700">{integration.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{integration.description}</p>
                          </div>
                        </div>
                        {getStatusIcon(integration.status)}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex-1">
                          {getStatusBadge(integration.status)}
                          {integration.lastSync && (
                            <p className="text-xs text-gray-500 mt-2">
                              Última sincronização: {integration.lastSync.toLocaleString('pt-BR')}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-2"
                          onClick={() => window.location.href = integration.href}
                        >
                          Configurar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}

        {/* Informações Importantes */}
        <Card className="mt-12 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">ℹ️ Informações Importantes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-900 space-y-3">
            <p>
              <strong>Segurança:</strong> Todos os dados sensíveis (chaves de API, tokens) são criptografados e armazenados de forma segura.
            </p>
            <p>
              <strong>Permissões:</strong> Cada integração requer permissões específicas. Revise cuidadosamente antes de conectar.
            </p>
            <p>
              <strong>Suporte:</strong> Consulte a documentação específica de cada integração para obter suporte técnico.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

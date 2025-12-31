import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Filter, Search } from 'lucide-react';
import { AuditLog } from '@/lib/types';

const MOCK_LOGS: AuditLog[] = [
  {
    id: '1',
    lodgeId: 'lodge-1',
    userId: 'user-1',
    action: 'CREATE',
    entityType: 'MEMBER',
    entityId: 'member-1',
    description: 'Novo membro criado: João Silva',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'SUCCESS',
  },
  {
    id: '2',
    lodgeId: 'lodge-1',
    userId: 'user-2',
    action: 'UPDATE',
    entityType: 'BILL',
    entityId: 'bill-1',
    description: 'Cobrança marcada como paga',
    changes: { status: { from: 'pending', to: 'paid' } },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: 'SUCCESS',
  },
  {
    id: '3',
    lodgeId: 'lodge-1',
    userId: 'user-1',
    action: 'UPDATE',
    entityType: 'SETTINGS',
    description: 'Configurações de email atualizadas',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: 'SUCCESS',
  },
  {
    id: '4',
    lodgeId: 'lodge-1',
    userId: 'user-3',
    action: 'LOGIN',
    entityType: 'USER',
    description: 'Login realizado',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    status: 'SUCCESS',
  },
  {
    id: '5',
    lodgeId: 'lodge-1',
    userId: 'user-2',
    action: 'DELETE',
    entityType: 'MEETING',
    entityId: 'meeting-1',
    description: 'Reunião deletada',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'SUCCESS',
  },
];

export default function Auditoria() {
  const [logs, setLogs] = useState<AuditLog[]>(MOCK_LOGS);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterEntity, setFilterEntity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = logs.filter(log => {
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesEntity = filterEntity === 'all' || log.entityType === filterEntity;
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAction && matchesEntity && matchesSearch;
  });

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'VIEW': return 'bg-gray-100 text-gray-800';
      case 'EXPORT': return 'bg-purple-100 text-purple-800';
      case 'LOGIN': return 'bg-yellow-100 text-yellow-800';
      case 'LOGOUT': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExport = () => {
    const csv = [
      ['Data', 'Ação', 'Entidade', 'Descrição', 'Usuário', 'Status'].join(','),
      ...filteredLogs.map(log =>
        [
          log.timestamp.toLocaleString('pt-BR'),
          log.action,
          log.entityType,
          log.description,
          log.userId,
          log.status,
        ].join(',')
      ),
    ].join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `auditoria_${new Date().toISOString()}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Auditoria e Logs</h1>
          <p className="text-gray-600">
            Visualize todas as ações realizadas no sistema para fins de conformidade e rastreamento
          </p>
        </div>

        {/* Filtros */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Ação</label>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as ações</SelectItem>
                    <SelectItem value="CREATE">Criar</SelectItem>
                    <SelectItem value="UPDATE">Atualizar</SelectItem>
                    <SelectItem value="DELETE">Deletar</SelectItem>
                    <SelectItem value="VIEW">Visualizar</SelectItem>
                    <SelectItem value="EXPORT">Exportar</SelectItem>
                    <SelectItem value="LOGIN">Login</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Entidade</label>
                <Select value={filterEntity} onValueChange={setFilterEntity}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as entidades</SelectItem>
                    <SelectItem value="MEMBER">Membro</SelectItem>
                    <SelectItem value="BILL">Cobrança</SelectItem>
                    <SelectItem value="MEETING">Reunião</SelectItem>
                    <SelectItem value="SETTINGS">Configurações</SelectItem>
                    <SelectItem value="USER">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Histórico de Ações</CardTitle>
              <CardDescription>
                {filteredLogs.length} registros encontrados
              </CardDescription>
            </div>
            <Button
              onClick={handleExport}
              variant="outline"
              className="border-gray-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <div
                    key={log.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getActionBadgeColor(log.action)}>
                            {log.action}
                          </Badge>
                          <Badge variant="outline" className="border-gray-300">
                            {log.entityType}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {log.timestamp.toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {log.description}
                        </p>
                        {log.changes && (
                          <div className="mt-2 text-xs text-gray-600">
                            <details>
                              <summary className="cursor-pointer font-medium">
                                Ver alterações
                              </summary>
                              <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto">
                                {JSON.stringify(log.changes, null, 2)}
                              </pre>
                            </details>
                          </div>
                        )}
                      </div>
                      <Badge
                        variant={log.status === 'SUCCESS' ? 'default' : 'destructive'}
                        className="ml-2"
                      >
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum registro encontrado</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

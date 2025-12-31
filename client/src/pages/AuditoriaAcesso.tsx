import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Download, Trash2, Filter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { accessAuditStore } from "@/lib/store";

export default function AuditoriaAcesso() {
  const [logs, setLogs] = useState(accessAuditStore.getAll());
  const [filterAction, setFilterAction] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const stats = accessAuditStore.getStats();

  const filteredLogs = logs.filter(log => {
    const matchAction = !filterAction || log.action.includes(filterAction);
    const matchUser = !filterUser || log.userId.includes(filterUser);
    return matchAction && matchUser;
  });

  const handleExportCSV = () => {
    const csv = [
      ['ID', 'Ação', 'Usuário', 'Alvo', 'Descrição', 'Data/Hora'].join(','),
      ...filteredLogs.map(log => [
        log.id,
        log.action,
        log.userId,
        log.targetId || '-',
        log.description,
        new Date(log.timestamp).toLocaleString('pt-BR'),
      ].map(v => `"${v}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Arquivo exportado com sucesso");
  };

  const handleClearLogs = () => {
    if (confirm("Tem certeza que deseja limpar todos os logs de auditoria?")) {
      accessAuditStore.clear();
      setLogs([]);
      toast.success("Logs de auditoria limpos");
    }
  };

  const getActionColor = (action: string) => {
    if (action.startsWith('CREATE')) return 'bg-green-100 text-green-700';
    if (action.startsWith('UPDATE')) return 'bg-blue-100 text-blue-700';
    if (action.startsWith('DELETE')) return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Auditoria de Acesso</h1>
            <p className="text-slate-600 mt-2">Rastreamento de todas as ações do sistema</p>
          </div>
          <BarChart3 className="h-12 w-12 text-blue-600 opacity-20" />
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLogs}</div>
              <p className="text-xs text-gray-600 mt-1">Registros de auditoria</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ações Únicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.actions).length}</div>
              <p className="text-xs text-gray-600 mt-1">Tipos de ações registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Último Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {stats.lastLog ? new Date(stats.lastLog.timestamp).toLocaleString('pt-BR') : '-'}
              </div>
              <p className="text-xs text-gray-600 mt-1">Data e hora</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Ação</Label>
                <Input
                  placeholder="Ex: CREATE_USER"
                  value={filterAction}
                  onChange={e => setFilterAction(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Usuário</Label>
                <Input
                  placeholder="ID do usuário"
                  value={filterUser}
                  onChange={e => setFilterUser(e.target.value)}
                />
              </div>

              <div className="flex items-end gap-2">
                <Button onClick={handleExportCSV} variant="outline" className="flex-1 gap-2">
                  <Download className="h-4 w-4" /> Exportar CSV
                </Button>
                <Button 
                  onClick={handleClearLogs} 
                  variant="outline" 
                  className="flex-1 gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" /> Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Logs de Auditoria ({filteredLogs.length})</CardTitle>
            <CardDescription>Últimas ações registradas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredLogs.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhum log encontrado</p>
              ) : (
                filteredLogs.reverse().map(log => (
                  <div key={log.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                          <span className="text-xs text-gray-600">
                            {new Date(log.timestamp).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{log.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-600">
                          <span>Usuário: <strong>{log.userId}</strong></span>
                          {log.targetId && <span>Alvo: <strong>{log.targetId}</strong></span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Trash2, Download, RefreshCw } from 'lucide-react';
import { TestLogManager, TestLog } from '@/lib/evolutionApiUtils';
import { toast } from 'sonner';

export default function HistoricoTestesEvolution() {
  const [logs, setLogs] = useState<TestLog[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'connection' | 'message'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'error'>('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    const allLogs = TestLogManager.getLogs();
    setLogs(allLogs);
  };

  const filteredLogs = logs.filter(log => {
    const typeMatch = filterType === 'all' || log.type === filterType;
    const statusMatch = filterStatus === 'all' || log.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const handleClearLogs = () => {
    if (confirm('Tem certeza que deseja limpar todos os logs?')) {
      TestLogManager.clearLogs();
      setLogs([]);
      toast.success('Logs limpos com sucesso');
    }
  };

  const handleClearOldLogs = () => {
    if (confirm('Tem certeza que deseja remover logs com mais de 7 dias?')) {
      TestLogManager.clearOldLogs(7);
      loadLogs();
      toast.success('Logs antigos removidos');
    }
  };

  const handleExportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `evolution-api-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Logs exportados com sucesso');
  };

  const getStatusIcon = (status: string) => {
    return status === 'success' ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusColor = (status: string) => {
    return status === 'success' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getTypeLabel = (type: string) => {
    return type === 'connection' ? 'Conexão' : 'Mensagem';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const getSuccessRate = () => {
    if (logs.length === 0) return 0;
    const successCount = logs.filter(log => log.status === 'success').length;
    return Math.round((successCount / logs.length) * 100);
  };

  const getAverageDuration = () => {
    if (logs.length === 0) return 0;
    const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);
    return Math.round(totalDuration / logs.length);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Histórico de Testes</h1>
            <p className="text-gray-600 mt-1">Evolution API - Testes de Conexão e Envio</p>
          </div>
          <Button 
            variant="outline" 
            onClick={loadLogs}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Atualizar
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total de Testes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{logs.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{getSuccessRate()}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Duração Média</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{getAverageDuration()}ms</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Último Teste</p>
                <p className="text-sm font-medium text-gray-900 mt-2">
                  {logs.length > 0 ? formatDate(logs[0].timestamp) : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Tipo de Teste</label>
                <div className="flex gap-2">
                  <Button
                    variant={filterType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('all')}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filterType === 'connection' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('connection')}
                  >
                    Conexão
                  </Button>
                  <Button
                    variant={filterType === 'message' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('message')}
                  >
                    Mensagem
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Status</label>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('all')}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filterStatus === 'success' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('success')}
                  >
                    Sucesso
                  </Button>
                  <Button
                    variant={filterStatus === 'error' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('error')}
                  >
                    Erro
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportLogs}
                className="gap-2"
              >
                <Download className="h-4 w-4" /> Exportar JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearOldLogs}
              >
                Limpar Antigos (7 dias)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearLogs}
                className="gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" /> Limpar Tudo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Logs */}
        <div className="space-y-2">
          {filteredLogs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600">Nenhum teste encontrado com os filtros selecionados.</p>
              </CardContent>
            </Card>
          ) : (
            filteredLogs.map((log) => (
              <Card key={log.id} className="border-gray-200 hover:border-gray-300 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getStatusIcon(log.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{log.instanceName}</span>
                          <Badge className={`${getStatusColor(log.status)} border-0 text-xs`}>
                            {getTypeLabel(log.type)}
                          </Badge>
                          <Badge className={`${getStatusColor(log.status)} border-0 text-xs`}>
                            {log.status === 'success' ? 'Sucesso' : 'Erro'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{log.message}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{formatDate(log.timestamp)}</span>
                          <span>Duração: {log.duration}ms</span>
                          {log.errorCode && <span>Código: {log.errorCode}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

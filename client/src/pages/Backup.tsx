import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HardDrive, Download, RotateCcw, Plus, Clock } from 'lucide-react';
import { BackupRecord } from '@/lib/types';
import { toast } from 'sonner';

const MOCK_BACKUPS: BackupRecord[] = [
  {
    id: '1',
    lodgeId: 'lodge-1',
    fileName: 'backup_2024_12_30_automatic.zip',
    fileSize: 2048576,
    createdAt: new Date(Date.now() - 0 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 0 * 60 * 60 * 1000),
    status: 'COMPLETED',
    backupType: 'AUTOMATIC',
    minioPath: 's3://backups/lodge-1/backup_2024_12_30.zip',
    dataCount: { members: 42, bills: 156, meetings: 12, transactions: 523 },
  },
  {
    id: '2',
    lodgeId: 'lodge-1',
    fileName: 'backup_2024_12_29_automatic.zip',
    fileSize: 2015232,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'COMPLETED',
    backupType: 'AUTOMATIC',
    minioPath: 's3://backups/lodge-1/backup_2024_12_29.zip',
    dataCount: { members: 42, bills: 154, meetings: 12, transactions: 520 },
  },
  {
    id: '3',
    lodgeId: 'lodge-1',
    fileName: 'backup_2024_12_28_manual.zip',
    fileSize: 2001024,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    status: 'COMPLETED',
    backupType: 'MANUAL',
    minioPath: 's3://backups/lodge-1/backup_2024_12_28_manual.zip',
    dataCount: { members: 41, bills: 150, meetings: 11, transactions: 510 },
  },
];

export default function Backup() {
  const [backups, setBackups] = useState<BackupRecord[]>(MOCK_BACKUPS);
  const [isCreating, setIsCreating] = useState(false);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);

  const handleCreateBackup = async () => {
    setIsCreating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newBackup: BackupRecord = {
        id: String(backups.length + 1),
        lodgeId: 'lodge-1',
        fileName: `backup_${new Date().toISOString().split('T')[0]}_manual.zip`,
        fileSize: Math.floor(Math.random() * 2000000) + 1000000,
        createdAt: new Date(),
        completedAt: new Date(),
        status: 'COMPLETED',
        backupType: 'MANUAL',
        minioPath: `s3://backups/lodge-1/backup_${Date.now()}.zip`,
        dataCount: { members: 42, bills: 156, meetings: 12, transactions: 523 },
      };
      setBackups([newBackup, ...backups]);
      toast.success('Backup criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar backup');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestore = async (backupId: string) => {
    setIsRestoring(backupId);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Backup restaurado com sucesso!');
    } catch (error) {
      toast.error('Erro ao restaurar backup');
    } finally {
      setIsRestoring(null);
    }
  };

  const handleDownload = (backup: BackupRecord) => {
    toast.success(`Iniciando download de ${backup.fileName}`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Backup e Restauração</h1>
          <p className="text-gray-600">
            Gerencie backups automáticos e manuais dos dados da sua loja com integração MinIO
          </p>
        </div>

        {/* Informações de Backup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Último Backup</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">
                {backups[0]?.createdAt.toLocaleDateString('pt-BR')}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {backups[0]?.createdAt.toLocaleTimeString('pt-BR')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Tamanho Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">
                {formatFileSize(backups.reduce((sum, b) => sum + b.fileSize, 0))}
              </p>
              <p className="text-xs text-gray-500 mt-1">{backups.length} backups armazenados</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Armazenamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">MinIO</p>
              <p className="text-xs text-gray-500 mt-1">Integração ativa</p>
            </CardContent>
          </Card>
        </div>

        {/* Ações */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Ações de Backup</CardTitle>
            <CardDescription>
              Configure e gerencie backups automáticos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                Backups automáticos são executados diariamente às 2:00 AM. Você pode criar backups manuais a qualquer momento.
              </p>
            </div>
            <Button
              onClick={handleCreateBackup}
              disabled={isCreating}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isCreating ? 'Criando backup...' : 'Criar Backup Manual'}
            </Button>
          </CardContent>
        </Card>

        {/* Lista de Backups */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Histórico de Backups</CardTitle>
            <CardDescription>
              {backups.length} backups disponíveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {backups.map(backup => (
                <div
                  key={backup.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <HardDrive className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{backup.fileName}</p>
                          <p className="text-xs text-gray-500">
                            {backup.createdAt.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <span>Tamanho: {formatFileSize(backup.fileSize)}</span>
                        <span>Membros: {backup.dataCount.members}</span>
                        <span>Cobranças: {backup.dataCount.bills}</span>
                        <span>Reuniões: {backup.dataCount.meetings}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge
                        variant={backup.status === 'COMPLETED' ? 'default' : 'secondary'}
                        className={backup.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {backup.status === 'COMPLETED' ? 'Concluído' : 'Pendente'}
                      </Badge>
                      <Badge variant="outline" className="border-gray-300">
                        {backup.backupType === 'AUTOMATIC' ? 'Automático' : 'Manual'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleDownload(backup)}
                      variant="outline"
                      size="sm"
                      className="border-gray-300"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => handleRestore(backup.id)}
                      disabled={isRestoring === backup.id}
                      variant="outline"
                      size="sm"
                      className="border-gray-300"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      {isRestoring === backup.id ? 'Restaurando...' : 'Restaurar'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuração de Backup Automático */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Configuração de Backup Automático</CardTitle>
            <CardDescription>
              Ajuste as configurações de backup automático
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Backup Automático Diário</p>
                  <p className="text-sm text-gray-600">Executado às 2:00 AM todos os dias</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Retenção de Backups</p>
                  <p className="text-sm text-gray-600">Últimos 30 dias</p>
                </div>
                <Badge variant="outline" className="border-gray-300">30 dias</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Armazenamento MinIO</p>
                  <p className="text-sm text-gray-600">s3://backups/lodge-1/</p>
                </div>
                <Badge variant="outline" className="border-gray-300">Conectado</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mail,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Settings,
  History,
  Play,
} from 'lucide-react';
import { toast } from 'sonner';
import { notificationSettingsStore, emailNotificationStore } from '@/lib/store';
import { checkAndCreateNotifications, processPendingNotifications } from '@/lib/emailNotifications';
import { EmailNotification, NotificationSettings } from '@/lib/types';

export default function NotificacoesEmail() {
  const [settings, setSettings] = useState<NotificationSettings>(notificationSettingsStore.getSettings());
  const [notifications, setNotifications] = useState<EmailNotification[]>(emailNotificationStore.getNotifications());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const pendingNotifications = notifications.filter(n => n.status === 'pending');
  const sentNotifications = notifications.filter(n => n.status === 'sent');
  const failedNotifications = notifications.filter(n => n.status === 'failed');

  const handleSettingsChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };

  const handleSmtpConfigChange = (key: string, value: string) => {
    const newSettings = {
      ...settings,
      smtpConfig: {
        ...settings.smtpConfig,
        [key]: value,
      },
    };
    setSettings(newSettings);
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      notificationSettingsStore.updateSettings(settings);
      toast.success('Configurações salvas com sucesso');
      setIsSaving(false);
    }, 800);
  };

  const handleCheckNotifications = () => {
    checkAndCreateNotifications();
    setNotifications(emailNotificationStore.getNotifications());
    toast.success('Notificações verificadas e criadas');
  };

  const handleProcessNotifications = async () => {
    setIsProcessing(true);
    const result = await processPendingNotifications();
    setNotifications(emailNotificationStore.getNotifications());
    toast.success(`${result.sent} emails enviados, ${result.failed} falharam`);
    setIsProcessing(false);
  };

  const handleRetryFailed = async () => {
    setIsProcessing(true);
    let retried = 0;
    for (const notification of failedNotifications) {
      emailNotificationStore.updateNotification(notification.id, { status: 'pending' });
      retried++;
    }
    setNotifications(emailNotificationStore.getNotifications());
    toast.success(`${retried} notificações marcadas para reenvio`);
    setIsProcessing(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">
            Notificações por Email
          </h1>
          <p className="text-muted-foreground font-serif italic mt-1">
            Configure e gerencie notificações automáticas de cobranças
          </p>
        </div>

        <Tabs defaultValue="configuracoes" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="status">
              Status
              {pendingNotifications.length > 0 && (
                <Badge className="ml-2 bg-amber-600">{pendingNotifications.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="configuracoes" className="space-y-6">
            {/* Ativar/Desativar */}
            <Card>
              <CardHeader>
                <CardTitle>Ativar Notificações</CardTitle>
                <CardDescription>
                  Controle se o sistema deve enviar notificações automáticas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Sistema de Notificações</p>
                    <p className="text-sm text-muted-foreground">
                      {settings.enabled ? 'Ativo' : 'Inativo'}
                    </p>
                  </div>
                  <Switch
                    checked={settings.enabled}
                    onCheckedChange={(checked) => handleSettingsChange('enabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tipos de Notificação */}
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Notificação</CardTitle>
                <CardDescription>
                  Selecione quais notificações devem ser enviadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Lembrete 3 dias antes</p>
                    <p className="text-sm text-muted-foreground">
                      Enviar email 3 dias antes do vencimento
                    </p>
                  </div>
                  <Switch
                    checked={settings.sendReminder3Days}
                    onCheckedChange={(checked) =>
                      handleSettingsChange('sendReminder3Days', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Lembrete 1 dia antes</p>
                    <p className="text-sm text-muted-foreground">
                      Enviar email 1 dia antes do vencimento
                    </p>
                  </div>
                  <Switch
                    checked={settings.sendReminder1Day}
                    onCheckedChange={(checked) =>
                      handleSettingsChange('sendReminder1Day', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Aviso 7 dias atrasado</p>
                    <p className="text-sm text-muted-foreground">
                      Enviar email se estiver 7 dias atrasado
                    </p>
                  </div>
                  <Switch
                    checked={settings.sendOverdue7Days}
                    onCheckedChange={(checked) =>
                      handleSettingsChange('sendOverdue7Days', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Aviso 15 dias atrasado</p>
                    <p className="text-sm text-muted-foreground">
                      Enviar email se estiver 15 dias atrasado
                    </p>
                  </div>
                  <Switch
                    checked={settings.sendOverdue15Days}
                    onCheckedChange={(checked) =>
                      handleSettingsChange('sendOverdue15Days', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configuração SMTP */}
            {settings.emailProvider === 'smtp' && (
              <Card>
                <CardHeader>
                  <CardTitle>Configuração SMTP</CardTitle>
                  <CardDescription>
                    Configure as credenciais do seu servidor SMTP
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="host">Host SMTP</Label>
                      <Input
                        id="host"
                        placeholder="smtp.gmail.com"
                        value={settings.smtpConfig?.host || ''}
                        onChange={(e) => handleSmtpConfigChange('host', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="port">Porta</Label>
                      <Input
                        id="port"
                        placeholder="587"
                        value={settings.smtpConfig?.port || ''}
                        onChange={(e) => handleSmtpConfigChange('port', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user">Usuário/Email</Label>
                    <Input
                      id="user"
                      placeholder="seu-email@gmail.com"
                      value={settings.smtpConfig?.user || ''}
                      onChange={(e) => handleSmtpConfigChange('user', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={settings.smtpConfig?.password || ''}
                      onChange={(e) => handleSmtpConfigChange('password', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fromEmail">Email de Envio</Label>
                      <Input
                        id="fromEmail"
                        placeholder="noreply@loja-maconica.com.br"
                        value={settings.smtpConfig?.fromEmail || ''}
                        onChange={(e) => handleSmtpConfigChange('fromEmail', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fromName">Nome do Remetente</Label>
                      <Input
                        id="fromName"
                        placeholder="Loja Maçônica"
                        value={settings.smtpConfig?.fromName || ''}
                        onChange={(e) => handleSmtpConfigChange('fromName', e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="w-full bg-primary text-primary-foreground"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Ações */}
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
                <CardDescription>
                  Gerencie o envio de notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleCheckNotifications}
                  className="w-full gap-2 bg-blue-600 text-white"
                >
                  <Clock className="h-4 w-4" />
                  Verificar e Criar Notificações
                </Button>
                <Button
                  onClick={handleProcessNotifications}
                  disabled={isProcessing || pendingNotifications.length === 0}
                  className="w-full gap-2 bg-green-600 text-white"
                >
                  <Send className="h-4 w-4" />
                  {isProcessing
                    ? 'Processando...'
                    : `Enviar ${pendingNotifications.length} Notificações`}
                </Button>
                {failedNotifications.length > 0 && (
                  <Button
                    onClick={handleRetryFailed}
                    disabled={isProcessing}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Reenviar {failedNotifications.length} Falhadas
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historico" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Notificações</CardTitle>
                <CardDescription>
                  Todas as notificações enviadas e pendentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Nenhuma notificação registrada
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg ${
                          notification.status === 'sent'
                            ? 'bg-green-50/30 border-green-100'
                            : notification.status === 'failed'
                              ? 'bg-red-50/30 border-red-100'
                              : 'bg-amber-50/30 border-amber-100'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-foreground">
                                {notification.email}
                              </p>
                              <Badge
                                variant={
                                  notification.status === 'sent'
                                    ? 'default'
                                    : notification.status === 'failed'
                                      ? 'destructive'
                                      : 'outline'
                                }
                                className={
                                  notification.status === 'sent'
                                    ? 'bg-green-600'
                                    : ''
                                }
                              >
                                {notification.status === 'sent'
                                  ? 'Enviado'
                                  : notification.status === 'failed'
                                    ? 'Falha'
                                    : 'Pendente'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.subject}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Criado em{' '}
                              {new Date(notification.createdAt).toLocaleDateString('pt-BR')}{' '}
                              às{' '}
                              {new Date(notification.createdAt).toLocaleTimeString('pt-BR')}
                            </p>
                            {notification.sentAt && (
                              <p className="text-xs text-muted-foreground">
                                Enviado em{' '}
                                {new Date(notification.sentAt).toLocaleDateString('pt-BR')}{' '}
                                às{' '}
                                {new Date(notification.sentAt).toLocaleTimeString('pt-BR')}
                              </p>
                            )}
                            {notification.failureReason && (
                              <p className="text-xs text-red-600 mt-1">
                                Erro: {notification.failureReason}
                              </p>
                            )}
                          </div>
                          <div className="ml-4">
                            {notification.status === 'sent' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : notification.status === 'failed' ? (
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            ) : (
                              <Clock className="h-5 w-5 text-amber-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                  <Clock className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">
                    {pendingNotifications.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Aguardando envio
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enviadas</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {sentNotifications.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enviadas com sucesso
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Falhadas</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {failedNotifications.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Erros no envio
                  </p>
                </CardContent>
              </Card>
            </div>

            {failedNotifications.length > 0 && (
              <Card className="bg-red-50/50 border-red-100">
                <CardHeader>
                  <CardTitle className="text-red-700">Notificações Falhadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {failedNotifications.map((notification) => (
                      <div key={notification.id} className="text-sm">
                        <p className="font-medium text-red-700">{notification.email}</p>
                        <p className="text-xs text-red-600">
                          {notification.failureReason}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

import { useState } from 'react';
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
import { notificationSettingsStore, emailNotificationStore, notificationTemplateStore } from '@/lib/store';
import { checkAndCreateNotifications, processPendingNotifications } from '@/lib/emailNotifications';
import { EmailNotification, NotificationSettings } from '@/lib/types';

export default function NotificacoesEmail() {
  const [settings, setSettings] = useState<NotificationSettings>(notificationSettingsStore.getSettings());
  const [notifications, setNotifications] = useState<EmailNotification[]>(emailNotificationStore.getNotifications());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState<Record<string, string>>({
    reminder3Days: '',
    reminder1Day: '',
    overdue7Days: '',
    overdue15Days: '',
  });
  const emailTemplates = notificationTemplateStore.getTemplatesByType('email');

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
    try {
      notificationSettingsStore.updateSettings(settings);
      toast.success('Configurações salvas com sucesso!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProcessNotifications = async () => {
    setIsProcessing(true);
    try {
      await processPendingNotifications();
      setNotifications(emailNotificationStore.getNotifications());
      toast.success('Notificações processadas com sucesso!');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckNotifications = () => {
    try {
      checkAndCreateNotifications();
      setNotifications(emailNotificationStore.getNotifications());
      toast.success('Notificações verificadas!');
    } catch (error) {
      toast.error('Erro ao verificar notificações');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground font-display">
            Notificações por Email
          </h1>
          <p className="text-muted-foreground">
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
                  Selecione quais notificações devem ser enviadas e escolha o template para cada uma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Lembrete 3 dias */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
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
                  {settings.sendReminder3Days && (
                    <div>
                      <Label className="text-sm">Selecionar Template</Label>
                      <Select value={selectedTemplates.reminder3Days} onValueChange={(value) => setSelectedTemplates({...selectedTemplates, reminder3Days: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Escolha um template" />
                        </SelectTrigger>
                        <SelectContent>
                          {emailTemplates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Lembrete 1 dia */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
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
                  {settings.sendReminder1Day && (
                    <div>
                      <Label className="text-sm">Selecionar Template</Label>
                      <Select value={selectedTemplates.reminder1Day} onValueChange={(value) => setSelectedTemplates({...selectedTemplates, reminder1Day: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Escolha um template" />
                        </SelectTrigger>
                        <SelectContent>
                          {emailTemplates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Aviso 7 dias atrasado */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
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
                  {settings.sendOverdue7Days && (
                    <div>
                      <Label className="text-sm">Selecionar Template</Label>
                      <Select value={selectedTemplates.overdue7Days} onValueChange={(value) => setSelectedTemplates({...selectedTemplates, overdue7Days: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Escolha um template" />
                        </SelectTrigger>
                        <SelectContent>
                          {emailTemplates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Aviso 15 dias atrasado */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
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
                  {settings.sendOverdue15Days && (
                    <div>
                      <Label className="text-sm">Selecionar Template</Label>
                      <Select value={selectedTemplates.overdue15Days} onValueChange={(value) => setSelectedTemplates({...selectedTemplates, overdue15Days: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Escolha um template" />
                        </SelectTrigger>
                        <SelectContent>
                          {emailTemplates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Configuração SMTP */}
            {settings.emailProvider === 'smtp' && (
              <Card>
                <CardHeader>
                  <CardTitle>Configuração SMTP</CardTitle>
                  <CardDescription>
                    Configure os dados do servidor de email
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtp-host">Host SMTP</Label>
                      <Input
                        id="smtp-host"
                        placeholder="smtp.gmail.com"
                        value={settings.smtpConfig?.host || ''}
                        onChange={(e) => handleSmtpConfigChange('host', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtp-port">Porta</Label>
                      <Input
                        id="smtp-port"
                        placeholder="587"
                        value={settings.smtpConfig?.port || ''}
                        onChange={(e) => handleSmtpConfigChange('port', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtp-user">Usuário</Label>
                      <Input
                        id="smtp-user"
                        placeholder="seu-email@gmail.com"
                        value={settings.smtpConfig?.user || ''}
                        onChange={(e) => handleSmtpConfigChange('user', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtp-password">Senha</Label>
                      <Input
                        id="smtp-password"
                        type="password"
                        placeholder="sua-senha"
                        value={settings.smtpConfig?.password || ''}
                        onChange={(e) => handleSmtpConfigChange('password', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtp-from-email">Email Remetente</Label>
                      <Input
                        id="smtp-from-email"
                        placeholder="noreply@lojamaonica.com"
                        value={settings.smtpConfig?.fromEmail || ''}
                        onChange={(e) => handleSmtpConfigChange('fromEmail', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtp-from-name">Nome Remetente</Label>
                      <Input
                        id="smtp-from-name"
                        placeholder="Loja Maçônica"
                        value={settings.smtpConfig?.fromName || ''}
                        onChange={(e) => handleSmtpConfigChange('fromName', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Salvar Configurações */}
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full bg-primary text-primary-foreground"
            >
              {isSaving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </TabsContent>

          <TabsContent value="historico" className="space-y-4">
            {sentNotifications.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    Nenhuma notificação enviada ainda
                  </p>
                </CardContent>
              </Card>
            ) : (
              sentNotifications.map(notification => (
                <Card key={notification.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{notification.email}</p>
                        <p className="text-sm text-muted-foreground">{notification.subject}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Enviado em {new Date(notification.sentAt!).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <Badge className="bg-green-600">Enviado</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            {/* Ações Rápidas */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleCheckNotifications}
                className="bg-blue-600 text-white"
              >
                <Clock className="h-4 w-4 mr-2" />
                Verificar Notificações
              </Button>
              <Button
                onClick={handleProcessNotifications}
                disabled={isProcessing || pendingNotifications.length === 0}
                className="bg-green-600 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Pendentes
              </Button>
            </div>

            {/* Status Geral */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-600">{pendingNotifications.length}</p>
                    <p className="text-sm text-muted-foreground mt-2">Pendentes</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{sentNotifications.length}</p>
                    <p className="text-sm text-muted-foreground mt-2">Enviadas</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">{failedNotifications.length}</p>
                    <p className="text-sm text-muted-foreground mt-2">Falhadas</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notificações Pendentes */}
            {pendingNotifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Notificações Pendentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingNotifications.map(notification => (
                    <div key={notification.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{notification.email}</p>
                        <p className="text-sm text-muted-foreground">{notification.subject}</p>
                      </div>
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Notificações Falhadas */}
            {failedNotifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Notificações Falhadas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {failedNotifications.map(notification => (
                    <div key={notification.id} className="flex items-start justify-between p-3 border rounded-lg border-red-200 bg-red-50">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{notification.email}</p>
                        <p className="text-sm text-red-600">{notification.failureReason}</p>
                      </div>
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

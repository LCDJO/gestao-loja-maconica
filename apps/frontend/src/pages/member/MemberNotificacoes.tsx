import { useState, useEffect } from 'react';
import { useMemberAuth } from '@/contexts/MemberAuthContext';
import MemberPortalLayout from '@/components/layout/MemberPortalLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Bell, MessageCircle, Phone, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { memberNotificationPreferencesStore } from '@/lib/store';
import { MemberNotificationPreferences } from '@/lib/types';

export default function MemberNotificacoes() {
  const { currentMember } = useMemberAuth();
  const [preferences, setPreferences] = useState<MemberNotificationPreferences | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentMember) {
      const prefs = memberNotificationPreferencesStore.getPreferences(currentMember.id);
      setPreferences(prefs);
    }
  }, [currentMember]);

  const handleToggle = (key: keyof MemberNotificationPreferences, value: boolean) => {
    if (preferences) {
      setPreferences({ ...preferences, [key]: value });
    }
  };

  const handleNotificationTypeToggle = (type: string, value: boolean) => {
    if (preferences) {
      setPreferences({
        ...preferences,
        notificationTypes: {
          ...preferences.notificationTypes,
          [type]: value,
        },
      });
    }
  };

  const handlePhoneChange = (type: 'whatsapp' | 'sms', value: string) => {
    if (preferences) {
      setPreferences({
        ...preferences,
        [type === 'whatsapp' ? 'whatsappPhone' : 'smsPhone']: value,
      });
    }
  };

  const handleSave = () => {
    if (!preferences) return;

    setIsSaving(true);
    setTimeout(() => {
      memberNotificationPreferencesStore.updatePreferences(preferences);
      toast.success('Preferências de notificação salvas com sucesso');
      setIsSaving(false);
    }, 800);
  };

  if (!preferences) {
    return (
      <MemberPortalLayout>
        <div className="text-center py-12">Carregando...</div>
      </MemberPortalLayout>
    );
  }

  return (
    <MemberPortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">
            Preferências de Notificação
          </h1>
          <p className="text-muted-foreground font-serif italic mt-1">
            Controle como você deseja receber notificações sobre suas cobranças
          </p>
        </div>

        <Tabs defaultValue="canais" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="canais">Canais de Notificação</TabsTrigger>
            <TabsTrigger value="tipos">Tipos de Notificação</TabsTrigger>
          </TabsList>

          <TabsContent value="canais" className="space-y-6">
            {/* Email */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle>Email</CardTitle>
                      <CardDescription>
                        Receba notificações por email
                      </CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleToggle('emailNotifications', checked)
                    }
                  />
                </div>
              </CardHeader>
              {preferences.emailNotifications && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Notificações serão enviadas para: <strong>{currentMember?.email}</strong>
                  </p>
                </CardContent>
              )}
            </Card>

            {/* Push Notifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle>Notificações Push</CardTitle>
                      <CardDescription>
                        Receba notificações no navegador e aplicativo
                      </CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) =>
                      handleToggle('pushNotifications', checked)
                    }
                  />
                </div>
              </CardHeader>
              {preferences.pushNotifications && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Você receberá notificações instantâneas no seu navegador
                  </p>
                </CardContent>
              )}
            </Card>

            {/* WhatsApp */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle>WhatsApp</CardTitle>
                      <CardDescription>
                        Receba notificações via WhatsApp
                      </CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.whatsappNotifications}
                    onCheckedChange={(checked) =>
                      handleToggle('whatsappNotifications', checked)
                    }
                  />
                </div>
              </CardHeader>
              {preferences.whatsappNotifications && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">Número do WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      placeholder="(11) 99999-9999"
                      value={preferences.whatsappPhone || ''}
                      onChange={(e) => handlePhoneChange('whatsapp', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Inclua o código do país (ex: +55 para Brasil)
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* SMS */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle>SMS</CardTitle>
                      <CardDescription>
                        Receba notificações por SMS
                      </CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.smsNotifications}
                    onCheckedChange={(checked) =>
                      handleToggle('smsNotifications', checked)
                    }
                  />
                </div>
              </CardHeader>
              {preferences.smsNotifications && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sms">Número de Telefone</Label>
                    <Input
                      id="sms"
                      placeholder="(11) 99999-9999"
                      value={preferences.smsPhone || ''}
                      onChange={(e) => handlePhoneChange('sms', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Inclua o código do país (ex: +55 para Brasil)
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="tipos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Notificação</CardTitle>
                <CardDescription>
                  Selecione quais tipos de notificação você deseja receber
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Lembrete 3 dias antes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Notificação 3 dias antes do vencimento
                    </p>
                  </div>
                  <Switch
                    checked={preferences.notificationTypes.reminder3Days}
                    onCheckedChange={(checked) =>
                      handleNotificationTypeToggle('reminder3Days', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Lembrete 1 dia antes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Notificação 1 dia antes do vencimento
                    </p>
                  </div>
                  <Switch
                    checked={preferences.notificationTypes.reminder1Day}
                    onCheckedChange={(checked) =>
                      handleNotificationTypeToggle('reminder1Day', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Aviso 7 dias atrasado
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Notificação se estiver 7 dias atrasado
                    </p>
                  </div>
                  <Switch
                    checked={preferences.notificationTypes.overdue7Days}
                    onCheckedChange={(checked) =>
                      handleNotificationTypeToggle('overdue7Days', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Aviso 15 dias atrasado
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Notificação se estiver 15 dias atrasado
                    </p>
                  </div>
                  <Switch
                    checked={preferences.notificationTypes.overdue15Days}
                    onCheckedChange={(checked) =>
                      handleNotificationTypeToggle('overdue15Days', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Notificações de Eventos
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Notificação sobre eventos e atividades da loja
                    </p>
                  </div>
                  <Switch
                    checked={preferences.notificationTypes.eventNotifications}
                    onCheckedChange={(checked) =>
                      handleNotificationTypeToggle('eventNotifications', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Lembretes de Reunião
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Notificação antes de reuniões e sessões
                    </p>
                  </div>
                  <Switch
                    checked={preferences.notificationTypes.meetingReminders}
                    onCheckedChange={(checked) =>
                      handleNotificationTypeToggle('meetingReminders', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botão Salvar */}
        <div className="flex gap-3 pt-6 border-t">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-primary text-primary-foreground"
          >
            {isSaving ? 'Salvando...' : 'Salvar Preferências'}
          </Button>
        </div>

        {/* Confirmação */}
        <div className="p-4 bg-green-50/50 border border-green-100 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-700">Suas preferências foram salvas</p>
            <p className="text-sm text-green-600">
              Você receberá notificações de acordo com as configurações acima
            </p>
          </div>
        </div>
      </div>
    </MemberPortalLayout>
  );
}

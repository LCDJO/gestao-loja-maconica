import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Settings,
  Mail,
  MessageSquare,
  Phone,
  Save,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface LodgeSettings {
  // Geral
  lodgeName: string;
  lodgeNumber: string;
  lodgeCity: string;
  lodgeState: string;
  lodgeEmail: string;
  lodgePhone: string;
  lodgeLogo: string;

  // Tesouraria
  treasuryEmail: string;
  treasuryPhone: string;
  treasuryBankAccount: string;
  treasuryBankCode: string;
  treasuryPixKey: string;

  // Secretaria
  secretaryEmail: string;
  secretaryPhone: string;
  secretaryNotificationDays: number;
  secretaryMeetingReminder: boolean;

  // Comunicação
  emailProvider: 'smtp' | 'sendgrid' | 'mailgun';
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  whatsappProvider: 'evolution' | 'gowa' | 'none';
  whatsappApiKey: string;
  smsProvider: 'twilio' | 'none';
  smsApiKey: string;
}

export default function Parametrizacao() {
  const [activeTab, setActiveTab] = useState('geral');
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<LodgeSettings>({
    // Geral
    lodgeName: 'Loja Exemplo',
    lodgeNumber: '123',
    lodgeCity: 'São Paulo',
    lodgeState: 'SP',
    lodgeEmail: 'contato@lojaexemplo.com',
    lodgePhone: '(11) 99999-9999',
    lodgeLogo: '/images/logo-placeholder.png',

    // Tesouraria
    treasuryEmail: 'tesouraria@lojaexemplo.com',
    treasuryPhone: '(11) 98888-8888',
    treasuryBankAccount: '12345-6',
    treasuryBankCode: '001',
    treasuryPixKey: 'chave-pix@lojaexemplo.com',

    // Secretaria
    secretaryEmail: 'secretaria@lojaexemplo.com',
    secretaryPhone: '(11) 97777-7777',
    secretaryNotificationDays: 3,
    secretaryMeetingReminder: true,

    // Comunicação
    emailProvider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'seu-email@gmail.com',
    smtpPassword: '',
    whatsappProvider: 'evolution',
    whatsappApiKey: '',
    smsProvider: 'twilio',
    smsApiKey: '',
  });

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Parametrizações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar parametrizações');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Parametrização</h1>
          <p className="text-gray-600">
            Configure todos os parâmetros da sua loja em um único lugar
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white border border-gray-200">
            <TabsTrigger value="geral" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Settings className="h-4 w-4 mr-2" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="tesouraria" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Mail className="h-4 w-4 mr-2" />
              Tesouraria
            </TabsTrigger>
            <TabsTrigger value="secretaria" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <MessageSquare className="h-4 w-4 mr-2" />
              Secretaria
            </TabsTrigger>
            <TabsTrigger value="comunicacao" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Phone className="h-4 w-4 mr-2" />
              Comunicacao
            </TabsTrigger>
          </TabsList>

          {/* Aba Geral */}
          <TabsContent value="geral" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Informações Gerais da Loja</CardTitle>
                <CardDescription>
                  Dados básicos e identificação da loja maçônica
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lodge-name" className="text-sm font-medium text-gray-700">Nome da Loja</Label>
                    <Input
                      id="lodge-name"
                      value={settings.lodgeName}
                      onChange={(e) => handleChange('lodgeName', e.target.value)}
                      className="mt-1 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lodge-number" className="text-sm font-medium text-gray-700">Número da Loja</Label>
                    <Input
                      id="lodge-number"
                      value={settings.lodgeNumber}
                      onChange={(e) => handleChange('lodgeNumber', e.target.value)}
                      className="mt-1 border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lodge-city" className="text-sm font-medium text-gray-700">Cidade</Label>
                    <Input
                      id="lodge-city"
                      value={settings.lodgeCity}
                      onChange={(e) => handleChange('lodgeCity', e.target.value)}
                      className="mt-1 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lodge-state" className="text-sm font-medium text-gray-700">Estado</Label>
                    <Input
                      id="lodge-state"
                      value={settings.lodgeState}
                      onChange={(e) => handleChange('lodgeState', e.target.value)}
                      className="mt-1 border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lodge-email" className="text-sm font-medium text-gray-700">Email da Loja</Label>
                    <Input
                      id="lodge-email"
                      type="email"
                      value={settings.lodgeEmail}
                      onChange={(e) => handleChange('lodgeEmail', e.target.value)}
                      className="mt-1 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lodge-phone" className="text-sm font-medium text-gray-700">Telefone</Label>
                    <Input
                      id="lodge-phone"
                      value={settings.lodgePhone}
                      onChange={(e) => handleChange('lodgePhone', e.target.value)}
                      className="mt-1 border-gray-300"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Tesouraria */}
          <TabsContent value="tesouraria" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Configuração da Tesouraria</CardTitle>
                <CardDescription>
                  Dados de contato e informações bancárias do tesoureiro
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="treasury-email" className="text-sm font-medium text-gray-700">Email do Tesoureiro</Label>
                    <Input
                      id="treasury-email"
                      type="email"
                      value={settings.treasuryEmail}
                      onChange={(e) => handleChange('treasuryEmail', e.target.value)}
                      className="mt-1 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="treasury-phone" className="text-sm font-medium text-gray-700">Telefone do Tesoureiro</Label>
                    <Input
                      id="treasury-phone"
                      value={settings.treasuryPhone}
                      onChange={(e) => handleChange('treasuryPhone', e.target.value)}
                      className="mt-1 border-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-900">Informações Bancárias</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bank-code" className="text-xs text-gray-600">Código do Banco</Label>
                      <Input
                        id="bank-code"
                        value={settings.treasuryBankCode}
                        onChange={(e) => handleChange('treasuryBankCode', e.target.value)}
                        className="mt-1 border-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bank-account" className="text-xs text-gray-600">Conta Bancária</Label>
                      <Input
                        id="bank-account"
                        value={settings.treasuryBankAccount}
                        onChange={(e) => handleChange('treasuryBankAccount', e.target.value)}
                        className="mt-1 border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="pix-key" className="text-sm font-medium text-gray-700">Chave PIX</Label>
                  <Input
                    id="pix-key"
                    value={settings.treasuryPixKey}
                    onChange={(e) => handleChange('treasuryPixKey', e.target.value)}
                    className="mt-1 border-gray-300"
                    placeholder="chave-pix@lojaexemplo.com"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Secretaria */}
          <TabsContent value="secretaria" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Configuração da Secretaria</CardTitle>
                <CardDescription>
                  Dados de contato e preferências de notificação do secretário
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="secretary-email" className="text-sm font-medium text-gray-700">Email do Secretário</Label>
                    <Input
                      id="secretary-email"
                      type="email"
                      value={settings.secretaryEmail}
                      onChange={(e) => handleChange('secretaryEmail', e.target.value)}
                      className="mt-1 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="secretary-phone" className="text-sm font-medium text-gray-700">Telefone do Secretário</Label>
                    <Input
                      id="secretary-phone"
                      value={settings.secretaryPhone}
                      onChange={(e) => handleChange('secretaryPhone', e.target.value)}
                      className="mt-1 border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notification-days" className="text-sm font-medium text-gray-700">Dias para Notificar Reunião</Label>
                  <Input
                    id="notification-days"
                    type="number"
                    value={settings.secretaryNotificationDays}
                    onChange={(e) => handleChange('secretaryNotificationDays', parseInt(e.target.value))}
                    className="mt-1 border-gray-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">Quantos dias antes da reunião notificar os membros</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Lembrete de Reunião</p>
                    <p className="text-sm text-gray-600">Enviar lembrete automático antes de cada reunião</p>
                  </div>
                  <Switch
                    checked={settings.secretaryMeetingReminder}
                    onCheckedChange={(checked) => handleChange('secretaryMeetingReminder', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Comunicação */}
          <TabsContent value="comunicacao" className="space-y-6">
            {/* Email */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Configuração de Email</CardTitle>
                <CardDescription>
                  Escolha o provedor de email e configure as credenciais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email-provider" className="text-sm font-medium text-gray-700">Provedor de Email</Label>
                  <Select value={settings.emailProvider} onValueChange={(value) => handleChange('emailProvider', value)}>
                    <SelectTrigger className="mt-1 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smtp">SMTP</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {settings.emailProvider === 'smtp' && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="smtp-host" className="text-xs text-gray-600">Host SMTP</Label>
                        <Input
                          id="smtp-host"
                          value={settings.smtpHost}
                          onChange={(e) => handleChange('smtpHost', e.target.value)}
                          className="mt-1 border-gray-300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtp-port" className="text-xs text-gray-600">Porta</Label>
                        <Input
                          id="smtp-port"
                          value={settings.smtpPort}
                          onChange={(e) => handleChange('smtpPort', e.target.value)}
                          className="mt-1 border-gray-300"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="smtp-user" className="text-xs text-gray-600">Usuário</Label>
                      <Input
                        id="smtp-user"
                        value={settings.smtpUser}
                        onChange={(e) => handleChange('smtpUser', e.target.value)}
                        className="mt-1 border-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtp-password" className="text-xs text-gray-600">Senha</Label>
                      <Input
                        id="smtp-password"
                        type="password"
                        value={settings.smtpPassword}
                        onChange={(e) => handleChange('smtpPassword', e.target.value)}
                        className="mt-1 border-gray-300"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* WhatsApp */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Configuração de WhatsApp</CardTitle>
                <CardDescription>
                  Configure a integração com Evolution API ou GOWA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="whatsapp-provider" className="text-sm font-medium text-gray-700">Provedor de WhatsApp</Label>
                  <Select value={settings.whatsappProvider} onValueChange={(value) => handleChange('whatsappProvider', value)}>
                    <SelectTrigger className="mt-1 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="evolution">Evolution API</SelectItem>
                      <SelectItem value="gowa">GOWA</SelectItem>
                      <SelectItem value="none">Desativado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {settings.whatsappProvider !== 'none' && (
                  <div>
                    <Label htmlFor="whatsapp-key" className="text-xs text-gray-600">API Key</Label>
                    <Input
                      id="whatsapp-key"
                      type="password"
                      value={settings.whatsappApiKey}
                      onChange={(e) => handleChange('whatsappApiKey', e.target.value)}
                      className="mt-1 border-gray-300"
                      placeholder="Cole sua chave de API aqui"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SMS */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Configuração de SMS</CardTitle>
                <CardDescription>
                  Configure a integração com Twilio para envio de SMS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sms-provider" className="text-sm font-medium text-gray-700">Provedor de SMS</Label>
                  <Select value={settings.smsProvider} onValueChange={(value) => handleChange('smsProvider', value)}>
                    <SelectTrigger className="mt-1 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="none">Desativado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {settings.smsProvider !== 'none' && (
                  <div>
                    <Label htmlFor="sms-key" className="text-xs text-gray-600">API Key</Label>
                    <Input
                      id="sms-key"
                      type="password"
                      value={settings.smsApiKey}
                      onChange={(e) => handleChange('smsApiKey', e.target.value)}
                      className="mt-1 border-gray-300"
                      placeholder="Cole sua chave de API aqui"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botão Salvar */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" className="border-gray-300 text-gray-700">
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar Parametrizações'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

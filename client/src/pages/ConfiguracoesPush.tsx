import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Bell, FileSignature, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { oneSignalConfigStore, openSignConfigStore } from '@/lib/store';
import { OneSignalConfig, OpenSignConfig } from '@/lib/types';

export default function ConfiguracoesPush() {
  const [oneSignalConfig, setOneSignalConfig] = useState<OneSignalConfig>(
    oneSignalConfigStore.getConfig()
  );
  const [openSignConfig, setOpenSignConfig] = useState<OpenSignConfig>(
    openSignConfigStore.getConfig()
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleOneSignalChange = (key: string, value: any) => {
    setOneSignalConfig({ ...oneSignalConfig, [key]: value });
  };

  const handleOpenSignChange = (key: string, value: any) => {
    setOpenSignConfig({ ...openSignConfig, [key]: value });
  };

  const handleSaveOneSignal = () => {
    setIsSaving(true);
    setTimeout(() => {
      oneSignalConfigStore.updateConfig(oneSignalConfig);
      toast.success('Configuração OneSignal salva com sucesso');
      setIsSaving(false);
    }, 800);
  };

  const handleSaveOpenSign = () => {
    setIsSaving(true);
    setTimeout(() => {
      openSignConfigStore.updateConfig(openSignConfig);
      toast.success('Configuração OpenSign salva com sucesso');
      setIsSaving(false);
    }, 800);
  };

  const handleTestOneSignal = () => {
    if (!oneSignalConfig.enabled) {
      toast.error('OneSignal não está habilitado');
      return;
    }
    if (!oneSignalConfig.appId || !oneSignalConfig.restApiKey) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    toast.success('Teste de conexão enviado para OneSignal');
  };

  const handleTestOpenSign = () => {
    if (!openSignConfig.enabled) {
      toast.error('OpenSign não está habilitado');
      return;
    }
    if (!openSignConfig.apiKey) {
      toast.error('Preencha a chave de API');
      return;
    }
    toast.success('Teste de conexão enviado para OpenSign');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">
            Configurações de Push e Assinatura
          </h1>
          <p className="text-muted-foreground font-serif italic mt-1">
            Configure integrações com OneSignal e OpenSign
          </p>
        </div>

        <Tabs defaultValue="onesignal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="onesignal" className="gap-2">
              <Bell className="h-4 w-4" />
              OneSignal
            </TabsTrigger>
            <TabsTrigger value="opensign" className="gap-2">
              <FileSignature className="h-4 w-4" />
              OpenSign
            </TabsTrigger>
          </TabsList>

          <TabsContent value="onesignal" className="space-y-6">
            {/* Informações */}
            <Card className="bg-blue-50/50 border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-700">Sobre OneSignal</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-600">
                <p>
                  OneSignal é uma plataforma de notificações push que permite enviar
                  notificações para navegadores, aplicativos móveis e web. Ideal para
                  lembretes de vencimento de cobranças e eventos da loja.
                </p>
                <p className="mt-2">
                  <a
                    href="https://onesignal.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold"
                  >
                    Criar conta no OneSignal →
                  </a>
                </p>
              </CardContent>
            </Card>

            {/* Configuração */}
            <Card>
              <CardHeader>
                <CardTitle>Configuração OneSignal</CardTitle>
                <CardDescription>
                  Preencha os dados da sua conta OneSignal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Habilitar OneSignal</p>
                    <p className="text-sm text-muted-foreground">
                      {oneSignalConfig.enabled ? 'Ativo' : 'Inativo'}
                    </p>
                  </div>
                  <Switch
                    checked={oneSignalConfig.enabled}
                    onCheckedChange={(checked) =>
                      handleOneSignalChange('enabled', checked)
                    }
                  />
                </div>

                {oneSignalConfig.enabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="appId">App ID</Label>
                      <Input
                        id="appId"
                        placeholder="Seu App ID do OneSignal"
                        value={oneSignalConfig.appId}
                        onChange={(e) => handleOneSignalChange('appId', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Encontre em: OneSignal Dashboard → Settings → Keys & IDs
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <Input
                        id="apiKey"
                        placeholder="Sua API Key"
                        value={oneSignalConfig.apiKey}
                        onChange={(e) => handleOneSignalChange('apiKey', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="restApiKey">REST API Key</Label>
                      <Input
                        id="restApiKey"
                        type="password"
                        placeholder="Sua REST API Key"
                        value={oneSignalConfig.restApiKey}
                        onChange={(e) =>
                          handleOneSignalChange('restApiKey', e.target.value)
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Encontre em: OneSignal Dashboard → Settings → Keys & IDs
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleTestOneSignal}
                        variant="outline"
                        className="flex-1"
                      >
                        Testar Conexão
                      </Button>
                      <Button
                        onClick={handleSaveOneSignal}
                        disabled={isSaving}
                        className="flex-1 bg-blue-600 text-white"
                      >
                        {isSaving ? 'Salvando...' : 'Salvar Configuração'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Funcionalidades */}
            <Card>
              <CardHeader>
                <CardTitle>Funcionalidades Habilitadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      Notificações Push
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Envie notificações push para navegadores e aplicativos
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      Segmentação de Usuários
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Envie notificações direcionadas por grupo de membros
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      Agendamento
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Agende notificações para horários específicos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opensign" className="space-y-6">
            {/* Informações */}
            <Card className="bg-purple-50/50 border-purple-100">
              <CardHeader>
                <CardTitle className="text-purple-700">Sobre OpenSign</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-purple-600">
                <p>
                  OpenSign é uma plataforma de assinatura eletrônica que permite
                  assinar documentos digitalmente. Perfeito para assinar atas,
                  estatutos e outros documentos maçônicos.
                </p>
                <p className="mt-2">
                  <a
                    href="https://opensign.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold"
                  >
                    Criar conta no OpenSign →
                  </a>
                </p>
              </CardContent>
            </Card>

            {/* Configuração */}
            <Card>
              <CardHeader>
                <CardTitle>Configuração OpenSign</CardTitle>
                <CardDescription>
                  Preencha os dados da sua conta OpenSign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Habilitar OpenSign</p>
                    <p className="text-sm text-muted-foreground">
                      {openSignConfig.enabled ? 'Ativo' : 'Inativo'}
                    </p>
                  </div>
                  <Switch
                    checked={openSignConfig.enabled}
                    onCheckedChange={(checked) =>
                      handleOpenSignChange('enabled', checked)
                    }
                  />
                </div>

                {openSignConfig.enabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <Input
                        id="apiKey"
                        type="password"
                        placeholder="Sua API Key do OpenSign"
                        value={openSignConfig.apiKey}
                        onChange={(e) => handleOpenSignChange('apiKey', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Encontre em: OpenSign Dashboard → Settings → API Keys
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apiUrl">URL da API</Label>
                      <Input
                        id="apiUrl"
                        placeholder="https://api.opensign.com"
                        value={openSignConfig.apiUrl}
                        onChange={(e) => handleOpenSignChange('apiUrl', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signerEmail">Email do Signatário</Label>
                      <Input
                        id="signerEmail"
                        type="email"
                        placeholder="seu-email@loja-maconica.com.br"
                        value={openSignConfig.signerEmail}
                        onChange={(e) =>
                          handleOpenSignChange('signerEmail', e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signerName">Nome do Signatário</Label>
                      <Input
                        id="signerName"
                        placeholder="Seu Nome Completo"
                        value={openSignConfig.signerName}
                        onChange={(e) =>
                          handleOpenSignChange('signerName', e.target.value)
                        }
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleTestOpenSign}
                        variant="outline"
                        className="flex-1"
                      >
                        Testar Conexão
                      </Button>
                      <Button
                        onClick={handleSaveOpenSign}
                        disabled={isSaving}
                        className="flex-1 bg-purple-600 text-white"
                      >
                        {isSaving ? 'Salvando...' : 'Salvar Configuração'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Funcionalidades */}
            <Card>
              <CardHeader>
                <CardTitle>Funcionalidades Habilitadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      Assinatura Digital
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Envie documentos para assinatura eletrônica
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      Rastreamento de Assinatura
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Acompanhe o status de assinatura em tempo real
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      Certificado Digital
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Documentos assinados com certificado digital
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

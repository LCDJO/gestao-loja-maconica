import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Zap,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentIntegration {
  id: string;
  provider: 'stripe' | 'pagseguro';
  enabled: boolean;
  apiKey: string;
  secretKey: string;
  publicKey?: string;
  webhookUrl: string;
  testMode: boolean;
  connectedAt: Date;
  lastSync: Date;
  transactionCount: number;
  totalProcessed: number;
}

export default function IntegracoesPagamentos() {
  const [activeTab, setActiveTab] = useState('stripe');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const [integrations, setIntegrations] = useState<PaymentIntegration[]>([
    {
      id: '1',
      provider: 'stripe',
      enabled: true,
      apiKey: 'sk_live_51234567890abcdef',
      secretKey: 'sk_live_secret_1234567890abcdef',
      publicKey: 'pk_live_1234567890abcdef',
      webhookUrl: 'https://gestao-loja-maconica.manus.space/webhooks/stripe',
      testMode: false,
      connectedAt: new Date('2024-01-15'),
      lastSync: new Date(),
      transactionCount: 342,
      totalProcessed: 45230.50,
    },
    {
      id: '2',
      provider: 'pagseguro',
      enabled: false,
      apiKey: 'pagseguro_api_key_123456',
      secretKey: 'pagseguro_secret_key_123456',
      webhookUrl: 'https://gestao-loja-maconica.manus.space/webhooks/pagseguro',
      testMode: true,
      connectedAt: new Date('2024-02-01'),
      lastSync: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      transactionCount: 0,
      totalProcessed: 0,
    },
  ]);

  const [stripeConfig, setStripeConfig] = useState({
    apiKey: integrations[0]?.apiKey || '',
    secretKey: integrations[0]?.secretKey || '',
    publicKey: integrations[0]?.publicKey || '',
    testMode: integrations[0]?.testMode || false,
  });

  const [pagseguroConfig, setPagseguroConfig] = useState({
    apiKey: integrations[1]?.apiKey || '',
    secretKey: integrations[1]?.secretKey || '',
    testMode: integrations[1]?.testMode || false,
  });

  const handleToggleIntegration = (id: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id ? { ...integration, enabled: !integration.enabled } : integration
    ));
  };

  const handleSaveStripeConfig = () => {
    if (!stripeConfig.apiKey || !stripeConfig.secretKey) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIntegrations(integrations.map(integration =>
      integration.id === '1'
        ? {
            ...integration,
            apiKey: stripeConfig.apiKey,
            secretKey: stripeConfig.secretKey,
            publicKey: stripeConfig.publicKey,
            testMode: stripeConfig.testMode,
            lastSync: new Date(),
          }
        : integration
    ));

    toast.success('Configuração Stripe salva com sucesso!');
  };

  const handleSavePagseguroConfig = () => {
    if (!pagseguroConfig.apiKey || !pagseguroConfig.secretKey) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIntegrations(integrations.map(integration =>
      integration.id === '2'
        ? {
            ...integration,
            apiKey: pagseguroConfig.apiKey,
            secretKey: pagseguroConfig.secretKey,
            testMode: pagseguroConfig.testMode,
            lastSync: new Date(),
          }
        : integration
    ));

    toast.success('Configuração PagSeguro salva com sucesso!');
  };

  const handleCopyWebhook = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copiada para a área de transferência');
  };

  const handleTestConnection = (provider: string) => {
    toast.loading('Testando conexão...');
    setTimeout(() => {
      toast.success(`Conexão com ${provider} estabelecida com sucesso!`);
    }, 2000);
  };

  const stripeIntegration = integrations.find(i => i.provider === 'stripe');
  const pagseguroIntegration = integrations.find(i => i.provider === 'pagseguro');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-8 w-8 text-blue-600" />
              Integração de Pagamentos
            </h1>
            <p className="text-gray-600 text-sm mt-1">Configure Stripe ou PagSeguro para processar mensalidades</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status das Integrações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {stripeIntegration && (
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Stripe</h3>
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Status:</span>{' '}
                        <span className={stripeIntegration.enabled ? 'text-green-600 font-medium' : 'text-gray-600'}>
                          {stripeIntegration.enabled ? '✓ Ativa' : 'Inativa'}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Modo:</span> {stripeIntegration.testMode ? 'Teste' : 'Produção'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Transações:</span> {stripeIntegration.transactionCount}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Total processado:</span> R$ {stripeIntegration.totalProcessed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {stripeIntegration.enabled ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {pagseguroIntegration && (
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">PagSeguro</h3>
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Status:</span>{' '}
                        <span className={pagseguroIntegration.enabled ? 'text-green-600 font-medium' : 'text-gray-600'}>
                          {pagseguroIntegration.enabled ? '✓ Ativa' : 'Inativa'}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Modo:</span> {pagseguroIntegration.testMode ? 'Teste' : 'Produção'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Transações:</span> {pagseguroIntegration.transactionCount}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Total processado:</span> R$ {pagseguroIntegration.totalProcessed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {pagseguroIntegration.enabled ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tabs de Configuração */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white border border-gray-200">
            <TabsTrigger value="stripe" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              Stripe
            </TabsTrigger>
            <TabsTrigger value="pagseguro" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              PagSeguro
            </TabsTrigger>
          </TabsList>

          {/* Aba Stripe */}
          <TabsContent value="stripe" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Configuração Stripe</CardTitle>
                <CardDescription>
                  Configure suas credenciais do Stripe para processar pagamentos de mensalidades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-blue-900">Status da Integração</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {stripeIntegration?.enabled ? 'Integração ativa e funcionando' : 'Integração inativa'}
                    </p>
                  </div>
                  <Switch
                    checked={stripeIntegration?.enabled || false}
                    onCheckedChange={() => handleToggleIntegration('1')}
                  />
                </div>

                {/* API Key */}
                <div>
                  <Label htmlFor="stripe-api-key" className="text-sm font-medium text-gray-700">
                    API Key (Secret)
                  </Label>
                  <div className="mt-1 flex gap-2">
                    <Input
                      id="stripe-api-key"
                      type={showKeys['stripe-api'] ? 'text' : 'password'}
                      value={stripeConfig.apiKey}
                      onChange={(e) => setStripeConfig({ ...stripeConfig, apiKey: e.target.value })}
                      className="flex-1 border-gray-300"
                      placeholder="sk_live_..."
                    />
                    <Button
                      onClick={() => setShowKeys({ ...showKeys, 'stripe-api': !showKeys['stripe-api'] })}
                      variant="outline"
                      className="border-gray-300 text-gray-700"
                    >
                      {showKeys['stripe-api'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Obtenha em: https://dashboard.stripe.com/apikeys</p>
                </div>

                {/* Secret Key */}
                <div>
                  <Label htmlFor="stripe-secret-key" className="text-sm font-medium text-gray-700">
                    Secret Key
                  </Label>
                  <div className="mt-1 flex gap-2">
                    <Input
                      id="stripe-secret-key"
                      type={showKeys['stripe-secret'] ? 'text' : 'password'}
                      value={stripeConfig.secretKey}
                      onChange={(e) => setStripeConfig({ ...stripeConfig, secretKey: e.target.value })}
                      className="flex-1 border-gray-300"
                      placeholder="sk_live_secret_..."
                    />
                    <Button
                      onClick={() => setShowKeys({ ...showKeys, 'stripe-secret': !showKeys['stripe-secret'] })}
                      variant="outline"
                      className="border-gray-300 text-gray-700"
                    >
                      {showKeys['stripe-secret'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Public Key */}
                <div>
                  <Label htmlFor="stripe-public-key" className="text-sm font-medium text-gray-700">
                    Public Key
                  </Label>
                  <div className="mt-1 flex gap-2">
                    <Input
                      id="stripe-public-key"
                      type="text"
                      value={stripeConfig.publicKey}
                      onChange={(e) => setStripeConfig({ ...stripeConfig, publicKey: e.target.value })}
                      className="flex-1 border-gray-300"
                      placeholder="pk_live_..."
                    />
                    <Button
                      onClick={() => handleCopyWebhook(stripeConfig.publicKey)}
                      variant="outline"
                      className="border-gray-300 text-gray-700"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Webhook URL */}
                <div>
                  <Label htmlFor="stripe-webhook" className="text-sm font-medium text-gray-700">
                    Webhook URL
                  </Label>
                  <div className="mt-1 flex gap-2">
                    <Input
                      id="stripe-webhook"
                      type="text"
                      value={stripeIntegration?.webhookUrl || ''}
                      readOnly
                      className="flex-1 border-gray-300 bg-gray-50"
                    />
                    <Button
                      onClick={() => handleCopyWebhook(stripeIntegration?.webhookUrl || '')}
                      variant="outline"
                      className="border-gray-300 text-gray-700"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Configure esta URL em: https://dashboard.stripe.com/webhooks</p>
                </div>

                {/* Modo Teste */}
                <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-amber-900">Modo Teste</h4>
                    <p className="text-sm text-amber-700 mt-1">Use credenciais de teste para validar integrações</p>
                  </div>
                  <Switch
                    checked={stripeConfig.testMode}
                    onCheckedChange={(checked) => setStripeConfig({ ...stripeConfig, testMode: checked })}
                  />
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleTestConnection('Stripe')}
                    variant="outline"
                    className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Testar Conexão
                  </Button>
                  <Button
                    onClick={handleSaveStripeConfig}
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Salvar Configuração
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba PagSeguro */}
          <TabsContent value="pagseguro" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Configuração PagSeguro</CardTitle>
                <CardDescription>
                  Configure suas credenciais do PagSeguro para processar pagamentos de mensalidades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-blue-900">Status da Integração</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {pagseguroIntegration?.enabled ? 'Integração ativa e funcionando' : 'Integração inativa'}
                    </p>
                  </div>
                  <Switch
                    checked={pagseguroIntegration?.enabled || false}
                    onCheckedChange={() => handleToggleIntegration('2')}
                  />
                </div>

                {/* API Key */}
                <div>
                  <Label htmlFor="pagseguro-api-key" className="text-sm font-medium text-gray-700">
                    API Key
                  </Label>
                  <div className="mt-1 flex gap-2">
                    <Input
                      id="pagseguro-api-key"
                      type={showKeys['pagseguro-api'] ? 'text' : 'password'}
                      value={pagseguroConfig.apiKey}
                      onChange={(e) => setPagseguroConfig({ ...pagseguroConfig, apiKey: e.target.value })}
                      className="flex-1 border-gray-300"
                      placeholder="pagseguro_api_key_..."
                    />
                    <Button
                      onClick={() => setShowKeys({ ...showKeys, 'pagseguro-api': !showKeys['pagseguro-api'] })}
                      variant="outline"
                      className="border-gray-300 text-gray-700"
                    >
                      {showKeys['pagseguro-api'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Obtenha em: https://meu.pagseguro.com/integracao/api</p>
                </div>

                {/* Secret Key */}
                <div>
                  <Label htmlFor="pagseguro-secret-key" className="text-sm font-medium text-gray-700">
                    Secret Key
                  </Label>
                  <div className="mt-1 flex gap-2">
                    <Input
                      id="pagseguro-secret-key"
                      type={showKeys['pagseguro-secret'] ? 'text' : 'password'}
                      value={pagseguroConfig.secretKey}
                      onChange={(e) => setPagseguroConfig({ ...pagseguroConfig, secretKey: e.target.value })}
                      className="flex-1 border-gray-300"
                      placeholder="pagseguro_secret_key_..."
                    />
                    <Button
                      onClick={() => setShowKeys({ ...showKeys, 'pagseguro-secret': !showKeys['pagseguro-secret'] })}
                      variant="outline"
                      className="border-gray-300 text-gray-700"
                    >
                      {showKeys['pagseguro-secret'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Webhook URL */}
                <div>
                  <Label htmlFor="pagseguro-webhook" className="text-sm font-medium text-gray-700">
                    Webhook URL
                  </Label>
                  <div className="mt-1 flex gap-2">
                    <Input
                      id="pagseguro-webhook"
                      type="text"
                      value={pagseguroIntegration?.webhookUrl || ''}
                      readOnly
                      className="flex-1 border-gray-300 bg-gray-50"
                    />
                    <Button
                      onClick={() => handleCopyWebhook(pagseguroIntegration?.webhookUrl || '')}
                      variant="outline"
                      className="border-gray-300 text-gray-700"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Configure esta URL em: https://meu.pagseguro.com/integracao/webhooks</p>
                </div>

                {/* Modo Teste */}
                <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-amber-900">Modo Teste</h4>
                    <p className="text-sm text-amber-700 mt-1">Use credenciais de teste para validar integrações</p>
                  </div>
                  <Switch
                    checked={pagseguroConfig.testMode}
                    onCheckedChange={(checked) => setPagseguroConfig({ ...pagseguroConfig, testMode: checked })}
                  />
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleTestConnection('PagSeguro')}
                    variant="outline"
                    className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Testar Conexão
                  </Button>
                  <Button
                    onClick={handleSavePagseguroConfig}
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Salvar Configuração
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Check, AlertCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmailConfig, sendEmail, emailHistoryStore, EmailHistory } from "@/lib/emailService";

export default function ConfiguracaoEmail() {
  const [config, setConfig] = useState<EmailConfig>({
    provider: 'sendgrid',
    apiKey: '',
    fromEmail: '',
    fromName: 'Sistema de Gestão de Lojas Maçônicas',
    enabled: false,
  });

  const [history, setHistory] = useState<EmailHistory[]>(emailHistoryStore.getAll());
  const [isTesting, setIsTesting] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const handleSaveConfig = () => {
    if (!config.apiKey || !config.fromEmail) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    localStorage.setItem('email_config', JSON.stringify(config));
    toast.success("Configuração de email salva com sucesso!");
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error("Digite um email para teste");
      return;
    }

    setIsTesting(true);
    try {
      const result = await sendEmail(config, {
        to: [testEmail],
        subject: "Teste de Configuração - Sistema de Gestão de Lojas Maçônicas",
        html: `
          <html>
            <body style="font-family: Arial, sans-serif;">
              <h2>Teste de Email</h2>
              <p>Este é um email de teste para verificar se sua configuração de email está funcionando corretamente.</p>
              <p><strong>Provedor:</strong> ${config.provider}</p>
              <p><strong>De:</strong> ${config.fromName} &lt;${config.fromEmail}&gt;</p>
              <p><strong>Enviado em:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            </body>
          </html>
        `,
      });

      if (result.success) {
        toast.success("Email de teste enviado com sucesso!");
        const historyEntry = emailHistoryStore.add({
          recipients: [testEmail],
          subject: "Teste de Configuração",
          reportType: 'sistema' as any,
          status: 'enviado',
          messageId: result.messageId,
          sentAt: new Date().toISOString(),
        });
        setHistory([historyEntry, ...history]);
      } else {
        toast.error(`Erro ao enviar email: ${result.error}`);
      }
    } finally {
      setIsTesting(false);
    }
  };

  const loadConfig = () => {
    const stored = localStorage.getItem('email_config');
    if (stored) {
      setConfig(JSON.parse(stored));
      toast.success("Configuração carregada");
    } else {
      toast.info("Nenhuma configuração salva");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Configuração de Email</h1>
            <p className="text-slate-600 mt-2">Configure SendGrid ou Mailgun para envio de relatórios</p>
          </div>
          <Mail className="h-12 w-12 text-blue-600 opacity-20" />
        </div>

        {/* Configuração */}
        <Card>
          <CardHeader>
            <CardTitle>Provedor de Email</CardTitle>
            <CardDescription>Selecione e configure seu provedor de email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Provedor</Label>
              <Select value={config.provider} onValueChange={v => setConfig({...config, provider: v as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {config.provider === 'sendgrid' 
                  ? 'SendGrid: Serviço confiável com excelente entregabilidade'
                  : 'Mailgun: Flexível com APIs poderosas para email marketing'}
              </p>
            </div>

            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                placeholder={config.provider === 'sendgrid' ? 'SG.xxxxxxxxxxxxxxxx' : 'key-xxxxxxxxxxxxxxxx'}
                value={config.apiKey}
                onChange={e => setConfig({...config, apiKey: e.target.value})}
              />
              <p className="text-xs text-gray-500">
                {config.provider === 'sendgrid'
                  ? 'Obtenha em: https://app.sendgrid.com/settings/api_keys'
                  : 'Obtenha em: https://app.mailgun.com/app/account/security/api_keys'}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Email de Origem</Label>
              <Input
                type="email"
                placeholder="noreply@seudominio.com"
                value={config.fromEmail}
                onChange={e => setConfig({...config, fromEmail: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Nome do Remetente</Label>
              <Input
                placeholder="Sistema de Gestão de Lojas Maçônicas"
                value={config.fromName}
                onChange={e => setConfig({...config, fromName: e.target.value})}
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <input
                type="checkbox"
                id="enabled"
                checked={config.enabled}
                onChange={e => setConfig({...config, enabled: e.target.checked})}
                className="w-4 h-4"
              />
              <label htmlFor="enabled" className="text-sm font-medium text-blue-900">
                Habilitar envio de emails
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveConfig} className="gap-2">
                <Check className="h-4 w-4" /> Salvar Configuração
              </Button>
              <Button variant="outline" onClick={loadConfig}>
                Carregar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Teste de Email */}
        <Card>
          <CardHeader>
            <CardTitle>Teste de Email</CardTitle>
            <CardDescription>Envie um email de teste para verificar a configuração</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email para Teste</Label>
              <Input
                type="email"
                placeholder="seu.email@exemplo.com"
                value={testEmail}
                onChange={e => setTestEmail(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleTestEmail} 
              disabled={isTesting || !config.apiKey}
              className="gap-2"
            >
              <Send className="h-4 w-4" /> 
              {isTesting ? 'Enviando...' : 'Enviar Email de Teste'}
            </Button>
          </CardContent>
        </Card>

        {/* Histórico */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Envios</CardTitle>
            <CardDescription>Últimos emails enviados</CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum email enviado ainda</p>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 10).map(entry => (
                  <div key={entry.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{entry.subject}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Para: {entry.recipients.join(', ')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(entry.sentAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {entry.status === 'enviado' ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <Check className="h-4 w-4" />
                            <span className="text-xs font-medium">Enviado</span>
                          </div>
                        ) : entry.status === 'falha' ? (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">Falha</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-yellow-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">Pendente</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {entry.error && (
                      <p className="text-xs text-red-600 mt-2">Erro: {entry.error}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

import { useState } from 'react';
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
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit,
  Plus,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface AutomationRule {
  id: string;
  name: string;
  trigger: 'days_before_due' | 'days_after_due' | 'monthly_date';
  triggerValue: number;
  channel: 'email' | 'sms' | 'whatsapp' | 'push';
  template: string;
  enabled: boolean;
  createdAt: Date;
  lastExecuted?: Date;
  executionCount: number;
}

export default function AutomacaoCampanhas() {
  const [activeTab, setActiveTab] = useState('regras');
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Lembrete 3 dias antes do vencimento',
      trigger: 'days_before_due',
      triggerValue: 3,
      channel: 'email',
      template: 'template-reminder-3days',
      enabled: true,
      createdAt: new Date('2024-01-15'),
      lastExecuted: new Date(),
      executionCount: 145,
    },
    {
      id: '2',
      name: 'Notificação 1 dia antes do vencimento',
      trigger: 'days_before_due',
      triggerValue: 1,
      channel: 'sms',
      template: 'template-reminder-1day',
      enabled: true,
      createdAt: new Date('2024-01-20'),
      lastExecuted: new Date(Date.now() - 24 * 60 * 60 * 1000),
      executionCount: 89,
    },
    {
      id: '3',
      name: 'Cobrança 7 dias após atraso',
      trigger: 'days_after_due',
      triggerValue: 7,
      channel: 'whatsapp',
      template: 'template-overdue-7days',
      enabled: true,
      createdAt: new Date('2024-02-01'),
      lastExecuted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      executionCount: 34,
    },
  ]);

  const [showNewRuleForm, setShowNewRuleForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    trigger: 'days_before_due' as const,
    triggerValue: 3,
    channel: 'email' as const,
    template: '',
  });

  const handleAddRule = () => {
    if (!newRule.name || !newRule.template) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const rule: AutomationRule = {
      id: `rule-${Date.now()}`,
      name: newRule.name,
      trigger: newRule.trigger,
      triggerValue: newRule.triggerValue,
      channel: newRule.channel,
      template: newRule.template,
      enabled: true,
      createdAt: new Date(),
      executionCount: 0,
    };

    setRules([...rules, rule]);
    setNewRule({
      name: '',
      trigger: 'days_before_due',
      triggerValue: 3,
      channel: 'email',
      template: '',
    });
    setShowNewRuleForm(false);
    toast.success('Regra de automação criada com sucesso!');
  };

  const handleToggleRule = (id: string) => {
    setRules(rules.map(rule =>
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    toast.success('Regra removida');
  };

  const getTriggerLabel = (trigger: string, value: number) => {
    switch (trigger) {
      case 'days_before_due':
        return `${value} dia(s) antes do vencimento`;
      case 'days_after_due':
        return `${value} dia(s) após atraso`;
      case 'monthly_date':
        return `Dia ${value} de cada mês`;
      default:
        return trigger;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return '📧';
      case 'sms':
        return '📱';
      case 'whatsapp':
        return '💬';
      case 'push':
        return '🔔';
      default:
        return '📨';
    }
  };

  const enabledRules = rules.filter(r => r.enabled).length;
  const totalExecutions = rules.reduce((sum, rule) => sum + rule.executionCount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="h-8 w-8 text-blue-600" />
              Automação de Campanhas
            </h1>
            <p className="text-gray-600 text-sm mt-1">Configure regras para disparar notificações automaticamente</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Regras Ativas</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{enabledRules}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total de Execuções</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalExecutions}</p>
                </div>
                <Activity className="h-10 w-10 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Taxa de Sucesso</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">98.5%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white border border-gray-200">
            <TabsTrigger value="regras" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Zap className="h-4 w-4 mr-2" />
              Regras de Automação
            </TabsTrigger>
            <TabsTrigger value="historico" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Clock className="h-4 w-4 mr-2" />
              Histórico de Execução
            </TabsTrigger>
          </TabsList>

          {/* Aba Regras */}
          <TabsContent value="regras" className="space-y-6">
            <div className="flex justify-end">
              <Button
                onClick={() => setShowNewRuleForm(!showNewRuleForm)}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Regra
              </Button>
            </div>

            {showNewRuleForm && (
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Criar Nova Regra de Automação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="rule-name" className="text-sm font-medium text-gray-700">Nome da Regra</Label>
                    <Input
                      id="rule-name"
                      value={newRule.name}
                      onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                      placeholder="Ex: Lembrete 3 dias antes do vencimento"
                      className="mt-1 border-gray-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="trigger" className="text-sm font-medium text-gray-700">Gatilho</Label>
                      <Select value={newRule.trigger} onValueChange={(value: any) => setNewRule({ ...newRule, trigger: value })}>
                        <SelectTrigger className="mt-1 border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="days_before_due">Dias antes do vencimento</SelectItem>
                          <SelectItem value="days_after_due">Dias após atraso</SelectItem>
                          <SelectItem value="monthly_date">Data fixa mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="trigger-value" className="text-sm font-medium text-gray-700">Valor</Label>
                      <Input
                        id="trigger-value"
                        type="number"
                        value={newRule.triggerValue}
                        onChange={(e) => setNewRule({ ...newRule, triggerValue: parseInt(e.target.value) })}
                        className="mt-1 border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="channel" className="text-sm font-medium text-gray-700">Canal</Label>
                      <Select value={newRule.channel} onValueChange={(value: any) => setNewRule({ ...newRule, channel: value })}>
                        <SelectTrigger className="mt-1 border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">📧 Email</SelectItem>
                          <SelectItem value="sms">📱 SMS</SelectItem>
                          <SelectItem value="whatsapp">💬 WhatsApp</SelectItem>
                          <SelectItem value="push">🔔 Push</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="template" className="text-sm font-medium text-gray-700">Template</Label>
                      <Select value={newRule.template} onValueChange={(value) => setNewRule({ ...newRule, template: value })}>
                        <SelectTrigger className="mt-1 border-gray-300">
                          <SelectValue placeholder="Selecione um template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="template-reminder-3days">Lembrete 3 dias</SelectItem>
                          <SelectItem value="template-reminder-1day">Lembrete 1 dia</SelectItem>
                          <SelectItem value="template-overdue-7days">Cobrança 7 dias</SelectItem>
                          <SelectItem value="template-overdue-15days">Cobrança 15 dias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleAddRule}
                      className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Criar Regra
                    </Button>
                    <Button
                      onClick={() => setShowNewRuleForm(false)}
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de Regras */}
            <div className="space-y-4">
              {rules.map(rule => (
                <Card key={rule.id} className="border-gray-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${rule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {rule.enabled ? 'Ativa' : 'Inativa'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                          <div>
                            <p className="text-gray-600">Gatilho</p>
                            <p className="font-medium text-gray-900">{getTriggerLabel(rule.trigger, rule.triggerValue)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Canal</p>
                            <p className="font-medium text-gray-900">{getChannelIcon(rule.channel)} {rule.channel.toUpperCase()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Execuções</p>
                            <p className="font-medium text-gray-900">{rule.executionCount}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Última execução</p>
                            <p className="font-medium text-gray-900">
                              {rule.lastExecuted ? rule.lastExecuted.toLocaleDateString('pt-BR') : 'Nunca'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={() => handleToggleRule(rule.id)}
                          />
                        </div>
                        <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteRule(rule.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Aba Histórico */}
          <TabsContent value="historico" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Histórico de Execução</CardTitle>
                <CardDescription>
                  Acompanhe quando cada regra foi executada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rules.map(rule => (
                    <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{rule.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {getChannelIcon(rule.channel)} {rule.channel.toUpperCase()} • {getTriggerLabel(rule.trigger, rule.triggerValue)}
                          </p>
                          <div className="mt-3 space-y-1">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Total de execuções:</span> {rule.executionCount}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Última execução:</span> {rule.lastExecuted ? rule.lastExecuted.toLocaleString('pt-BR') : 'Nunca'}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Criada em:</span> {rule.createdAt.toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            <CheckCircle className="h-4 w-4" />
                            Ativa
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

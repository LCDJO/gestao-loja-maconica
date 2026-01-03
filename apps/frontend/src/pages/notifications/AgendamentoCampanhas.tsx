import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Calendar, Send, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { campaignStore, notificationTemplateStore, memberStore, webhookEventStore } from '@/lib/store';
import { NotificationCampaign } from '@/lib/types';

export default function AgendamentoCampanhas() {
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>(campaignStore.getCampaigns());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NotificationCampaign>>({
    name: '',
    description: '',
    billType: 'mensalidade',
    channel: 'email',
    scheduledFor: new Date().toISOString().slice(0, 16),
    templateId: '',
    recipientCount: 0,
    abTest: {
      enabled: false,
      templateAId: '',
      templateBId: '',
      splitPercentage: 50,
    },
  });

  const templates = notificationTemplateStore.getTemplates();
  const members = memberStore.getAll();

  const handleNewCampaign = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      billType: 'mensalidade',
      channel: 'email',
      scheduledFor: new Date().toISOString().slice(0, 16),
      templateId: '',
      recipientCount: 0,
      abTest: {
        enabled: false,
        templateAId: '',
        templateBId: '',
        splitPercentage: 50,
      },
    });
  };

  const handleSaveCampaign = () => {
    if (!formData.name || !formData.templateId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (editingId) {
      const updated = campaignStore.updateCampaign(editingId, {
        ...formData,
        status: 'scheduled',
      } as any);
      if (updated) {
        setCampaigns(campaignStore.getCampaigns());
        toast.success('Campanha atualizada com sucesso');
        setEditingId(null);
      }
    } else {
      const newCampaign = campaignStore.addCampaign({
        ...formData,
        status: 'draft',
        recipientCount: members.length,
      } as any);
      setCampaigns(campaignStore.getCampaigns());
      toast.success('Campanha criada com sucesso');
      setEditingId(null);
    }
  };

  const handleSendCampaign = (id: string) => {
    const campaign = campaignStore.getCampaignById(id);
    if (!campaign) return;

    // Simular envio de campanha
    const updated = campaignStore.updateCampaign(id, {
      status: 'sent',
      sentAt: new Date().toISOString(),
      campaignMetrics: {
        sent: campaign.recipientCount,
        delivered: Math.floor(campaign.recipientCount * 0.95),
        opened: Math.floor(campaign.recipientCount * 0.35),
        clicked: Math.floor(campaign.recipientCount * 0.15),
        converted: Math.floor(campaign.recipientCount * 0.08),
        revenue: Math.floor(campaign.recipientCount * 0.08 * 150),
        openRate: 35,
        clickRate: 15,
        conversionRate: 8,
        roi: 250,
      },
    });

    if (updated) {
      // Simular eventos de webhook
      members.slice(0, Math.floor(campaign.recipientCount * 0.95)).forEach((member: any, index: number) => {
        setTimeout(() => {
          webhookEventStore.addEvent({
            campaignId: id,
            type: Math.random() > 0.7 ? 'converted' : (Math.random() > 0.5 ? 'opened' : 'delivered'),
            memberId: member.id,
            memberEmail: member.email,
            timestamp: new Date().toISOString(),
            metadata: {
              templateId: campaign.templateId,
              paymentAmount: Math.random() > 0.92 ? 150 : 0,
            },
          });
        }, Math.random() * 5000);
      });

      setCampaigns(campaignStore.getCampaigns());
      toast.success('Campanha enviada com sucesso!');
    }
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta campanha?')) {
      campaignStore.deleteCampaign(id);
      setCampaigns(campaignStore.getCampaigns());
      toast.success('Campanha deletada com sucesso');
    }
  };

  const billTypes = [
    { value: 'mensalidade', label: 'Mensalidade' },
    { value: 'mutua', label: 'Mútua' },
    { value: 'taxa', label: 'Taxa' },
    { value: 'outro', label: 'Outro' },
  ];

  const channels = [
    { value: 'email', label: 'Email' },
    { value: 'push', label: 'Push' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'sms', label: 'SMS' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">
              Agendamento de Campanhas
            </h1>
            <p className="text-muted-foreground font-serif italic mt-1">
              Crie e agende campanhas de notificação com testes A/B
            </p>
          </div>
          <Button onClick={handleNewCampaign} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Campanha
          </Button>
        </div>

        <Tabs defaultValue="lista" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="lista">Minhas Campanhas</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="lista" className="space-y-4">
            {campaigns.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Nenhuma campanha criada ainda</p>
                  <Button onClick={handleNewCampaign} className="mt-4">
                    Criar Primeira Campanha
                  </Button>
                </CardContent>
              </Card>
            ) : (
              campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{campaign.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {billTypes.find(b => b.value === campaign.billType)?.label} •{' '}
                          {channels.find(c => c.value === campaign.channel)?.label} •{' '}
                          {new Date(campaign.scheduledFor).toLocaleString('pt-BR')}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {campaign.status === 'draft' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(campaign.id);
                                setFormData(campaign);
                              }}
                            >
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              className="gap-1"
                              onClick={() => handleSendCampaign(campaign.id)}
                            >
                              <Send className="h-4 w-4" />
                              Enviar
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-foreground">{campaign.description}</p>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Destinatários</p>
                        <p className="font-semibold">{campaign.recipientCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-semibold capitalize">{campaign.status}</p>
                      </div>
                      {campaign.campaignMetrics && (
                        <>
                          <div>
                            <p className="text-muted-foreground">Taxa Abertura</p>
                            <p className="font-semibold">{campaign.campaignMetrics.openRate}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">ROI</p>
                            <p className="font-semibold text-green-600">
                              +{campaign.campaignMetrics.roi}%
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    {campaign.abTest?.enabled && (
                      <div className="p-3 bg-secondary rounded-lg">
                        <p className="text-sm font-semibold">Teste A/B Ativo</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Split: {campaign.abTest.splitPercentage}% / {100 - campaign.abTest.splitPercentage}%
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingId ? 'Editar Campanha' : 'Nova Campanha'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Campanha</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Cobrança Mensalidade - Junho"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o objetivo da campanha"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Tipo de Cobrança */}
                  <div className="space-y-2">
                    <Label htmlFor="billType">Tipo de Cobrança</Label>
                    <Select
                      value={formData.billType || 'mensalidade'}
                      onValueChange={(value) =>
                        setFormData({ ...formData, billType: value as any })
                      }
                    >
                      <SelectTrigger id="billType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {billTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Canal */}
                  <div className="space-y-2">
                    <Label htmlFor="channel">Canal</Label>
                    <Select
                      value={formData.channel || 'email'}
                      onValueChange={(value) =>
                        setFormData({ ...formData, channel: value as any })
                      }
                    >
                      <SelectTrigger id="channel">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {channels.map((channel) => (
                          <SelectItem key={channel.value} value={channel.value}>
                            {channel.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Template */}
                <div className="space-y-2">
                  <Label htmlFor="templateId">Template</Label>
                  <Select
                    value={formData.templateId || ''}
                    onValueChange={(value) =>
                      setFormData({ ...formData, templateId: value })
                    }
                  >
                    <SelectTrigger id="templateId">
                      <SelectValue placeholder="Selecione um template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Data/Hora de Agendamento */}
                <div className="space-y-2">
                  <Label htmlFor="scheduledFor">Agendar Para</Label>
                  <Input
                    id="scheduledFor"
                    type="datetime-local"
                    value={formData.scheduledFor || ''}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                  />
                </div>

                {/* Teste A/B */}
                <div className="space-y-4 p-4 border rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="abTest"
                      checked={formData.abTest?.enabled || false}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          abTest: { ...formData.abTest!, enabled: checked as boolean },
                        })
                      }
                    />
                    <Label htmlFor="abTest" className="cursor-pointer">
                      Ativar Teste A/B
                    </Label>
                  </div>

                  {formData.abTest?.enabled && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="templateA">Template A</Label>
                          <Select
                            value={formData.abTest.templateAId || ''}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                abTest: { ...formData.abTest!, templateAId: value },
                              })
                            }
                          >
                            <SelectTrigger id="templateA">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {templates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="templateB">Template B</Label>
                          <Select
                            value={formData.abTest.templateBId || ''}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                abTest: { ...formData.abTest!, templateBId: value },
                              })
                            }
                          >
                            <SelectTrigger id="templateB">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {templates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="splitPercentage">
                          Split: {formData.abTest.splitPercentage}% / {100 - (formData.abTest.splitPercentage || 50)}%
                        </Label>
                        <Input
                          id="splitPercentage"
                          type="range"
                          min="10"
                          max="90"
                          step="10"
                          value={formData.abTest.splitPercentage || 50}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              abTest: { ...formData.abTest!, splitPercentage: parseInt(e.target.value) },
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={handleSaveCampaign}
                    className="flex-1 bg-primary text-primary-foreground gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    {editingId ? 'Atualizar Campanha' : 'Agendar Campanha'}
                  </Button>
                  <Button
                    onClick={handleNewCampaign}
                    variant="outline"
                    className="flex-1"
                  >
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

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
import { Plus, Edit2, Trash2, Eye, Save } from 'lucide-react';
import { toast } from 'sonner';
import { notificationTemplateStore } from '@/lib/store';
import { NotificationTemplate } from '@/lib/types';

export default function TemplatesNotificacao() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(
    notificationTemplateStore.getTemplates()
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NotificationTemplate>>({
    name: '',
    billType: 'mensalidade',
    channel: 'email',
    subject: '',
    content: '',
    primaryColor: '#1e3a8a',
    secondaryColor: '#d4af37',
    accentColor: '#ffffff',
  });
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleNewTemplate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      billType: 'mensalidade',
      channel: 'email',
      subject: '',
      content: '',
      primaryColor: '#1e3a8a',
      secondaryColor: '#d4af37',
      accentColor: '#ffffff',
    });
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    setEditingId(template.id);
    setFormData(template);
  };

  const handleSaveTemplate = () => {
    if (!formData.name || !formData.content) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (editingId) {
      const updated = notificationTemplateStore.updateTemplate(editingId, formData);
      if (updated) {
        setTemplates(notificationTemplateStore.getTemplates());
        toast.success('Template atualizado com sucesso');
        setEditingId(null);
      }
    } else {
      const newTemplate = notificationTemplateStore.addTemplate(
        formData as Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>
      );
      setTemplates(notificationTemplateStore.getTemplates());
      toast.success('Template criado com sucesso');
      setEditingId(null);
    }
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este template?')) {
      notificationTemplateStore.deleteTemplate(id);
      setTemplates(notificationTemplateStore.getTemplates());
      toast.success('Template deletado com sucesso');
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

  const variables = ['{nome}', '{valor}', '{vencimento}', '{linkPagamento}', '{dataAtual}'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">
              Templates de Notificação
            </h1>
            <p className="text-muted-foreground font-serif italic mt-1">
              Customize mensagens para cada tipo de cobrança
            </p>
          </div>
          <Button onClick={handleNewTemplate} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Template
          </Button>
        </div>

        <Tabs defaultValue="lista" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="lista">Meus Templates</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="lista" className="space-y-4">
            {templates.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Nenhum template criado ainda</p>
                  <Button onClick={handleNewTemplate} className="mt-4">
                    Criar Primeiro Template
                  </Button>
                </CardContent>
              </Card>
            ) : (
              templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {billTypes.find(b => b.value === template.billType)?.label} •{' '}
                          {channels.find(c => c.value === template.channel)?.label}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                          disabled={template.isDefault}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {template.subject && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Assunto</p>
                          <p className="text-foreground">{template.subject}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Conteúdo</p>
                        <p className="text-foreground whitespace-pre-wrap text-sm">
                          {template.content.substring(0, 150)}...
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: template.primaryColor }}
                          title="Cor Primária"
                        />
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: template.secondaryColor }}
                          title="Cor Secundária"
                        />
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: template.accentColor }}
                          title="Cor de Destaque"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingId ? 'Editar Template' : 'Novo Template'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Template</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Mensalidade - Email"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

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

                {/* Assunto (para email) */}
                {formData.channel === 'email' && (
                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto do Email</Label>
                    <Input
                      id="subject"
                      placeholder="Ex: Aviso de Vencimento - Mensalidade"
                      value={formData.subject || ''}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                )}

                {/* Conteúdo */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="content">Conteúdo</Label>
                    <div className="text-xs text-muted-foreground">
                      Variáveis disponíveis: {variables.join(', ')}
                    </div>
                  </div>
                  <Textarea
                    id="content"
                    placeholder="Digite o conteúdo da notificação. Use as variáveis disponíveis para personalização."
                    value={formData.content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                  />
                </div>

                {/* Cores */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Cor Primária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={formData.primaryColor || '#1e3a8a'}
                        onChange={(e) =>
                          setFormData({ ...formData, primaryColor: e.target.value })
                        }
                        className="w-12 h-10"
                      />
                      <Input
                        type="text"
                        value={formData.primaryColor || '#1e3a8a'}
                        onChange={(e) =>
                          setFormData({ ...formData, primaryColor: e.target.value })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Cor Secundária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={formData.secondaryColor || '#d4af37'}
                        onChange={(e) =>
                          setFormData({ ...formData, secondaryColor: e.target.value })
                        }
                        className="w-12 h-10"
                      />
                      <Input
                        type="text"
                        value={formData.secondaryColor || '#d4af37'}
                        onChange={(e) =>
                          setFormData({ ...formData, secondaryColor: e.target.value })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Cor de Destaque</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={formData.accentColor || '#ffffff'}
                        onChange={(e) =>
                          setFormData({ ...formData, accentColor: e.target.value })
                        }
                        className="w-12 h-10"
                      />
                      <Input
                        type="text"
                        value={formData.accentColor || '#ffffff'}
                        onChange={(e) =>
                          setFormData({ ...formData, accentColor: e.target.value })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={handleSaveTemplate}
                    className="flex-1 bg-primary text-primary-foreground gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {editingId ? 'Atualizar Template' : 'Criar Template'}
                  </Button>
                  <Button
                    onClick={handleNewTemplate}
                    variant="outline"
                    className="flex-1"
                  >
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            {formData.content && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="p-6 rounded-lg text-foreground"
                    style={{
                      backgroundColor: formData.primaryColor,
                      color: formData.accentColor,
                    }}
                  >
                    {formData.subject && (
                      <h2 className="text-xl font-bold mb-4">{formData.subject}</h2>
                    )}
                    <p className="whitespace-pre-wrap text-sm">{formData.content}</p>
                    <div className="mt-6">
                      <button
                        className="px-4 py-2 rounded font-semibold"
                        style={{
                          backgroundColor: formData.secondaryColor,
                          color: formData.primaryColor,
                        }}
                      >
                        Pagar Agora
                      </button>
                    </div>
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

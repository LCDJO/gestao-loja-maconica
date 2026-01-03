import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Mail,
  MessageSquare,
  Phone,
  Send,
  Save,
  History,
  Eye,
  RotateCcw,
  Copy,
  Trash2,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

interface TemplateVersion {
  id: string;
  timestamp: Date;
  content: string;
  subject?: string;
  author: string;
}

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp';
  subject?: string;
  content: string;
  variables: string[];
  versions: TemplateVersion[];
  createdAt: Date;
  updatedAt: Date;
}

const SMS_CHAR_LIMIT = 160;
const WHATSAPP_CHAR_LIMIT = 4096;

export default function EditorTemplates() {
  const [activeTab, setActiveTab] = useState('email');
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Lembrete 3 dias',
      type: 'email',
      subject: 'Lembrete: Cobrança vencendo em 3 dias',
      content: 'Prezado {{nome}},\n\nEste é um lembrete de que sua cobrança de R$ {{valor}} vence em 3 dias.\n\nData de vencimento: {{data_vencimento}}\n\nClique aqui para pagar: {{link_pagamento}}\n\nAtenciosamente,\n{{nome_loja}}',
      variables: ['nome', 'valor', 'data_vencimento', 'link_pagamento', 'nome_loja'],
      versions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(templates[0]);
  const [editContent, setEditContent] = useState(templates[0].content);
  const [editSubject, setEditSubject] = useState(templates[0].subject || '');
  const [testEmail, setTestEmail] = useState('');
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const currentTemplate = selectedTemplate || templates[0];
  const charCount = editContent.length;
  const charLimit = currentTemplate.type === 'sms' ? SMS_CHAR_LIMIT : WHATSAPP_CHAR_LIMIT;
  const charPercentage = (charCount / charLimit) * 100;

  const handleSaveTemplate = () => {
    if (!selectedTemplate) return;

    const updatedTemplate = {
      ...selectedTemplate,
      content: editContent,
      subject: editSubject,
      versions: [
        {
          id: `v-${Date.now()}`,
          timestamp: new Date(),
          content: selectedTemplate.content,
          subject: selectedTemplate.subject,
          author: 'Admin',
        },
        ...selectedTemplate.versions,
      ],
      updatedAt: new Date(),
    };

    setTemplates(templates.map(t => t.id === selectedTemplate.id ? updatedTemplate : t));
    setSelectedTemplate(updatedTemplate);
    toast.success('Template salvo com sucesso!');
  };

  const handleSendTest = async () => {
    if (!testEmail) {
      toast.error('Informe um email para teste');
      return;
    }

    setIsSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Email de teste enviado para ${testEmail}`);
      setShowTestDialog(false);
      setTestEmail('');
    } catch (error) {
      toast.error('Erro ao enviar email de teste');
    } finally {
      setIsSending(false);
    }
  };

  const handleRevertVersion = (version: TemplateVersion) => {
    if (!selectedTemplate) return;

    const updatedTemplate = {
      ...selectedTemplate,
      content: version.content,
      subject: version.subject || '',
      versions: selectedTemplate.versions.filter(v => v.id !== version.id),
      updatedAt: new Date(),
    };

    setTemplates(templates.map(t => t.id === selectedTemplate.id ? updatedTemplate : t));
    setSelectedTemplate(updatedTemplate);
    setEditContent(version.content);
    setEditSubject(version.subject || '');
    toast.success('Template revertido para versão anterior');
    setShowHistoryDialog(false);
  };

  const renderPreview = () => {
    const preview = editContent
      .replace(/{{nome}}/g, 'João Silva')
      .replace(/{{valor}}/g, 'R$ 150,00')
      .replace(/{{data_vencimento}}/g, '15/06/2024')
      .replace(/{{link_pagamento}}/g, 'https://pagamento.com')
      .replace(/{{nome_loja}}/g, 'Loja Maçônica Exemplo');

    if (currentTemplate.type === 'email') {
      return (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="mb-4 pb-4 border-b border-gray-200">
            <p className="text-xs text-gray-500 font-medium">ASSUNTO</p>
            <p className="text-sm font-medium text-gray-900">{editSubject}</p>
          </div>
          <div className="space-y-2 text-sm text-gray-700 whitespace-pre-wrap font-sans">
            {preview}
          </div>
        </div>
      );
    } else if (currentTemplate.type === 'sms') {
      return (
        <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
          <div className="bg-white rounded-lg p-4 max-w-xs mx-auto shadow-sm">
            <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">{preview}</p>
          </div>
          <div className="mt-4 text-xs text-gray-600 text-center">
            <p>{charCount} / {charLimit} caracteres</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="bg-white rounded-lg p-4 max-w-md mx-auto shadow-sm">
            <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">{preview}</p>
          </div>
          <div className="mt-4 text-xs text-green-700 text-center">
            <p>WhatsApp - {charCount} caracteres</p>
          </div>
        </div>
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Editor de Templates</h1>
          <p className="text-gray-600">
            Crie e edite templates para cada canal de comunicação
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Painel Esquerdo - Lista de Templates */}
          <div className="lg:col-span-1">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template);
                      setEditContent(template.content);
                      setEditSubject(template.subject || '');
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{template.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {template.type === 'email' && <Mail className="h-3 w-3 inline mr-1" />}
                          {template.type === 'sms' && <Phone className="h-3 w-3 inline mr-1" />}
                          {template.type === 'whatsapp' && <MessageSquare className="h-3 w-3 inline mr-1" />}
                          {template.type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Painel Central - Editor */}
          <div className="lg:col-span-2 space-y-6">
            {selectedTemplate && (
              <>
                {/* Informações do Template */}
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Informações</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="template-name" className="text-sm font-medium text-gray-700">Nome do Template</Label>
                      <Input
                        id="template-name"
                        value={selectedTemplate.name}
                        disabled
                        className="mt-1 bg-gray-50 border-gray-300"
                      />
                    </div>

                    <div>
                      <Label htmlFor="template-type" className="text-sm font-medium text-gray-700">Tipo</Label>
                      <Select value={selectedTemplate.type} disabled>
                        <SelectTrigger className="mt-1 bg-gray-50 border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Editor */}
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Conteúdo</CardTitle>
                    {selectedTemplate.type !== 'sms' && selectedTemplate.type !== 'whatsapp' && (
                      <CardDescription>
                        {selectedTemplate.type === 'email' && 'Edite o assunto e corpo do email'}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedTemplate.type === 'email' && (
                      <div>
                        <Label htmlFor="subject" className="text-sm font-medium text-gray-700">Assunto</Label>
                        <Input
                          id="subject"
                          value={editSubject}
                          onChange={(e) => setEditSubject(e.target.value)}
                          className="mt-1 border-gray-300"
                          placeholder="Assunto do email"
                        />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="content" className="text-sm font-medium text-gray-700">Conteúdo</Label>
                        {(selectedTemplate.type === 'sms' || selectedTemplate.type === 'whatsapp') && (
                          <span className={`text-xs font-medium ${charPercentage > 100 ? 'text-red-600' : charPercentage > 80 ? 'text-amber-600' : 'text-gray-600'}`}>
                            {charCount} / {charLimit}
                          </span>
                        )}
                      </div>
                      <Textarea
                        id="content"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="mt-1 border-gray-300 font-mono text-sm"
                        rows={8}
                        placeholder="Use {{variavel}} para inserir variáveis dinâmicas"
                      />
                      {(selectedTemplate.type === 'sms' || selectedTemplate.type === 'whatsapp') && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                charPercentage > 100 ? 'bg-red-600' : charPercentage > 80 ? 'bg-amber-600' : 'bg-green-600'
                              }`}
                              style={{ width: `${Math.min(charPercentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedTemplate.variables.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-blue-900 mb-2">Variáveis disponíveis:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedTemplate.variables.map(variable => (
                            <code key={variable} className="bg-white border border-blue-200 rounded px-2 py-1 text-xs text-blue-700">
                              {`{{${variable}}}`}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Ações */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleSaveTemplate}
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Template
                  </Button>
                  <Button
                    onClick={() => setShowTestDialog(true)}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700"
                    disabled={selectedTemplate.type !== 'email'}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Teste
                  </Button>
                  <Button
                    onClick={() => setShowHistoryDialog(true)}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700"
                    disabled={selectedTemplate.versions.length === 0}
                  >
                    <History className="h-4 w-4 mr-2" />
                    Histórico
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Preview */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview
            </CardTitle>
            <CardDescription>
              Visualize como o template será renderizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderPreview()}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Teste */}
      <AlertDialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <AlertDialogContent className="border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Enviar Email de Teste</AlertDialogTitle>
            <AlertDialogDescription>
              Digite o email para onde deseja enviar o template de teste
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="test-email" className="text-sm font-medium text-gray-700">Email de Teste</Label>
              <Input
                id="test-email"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="seu-email@exemplo.com"
                className="mt-1 border-gray-300"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <AlertDialogCancel className="border-gray-300 text-gray-700">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSendTest}
              disabled={isSending}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSending ? 'Enviando...' : 'Enviar'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Histórico */}
      <AlertDialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <AlertDialogContent className="border-gray-200 max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Histórico de Versões</AlertDialogTitle>
            <AlertDialogDescription>
              Visualize e reverta para versões anteriores do template
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto py-4">
            {selectedTemplate?.versions.map((version, index) => (
              <div key={version.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <p className="text-sm font-medium text-gray-900">
                        Versão {selectedTemplate!.versions.length - index}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {version.timestamp.toLocaleString('pt-BR')} - {version.author}
                    </p>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">{version.content}</p>
                  </div>
                  <Button
                    onClick={() => handleRevertVersion(version)}
                    size="sm"
                    variant="outline"
                    className="border-gray-300 text-gray-700"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reverter
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <AlertDialogCancel className="border-gray-300 text-gray-700">Fechar</AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}

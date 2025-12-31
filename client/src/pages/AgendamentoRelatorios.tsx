import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Plus, Trash2, Edit2, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { scheduledReportStore, ScheduledReport } from "@/lib/store";

export default function AgendamentoRelatorios() {
  const [reports, setReports] = useState<ScheduledReport[]>(scheduledReportStore.getAll());
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'dashboard' as 'dashboard' | 'comunicados' | 'financeiro',
    frequency: 'semanal' as 'diario' | 'semanal' | 'mensal',
    dayOfWeek: 1,
    dayOfMonth: 1,
    hour: 9,
    minute: 0,
    recipients: '',
    enabled: true,
  });

  const handleSave = () => {
    if (!formData.name || !formData.recipients) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const recipients = formData.recipients.split(',').map(e => e.trim());
    const nextRun = calculateNextRun(formData.frequency, formData.dayOfWeek, formData.dayOfMonth, formData.hour, formData.minute);

    if (editingId) {
      const updated = scheduledReportStore.update(editingId, {
        name: formData.name,
        type: formData.type,
        frequency: formData.frequency,
        dayOfWeek: formData.frequency === 'semanal' ? formData.dayOfWeek : undefined,
        dayOfMonth: formData.frequency === 'mensal' ? formData.dayOfMonth : undefined,
        hour: formData.hour,
        minute: formData.minute,
        recipients,
        enabled: formData.enabled,
        nextRun,
      });
      if (updated) {
        setReports(scheduledReportStore.getAll());
        toast.success("Agendamento atualizado com sucesso!");
      }
    } else {
      const newReport = scheduledReportStore.add({
        name: formData.name,
        type: formData.type,
        frequency: formData.frequency,
        dayOfWeek: formData.frequency === 'semanal' ? formData.dayOfWeek : undefined,
        dayOfMonth: formData.frequency === 'mensal' ? formData.dayOfMonth : undefined,
        hour: formData.hour,
        minute: formData.minute,
        recipients,
        enabled: formData.enabled,
        nextRun,
      });
      setReports([...reports, newReport]);
      toast.success("Agendamento criado com sucesso!");
    }

    resetForm();
    setIsOpen(false);
  };

  const handleEdit = (report: ScheduledReport) => {
    setEditingId(report.id);
    setFormData({
      name: report.name,
      type: report.type,
      frequency: report.frequency,
      dayOfWeek: report.dayOfWeek || 1,
      dayOfMonth: report.dayOfMonth || 1,
      hour: report.hour,
      minute: report.minute,
      recipients: report.recipients.join(', '),
      enabled: report.enabled,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    scheduledReportStore.delete(id);
    setReports(scheduledReportStore.getAll());
    toast.success("Agendamento removido com sucesso!");
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      type: 'dashboard',
      frequency: 'semanal',
      dayOfWeek: 1,
      dayOfMonth: 1,
      hour: 9,
      minute: 0,
      recipients: '',
      enabled: true,
    });
  };

  const calculateNextRun = (frequency: string, dayOfWeek: number, dayOfMonth: number, hour: number, minute: number): string => {
    const now = new Date();
    const next = new Date(now);

    if (frequency === 'diario') {
      next.setDate(next.getDate() + 1);
    } else if (frequency === 'semanal') {
      const daysUntil = (dayOfWeek - next.getDay() + 7) % 7 || 7;
      next.setDate(next.getDate() + daysUntil);
    } else if (frequency === 'mensal') {
      next.setMonth(next.getMonth() + 1);
      next.setDate(dayOfMonth);
    }

    next.setHours(hour, minute, 0, 0);
    return next.toISOString();
  };

  const getFrequencyLabel = (frequency: string, dayOfWeek?: number, dayOfMonth?: number) => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    if (frequency === 'diario') return 'Diariamente';
    if (frequency === 'semanal') return `Toda ${days[dayOfWeek || 0]}`;
    if (frequency === 'mensal') return `Dia ${dayOfMonth} de cada mês`;
    return frequency;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'dashboard': 'Dashboard Executivo',
      'comunicados': 'Comunicados',
      'financeiro': 'Financeiro',
    };
    return labels[type] || type;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Agendamento de Relatórios</h1>
            <p className="text-slate-600 mt-2">Configure envio automático de relatórios por email</p>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Editar' : 'Novo'} Agendamento</DialogTitle>
                <DialogDescription>Configure o envio automático de relatórios</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Nome do Agendamento</Label>
                  <Input
                    placeholder="Ex: Relatório Semanal do Dashboard"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Relatório</Label>
                    <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">Dashboard Executivo</SelectItem>
                        <SelectItem value="comunicados">Comunicados</SelectItem>
                        <SelectItem value="financeiro">Financeiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Frequência</Label>
                    <Select value={formData.frequency} onValueChange={v => setFormData({...formData, frequency: v as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diariamente</SelectItem>
                        <SelectItem value="semanal">Semanalmente</SelectItem>
                        <SelectItem value="mensal">Mensalmente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.frequency === 'semanal' && (
                  <div className="space-y-2">
                    <Label>Dia da Semana</Label>
                    <Select value={String(formData.dayOfWeek)} onValueChange={v => setFormData({...formData, dayOfWeek: parseInt(v)})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Domingo</SelectItem>
                        <SelectItem value="1">Segunda</SelectItem>
                        <SelectItem value="2">Terça</SelectItem>
                        <SelectItem value="3">Quarta</SelectItem>
                        <SelectItem value="4">Quinta</SelectItem>
                        <SelectItem value="5">Sexta</SelectItem>
                        <SelectItem value="6">Sábado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.frequency === 'mensal' && (
                  <div className="space-y-2">
                    <Label>Dia do Mês</Label>
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      value={formData.dayOfMonth}
                      onChange={e => setFormData({...formData, dayOfMonth: parseInt(e.target.value)})}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hora</Label>
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      value={formData.hour}
                      onChange={e => setFormData({...formData, hour: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Minuto</Label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={formData.minute}
                      onChange={e => setFormData({...formData, minute: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Emails dos Destinatários</Label>
                  <Input
                    placeholder="email1@exemplo.com, email2@exemplo.com"
                    value={formData.recipients}
                    onChange={e => setFormData({...formData, recipients: e.target.value})}
                  />
                  <p className="text-xs text-gray-500">Separe múltiplos emails por vírgula</p>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  setIsOpen(false);
                  resetForm();
                }}>Cancelar</Button>
                <Button onClick={handleSave}>{editingId ? 'Atualizar' : 'Criar'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Agendamentos */}
        <div className="space-y-4">
          {reports.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum agendamento configurado</p>
              </CardContent>
            </Card>
          ) : (
            reports.map(report => (
              <Card key={report.id} className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>{report.name}</CardTitle>
                        {report.enabled ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <CardDescription>
                        <span className="inline-block mr-4">{getTypeLabel(report.type)}</span>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {getFrequencyLabel(report.frequency, report.dayOfWeek, report.dayOfMonth)}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(report)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(report.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Horário: {String(report.hour).padStart(2, '0')}:{String(report.minute).padStart(2, '0')}</p>
                    <p className="text-gray-600">Próxima execução: {new Date(report.nextRun).toLocaleDateString('pt-BR')} às {new Date(report.nextRun).toLocaleTimeString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium mb-1">Destinatários:</p>
                    <div className="flex flex-wrap gap-1">
                      {report.recipients.map((email, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {email}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

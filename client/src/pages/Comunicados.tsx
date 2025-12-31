import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Users, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Comunicados() {
  const [comunicados, setComunicados] = useState<any[]>([
    {
      id: 1,
      title: 'Convite para Sessão Magna',
      content: 'Convido todos os irmãos para a Sessão Magna de Iniciação em 15 de junho.',
      audience: 'todos',
      date: '2024-06-01',
      read: 35,
      total: 42
    },
    {
      id: 2,
      title: 'Reunião Administrativa',
      content: 'Reunião dos oficiais para discussão de assuntos administrativos.',
      audience: 'oficiais',
      date: '2024-05-28',
      read: 12,
      total: 15
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [newComunicado, setNewComunicado] = useState({
    title: '',
    content: '',
    audience: 'todos'
  });

  const handleSend = () => {
    if (!newComunicado.title || !newComunicado.content) {
      toast.error("Preencha todos os campos");
      return;
    }

    const comunicado = {
      id: comunicados.length + 1,
      ...newComunicado,
      date: new Date().toISOString().split('T')[0],
      read: 0,
      total: newComunicado.audience === 'todos' ? 42 : 15
    };

    setComunicados([comunicado, ...comunicados]);
    setNewComunicado({ title: '', content: '', audience: 'todos' });
    setIsOpen(false);
    toast.success("Comunicado enviado com sucesso!");
  };

  const getAudienceLabel = (audience: string) => {
    const labels: Record<string, string> = {
      'todos': 'Todos os membros',
      'oficiais': 'Apenas oficiais',
      'aprendizes': 'Apenas aprendizes',
      'mestres': 'Apenas mestres'
    };
    return labels[audience] || audience;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">Comunicados Internos</h1>
            <p className="text-muted-foreground font-serif italic">Envie mensagens para grupos específicos de membros.</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Send className="h-4 w-4" /> Novo Comunicado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Enviar Comunicado</DialogTitle>
                <DialogDescription>Crie uma mensagem para um grupo específico de membros.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    placeholder="Ex: Convite para Sessão Magna"
                    value={newComunicado.title}
                    onChange={e => setNewComunicado({...newComunicado, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Público Alvo</Label>
                  <Select value={newComunicado.audience} onValueChange={v => setNewComunicado({...newComunicado, audience: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os membros</SelectItem>
                      <SelectItem value="oficiais">Apenas oficiais</SelectItem>
                      <SelectItem value="aprendizes">Apenas aprendizes</SelectItem>
                      <SelectItem value="mestres">Apenas mestres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mensagem</Label>
                  <Textarea
                    placeholder="Digite sua mensagem..."
                    value={newComunicado.content}
                    onChange={e => setNewComunicado({...newComunicado, content: e.target.value})}
                    className="min-h-32"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                <Button onClick={handleSend} className="bg-primary">Enviar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Comunicados */}
        <div className="space-y-4">
          {comunicados.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum comunicado enviado ainda.</p>
              </CardContent>
            </Card>
          ) : (
            comunicados.map(com => (
              <Card key={com.id} className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{com.title}</CardTitle>
                      <CardDescription>
                        <span className="inline-block mr-3">{com.date}</span>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {getAudienceLabel(com.audience)}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{com.content}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" /> {com.read} de {com.total} leram
                    </span>
                    <span className="text-xs">Taxa de leitura: {Math.round((com.read / com.total) * 100)}%</span>
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

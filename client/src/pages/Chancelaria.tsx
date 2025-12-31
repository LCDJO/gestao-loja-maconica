import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarCheck, 
  UserCheck, 
  Users, 
  Search,
  Check,
  X,
  Clock,
  UserPlus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { memberStore, meetingStore, attendanceStore, visitorStore } from "@/lib/store";
import { Member, Meeting, Attendance, Visitor } from "@/lib/types";

export default function Chancelaria() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>("");
  const [currentAttendance, setCurrentAttendance] = useState<Attendance[]>([]);
  const [isAddVisitorOpen, setIsAddVisitorOpen] = useState(false);
  
  const [newVisitor, setNewVisitor] = useState<Partial<Visitor>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allMeetings = meetingStore.getAll();
    setMeetings(allMeetings);
    setMembers(memberStore.getAll());
    setVisitors(visitorStore.getAll());
    
    if (allMeetings.length > 0 && !selectedMeetingId) {
      setSelectedMeetingId(allMeetings[0].id);
      loadAttendance(allMeetings[0].id);
    }
  };

  const loadAttendance = (meetingId: string) => {
    const saved = attendanceStore.getByMeeting(meetingId);
    if (saved.length > 0) {
      setCurrentAttendance(saved);
    } else {
      // Initialize empty attendance for all active members
      const initial = memberStore.getAll()
        .filter(m => m.status === 'ativo')
        .map(m => ({
          id: Math.random().toString(36).substr(2, 9),
          meetingId,
          memberId: m.id,
          status: 'ausente' as const
        }));
      setCurrentAttendance(initial);
    }
  };

  const handleMeetingChange = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    loadAttendance(meetingId);
  };

  const updateAttendanceStatus = (memberId: string, status: 'presente' | 'ausente' | 'justificado') => {
    const updated = currentAttendance.map(a => 
      a.memberId === memberId ? { ...a, status } : a
    );
    setCurrentAttendance(updated);
    attendanceStore.save(selectedMeetingId, updated);
    
    // Update meeting attendance count
    const presentCount = updated.filter(a => a.status === 'presente').length;
    // In a real app we would update the meeting store too
  };

  const handleAddVisitor = () => {
    if (!newVisitor.name || !newVisitor.lodge || !newVisitor.date) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    visitorStore.add({
      ...newVisitor,
      meetingId: selectedMeetingId || 'unknown'
    } as Visitor);
    toast.success("Visitante registrado");
    setIsAddVisitorOpen(false);
    setNewVisitor({});
    loadData();
  };

  const getAttendanceStats = () => {
    const total = currentAttendance.length;
    if (total === 0) return { present: 0, justified: 0, absent: 0, percentage: 0 };
    
    const present = currentAttendance.filter(a => a.status === 'presente').length;
    const justified = currentAttendance.filter(a => a.status === 'justificado').length;
    const absent = total - present - justified;
    
    return {
      present,
      justified,
      absent,
      percentage: Math.round((present / total) * 100)
    };
  };

  const stats = getAttendanceStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">Chancelaria</h1>
            <p className="text-muted-foreground font-serif italic">Controle de presença e visitantes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frequência da Sessão</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.percentage}%</div>
              <p className="text-xs text-muted-foreground">{stats.present} presentes de {currentAttendance.length} ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ausências Justificadas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.justified}</div>
              <p className="text-xs text-muted-foreground">Irmãos justificados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitantes Registrados</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{visitors.length}</div>
              <p className="text-xs text-muted-foreground">Total histórico</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="presenca" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="presenca">Livro de Presença</TabsTrigger>
            <TabsTrigger value="visitantes">Livro de Visitantes</TabsTrigger>
          </TabsList>

          <TabsContent value="presenca" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="space-y-1">
                    <CardTitle>Chamada dos Obreiros</CardTitle>
                    <CardDescription>Registre a presença dos irmãos na sessão selecionada</CardDescription>
                  </div>
                  <div className="w-full md:w-64">
                    <Select value={selectedMeetingId} onValueChange={handleMeetingChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a sessão" />
                      </SelectTrigger>
                      <SelectContent>
                        {meetings.map(m => (
                          <SelectItem key={m.id} value={m.id}>
                            {new Date(m.date).toLocaleDateString('pt-BR')} - {m.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentAttendance.map((record) => {
                    const member = members.find(m => m.id === record.memberId);
                    if (!member) return null;
                    
                    return (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{member.degree}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant={record.status === 'presente' ? 'default' : 'outline'}
                            className={record.status === 'presente' ? 'bg-green-600 hover:bg-green-700' : ''}
                            onClick={() => updateAttendanceStatus(member.id, 'presente')}
                          >
                            <Check className="h-4 w-4 mr-1" /> Presente
                          </Button>
                          <Button 
                            size="sm" 
                            variant={record.status === 'justificado' ? 'default' : 'outline'}
                            className={record.status === 'justificado' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                            onClick={() => updateAttendanceStatus(member.id, 'justificado')}
                          >
                            <Clock className="h-4 w-4 mr-1" /> Justif.
                          </Button>
                          <Button 
                            size="sm" 
                            variant={record.status === 'ausente' ? 'default' : 'outline'}
                            className={record.status === 'ausente' ? 'bg-red-600 hover:bg-red-700' : ''}
                            onClick={() => updateAttendanceStatus(member.id, 'ausente')}
                          >
                            <X className="h-4 w-4 mr-1" /> Ausente
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {currentAttendance.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Selecione uma reunião para realizar a chamada.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visitantes" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isAddVisitorOpen} onOpenChange={setIsAddVisitorOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <UserPlus className="h-4 w-4" /> Registrar Visitante
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Visitante</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Nome do Irmão</Label>
                      <Input value={newVisitor.name || ''} onChange={e => setNewVisitor({...newVisitor, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Loja de Origem</Label>
                      <Input value={newVisitor.lodge || ''} onChange={e => setNewVisitor({...newVisitor, lodge: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Grau/Cargo</Label>
                        <Input value={newVisitor.rank || ''} onChange={e => setNewVisitor({...newVisitor, rank: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Data da Visita</Label>
                        <Input type="date" value={newVisitor.date || ''} onChange={e => setNewVisitor({...newVisitor, date: e.target.value})} />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddVisitor}>Salvar Registro</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Livro de Visitantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {visitors.map((visitor) => (
                    <div key={visitor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground font-bold">
                          {visitor.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">{visitor.name}</h4>
                          <p className="text-sm text-muted-foreground">{visitor.lodge} • {visitor.rank}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{new Date(visitor.date).toLocaleDateString('pt-BR')}</Badge>
                      </div>
                    </div>
                  ))}
                  {visitors.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum visitante registrado.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

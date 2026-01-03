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
  Plus, 
  Search, 
  FileText, 
  UserPlus, 
  Archive, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  UserX,
  CheckCircle2
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { memberStore, meetingStore, troncoStore } from "@/lib/store";
import { Member, Meeting, TroncoRecord, MemberDegree, MemberStatus } from "@/lib/types";

export default function Secretaria() {
  const [members, setMembers] = useState<Member[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [troncoRecords, setTroncoRecords] = useState<TroncoRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [isAddTroncoOpen, setIsAddTroncoOpen] = useState(false);

  // Form states
  const [newMember, setNewMember] = useState<Partial<Member>>({
    status: 'ativo',
    degree: 'aprendiz'
  });
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({});
  const [newTronco, setNewTronco] = useState<Partial<TroncoRecord>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setMembers(memberStore.getAll());
    setMeetings(meetingStore.getAll());
    setTroncoRecords(troncoStore.getAll());
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.cim) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    memberStore.add(newMember as Member);
    toast.success("Membro adicionado com sucesso");
    setIsAddMemberOpen(false);
    setNewMember({ status: 'ativo', degree: 'aprendiz' });
    loadData();
  };

  const handleUpdateStatus = (id: string, status: MemberStatus) => {
    memberStore.update(id, { status });
    toast.success(`Status atualizado para ${status}`);
    loadData();
  };

  const handleAddMeeting = () => {
    if (!newMeeting.date || !newMeeting.type) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    meetingStore.add(newMeeting as Meeting);
    toast.success("Reunião registrada com sucesso");
    setIsAddMeetingOpen(false);
    setNewMeeting({});
    loadData();
  };

  const handleAddTronco = () => {
    if (!newTronco.amount || !newTronco.date) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    troncoStore.add(newTronco as TroncoRecord);
    toast.success("Valor registrado no tronco");
    setIsAddTroncoOpen(false);
    setNewTronco({});
    loadData();
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.cim.includes(searchTerm)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">Secretaria</h1>
            <p className="text-muted-foreground font-serif italic">Gestão de membros, atas e documentos.</p>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <UserPlus className="h-4 w-4" /> Novo Membro
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl text-primary">Adicionar Novo Membro</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input id="name" value={newMember.name || ''} onChange={e => setNewMember({...newMember, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cim">CIM</Label>
                      <Input id="cim" value={newMember.cim || ''} onChange={e => setNewMember({...newMember, cim: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="degree">Grau</Label>
                      <Select value={newMember.degree} onValueChange={(v: MemberDegree) => setNewMember({...newMember, degree: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aprendiz">Aprendiz</SelectItem>
                          <SelectItem value="companheiro">Companheiro</SelectItem>
                          <SelectItem value="mestre">Mestre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={newMember.status} onValueChange={(v: MemberStatus) => setNewMember({...newMember, status: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                          <SelectItem value="irregular">Irregular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={newMember.email || ''} onChange={e => setNewMember({...newMember, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" value={newMember.phone || ''} onChange={e => setNewMember({...newMember, phone: e.target.value})} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>Cancelar</Button>
                  <Button onClick={handleAddMember}>Salvar Membro</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="membros" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="membros">Membros</TabsTrigger>
            <TabsTrigger value="atas">Atas e Reuniões</TabsTrigger>
            <TabsTrigger value="tronco">Tronco de Beneficência</TabsTrigger>
          </TabsList>

          {/* ABA MEMBROS */}
          <TabsContent value="membros" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <CardTitle className="font-display text-xl">Quadro de Obreiros</CardTitle>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar por nome ou CIM..." 
                      className="pl-8" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">{member.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>CIM: {member.cim}</span>
                            <span>•</span>
                            <span className="capitalize">{member.degree}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={member.status === 'ativo' ? 'default' : 'destructive'}>
                          {member.status}
                        </Badge>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {member.status === 'ativo' ? (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(member.id, 'inativo')}>
                                <UserX className="mr-2 h-4 w-4" /> Inativar
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(member.id, 'ativo')}>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Reativar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  {filteredMembers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum membro encontrado.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA ATAS */}
          <TabsContent value="atas" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isAddMeetingOpen} onOpenChange={setIsAddMeetingOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <FileText className="h-4 w-4" /> Nova Ata / Reunião
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Reunião</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Input type="date" value={newMeeting.date || ''} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de Sessão</Label>
                      <Select value={newMeeting.type} onValueChange={v => setNewMeeting({...newMeeting, type: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Econômica">Econômica</SelectItem>
                          <SelectItem value="Magna">Magna</SelectItem>
                          <SelectItem value="Administrativa">Administrativa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Input value={newMeeting.description || ''} onChange={e => setNewMeeting({...newMeeting, description: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Presença (Qtd)</Label>
                      <Input type="number" value={newMeeting.attendanceCount || ''} onChange={e => setNewMeeting({...newMeeting, attendanceCount: parseInt(e.target.value)})} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddMeeting}>Salvar Registro</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {meetings.map((meeting) => (
                <Card key={meeting.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{meeting.type}</CardTitle>
                        <CardDescription>{new Date(meeting.date).toLocaleDateString('pt-BR')}</CardDescription>
                      </div>
                      <Badge variant="outline">{meeting.attendanceCount} presentes</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{meeting.description}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="mr-2 h-3 w-3" /> Ver Ata
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full">
                        <Archive className="mr-2 h-3 w-3" /> Arquivar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ABA TRONCO */}
          <TabsContent value="tronco" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isAddTroncoOpen} onOpenChange={setIsAddTroncoOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                    <Plus className="h-4 w-4" /> Registrar Tronco
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Lançar Tronco de Beneficência</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Input type="date" value={newTronco.date || ''} onChange={e => setNewTronco({...newTronco, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Valor (R$)</Label>
                      <Input type="number" step="0.01" value={newTronco.amount || ''} onChange={e => setNewTronco({...newTronco, amount: parseFloat(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Observações</Label>
                      <Input value={newTronco.notes || ''} onChange={e => setNewTronco({...newTronco, notes: e.target.value})} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddTronco}>Salvar Lançamento</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Arrecadação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {troncoRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border-b last:border-0">
                      <div>
                        <p className="font-medium">{new Date(record.date).toLocaleDateString('pt-BR')}</p>
                        <p className="text-sm text-muted-foreground">{record.notes || 'Sem observações'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(record.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

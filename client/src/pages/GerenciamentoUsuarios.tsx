import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Edit, Trash2, Lock, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { userManagementStore, accessAuditStore, userPermissionsStore } from "@/lib/store";

interface UserForm {
  name: string;
  email: string;
  role: 'admin' | 'tesoureiro' | 'secretario' | 'visualizador' | 'membro';
}

export default function GerenciamentoUsuarios() {
  const [users, setUsers] = useState(userManagementStore.getAll());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserForm>({
    name: '',
    email: '',
    role: 'membro',
  });

  const handleAddUser = () => {
    if (!formData.name || !formData.email) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (editingId) {
      userManagementStore.update(editingId, formData);
      toast.success("Usuário atualizado com sucesso");
      setEditingId(null);
    } else {
      userManagementStore.add({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: 'ativo',
      });
      toast.success("Usuário criado com sucesso");
    }

    setUsers(userManagementStore.getAll());
    setFormData({ name: '', email: '', role: 'membro' });
    setShowForm(false);
  };

  const handleEditUser = (id: string) => {
    const user = userManagementStore.getById(id);
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este usuário?")) {
      userManagementStore.delete(id);
      setUsers(userManagementStore.getAll());
      toast.success("Usuário deletado com sucesso");
    }
  };

  const handleChangeRole = (id: string, newRole: any) => {
    userManagementStore.changeRole(id, newRole);
    setUsers(userManagementStore.getAll());
    toast.success("Role alterado com sucesso");
  };

  const handleChangeStatus = (id: string, newStatus: any) => {
    userManagementStore.changeStatus(id, newStatus);
    setUsers(userManagementStore.getAll());
    toast.success("Status alterado com sucesso");
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      tesoureiro: 'Tesoureiro',
      secretario: 'Secretário',
      visualizador: 'Visualizador',
      membro: 'Membro',
    };
    return labels[role] || role;
  };

  const getStatusColor = (status: string) => {
    return status === 'ativo' ? 'bg-green-100 text-green-700' :
           status === 'inativo' ? 'bg-gray-100 text-gray-700' :
           'bg-red-100 text-red-700';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gerenciamento de Usuários</h1>
            <p className="text-slate-600 mt-2">Crie, edite e gerencie usuários do sistema</p>
          </div>
          <Users className="h-12 w-12 text-blue-600 opacity-20" />
        </div>

        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Usuário
        </Button>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Editar Usuário' : 'Novo Usuário'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  placeholder="Nome completo"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="membro">Membro</option>
                  <option value="visualizador">Visualizador</option>
                  <option value="secretario">Secretário</option>
                  <option value="tesoureiro">Tesoureiro</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddUser} className="flex-1">
                  {editingId ? 'Atualizar' : 'Criar'} Usuário
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', email: '', role: 'membro' });
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {users.map(user => (
            <Card key={user.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status === 'ativo' ? '✓ Ativo' : user.status === 'inativo' ? 'Inativo' : 'Suspenso'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{user.email}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <select 
                          value={user.role}
                          onChange={e => handleChangeRole(user.id, e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs"
                        >
                          <option value="membro">Membro</option>
                          <option value="visualizador">Visualizador</option>
                          <option value="secretario">Secretário</option>
                          <option value="tesoureiro">Tesoureiro</option>
                          <option value="admin">Administrador</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-gray-600" />
                        <select 
                          value={user.status}
                          onChange={e => handleChangeStatus(user.id, e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs"
                        >
                          <option value="ativo">Ativo</option>
                          <option value="inativo">Inativo</option>
                          <option value="suspenso">Suspenso</option>
                        </select>
                      </div>

                      {user.lastLogin && (
                        <div className="text-xs text-gray-500">
                          Último acesso: {new Date(user.lastLogin).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditUser(user.id)}
                      className="gap-1"
                    >
                      <Edit className="h-3 w-3" /> Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" /> Deletar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {users.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum usuário criado ainda</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Lock, Plus, Edit2, Trash2 } from 'lucide-react';
import { UserRole, ROLE_PERMISSIONS } from '@/lib/types';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  lastLogin?: string;
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@loja.com',
    role: 'ADMIN',
    status: 'active',
    lastLogin: '2024-12-30 14:30',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@loja.com',
    role: 'TREASURER',
    status: 'active',
    lastLogin: '2024-12-30 10:15',
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro@loja.com',
    role: 'SECRETARY',
    status: 'active',
    lastLogin: '2024-12-29 16:45',
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana@loja.com',
    role: 'VIEWER',
    status: 'active',
    lastLogin: '2024-12-28 09:20',
  },
];

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  ADMIN: 'Acesso total ao sistema, gerenciamento de usuários e configurações',
  TREASURER: 'Gerenciamento de cobranças, receitas e despesas',
  SECRETARY: 'Gerenciamento de membros, reuniões e atas',
  VIEWER: 'Visualização apenas de dados (sem permissão de edição)',
};

const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: 'bg-red-100 text-red-800',
  TREASURER: 'bg-green-100 text-green-800',
  SECRETARY: 'bg-blue-100 text-blue-800',
  VIEWER: 'bg-gray-100 text-gray-800',
};

export default function Permissoes() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('VIEWER');

  const handleAddUser = async () => {
    if (!newUserEmail) {
      toast.error('Digite um email válido');
      return;
    }

    const newUser: User = {
      id: String(users.length + 1),
      name: newUserEmail.split('@')[0],
      email: newUserEmail,
      role: newUserRole,
      status: 'active',
    };

    setUsers([...users, newUser]);
    setNewUserEmail('');
    setNewUserRole('VIEWER');
    toast.success('Usuário adicionado com sucesso!');
  };

  const handleUpdateUser = (user: User) => {
    setUsers(users.map(u => (u.id === user.id ? user : u)));
    setEditingUser(null);
    toast.success('Usuário atualizado com sucesso!');
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast.success('Usuário removido com sucesso!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Permissões e Roles</h1>
          <p className="text-gray-600">
            Gerencie usuários e controle de acesso por papel (Admin, Tesoureiro, Secretário, Visualizador)
          </p>
        </div>

        {/* Roles Disponíveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(ROLE_DESCRIPTIONS).map(([role, description]) => (
            <Card key={role} className="border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{role}</CardTitle>
                  <Badge className={ROLE_COLORS[role as UserRole]}>
                    {role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{description}</p>
                <div className="text-xs text-gray-500">
                  <p className="font-medium mb-2">Permissões:</p>
                  <ul className="space-y-1">
                    {ROLE_PERMISSIONS[role as UserRole].slice(0, 5).map(perm => (
                      <li key={perm} className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        {perm}
                      </li>
                    ))}
                    {ROLE_PERMISSIONS[role as UserRole].length > 5 && (
                      <li className="text-gray-400">
                        +{ROLE_PERMISSIONS[role as UserRole].length - 5} mais
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Adicionar Novo Usuário */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Adicionar Novo Usuário</CardTitle>
            <CardDescription>
              Convide um novo usuário para a loja
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Email do usuário"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="border-gray-300"
              />
              <Select value={newUserRole} onValueChange={(value) => setNewUserRole(value as UserRole)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="TREASURER">Tesoureiro</SelectItem>
                  <SelectItem value="SECRETARY">Secretário</SelectItem>
                  <SelectItem value="VIEWER">Visualizador</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddUser}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Usuários */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Usuários da Loja</CardTitle>
            <CardDescription>
              {users.length} usuários cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map(user => (
                <div
                  key={user.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                        <Badge className={ROLE_COLORS[user.role]}>
                          {user.role}
                        </Badge>
                        <Badge
                          variant={user.status === 'active' ? 'default' : 'secondary'}
                          className={user.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {user.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                        {user.lastLogin && (
                          <span className="text-xs text-gray-500">
                            Último acesso: {user.lastLogin}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => setEditingUser(user)}
                        variant="outline"
                        size="sm"
                        className="border-gray-300"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteUser(user.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Matriz de Permissões */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Matriz de Permissões</CardTitle>
            <CardDescription>
              Visualize as permissões de cada role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Recurso</th>
                    {Object.keys(ROLE_DESCRIPTIONS).map(role => (
                      <th key={role} className="text-center py-3 px-4 font-medium text-gray-900">
                        {role}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['members', 'bills', 'meetings', 'settings', 'templates', 'users', 'audit', 'backup'].map(resource => (
                    <tr key={resource} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900 capitalize">{resource}</td>
                      {Object.keys(ROLE_DESCRIPTIONS).map(role => {
                        const hasPermission = ROLE_PERMISSIONS[role as UserRole].some(p => p.startsWith(resource));
                        return (
                          <td key={role} className="text-center py-3 px-4">
                            {hasPermission ? (
                              <span className="text-green-600 font-bold">✓</span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

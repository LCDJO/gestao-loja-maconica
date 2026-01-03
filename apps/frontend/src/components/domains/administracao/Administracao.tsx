import { FC, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Settings, UserCheck } from 'lucide-react';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  funcao: string;
  ativo: boolean;
  ultimoAcesso?: string;
  papel: 'admin' | 'operador' | 'leitor';
}

export interface ConfiguracoesAdm {
  id: string;
  nome: string;
  valor: string;
  tipo: 'texto' | 'numero' | 'booleano' | 'lista';
}

interface AdministracaoProps {
  usuarioId?: string;
}

export const Administracao: FC<AdministracaoProps> = () => {
  const [usuarios] = useState<Usuario[]>([
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao@loja.org.br',
      funcao: 'Administrador',
      ativo: true,
      ultimoAcesso: '2024-01-10T14:30:00',
      papel: 'admin',
    },
    {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria@loja.org.br',
      funcao: 'Operador',
      ativo: true,
      ultimoAcesso: '2024-01-09T16:45:00',
      papel: 'operador',
    },
    {
      id: '3',
      nome: 'Pedro Oliveira',
      email: 'pedro@loja.org.br',
      funcao: 'Leitor',
      ativo: true,
      papel: 'leitor',
    },
  ]);

  const [configs] = useState<ConfiguracoesAdm[]>([
    {
      id: '1',
      nome: 'Tema da Aplicação',
      valor: 'light',
      tipo: 'lista',
    },
    {
      id: '2',
      nome: 'Email SMTP',
      valor: 'smtp.loja.org.br',
      tipo: 'texto',
    },
    {
      id: '3',
      nome: 'Backup Automático',
      valor: 'true',
      tipo: 'booleano',
    },
  ]);

  const [novoUsuario, setNovoUsuario] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'operador':
        return 'bg-blue-100 text-blue-800';
      case 'leitor':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Lock className="h-8 w-8 text-red-600" />
          Administração
        </h1>
        <p className="text-gray-600 mt-1">Gerenciamento de usuários e configurações</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="usuarios" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        </TabsList>

        {/* Tab Usuários */}
        <TabsContent value="usuarios" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setNovoUsuario(!novoUsuario)}>
              {novoUsuario ? 'Cancelar' : 'Novo Usuário'}
            </Button>
          </div>

          {novoUsuario && (
            <Card className="p-6 bg-blue-50">
              <h3 className="font-bold text-gray-900 mb-4">Adicionar Novo Usuário</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome completo"
                  className="w-full px-4 py-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded"
                />
                <select className="w-full px-4 py-2 border rounded">
                  <option>Selecionar papel</option>
                  <option value="admin">Administrador</option>
                  <option value="operador">Operador</option>
                  <option value="leitor">Leitor</option>
                </select>
                <div className="flex gap-2">
                  <Button className="flex-1">Criar</Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setNovoUsuario(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-4">
            {usuarios.map((usuario) => (
              <Card key={usuario.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <UserCheck className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{usuario.nome}</h3>
                        <p className="text-gray-600 text-sm">{usuario.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Badge className={getRoleColor(usuario.papel)}>{usuario.papel}</Badge>
                      <Badge variant={usuario.ativo ? 'default' : 'secondary'}>
                        {usuario.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    {usuario.ultimoAcesso && (
                      <p className="text-sm text-gray-500 mt-2">
                        Último acesso:{' '}
                        {new Date(usuario.ultimoAcesso).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      Remover
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab Configurações */}
        <TabsContent value="configuracoes" className="space-y-4">
          <div className="space-y-4">
            {configs.map((config) => (
              <Card key={config.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{config.nome}</h3>
                    <p className="text-gray-600 text-sm mt-1">{config.valor}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab Segurança */}
        <TabsContent value="seguranca" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Configurações de Segurança</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">Autenticação de Dois Fatores</p>
                  <p className="text-gray-600 text-sm">Aumentar segurança das contas</p>
                </div>
                <Button variant="outline">Configurar</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">Backup de Dados</p>
                  <p className="text-gray-600 text-sm">Última execução: 10/01/2024</p>
                </div>
                <Button variant="outline">Executar</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">Logs de Acesso</p>
                  <p className="text-gray-600 text-sm">Auditoria do sistema</p>
                </div>
                <Button variant="outline">Visualizar</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Total de Usuários</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{usuarios.length}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Usuários Ativos</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {usuarios.filter((u) => u.ativo).length}
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Configurações</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{configs.length}</p>
        </Card>
      </div>
    </div>
  );
};

export default Administracao;

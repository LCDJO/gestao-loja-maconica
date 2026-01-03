import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  DollarSign,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  AlertCircle,
  CheckCircle,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';

interface Lodge {
  id: string;
  name: string;
  number: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  subscription: {
    plan: 'basic' | 'professional' | 'enterprise';
    monthlyFee: number;
    dueDate: Date;
    status: 'paid' | 'pending' | 'overdue';
  };
  financialContact: {
    name: string;
    email: string;
    phone: string;
  };
}

interface FinancialContact {
  id: string;
  lodgeId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export default function SuperAdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('lojas');
  const [lodges, setLodges] = useState<Lodge[]>([
    {
      id: '1',
      name: 'Loja Exemplo #123',
      number: '123',
      city: 'São Paulo',
      state: 'SP',
      email: 'contato@lojaexemplo.com',
      phone: '(11) 99999-9999',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      subscription: {
        plan: 'professional',
        monthlyFee: 299.90,
        dueDate: new Date('2024-06-15'),
        status: 'paid',
      },
      financialContact: {
        name: 'João Silva',
        email: 'financeiro@lojaexemplo.com',
        phone: '(11) 98888-8888',
      },
    },
    {
      id: '2',
      name: 'Loja Maçônica Rio',
      number: '456',
      city: 'Rio de Janeiro',
      state: 'RJ',
      email: 'contato@lojario.com',
      phone: '(21) 98888-8888',
      status: 'active',
      createdAt: new Date('2024-02-20'),
      subscription: {
        plan: 'basic',
        monthlyFee: 99.90,
        dueDate: new Date('2024-05-20'),
        status: 'overdue',
      },
      financialContact: {
        name: 'Maria Santos',
        email: 'financeiro@lojario.com',
        phone: '(21) 97777-7777',
      },
    },
  ]);

  const [showNewLodgeForm, setShowNewLodgeForm] = useState(false);
  const [newLodge, setNewLodge] = useState({
    name: '',
    number: '',
    city: '',
    state: '',
    email: '',
    phone: '',
    plan: 'basic' as const,
    financialContactName: '',
    financialContactEmail: '',
    financialContactPhone: '',
  });

  const totalRevenue = lodges.reduce((sum, lodge) => sum + lodge.subscription.monthlyFee, 0);
  const activeLodges = lodges.filter(l => l.status === 'active').length;
  const overduePayments = lodges.filter(l => l.subscription.status === 'overdue').length;

  const handleAddLodge = () => {
    if (!newLodge.name || !newLodge.number) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    const lodge: Lodge = {
      id: `lodge-${Date.now()}`,
      name: newLodge.name,
      number: newLodge.number,
      city: newLodge.city,
      state: newLodge.state,
      email: newLodge.email,
      phone: newLodge.phone,
      status: 'active',
      createdAt: new Date(),
      subscription: {
        plan: newLodge.plan,
        monthlyFee: newLodge.plan === 'basic' ? 99.90 : newLodge.plan === 'professional' ? 299.90 : 599.90,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'pending',
      },
      financialContact: {
        name: newLodge.financialContactName,
        email: newLodge.financialContactEmail,
        phone: newLodge.financialContactPhone,
      },
    };

    setLodges([...lodges, lodge]);
    setNewLodge({
      name: '',
      number: '',
      city: '',
      state: '',
      email: '',
      phone: '',
      plan: 'basic',
      financialContactName: '',
      financialContactEmail: '',
      financialContactPhone: '',
    });
    setShowNewLodgeForm(false);
    toast.success('Loja cadastrada com sucesso!');
  };

  const handleToggleLodgeStatus = (id: string) => {
    setLodges(lodges.map(lodge =>
      lodge.id === id
        ? { ...lodge, status: lodge.status === 'active' ? 'inactive' : 'active' }
        : lodge
    ));
  };

  const handleDeleteLodge = (id: string) => {
    setLodges(lodges.filter(lodge => lodge.id !== id));
    toast.success('Loja removida');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Ativa</span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">Inativa</span>;
      case 'suspended':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">Suspensa</span>;
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Pago</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded">Pendente</span>;
      case 'overdue':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Atrasado</span>;
      default:
        return null;
    }
  };

  /**
   * Função para fazer logout do super administrador
   * Remove o token do localStorage e redireciona para a página de login
   */
  const handleLogout = () => {
    try {
      // Remover token do localStorage
      localStorage.removeItem('superAdminToken');

      // Exibir mensagem de sucesso
      toast.success('Desconectado com sucesso');

      // Redirecionar para login
      setLocation('/super-admin/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao desconectar');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super Administrador</h1>
            <p className="text-gray-600 text-sm mt-1">Gerencie todas as lojas e mensalidades do SaaS</p>
          </div>
          <Button 
            onClick={handleLogout}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Lojas Ativas</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{activeLodges}</p>
                </div>
                <Building2 className="h-10 w-10 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Receita Mensal</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <DollarSign className="h-10 w-10 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Pagamentos Atrasados</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{overduePayments}</p>
                </div>
                <AlertCircle className="h-10 w-10 text-red-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Taxa de Crescimento</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">+12.5%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white border border-gray-200">
            <TabsTrigger value="lojas" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Building2 className="h-4 w-4 mr-2" />
              Lojas
            </TabsTrigger>
            <TabsTrigger value="mensalidades" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <DollarSign className="h-4 w-4 mr-2" />
              Mensalidades
            </TabsTrigger>
            <TabsTrigger value="contatos" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
              <Users className="h-4 w-4 mr-2" />
              Contatos Financeiros
            </TabsTrigger>
          </TabsList>

          {/* Aba Lojas */}
          <TabsContent value="lojas" className="space-y-6">
            <div className="flex justify-end">
              <Button
                onClick={() => setShowNewLodgeForm(!showNewLodgeForm)}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Loja
              </Button>
            </div>

            {showNewLodgeForm && (
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Cadastrar Nova Loja</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lodge-name" className="text-sm font-medium text-gray-700">Nome da Loja</Label>
                      <Input
                        id="lodge-name"
                        value={newLodge.name}
                        onChange={(e) => setNewLodge({ ...newLodge, name: e.target.value })}
                        className="mt-1 border-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lodge-number" className="text-sm font-medium text-gray-700">Número</Label>
                      <Input
                        id="lodge-number"
                        value={newLodge.number}
                        onChange={(e) => setNewLodge({ ...newLodge, number: e.target.value })}
                        className="mt-1 border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lodge-city" className="text-sm font-medium text-gray-700">Cidade</Label>
                      <Input
                        id="lodge-city"
                        value={newLodge.city}
                        onChange={(e) => setNewLodge({ ...newLodge, city: e.target.value })}
                        className="mt-1 border-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lodge-state" className="text-sm font-medium text-gray-700">Estado</Label>
                      <Input
                        id="lodge-state"
                        value={newLodge.state}
                        onChange={(e) => setNewLodge({ ...newLodge, state: e.target.value })}
                        className="mt-1 border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lodge-email" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input
                        id="lodge-email"
                        type="email"
                        value={newLodge.email}
                        onChange={(e) => setNewLodge({ ...newLodge, email: e.target.value })}
                        className="mt-1 border-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lodge-phone" className="text-sm font-medium text-gray-700">Telefone</Label>
                      <Input
                        id="lodge-phone"
                        value={newLodge.phone}
                        onChange={(e) => setNewLodge({ ...newLodge, phone: e.target.value })}
                        className="mt-1 border-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="plan" className="text-sm font-medium text-gray-700">Plano</Label>
                    <Select value={newLodge.plan} onValueChange={(value: any) => setNewLodge({ ...newLodge, plan: value })}>
                      <SelectTrigger className="mt-1 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic - R$ 99,90/mês</SelectItem>
                        <SelectItem value="professional">Professional - R$ 299,90/mês</SelectItem>
                        <SelectItem value="enterprise">Enterprise - R$ 599,90/mês</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Contato Financeiro</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="contact-name" className="text-sm font-medium text-gray-700">Nome</Label>
                        <Input
                          id="contact-name"
                          value={newLodge.financialContactName}
                          onChange={(e) => setNewLodge({ ...newLodge, financialContactName: e.target.value })}
                          className="mt-1 border-gray-300"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contact-email" className="text-sm font-medium text-gray-700">Email</Label>
                          <Input
                            id="contact-email"
                            type="email"
                            value={newLodge.financialContactEmail}
                            onChange={(e) => setNewLodge({ ...newLodge, financialContactEmail: e.target.value })}
                            className="mt-1 border-gray-300"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact-phone" className="text-sm font-medium text-gray-700">Telefone</Label>
                          <Input
                            id="contact-phone"
                            value={newLodge.financialContactPhone}
                            onChange={(e) => setNewLodge({ ...newLodge, financialContactPhone: e.target.value })}
                            className="mt-1 border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleAddLodge}
                      className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Cadastrar Loja
                    </Button>
                    <Button
                      onClick={() => setShowNewLodgeForm(false)}
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de Lojas */}
            <div className="space-y-4">
              {lodges.map(lodge => (
                <Card key={lodge.id} className="border-gray-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{lodge.name}</h3>
                          {getStatusBadge(lodge.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Loja #{lodge.number} • {lodge.city}, {lodge.state}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Email</p>
                            <p className="font-medium text-gray-900">{lodge.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Telefone</p>
                            <p className="font-medium text-gray-900">{lodge.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Plano</p>
                            <p className="font-medium text-gray-900 capitalize">{lodge.subscription.plan}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Mensalidade</p>
                            <p className="font-medium text-gray-900">R$ {lodge.subscription.monthlyFee.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-900 mb-2">Contato Financeiro</p>
                          <p className="text-sm text-gray-600">{lodge.financialContact.name} • {lodge.financialContact.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => handleToggleLodgeStatus(lodge.id)}
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-gray-700"
                        >
                          {lodge.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteLodge(lodge.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Aba Mensalidades */}
          <TabsContent value="mensalidades" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Controle de Mensalidades</CardTitle>
                <CardDescription>
                  Acompanhe o status de pagamento de todas as lojas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Loja</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Plano</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Valor</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Vencimento</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lodges.map(lodge => (
                        <tr key={lodge.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{lodge.name}</td>
                          <td className="py-3 px-4 capitalize text-gray-600">{lodge.subscription.plan}</td>
                          <td className="py-3 px-4 font-medium text-gray-900">R$ {lodge.subscription.monthlyFee.toFixed(2)}</td>
                          <td className="py-3 px-4 text-gray-600">{lodge.subscription.dueDate.toLocaleDateString('pt-BR')}</td>
                          <td className="py-3 px-4">{getPaymentStatusBadge(lodge.subscription.status)}</td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                              Detalhes
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Contatos Financeiros */}
          <TabsContent value="contatos" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Contatos Financeiros</CardTitle>
                <CardDescription>
                  Gerencie os contatos financeiros de cada loja
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lodges.map(lodge => (
                    <div key={lodge.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{lodge.financialContact.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{lodge.name}</p>
                          <div className="mt-3 space-y-1">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Email:</span> {lodge.financialContact.email}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Telefone:</span> {lodge.financialContact.phone}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

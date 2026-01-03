import { FC, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Settings, UserCheck, Palette, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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

  // Estado para background da página de login
  const [backgroundConfig, setBackgroundConfig] = useState({
    type: 'gradient', // 'gradient' | 'solid' | 'image'
    gradientFrom: '#2563EB',
    gradientTo: '#1E40AF',
    gradientType: 'to-br', // to-b, to-r, to-br, etc
    solidColor: '#2563EB',
    imageUrl: '',
    imageSize: 'cover',
    imagePosition: 'center',
  });

  const [isSaving, setIsSaving] = useState(false);

  // Carregar configuração ao montar
  useEffect(() => {
    try {
      const savedBg = localStorage.getItem('memberLoginBackground');
      if (savedBg) {
        const bgConfig = JSON.parse(savedBg);
        // Determinar tipo baseado na configuração salva
        if (bgConfig.background?.includes('gradient')) {
          setBackgroundConfig(prev => ({ ...prev, type: 'gradient' }));
        } else if (bgConfig.background?.includes('url')) {
          setBackgroundConfig(prev => ({ ...prev, type: 'image' }));
        } else {
          setBackgroundConfig(prev => ({ ...prev, type: 'solid' }));
        }
      }
    } catch (err) {
      console.error('Erro ao carregar configuração:', err);
    }
  }, []);

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

  const generateBackgroundStyle = () => {
    if (backgroundConfig.type === 'gradient') {
      const gradientMap: Record<string, string> = {
        'to-b': 'linear-gradient(to bottom',
        'to-r': 'linear-gradient(to right',
        'to-br': 'linear-gradient(to bottom right',
        'to-bl': 'linear-gradient(to bottom left',
        'to-tr': 'linear-gradient(to top right',
        'to-tl': 'linear-gradient(to top left',
      };
      const direction = gradientMap[backgroundConfig.gradientType] || 'linear-gradient(to bottom right';
      return `${direction}, ${backgroundConfig.gradientFrom}, ${backgroundConfig.gradientTo})`;
    } else if (backgroundConfig.type === 'image') {
      return `url('${backgroundConfig.imageUrl}')`;
    } else {
      return backgroundConfig.solidColor;
    }
  };

  const handleSaveBackground = async () => {
    setIsSaving(true);
    try {
      const backgroundStyle: any = {
        background: generateBackgroundStyle(),
      };

      if (backgroundConfig.type === 'image') {
        backgroundStyle.backgroundSize = backgroundConfig.imageSize;
        backgroundStyle.backgroundPosition = backgroundConfig.imagePosition;
        backgroundStyle.backgroundAttachment = 'cover';
      }

      // Salvar no localStorage
      localStorage.setItem('memberLoginBackground', JSON.stringify(backgroundStyle));
      
      toast.success('Background da página de login atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar background:', error);
      toast.error('Erro ao salvar background');
    } finally {
      setIsSaving(false);
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          <TabsTrigger value="login-bg">Background Login</TabsTrigger>
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

        {/* Tab Background da Página de Login */}
        <TabsContent value="login-bg" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">Customizar Background - Portal do Irmão</h3>
            </div>

            <div className="space-y-6">
              {/* Tipo de Background */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Tipo de Background</Label>
                <div className="flex gap-3">
                  {['gradient', 'solid', 'image'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setBackgroundConfig(prev => ({ ...prev, type: type as any }))}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        backgroundConfig.type === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {type === 'gradient' && 'Gradiente'}
                      {type === 'solid' && 'Cor Sólida'}
                      {type === 'image' && 'Imagem'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Configurações por tipo */}
              {backgroundConfig.type === 'gradient' && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900">Configuração de Gradiente</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gradient-from" className="text-sm">Cor Inicial</Label>
                      <div className="flex gap-2 mt-1">
                        <input
                          id="gradient-from"
                          type="color"
                          value={backgroundConfig.gradientFrom}
                          onChange={(e) => setBackgroundConfig(prev => ({ ...prev, gradientFrom: e.target.value }))}
                          className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={backgroundConfig.gradientFrom}
                          onChange={(e) => setBackgroundConfig(prev => ({ ...prev, gradientFrom: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="gradient-to" className="text-sm">Cor Final</Label>
                      <div className="flex gap-2 mt-1">
                        <input
                          id="gradient-to"
                          type="color"
                          value={backgroundConfig.gradientTo}
                          onChange={(e) => setBackgroundConfig(prev => ({ ...prev, gradientTo: e.target.value }))}
                          className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={backgroundConfig.gradientTo}
                          onChange={(e) => setBackgroundConfig(prev => ({ ...prev, gradientTo: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="gradient-type" className="text-sm">Direção do Gradiente</Label>
                    <select
                      id="gradient-type"
                      value={backgroundConfig.gradientType}
                      onChange={(e) => setBackgroundConfig(prev => ({ ...prev, gradientType: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="to-b">Para Baixo</option>
                      <option value="to-r">Para Direita</option>
                      <option value="to-br">Para Baixo-Direita (Diagonal)</option>
                      <option value="to-bl">Para Baixo-Esquerda (Diagonal)</option>
                      <option value="to-tr">Para Cima-Direita (Diagonal)</option>
                      <option value="to-tl">Para Cima-Esquerda (Diagonal)</option>
                    </select>
                  </div>
                </div>
              )}

              {backgroundConfig.type === 'solid' && (
                <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-gray-900">Cor Sólida</h4>
                  
                  <div>
                    <Label htmlFor="solid-color" className="text-sm">Selecione a Cor</Label>
                    <div className="flex gap-2 mt-1">
                      <input
                        id="solid-color"
                        type="color"
                        value={backgroundConfig.solidColor}
                        onChange={(e) => setBackgroundConfig(prev => ({ ...prev, solidColor: e.target.value }))}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={backgroundConfig.solidColor}
                        onChange={(e) => setBackgroundConfig(prev => ({ ...prev, solidColor: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {backgroundConfig.type === 'image' && (
                <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-gray-900">Imagem de Fundo</h4>
                  
                  <div>
                    <Label htmlFor="image-url" className="text-sm">URL da Imagem</Label>
                    <Input
                      id="image-url"
                      type="text"
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={backgroundConfig.imageUrl}
                      onChange={(e) => setBackgroundConfig(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="image-size" className="text-sm">Tamanho da Imagem</Label>
                      <select
                        id="image-size"
                        value={backgroundConfig.imageSize}
                        onChange={(e) => setBackgroundConfig(prev => ({ ...prev, imageSize: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="cover">Cobrir</option>
                        <option value="contain">Conter</option>
                        <option value="auto">Automático</option>
                        <option value="100% 100%">Esticar</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="image-position" className="text-sm">Posição</Label>
                      <select
                        id="image-position"
                        value={backgroundConfig.imagePosition}
                        onChange={(e) => setBackgroundConfig(prev => ({ ...prev, imagePosition: e.target.value }))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="center">Centro</option>
                        <option value="top">Topo</option>
                        <option value="bottom">Rodapé</option>
                        <option value="left">Esquerda</option>
                        <option value="right">Direita</option>
                        <option value="top left">Topo Esquerda</option>
                        <option value="top right">Topo Direita</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">Visualização</Label>
                <div
                  className="w-full h-48 rounded-lg border-2 border-gray-300 flex items-center justify-center text-white font-bold"
                  style={{
                    background: generateBackgroundStyle(),
                    backgroundSize: backgroundConfig.type === 'image' ? backgroundConfig.imageSize : undefined,
                    backgroundPosition: backgroundConfig.type === 'image' ? backgroundConfig.imagePosition : undefined,
                  }}
                >
                  Preview
                </div>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSaveBackground}
                disabled={isSaving}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Salvando...' : 'Salvar Configuração'}
              </Button>

              <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                ℹ️ Nota: A configuração será aplicada imediatamente na página de login do Portal do Irmão.
              </p>
            </div>
          </Card>
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

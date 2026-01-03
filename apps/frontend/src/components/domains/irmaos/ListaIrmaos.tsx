import { FC, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Mail, Phone, Heart } from 'lucide-react';

export interface Irmao {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  grau: string;
  dataAdmissao: string;
  filiacao?: string;
  dataNascimento?: string;
  ativo: boolean;
}

interface ListaIrmaosProps {
  filtro?: 'todos' | 'ativos' | 'inativos';
  grauFiltro?: string;
}

export const ListaIrmaos: FC<ListaIrmaosProps> = ({ filtro = 'ativos', grauFiltro }) => {
  const [irmaos] = useState<Irmao[]>([
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao@example.com',
      telefone: '11999999999',
      grau: 'Mestre',
      dataAdmissao: '2015-01-15',
      filiacao: 'Filiação 1',
      dataNascimento: '1980-05-10',
      ativo: true,
    },
    {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria@example.com',
      telefone: '11988888888',
      grau: 'Companheiro',
      dataAdmissao: '2018-03-20',
      filiacao: 'Filiação 2',
      dataNascimento: '1985-07-15',
      ativo: true,
    },
    {
      id: '3',
      nome: 'Pedro Oliveira',
      email: 'pedro@example.com',
      grau: 'Aprendiz',
      dataAdmissao: '2023-06-10',
      ativo: true,
    },
  ]);

  const [busca, setBusca] = useState('');

  const irmaosFiltrados = irmaos.filter((irmao) => {
    if (filtro === 'ativos' && !irmao.ativo) return false;
    if (filtro === 'inativos' && irmao.ativo) return false;
    if (grauFiltro && irmao.grau !== grauFiltro) return false;
    if (busca && !irmao.nome.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  const getGrauColor = (grau: string) => {
    switch (grau) {
      case 'Aprendiz':
        return 'bg-yellow-100 text-yellow-800';
      case 'Companheiro':
        return 'bg-blue-100 text-blue-800';
      case 'Mestre':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-8 w-8 text-blue-600" />
          Irmãos
        </h1>
        <p className="text-gray-600 mt-1">Gerenciar membros da loja maçônica</p>
      </div>

      {/* Barra de Busca */}
      <Card className="p-4">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
      </Card>

      {/* Grid de Irmãos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {irmaosFiltrados.map((irmao) => (
          <Card key={irmao.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{irmao.nome}</h3>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded text-xs font-medium ${getGrauColor(
                      irmao.grau
                    )}`}
                  >
                    {irmao.grau}
                  </span>
                </div>
                {irmao.ativo && <Heart className="h-5 w-5 text-red-500 fill-red-500" />}
              </div>

              {/* Informações de Contato */}
              <div className="space-y-2 text-sm text-gray-600">
                {irmao.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {irmao.email}
                  </div>
                )}
                {irmao.telefone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {irmao.telefone}
                  </div>
                )}
              </div>

              {/* Informações Maçônicas */}
              <div className="bg-gray-50 p-3 rounded space-y-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Admissão:</span> {new Date(irmao.dataAdmissao).toLocaleDateString('pt-BR')}
                </div>
                {irmao.filiacao && (
                  <div>
                    <span className="font-medium">Filiação:</span> {irmao.filiacao}
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Ver Perfil
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Contatar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {irmaosFiltrados.length === 0 && (
        <Card className="p-8 text-center">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum irmão encontrado</p>
        </Card>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Total de Irmãos</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{irmaos.length}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Ativos</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{irmaos.filter((i) => i.ativo).length}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Inativos</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{irmaos.filter((i) => !i.ativo).length}</p>
        </Card>
      </div>
    </div>
  );
};

export default ListaIrmaos;

import { FC, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, FileText } from 'lucide-react';

export interface Comissao {
  id: string;
  nome: string;
  descricao: string;
  presidente: string;
  membros: string[];
  objetivos: string[];
  dataCriacao: string;
  ativa: boolean;
  reunioesAno?: number;
}

interface ListaComissoesProps {
  filtroAtivas?: boolean;
}

export const ListaComissoes: FC<ListaComissoesProps> = ({ filtroAtivas = true }) => {
  const [comissoes] = useState<Comissao[]>([
    {
      id: '1',
      nome: 'Comissão de Educação',
      descricao: 'Responsável pelo desenvolvimento de programas educacionais',
      presidente: 'João Silva',
      membros: ['João Silva', 'Maria Santos', 'Pedro Oliveira'],
      objetivos: [
        'Organizar palestras e seminários',
        'Desenvolver materiais educacionais',
        'Promover pesquisas maçônicas',
      ],
      dataCriacao: '2010-01-15',
      ativa: true,
      reunioesAno: 12,
    },
    {
      id: '2',
      nome: 'Comissão de Beneficência',
      descricao: 'Coordena atividades filantrópicas e sociais',
      presidente: 'Maria Santos',
      membros: ['Maria Santos', 'Ana Costa', 'Carlos Silva'],
      objetivos: [
        'Gerenciar doações',
        'Coordenar voluntariados',
        'Apoiar causas sociais',
      ],
      dataCriacao: '2012-03-20',
      ativa: true,
      reunioesAno: 10,
    },
    {
      id: '3',
      nome: 'Comissão de Obras',
      descricao: 'Gestão de manutenção e reforma do templo',
      presidente: 'Pedro Oliveira',
      membros: ['Pedro Oliveira', 'Francisco Lima'],
      objetivos: [
        'Manutenção predial',
        'Planejamento de reformas',
        'Segurança das instalações',
      ],
      dataCriacao: '2008-06-10',
      ativa: true,
      reunioesAno: 8,
    },
  ]);

  const [busca, setBusca] = useState('');

  const comissoesFiltradas = comissoes.filter((c) => {
    if (filtroAtivas && !c.ativa) return false;
    if (busca && !c.nome.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Comissões
          </h1>
          <p className="text-gray-600 mt-1">Comissões permanentes e temporárias</p>
        </div>
        <Button>Nova Comissão</Button>
      </div>

      {/* Barra de Busca */}
      <Card className="p-4">
        <input
          type="text"
          placeholder="Buscar comissão..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
      </Card>

      {/* Grid de Comissões */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comissoesFiltradas.map((comissao) => (
          <Card key={comissao.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{comissao.nome}</h3>
                  <p className="text-gray-600 text-sm mt-1">{comissao.descricao}</p>
                </div>
                <Badge variant={comissao.ativa ? 'default' : 'secondary'}>
                  {comissao.ativa ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>

              {/* Presidente */}
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-xs text-gray-600">Presidente</p>
                <p className="font-bold text-gray-900">{comissao.presidente}</p>
              </div>

              {/* Membros */}
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">Membros</p>
                <div className="flex flex-wrap gap-2">
                  {comissao.membros.map((membro, idx) => (
                    <Badge key={idx} variant="outline">
                      {membro}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Objetivos */}
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">Objetivos</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {comissao.objetivos.slice(0, 2).map((obj, idx) => (
                    <li key={idx}>• {obj}</li>
                  ))}
                  {comissao.objetivos.length > 2 && (
                    <li>• +{comissao.objetivos.length - 2} mais</li>
                  )}
                </ul>
              </div>

              {/* Informações */}
              <div className="flex gap-4 text-sm text-gray-600 border-t pt-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {comissao.reunioesAno}x/ano
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Desde {new Date(comissao.dataCriacao).getFullYear()}
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Detalhes
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Editar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {comissoesFiltradas.length === 0 && (
        <Card className="p-8 text-center">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhuma comissão encontrada</p>
        </Card>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Total de Comissões</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{comissoes.length}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Ativas</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {comissoes.filter((c) => c.ativa).length}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ListaComissoes;

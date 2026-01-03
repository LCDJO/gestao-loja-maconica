import { FC, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Gift } from 'lucide-react';

export interface RegistroCaridade {
  id: string;
  tipo: 'doacao' | 'auxilio' | 'voluntariado' | 'campanha';
  titulo: string;
  descricao: string;
  data: string;
  responsavel: string;
  pessoas: number;
  status: 'planejado' | 'em-andamento' | 'concluido';
  beneficiarios?: number;
}

interface RegistrosCaridadeProps {
  filtroStatus?: string;
}

export const RegistrosCaridade: FC<RegistrosCaridadeProps> = ({ filtroStatus }) => {
  const [registros] = useState<RegistroCaridade[]>([
    {
      id: '1',
      tipo: 'doacao',
      titulo: 'Doação de Alimentos',
      descricao: 'Coleta e doação de alimentos não perecíveis',
      data: '2024-01-15',
      responsavel: 'João Silva',
      pessoas: 15,
      status: 'concluido',
      beneficiarios: 50,
    },
    {
      id: '2',
      tipo: 'auxilio',
      titulo: 'Auxílio Emergencial',
      descricao: 'Apoio financeiro para irmão em necessidade',
      data: '2024-02-20',
      responsavel: 'Maria Santos',
      pessoas: 5,
      status: 'concluido',
      beneficiarios: 1,
    },
    {
      id: '3',
      tipo: 'voluntariado',
      titulo: 'Reforma de Casa',
      descricao: 'Reforma de moradia de família carente',
      data: '2024-03-10',
      responsavel: 'Pedro Oliveira',
      pessoas: 20,
      status: 'em-andamento',
    },
  ]);

  const [filtro, setFiltro] = useState(filtroStatus || '');

  const registrosFiltrados = registros.filter((r) => {
    if (filtro && r.status !== filtro) return false;
    return true;
  });

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'doacao':
        return 'bg-red-100 text-red-800';
      case 'auxilio':
        return 'bg-blue-100 text-blue-800';
      case 'voluntariado':
        return 'bg-green-100 text-green-800';
      case 'campanha':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planejado':
        return 'bg-yellow-100 text-yellow-800';
      case 'em-andamento':
        return 'bg-blue-100 text-blue-800';
      case 'concluido':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-600" />
            Registros de Caridade
          </h1>
          <p className="text-gray-600 mt-1">Gerenciar atividades de filantropia</p>
        </div>
        <Button>
          <Gift className="h-4 w-4 mr-2" />
          Novo Registro
        </Button>
      </div>

      {/* Filtro */}
      <Card className="p-4">
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">Todos os status</option>
          <option value="planejado">Planejado</option>
          <option value="em-andamento">Em Andamento</option>
          <option value="concluido">Concluído</option>
        </select>
      </Card>

      {/* Lista de Registros */}
      <div className="space-y-4">
        {registrosFiltrados.map((registro) => (
          <Card key={registro.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{registro.titulo}</h3>
                  <p className="text-gray-600 text-sm mt-1">{registro.descricao}</p>
                </div>
                <Badge className={getStatusColor(registro.status)}>
                  {registro.status}
                </Badge>
              </div>

              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                <Badge className={getTipoColor(registro.tipo)}>{registro.tipo}</Badge>
                <Badge variant="secondary">
                  {new Date(registro.data).toLocaleDateString('pt-BR')}
                </Badge>
              </div>

              {/* Informações */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 bg-gray-50 p-3 rounded">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Voluntários</p>
                    <p className="font-bold text-gray-900">{registro.pessoas}</p>
                  </div>
                </div>
                {registro.beneficiarios && (
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-xs text-gray-600">Beneficiários</p>
                      <p className="font-bold text-gray-900">{registro.beneficiarios}</p>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-600">Responsável</p>
                  <p className="font-bold text-gray-900">{registro.responsavel}</p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Ver Detalhes
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Editar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {registrosFiltrados.length === 0 && (
        <Card className="p-8 text-center">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum registro encontrado</p>
        </Card>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{registros.length}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Planejados</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {registros.filter((r) => r.status === 'planejado').length}
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Em Andamento</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {registros.filter((r) => r.status === 'em-andamento').length}
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Concluídos</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {registros.filter((r) => r.status === 'concluido').length}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default RegistrosCaridade;

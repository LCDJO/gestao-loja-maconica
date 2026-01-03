import { FC, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Gift, Users } from 'lucide-react';

export interface Aniversariante {
  id: string;
  nome: string;
  email: string;
  dataNascimento: string;
  grau: string;
  proximoAniversario: string;
}

interface ListaAniversariantesProps {
  irmao?: boolean;
}

export const ListaAniversariantes: FC<ListaAniversariantesProps> = ({ irmao = false }) => {
  const [aniversariantes] = useState<Aniversariante[]>([
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao@example.com',
      dataNascimento: '1980-01-15',
      grau: 'Mestre',
      proximoAniversario: '2026-01-15',
    },
    {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria@example.com',
      dataNascimento: '1985-02-20',
      grau: 'Companheiro',
      proximoAniversario: '2026-02-20',
    },
  ]);

  const [filtroMes, setFiltroMes] = useState<string>('');

  const aniversariosFiltrados = filtroMes
    ? aniversariantes.filter((a) => {
        const mes = new Date(a.proximoAniversario).getMonth() + 1;
        return mes === parseInt(filtroMes);
      })
    : aniversariantes;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Gift className="h-8 w-8 text-purple-600" />
          Aniversariantes
        </h1>
        <p className="text-gray-600 mt-1">
          {irmao ? 'Próximos aniversários da Loja' : 'Gerenciar e acompanhar aniversários'}
        </p>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex gap-2">
          <select
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="">Todos os meses</option>
            <option value="1">Janeiro</option>
            <option value="2">Fevereiro</option>
            <option value="3">Março</option>
            <option value="4">Abril</option>
            <option value="5">Maio</option>
            <option value="6">Junho</option>
            <option value="7">Julho</option>
            <option value="8">Agosto</option>
            <option value="9">Setembro</option>
            <option value="10">Outubro</option>
            <option value="11">Novembro</option>
            <option value="12">Dezembro</option>
          </select>
          {filtroMes && (
            <Button variant="outline" onClick={() => setFiltroMes('')}>
              Limpar filtro
            </Button>
          )}
        </div>
      </Card>

      {/* Grid de Aniversariantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aniversariosFiltrados.map((aniversariante) => (
          <Card key={aniversariante.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-3">
              {/* Nome */}
              <div>
                <h3 className="text-lg font-bold text-gray-900">{aniversariante.nome}</h3>
                <p className="text-sm text-gray-500">{aniversariante.email}</p>
              </div>

              {/* Informações */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(aniversariante.dataNascimento).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <Badge variant="secondary">{aniversariante.grau}</Badge>
                </div>
              </div>

              {/* Data Próximo Aniversário */}
              <div className="bg-purple-50 p-3 rounded">
                <p className="text-xs text-gray-600">Próximo aniversário</p>
                <p className="text-sm font-bold text-purple-600">
                  {new Date(aniversariante.proximoAniversario).toLocaleDateString('pt-BR')}
                </p>
              </div>

              {/* Ações */}
              {!irmao && (
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Enviar Mensagem
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {aniversariosFiltrados.length === 0 && (
        <Card className="p-8 text-center">
          <Gift className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum aniversariante encontrado</p>
        </Card>
      )}
    </div>
  );
};

export default ListaAniversariantes;

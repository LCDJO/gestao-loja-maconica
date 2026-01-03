import { FC, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

export interface Sessao {
  id: string;
  titulo: string;
  data: string;
  horario: string;
  local: string;
  tipo: 'sessao' | 'reuniao' | 'evento';
  descricao?: string;
  capacidade?: number;
  presentes?: number;
}

interface ListaSessoesProps {
  filtro?: 'todas' | 'proximas' | 'passadas';
}

export const ListaSessoes: FC<ListaSessoesProps> = () => {
  const [sessoes] = useState<Sessao[]>([
    {
      id: '1',
      titulo: 'Sessão Ordinária',
      data: '2026-01-10',
      horario: '20:00',
      local: 'Loja Maçônica',
      tipo: 'sessao',
      descricao: 'Sessão ordinária da Loja',
      capacidade: 50,
      presentes: 35,
    },
    {
      id: '2',
      titulo: 'Reunião da Comissão de Educação',
      data: '2026-01-15',
      horario: '19:00',
      local: 'Sala de Reuniões',
      tipo: 'reuniao',
      descricao: 'Planejamento educacional do ano',
      capacidade: 20,
      presentes: 15,
    },
    {
      id: '3',
      titulo: 'Evento Social',
      data: '2026-01-20',
      horario: '18:00',
      local: 'Auditório',
      tipo: 'evento',
      descricao: 'Confraternização dos membros',
      capacidade: 100,
    },
  ]);

  const getTipoBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'sessao':
        return 'bg-blue-100 text-blue-800';
      case 'reuniao':
        return 'bg-green-100 text-green-800';
      case 'evento':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'sessao':
        return 'Sessão';
      case 'reuniao':
        return 'Reunião';
      case 'evento':
        return 'Evento';
      default:
        return tipo;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="h-8 w-8 text-blue-600" />
          Cronograma
        </h1>
        <p className="text-gray-600 mt-1">Confira as próximas sessões e eventos</p>
      </div>

      {/* Lista de Sessões */}
      <div className="space-y-4">
        {sessoes.map((sessao) => (
          <Card key={sessao.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex gap-4">
              {/* Data */}
              <div className="flex flex-col items-center min-w-fit bg-gray-50 p-4 rounded">
                <span className="text-xs text-gray-500 uppercase">
                  {new Date(sessao.data).toLocaleDateString('pt-BR', { month: 'short' })}
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  {new Date(sessao.data).getDate()}
                </span>
              </div>

              {/* Conteúdo */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{sessao.titulo}</h3>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded text-xs font-medium ${getTipoBadgeColor(
                        sessao.tipo
                      )}`}
                    >
                      {getTipoLabel(sessao.tipo)}
                    </span>
                  </div>
                </div>

                {/* Descrição */}
                {sessao.descricao && (
                  <p className="text-sm text-gray-600 mb-3">{sessao.descricao}</p>
                )}

                {/* Detalhes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {sessao.horario}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {sessao.local}
                  </div>
                  {sessao.presentes !== undefined && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-gray-400" />
                      {sessao.presentes} / {sessao.capacidade}
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Ver Detalhes
                  </Button>
                  <Button size="sm" variant="outline">
                    Confirmar Presença
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ListaSessoes;

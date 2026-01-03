import { FC, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, FileText } from 'lucide-react';

export interface Prancha {
  id: string;
  titulo: string;
  autor: string;
  data: string;
  grau: string;
  tema: string;
  resumo: string;
  arquivo?: string;
  arquivado: boolean;
}

interface ListaPranchasProps {
  filtroGrau?: string;
}

export const ListaPranchas: FC<ListaPranchasProps> = ({ filtroGrau }) => {
  const [pranchas] = useState<Prancha[]>([
    {
      id: '1',
      titulo: 'A Simbologia da Maçonaria',
      autor: 'Irmão João Silva',
      data: '2024-01-10',
      grau: 'Aprendiz',
      tema: 'Simbolismo',
      resumo:
        'Análise profunda dos símbolos maçônicos e seus significados filosóficos',
      arquivo: 'prancha-001.pdf',
      arquivado: false,
    },
    {
      id: '2',
      titulo: 'História da Ordem no Brasil',
      autor: 'Irmão Pedro Costa',
      data: '2024-02-15',
      grau: 'Companheiro',
      tema: 'História',
      resumo: 'Panorama histórico da maçonaria brasileira desde o século XVIII',
      arquivo: 'prancha-002.pdf',
      arquivado: false,
    },
    {
      id: '3',
      titulo: 'Ética Maçônica Aplicada',
      autor: 'Irmão Carlos Mendes',
      data: '2024-03-20',
      grau: 'Mestre',
      tema: 'Ética',
      resumo:
        'Reflexão sobre princípios éticos da ordem e sua aplicação na vida',
      arquivo: 'prancha-003.pdf',
      arquivado: false,
    },
  ]);

  const [busca, setBusca] = useState('');
  const [grauFiltro, setGrauFiltro] = useState(filtroGrau || '');

  const punchasFiltradas = pranchas.filter((p) => {
    if (grauFiltro && p.grau !== grauFiltro) return false;
    if (busca && !p.titulo.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  const graus = [...new Set(pranchas.map((p) => p.grau))];

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            Pranchas
          </h1>
          <p className="text-gray-600 mt-1">Trabalhos e estudos publicados</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Prancha
        </Button>
      </div>

      {/* Buscas e Filtros */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por título..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <select
            value={grauFiltro}
            onChange={(e) => setGrauFiltro(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="">Todos os graus</option>
            {graus.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Lista de Pranchas */}
      <div className="space-y-4">
        {punchasFiltradas.map((prancha) => (
          <Card key={prancha.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{prancha.titulo}</h3>
                  <p className="text-gray-600 text-sm">por {prancha.autor}</p>
                </div>
                <Badge className={getGrauColor(prancha.grau)}>{prancha.grau}</Badge>
              </div>

              {/* Tema e Data */}
              <div className="flex gap-2">
                <Badge variant="secondary">{prancha.tema}</Badge>
                <Badge variant="outline">
                  {new Date(prancha.data).toLocaleDateString('pt-BR')}
                </Badge>
              </div>

              {/* Resumo */}
              <p className="text-gray-700">{prancha.resumo}</p>

              {/* Ações */}
              <div className="flex gap-2">
                {prancha.arquivo && (
                  <Button size="sm" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Baixar
                  </Button>
                )}
                <Button size="sm" variant="outline" className={prancha.arquivo ? 'flex-1' : ''}>
                  Ver Detalhes
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {punchasFiltradas.length === 0 && (
        <Card className="p-8 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhuma prancha encontrada</p>
        </Card>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Total de Pranchas</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{pranchas.length}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Temas</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {[...new Set(pranchas.map((p) => p.tema))].length}
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Este Ano</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {pranchas.filter((p) => new Date(p.data).getFullYear() === 2024).length}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ListaPranchas;

import { FC, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Search } from 'lucide-react';

export interface Livro {
  id: string;
  titulo: string;
  autor: string;
  categoria: string;
  isbn?: string;
  ano?: number;
  disponibilidade: 'disponivel' | 'emprestado' | 'reservado';
  localizacao?: string;
}

interface CatalogoBibliotecaProps {
  filtro?: string;
}

export const CatalogoBiblioteca: FC<CatalogoBibliotecaProps> = ({ filtro: filtroInicial }) => {
  const [livros] = useState<Livro[]>([
    {
      id: '1',
      titulo: 'Constituição Maçônica',
      autor: 'Grande Oriente do Brasil',
      categoria: 'Legislação',
      isbn: '978-1234567890',
      ano: 2010,
      disponibilidade: 'disponivel',
      localizacao: 'Prateleira A1',
    },
    {
      id: '2',
      titulo: 'História da Maçonaria',
      autor: 'Albert Pike',
      categoria: 'História',
      isbn: '978-0987654321',
      ano: 1889,
      disponibilidade: 'emprestado',
      localizacao: 'Prateleira B2',
    },
    {
      id: '3',
      titulo: 'Rituais do Primeiro Grau',
      autor: 'Grande Loja Unida',
      categoria: 'Rituais',
      isbn: '978-5555555555',
      ano: 2015,
      disponibilidade: 'disponivel',
      localizacao: 'Prateleira C3',
    },
  ]);

  const [busca, setBusca] = useState(filtroInicial || '');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  const livrosFiltrados = livros.filter((livro) => {
    if (busca && !livro.titulo.toLowerCase().includes(busca.toLowerCase())) return false;
    if (categoriaFiltro && livro.categoria !== categoriaFiltro) return false;
    return true;
  });

  const categorias = [...new Set(livros.map((l) => l.categoria))];

  const getDisponibilidadeColor = (disponibilidade: string) => {
    switch (disponibilidade) {
      case 'disponivel':
        return 'bg-green-100 text-green-800';
      case 'emprestado':
        return 'bg-orange-100 text-orange-800';
      case 'reservado':
        return 'bg-blue-100 text-blue-800';
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
            Catálogo Biblioteca
          </h1>
          <p className="text-gray-600 mt-1">Gerenciar acervo de livros</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Livro
        </Button>
      </div>

      {/* Barra de Busca */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-2 border rounded px-3 py-2">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="">Todas as categorias</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Lista de Livros */}
      <div className="space-y-4">
        {livrosFiltrados.map((livro) => (
          <Card key={livro.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex gap-4">
              <div className="bg-blue-100 rounded p-4 h-24 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{livro.titulo}</h3>
                <p className="text-gray-600">
                  <span className="font-medium">Autor:</span> {livro.autor}
                </p>
                <div className="flex gap-4 mt-2">
                  <Badge variant="secondary">{livro.categoria}</Badge>
                  <Badge className={getDisponibilidadeColor(livro.disponibilidade)}>
                    {livro.disponibilidade}
                  </Badge>
                </div>
                {livro.localizacao && (
                  <p className="text-sm text-gray-500 mt-2">
                    Localização: {livro.localizacao}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Detalhes
                </Button>
                {livro.disponibilidade === 'disponivel' && (
                  <Button size="sm">Emprestar</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {livrosFiltrados.length === 0 && (
        <Card className="p-8 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum livro encontrado</p>
        </Card>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Total de Livros</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{livros.length}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Disponíveis</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {livros.filter((l) => l.disponibilidade === 'disponivel').length}
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-gray-600 text-sm">Emprestados</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {livros.filter((l) => l.disponibilidade === 'emprestado').length}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default CatalogoBiblioteca;

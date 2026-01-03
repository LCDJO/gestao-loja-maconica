import { FC, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export interface LancamentoFinanceiro {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  status: 'pendente' | 'pago';
  tipo: 'receita' | 'despesa';
}

interface MinhasFinancasProps {
  userEmail?: string;
}

export const MinhasFinancas: FC<MinhasFinancasProps> = () => {
  const [lancamentos] = useState<LancamentoFinanceiro[]>([
    {
      id: '1',
      descricao: 'Mensalidade Janeiro',
      valor: 150.00,
      data: '2026-01-15',
      categoria: 'Mensalidade',
      status: 'pago',
      tipo: 'receita',
    },
    {
      id: '2',
      descricao: 'Mensalidade Fevereiro',
      valor: 150.00,
      data: '2026-02-15',
      categoria: 'Mensalidade',
      status: 'pendente',
      tipo: 'receita',
    },
  ]);

  const [filtro, setFiltro] = useState<'todos' | 'pendentes' | 'pagos'>('todos');
  const [anoFiltro, setAnoFiltro] = useState(new Date().getFullYear());

  // Estatísticas - Cálculo
  const totalReceitas = lancamentos
    .filter(l => l.tipo === 'receita')
    .reduce((sum, l) => sum + l.valor, 0);
  
  const totalDespesas = lancamentos
    .filter(l => l.tipo === 'despesa')
    .reduce((sum, l) => sum + l.valor, 0);
  
  const totalPago = lancamentos
    .filter(l => l.status === 'pago')
    .reduce((sum, l) => sum + l.valor, 0);
  
  const saldoLiquido = totalReceitas - totalDespesas;

  const lancamentosFiltrados = lancamentos.filter((item) => {
    if (filtro === 'pendentes') return item.status === 'pendente';
    if (filtro === 'pagos') return item.status === 'pago';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Minhas Finanças</h1>
        <p className="text-gray-600 mt-1">Acompanhe seus lançamentos financeiros</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total a Pagar</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {totalReceitas.toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Já Pago</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {totalPago.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Créditos</p>
              <p className="text-2xl font-bold text-orange-600">
                R$ {totalDespesas.toFixed(2)}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Saldo</p>
              <p className={`text-2xl font-bold ${saldoLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {saldoLiquido.toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Filtros e Tabela */}
      <Card>
        <div className="p-6 space-y-6">
          {/* Filtros */}
          <div className="flex gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Filtrar por Status
              </label>
              <Tabs defaultValue={filtro} onValueChange={(v) => setFiltro(v as any)}>
                <TabsList>
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
                  <TabsTrigger value="pagos">Pagos</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Ano
              </label>
              <input
                type="number"
                value={anoFiltro}
                onChange={(e) => setAnoFiltro(parseInt(e.target.value))}
                className="border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lancamentosFiltrados.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{new Date(item.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{item.descricao}</TableCell>
                    <TableCell>{item.categoria}</TableCell>
                    <TableCell className="text-right font-medium">
                      {item.tipo === 'receita' ? '+' : '-'} R$ {item.valor.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'pago'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.status === 'pago' ? 'Pago' : 'Pendente'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {lancamentosFiltrados.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum lançamento encontrado</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MinhasFinancas;

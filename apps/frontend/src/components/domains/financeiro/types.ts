export interface LancamentoFinanceiro {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  status: 'pendente' | 'pago';
  tipo: 'receita' | 'despesa';
}

export interface EstatisticasFinanceiras {
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
  totalPago: number;
}

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

export interface ComissoesStats {
  total: number;
  ativas: number;
  inativas: number;
  totalMembros: number;
}

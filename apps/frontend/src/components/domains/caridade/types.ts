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

export interface CaridadeStats {
  total: number;
  planejados: number;
  emAndamento: number;
  concluidos: number;
  totalVoluntarios: number;
  totalBeneficiarios: number;
}

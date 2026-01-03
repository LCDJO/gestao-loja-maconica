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

export interface RegistroPresenca {
  id: string;
  sessaoId: string;
  irmaoId: string;
  presente: boolean;
  dataPresenca: string;
}

export interface CronogramaStats {
  totalSessoes: number;
  proximasSessoes: number;
  proximoEvento: string;
}

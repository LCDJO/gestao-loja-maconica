// Tipos compartilhados entre frontend e backend
// Este arquivo será expandido com os tipos migrados de apps/frontend/src/lib/types.ts

export type MemberStatus = 'ativo' | 'inativo' | 'irregular';
export type MemberDegree = 'aprendiz' | 'companheiro' | 'mestre';
export type TransactionType = 'receita' | 'despesa';
export type TransactionCategory = 'mensalidade' | 'tronco' | 'aluguel' | 'agape' | 'materiais' | 'outros';

export interface Member {
  id: string;
  name: string;
  cim: string;
  degree: MemberDegree;
  status: MemberStatus;
  email: string;
  phone: string;
  birthDate: string;
  initiationDate: string;
  photoUrl?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
  memberId?: string;
}

export interface Meeting {
  id: string;
  date: string;
  type: string;
  description: string;
  minutesContent?: string;
  minutesFileUrl?: string;
  attendanceCount: number;
}

// TODO: Adicionar mais tipos conforme necessário

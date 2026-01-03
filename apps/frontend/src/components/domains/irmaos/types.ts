export interface Irmao {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  grau: 'Aprendiz' | 'Companheiro' | 'Mestre';
  dataAdmissao: string;
  filiacao?: string;
  dataNascimento?: string;
  ativo: boolean;
  endereco?: string;
  cpf?: string;
}

export interface IrmaoStats {
  total: number;
  ativos: number;
  inativos: number;
  porGrau: Record<string, number>;
}

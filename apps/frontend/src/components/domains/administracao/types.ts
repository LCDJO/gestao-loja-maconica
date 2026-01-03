export interface Usuario {
  id: string;
  nome: string;
  email: string;
  funcao: string;
  ativo: boolean;
  ultimoAcesso?: string;
  papel: 'admin' | 'operador' | 'leitor';
}

export interface ConfiguracoesAdm {
  id: string;
  nome: string;
  valor: string;
  tipo: 'texto' | 'numero' | 'booleano' | 'lista';
}

export interface AdministracaoStats {
  totalUsuarios: number;
  usuariosAtivos: number;
  admins: number;
  operadores: number;
  leitores: number;
}

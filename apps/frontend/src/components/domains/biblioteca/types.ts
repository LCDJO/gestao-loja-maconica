export interface Livro {
  id: string;
  titulo: string;
  autor: string;
  categoria: string;
  isbn?: string;
  ano?: number;
  disponibilidade: 'disponivel' | 'emprestado' | 'reservado';
  localizacao?: string;
  descricao?: string;
}

export interface BibliotecaStats {
  totalLivros: number;
  disponibles: number;
  emprestados: number;
  reservados: number;
}

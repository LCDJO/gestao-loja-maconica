export interface Prancha {
  id: string;
  titulo: string;
  autor: string;
  data: string;
  grau: 'Aprendiz' | 'Companheiro' | 'Mestre';
  tema: string;
  resumo: string;
  arquivo?: string;
  arquivado: boolean;
  palavrasChave?: string[];
}

export interface PranchasStats {
  total: number;
  porGrau: Record<string, number>;
  temas: number;
  esteAno: number;
}

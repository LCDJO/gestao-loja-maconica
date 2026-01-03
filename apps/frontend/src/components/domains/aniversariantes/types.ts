export interface Aniversariante {
  id: string;
  nome: string;
  email: string;
  dataNascimento: string;
  grau: string;
  proximoAniversario: string;
}

export interface AniversarianteStats {
  total: number;
  proximos30dias: number;
  proximos90dias: number;
}

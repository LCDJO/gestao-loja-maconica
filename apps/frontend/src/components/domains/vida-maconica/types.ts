export interface GrauMaconica {
  id: string;
  grau: 'Aprendiz' | 'Companheiro' | 'Mestre';
  dataIniciacao: string;
  dataProgressao?: string;
  mestresGuia: string[];
  certificado: boolean;
}

export interface HistoricoVidaMaconica {
  id: string;
  irmaoId: string;
  titulo: string;
  tipo: 'progressao' | 'cargo' | 'evento' | 'formacao';
  data: string;
  descricao: string;
  certificado?: string;
}

export interface VidaMaconicaStats {
  grauAtual: string;
  totalEventos: number;
  totalCertificados: number;
}

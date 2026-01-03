export interface DadosLoja {
  id: string;
  nome: string;
  numeroLoja: number;
  obreAnciano: string;
  mestredeCerimonia: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  email: string;
  telefone: string;
  website?: string;
  fundacao: string;
  jurisdicao?: string;
  ativa: boolean;
}

export interface ConfiguracaoSistema {
  id: string;
  thema: 'light' | 'dark';
  idioma: 'pt-BR' | 'en' | 'es';
  notificacoes: boolean;
  emailNotificacoes: boolean;
}

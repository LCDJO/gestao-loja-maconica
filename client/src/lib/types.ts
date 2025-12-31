export type MemberStatus = 'ativo' | 'inativo' | 'irregular';
export type MemberDegree = 'aprendiz' | 'companheiro' | 'mestre';

export interface Member {
  id: string;
  name: string;
  cim: string; // Cadastro Internacional Maçônico
  degree: MemberDegree;
  status: MemberStatus;
  email: string;
  phone: string;
  birthDate: string;
  initiationDate: string;
  photoUrl?: string;
}

export interface Meeting {
  id: string;
  date: string;
  type: string; // Econômica, Magna, etc.
  description: string;
  minutesContent?: string; // Conteúdo da ata
  minutesFileUrl?: string; // URL simulada para arquivo
  attendanceCount: number;
}

export interface TroncoRecord {
  id: string;
  date: string;
  meetingId?: string;
  amount: number;
  notes?: string;
}

export interface Attendance {
  id: string;
  meetingId: string;
  memberId: string;
  status: 'presente' | 'ausente' | 'justificado';
}

export interface Visitor {
  id: string;
  name: string;
  lodge: string; // Loja de origem
  rank: string; // Grau/Cargo
  meetingId: string;
  date: string;
}

export type TransactionType = 'receita' | 'despesa';
export type TransactionCategory = 'mensalidade' | 'tronco' | 'aluguel' | 'agape' | 'materiais' | 'outros';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
  memberId?: string; // Opcional, para mensalidades
}

export interface MonthlyFee {
  id: string;
  memberId: string;
  month: number; // 1-12
  year: number;
  amount: number;
  status: 'pago' | 'pendente' | 'atrasado';
  paymentDate?: string;
}

export interface AppConfig {
  integrations: {
    evolutionApi: {
      enabled: boolean;
      baseUrl: string;
      apiKey: string;
      instanceName: string;
    };
    gowa: {
      enabled: boolean;
      baseUrl: string;
      token: string;
    };
  };
  paymentMethods: {
    pix: {
      enabled: boolean;
      key: string;
      keyType: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
      merchantName: string;
      merchantCity: string;
    };
    boleto: {
      enabled: boolean;
      provider: string;
      clientId: string;
      clientSecret: string;
    };
    creditCard: {
      enabled: boolean;
      provider: string;
      publicKey: string;
    };
  };
}

export type BillingEventType = 'mutua' | 'taxa_extra' | 'mensalidade' | 'evento';

export interface BillingEvent {
  id: string;
  title: string;
  type: BillingEventType;
  description: string;
  amount: number;
  dueDate: string;
  createdAt: string;
  targetMembers: 'all' | 'active' | 'specific'; // Quem recebe a cobrança
  status: 'draft' | 'generated' | 'cancelled';
}

export interface Bill {
  id: string;
  billingEventId: string;
  memberId: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: 'pix' | 'boleto' | 'credit_card' | 'cash';
  paymentDate?: string;
  pixCode?: string; // Código copia e cola gerado
  sentViaWhatsapp: boolean;
  whatsappSentAt?: string;
}

export interface OFXTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'debit' | 'credit';
  memo?: string;
}

export interface BankReconciliation {
  id: string;
  fileName: string;
  uploadDate: string;
  bankName: string;
  accountNumber: string;
  transactions: OFXTransaction[];
  status: 'pending' | 'completed' | 'partial';
  matchedBills: string[]; // IDs das cobranças que foram baixadas
}

export interface ReconciliationMatch {
  ofxTransactionId: string;
  billId: string;
  confidence: number; // 0-100, percentual de confiança do match automático
  matchType: 'exact' | 'fuzzy' | 'manual';
}

export interface AuthUser {
  id: string;
  email: string;
  password?: string; // Apenas para armazenamento local simulado
  isAuthenticated: boolean;
}

export interface EmailNotification {
  id: string;
  billId: string;
  memberId: string;
  email: string;
  type: 'reminder_3days' | 'reminder_1day' | 'overdue_7days' | 'overdue_15days';
  subject: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: string;
  failureReason?: string;
  createdAt: string;
}

export interface NotificationSettings {
  enabled: boolean;
  sendReminder3Days: boolean;
  sendReminder1Day: boolean;
  sendOverdue7Days: boolean;
  sendOverdue15Days: boolean;
  emailProvider: 'smtp' | 'sendgrid' | 'mailgun';
  smtpConfig?: {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    fromEmail?: string;
    fromName?: string;
  };
  sendgridKey?: string;
  mailgunKey?: string;
  mailgunDomain?: string;
}

export interface MemberNotificationPreferences {
  memberId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  whatsappNotifications: boolean;
  smsNotifications: boolean;
  whatsappPhone?: string;
  smsPhone?: string;
  notificationTypes: {
    reminder3Days: boolean;
    reminder1Day: boolean;
    overdue7Days: boolean;
    overdue15Days: boolean;
    eventNotifications: boolean;
    meetingReminders: boolean;
  };
  updatedAt: string;
}

export interface OneSignalConfig {
  enabled: boolean;
  appId: string;
  apiKey: string;
  restApiKey: string;
}

export interface OpenSignConfig {
  enabled: boolean;
  apiKey: string;
  apiUrl: string;
  signerEmail: string;
  signerName: string;
}

export interface DocumentSignature {
  id: string;
  documentName: string;
  documentUrl: string;
  signerEmail: string;
  signerName: string;
  status: 'pending' | 'signed' | 'rejected' | 'expired';
  createdAt: string;
  signedAt?: string;
  expiresAt?: string;
  openSignDocumentId?: string;
}

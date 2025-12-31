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

export interface Document {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
  status: 'draft' | 'ready' | 'sent' | 'completed' | 'failed';
  documentType: 'ata' | 'estatuto' | 'contrato' | 'outro';
}

export interface SignatureBatch {
  id: string;
  name: string;
  description: string;
  documents: string[]; // IDs dos documentos
  signers: BatchSigner[];
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: string;
  createdBy: string;
  sentAt?: string;
  completedAt?: string;
  openSignBatchId?: string;
}

export interface BatchSigner {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  status: 'pending' | 'signed' | 'rejected' | 'expired';
  signedAt?: string;
  openSignSignerId?: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'ata' | 'estatuto' | 'contrato' | 'outro';
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationMetrics {
  id: string;
  notificationId: string;
  channel: 'email' | 'push' | 'whatsapp' | 'sms';
  billType: 'mensalidade' | 'mutua' | 'taxa' | 'outro';
  sentAt: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  billType: 'mensalidade' | 'mutua' | 'taxa' | 'outro';
  channel: 'email' | 'push' | 'whatsapp' | 'sms';
  subject?: string;
  content: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  variables: string[]; // Ex: ['{nome}', '{valor}', '{vencimento}']
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
}

export interface NotificationAnalytics {
  period: {
    startDate: string;
    endDate: string;
  };
  channels: {
    email: ChannelMetrics;
    push: ChannelMetrics;
    whatsapp: ChannelMetrics;
    sms: ChannelMetrics;
  };
  byBillType: {
    mensalidade: BillTypeMetrics;
    mutua: BillTypeMetrics;
    taxa: BillTypeMetrics;
    outro: BillTypeMetrics;
  };
  totalNotificationsSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
}

export interface ChannelMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
}

export interface BillTypeMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
}

export interface NotificationCampaign {
  id: string;
  name: string;
  description: string;
  billType: 'mensalidade' | 'mutua' | 'taxa' | 'outro';
  channel: 'email' | 'push' | 'whatsapp' | 'sms';
  scheduledFor: string;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  templateId: string;
  recipientCount: number;
  abTest?: ABTest;
  createdAt: string;
  sentAt?: string;
  campaignMetrics?: CampaignMetrics;
}

export interface ABTest {
  enabled: boolean;
  templateAId: string;
  templateBId: string;
  splitPercentage: number; // 50 = 50/50 split
  winnerTemplate?: string;
  results?: {
    templateA: ABTestResults;
    templateB: ABTestResults;
  };
}

export interface ABTestResults {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

export interface CampaignMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  roi: number;
}

export interface WebhookEvent {
  id: string;
  campaignId: string;
  type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'converted' | 'bounced' | 'unsubscribed';
  memberId: string;
  memberEmail: string;
  timestamp: string;
  metadata?: {
    templateId?: string;
    linkUrl?: string;
    paymentAmount?: number;
  };
}

export interface NotificationROI {
  period: {
    startDate: string;
    endDate: string;
  };
  channels: {
    email: ChannelROI;
    push: ChannelROI;
    whatsapp: ChannelROI;
    sms: ChannelROI;
  };
  totalCampaigns: number;
  totalSent: number;
  totalConverted: number;
  totalRevenue: number;
  totalCost: number;
  overallROI: number;
  bestPerformingChannel: string;
  bestPerformingTemplate: string;
}

export interface ChannelROI {
  campaigns: number;
  sent: number;
  converted: number;
  revenue: number;
  cost: number;
  roi: number;
  conversionRate: number;
  revenuePerSent: number;
  costPerConversion: number;
}

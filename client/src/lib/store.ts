import { Member, Meeting, TroncoRecord } from "./types";

// Helper para gerar IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Dados iniciais (seed)
const initialMembers: Member[] = [
  {
    id: '1',
    name: 'João da Silva',
    cim: '123456',
    degree: 'mestre',
    status: 'ativo',
    email: 'joao@exemplo.com',
    phone: '(11) 99999-9999',
    birthDate: '1980-05-15',
    initiationDate: '2010-03-20',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao'
  },
  {
    id: '2',
    name: 'Pedro Santos',
    cim: '654321',
    degree: 'companheiro',
    status: 'ativo',
    email: 'pedro@exemplo.com',
    phone: '(11) 88888-8888',
    birthDate: '1985-08-22',
    initiationDate: '2022-06-15',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro'
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    cim: '987654',
    degree: 'aprendiz',
    status: 'ativo',
    email: 'carlos@exemplo.com',
    phone: '(11) 77777-7777',
    birthDate: '1990-12-10',
    initiationDate: '2023-11-05',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos'
  }
];

const initialMeetings: Meeting[] = [
  {
    id: '1',
    date: '2024-05-15',
    type: 'Sessão Econômica',
    description: 'Sessão regular de instrução',
    attendanceCount: 25
  },
  {
    id: '2',
    date: '2024-05-22',
    type: 'Sessão Magna',
    description: 'Iniciação de novos membros',
    attendanceCount: 42
  }
];

const initialTronco: TroncoRecord[] = [
  {
    id: '1',
    date: '2024-05-15',
    meetingId: '1',
    amount: 350.50,
    notes: 'Arrecadação regular'
  },
  {
    id: '2',
    date: '2024-05-22',
    meetingId: '2',
    amount: 890.00,
    notes: 'Sessão Magna com visitantes'
  }
];

// Funções de Store
export const memberStore = {
  getAll: (): Member[] => {
    const stored = localStorage.getItem('members');
    if (!stored) {
      localStorage.setItem('members', JSON.stringify(initialMembers));
      return initialMembers;
    }
    return JSON.parse(stored);
  },
  add: (member: Omit<Member, 'id'>) => {
    const members = memberStore.getAll();
    const newMember = { ...member, id: generateId() };
    members.push(newMember);
    localStorage.setItem('members', JSON.stringify(members));
    return newMember;
  },
  update: (id: string, data: Partial<Member>) => {
    const members = memberStore.getAll();
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index] = { ...members[index], ...data };
      localStorage.setItem('members', JSON.stringify(members));
      return members[index];
    }
    return null;
  },
  delete: (id: string) => {
    const members = memberStore.getAll();
    const filtered = members.filter(m => m.id !== id);
    localStorage.setItem('members', JSON.stringify(filtered));
  }
};

export const meetingStore = {
  getAll: (): Meeting[] => {
    const stored = localStorage.getItem('meetings');
    if (!stored) {
      localStorage.setItem('meetings', JSON.stringify(initialMeetings));
      return initialMeetings;
    }
    return JSON.parse(stored);
  },
  add: (meeting: Omit<Meeting, 'id'>) => {
    const meetings = meetingStore.getAll();
    const newMeeting = { ...meeting, id: generateId() };
    meetings.push(newMeeting);
    localStorage.setItem('meetings', JSON.stringify(meetings));
    return newMeeting;
  }
};

export const troncoStore = {
  getAll: (): TroncoRecord[] => {
    const stored = localStorage.getItem('tronco');
    if (!stored) {
      localStorage.setItem('tronco', JSON.stringify(initialTronco));
      return initialTronco;
    }
    return JSON.parse(stored);
  },
  add: (record: Omit<TroncoRecord, 'id'>) => {
    const records = troncoStore.getAll();
    const newRecord = { ...record, id: generateId() };
    records.push(newRecord);
    localStorage.setItem('tronco', JSON.stringify(records));
    return newRecord;
  }
};

import { Attendance, Visitor } from "./types";

const initialVisitors: Visitor[] = [
  {
    id: '1',
    name: 'Roberto Almeida',
    lodge: 'Loja Fraternidade #42',
    rank: 'Mestre',
    meetingId: '2',
    date: '2024-05-22'
  }
];

export const attendanceStore = {
  getByMeeting: (meetingId: string): Attendance[] => {
    const stored = localStorage.getItem(`attendance_${meetingId}`);
    return stored ? JSON.parse(stored) : [];
  },
  save: (meetingId: string, attendances: Attendance[]) => {
    localStorage.setItem(`attendance_${meetingId}`, JSON.stringify(attendances));
  }
};

export const visitorStore = {
  getAll: (): Visitor[] => {
    const stored = localStorage.getItem('visitors');
    if (!stored) {
      localStorage.setItem('visitors', JSON.stringify(initialVisitors));
      return initialVisitors;
    }
    return JSON.parse(stored);
  },
  add: (visitor: Omit<Visitor, 'id'>) => {
    const visitors = visitorStore.getAll();
    const newVisitor = { ...visitor, id: generateId() };
    visitors.push(newVisitor);
    localStorage.setItem('visitors', JSON.stringify(visitors));
    return newVisitor;
  }
};

import { Transaction, MonthlyFee } from "./types";

const initialTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-05-01',
    type: 'despesa',
    category: 'aluguel',
    description: 'Aluguel do Templo - Maio',
    amount: 1500.00
  },
  {
    id: '2',
    date: '2024-05-05',
    type: 'receita',
    category: 'mensalidade',
    description: 'Mensalidade - João da Silva',
    amount: 150.00,
    memberId: '1'
  },
  {
    id: '3',
    date: '2024-05-15',
    type: 'receita',
    category: 'tronco',
    description: 'Tronco Sessão Econômica',
    amount: 350.50
  }
];

export const transactionStore = {
  getAll: (): Transaction[] => {
    const stored = localStorage.getItem('transactions');
    if (!stored) {
      localStorage.setItem('transactions', JSON.stringify(initialTransactions));
      return initialTransactions;
    }
    return JSON.parse(stored);
  },
  add: (transaction: Omit<Transaction, 'id'>) => {
    const transactions = transactionStore.getAll();
    const newTransaction = { ...transaction, id: generateId() };
    transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    return newTransaction;
  },
  getBalance: () => {
    const transactions = transactionStore.getAll();
    const receitas = transactions
      .filter(t => t.type === 'receita')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const despesas = transactions
      .filter(t => t.type === 'despesa')
      .reduce((acc, curr) => acc + curr.amount, 0);
    return receitas - despesas;
  }
};

export const feeStore = {
  getByMember: (memberId: string): MonthlyFee[] => {
    const stored = localStorage.getItem(`fees_${memberId}`);
    return stored ? JSON.parse(stored) : [];
  },
  save: (memberId: string, fees: MonthlyFee[]) => {
    localStorage.setItem(`fees_${memberId}`, JSON.stringify(fees));
  },
  generateForYear: (memberId: string, year: number, amount: number) => {
    const fees: MonthlyFee[] = [];
    for (let i = 1; i <= 12; i++) {
      fees.push({
        id: generateId(),
        memberId,
        month: i,
        year,
        amount,
        status: 'pendente'
      });
    }
    feeStore.save(memberId, fees);
    return fees;
  }
};

import { AppConfig, BillingEvent, Bill } from "./types";

const initialConfig: AppConfig = {
  integrations: {
    evolutionApi: {
      enabled: false,
      baseUrl: '',
      apiKey: '',
      instanceName: ''
    },
    gowa: {
      enabled: false,
      baseUrl: '',
      token: ''
    }
  },
  paymentMethods: {
    pix: {
      enabled: true,
      key: '12.345.678/0001-90',
      keyType: 'cnpj',
      merchantName: 'Loja Maçônica Exemplo',
      merchantCity: 'São Paulo'
    },
    boleto: {
      enabled: false,
      provider: 'asaas',
      clientId: '',
      clientSecret: ''
    },
    creditCard: {
      enabled: false,
      provider: 'stripe',
      publicKey: ''
    }
  }
};

export const configStore = {
  get: (): AppConfig => {
    const stored = localStorage.getItem('app_config');
    if (!stored) {
      localStorage.setItem('app_config', JSON.stringify(initialConfig));
      return initialConfig;
    }
    return JSON.parse(stored);
  },
  save: (config: AppConfig) => {
    localStorage.setItem('app_config', JSON.stringify(config));
  }
};

export const billingStore = {
  getEvents: (): BillingEvent[] => {
    const stored = localStorage.getItem('billing_events');
    return stored ? JSON.parse(stored) : [];
  },
  addEvent: (event: Omit<BillingEvent, 'id'>) => {
    const events = billingStore.getEvents();
    const newEvent = { ...event, id: generateId() };
    events.push(newEvent);
    localStorage.setItem('billing_events', JSON.stringify(events));
    return newEvent;
  },
  getBills: (): Bill[] => {
    const stored = localStorage.getItem('bills');
    return stored ? JSON.parse(stored) : [];
  },
  generateBills: (event: BillingEvent, members: Member[]) => {
    const bills = billingStore.getBills();
    const newBills: Bill[] = [];
    
    const targets = event.targetMembers === 'all' 
      ? members 
      : members.filter(m => m.status === 'ativo');

    targets.forEach(member => {
      newBills.push({
        id: generateId(),
        billingEventId: event.id,
        memberId: member.id,
        amount: event.amount,
        dueDate: event.dueDate,
        status: 'pending',
        sentViaWhatsapp: false
      });
    });

    const updatedBills = [...bills, ...newBills];
    localStorage.setItem('bills', JSON.stringify(updatedBills));
    return newBills;
  },
  updateBill: (id: string, data: Partial<Bill>) => {
    const bills = billingStore.getBills();
    const index = bills.findIndex(b => b.id === id);
    if (index !== -1) {
      bills[index] = { ...bills[index], ...data };
      localStorage.setItem('bills', JSON.stringify(bills));
      return bills[index];
    }
    return null;
  }
};

import { BankReconciliation, ReconciliationMatch } from "./types";

export const reconciliationStore = {
  getReconciliations: (): BankReconciliation[] => {
    const stored = localStorage.getItem('bank_reconciliations');
    return stored ? JSON.parse(stored) : [];
  },
  addReconciliation: (reconciliation: Omit<BankReconciliation, 'id'>) => {
    const reconciliations = reconciliationStore.getReconciliations();
    const newReconciliation = { ...reconciliation, id: generateId() };
    reconciliations.push(newReconciliation);
    localStorage.setItem('bank_reconciliations', JSON.stringify(reconciliations));
    return newReconciliation;
  },
  updateReconciliation: (id: string, data: Partial<BankReconciliation>) => {
    const reconciliations = reconciliationStore.getReconciliations();
    const index = reconciliations.findIndex(r => r.id === id);
    if (index !== -1) {
      reconciliations[index] = { ...reconciliations[index], ...data };
      localStorage.setItem('bank_reconciliations', JSON.stringify(reconciliations));
      return reconciliations[index];
    }
    return null;
  },
  getMatches: (): ReconciliationMatch[] => {
    const stored = localStorage.getItem('reconciliation_matches');
    return stored ? JSON.parse(stored) : [];
  },
  saveMatches: (matches: ReconciliationMatch[]) => {
    localStorage.setItem('reconciliation_matches', JSON.stringify(matches));
  }
};

import { EmailNotification, NotificationSettings } from "./types";

export const emailNotificationStore = {
  getNotifications: (): EmailNotification[] => {
    const stored = localStorage.getItem('email_notifications');
    return stored ? JSON.parse(stored) : [];
  },
  addNotification: (notification: Omit<EmailNotification, 'id'>) => {
    const notifications = emailNotificationStore.getNotifications();
    const newNotification = { ...notification, id: generateId() };
    notifications.push(newNotification);
    localStorage.setItem('email_notifications', JSON.stringify(notifications));
    return newNotification;
  },
  updateNotification: (id: string, data: Partial<EmailNotification>) => {
    const notifications = emailNotificationStore.getNotifications();
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications[index] = { ...notifications[index], ...data };
      localStorage.setItem('email_notifications', JSON.stringify(notifications));
      return notifications[index];
    }
    return null;
  },
  getNotificationsByBill: (billId: string): EmailNotification[] => {
    const notifications = emailNotificationStore.getNotifications();
    return notifications.filter(n => n.billId === billId);
  },
  getNotificationsByMember: (memberId: string): EmailNotification[] => {
    const notifications = emailNotificationStore.getNotifications();
    return notifications.filter(n => n.memberId === memberId);
  },
};

export const notificationSettingsStore = {
  getSettings: (): NotificationSettings => {
    const stored = localStorage.getItem('notification_settings');
    if (stored) {
      return JSON.parse(stored);
    }
    // Configurações padrão
    return {
      enabled: true,
      sendReminder3Days: true,
      sendReminder1Day: true,
      sendOverdue7Days: true,
      sendOverdue15Days: true,
      emailProvider: 'smtp',
      smtpConfig: {
        host: 'smtp.gmail.com',
        port: 587,
        user: '',
        password: '',
        fromEmail: 'noreply@loja-maconica.com.br',
        fromName: 'Loja Maçônica',
      },
    };
  },
  updateSettings: (settings: NotificationSettings) => {
    localStorage.setItem('notification_settings', JSON.stringify(settings));
    return settings;
  },
};

import { MemberNotificationPreferences, OneSignalConfig, OpenSignConfig, DocumentSignature } from "./types";

export const memberNotificationPreferencesStore = {
  getPreferences: (memberId: string): MemberNotificationPreferences => {
    const stored = localStorage.getItem(`member_preferences_${memberId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    // Preferências padrão
    return {
      memberId,
      emailNotifications: true,
      pushNotifications: true,
      whatsappNotifications: false,
      smsNotifications: false,
      notificationTypes: {
        reminder3Days: true,
        reminder1Day: true,
        overdue7Days: true,
        overdue15Days: true,
        eventNotifications: true,
        meetingReminders: true,
      },
      updatedAt: new Date().toISOString(),
    };
  },
  updatePreferences: (preferences: MemberNotificationPreferences) => {
    localStorage.setItem(
      `member_preferences_${preferences.memberId}`,
      JSON.stringify({ ...preferences, updatedAt: new Date().toISOString() })
    );
    return preferences;
  },
};

export const oneSignalConfigStore = {
  getConfig: (): OneSignalConfig => {
    const stored = localStorage.getItem('onesignal_config');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      enabled: false,
      appId: '',
      apiKey: '',
      restApiKey: '',
    };
  },
  updateConfig: (config: OneSignalConfig) => {
    localStorage.setItem('onesignal_config', JSON.stringify(config));
    return config;
  },
};

export const openSignConfigStore = {
  getConfig: (): OpenSignConfig => {
    const stored = localStorage.getItem('opensign_config');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      enabled: false,
      apiKey: '',
      apiUrl: 'https://api.opensign.com',
      signerEmail: '',
      signerName: '',
    };
  },
  updateConfig: (config: OpenSignConfig) => {
    localStorage.setItem('opensign_config', JSON.stringify(config));
    return config;
  },
};

export const documentSignatureStore = {
  getDocuments: (): DocumentSignature[] => {
    const stored = localStorage.getItem('document_signatures');
    return stored ? JSON.parse(stored) : [];
  },
  addDocument: (document: Omit<DocumentSignature, 'id'>) => {
    const documents = documentSignatureStore.getDocuments();
    const newDocument = { ...document, id: generateId() };
    documents.push(newDocument);
    localStorage.setItem('document_signatures', JSON.stringify(documents));
    return newDocument;
  },
  updateDocument: (id: string, data: Partial<DocumentSignature>) => {
    const documents = documentSignatureStore.getDocuments();
    const index = documents.findIndex(d => d.id === id);
    if (index !== -1) {
      documents[index] = { ...documents[index], ...data };
      localStorage.setItem('document_signatures', JSON.stringify(documents));
      return documents[index];
    }
    return null;
  },
  getDocumentsByMember: (signerEmail: string): DocumentSignature[] => {
    const documents = documentSignatureStore.getDocuments();
    return documents.filter(d => d.signerEmail === signerEmail);
  },
};

import { NotificationMetrics, NotificationTemplate, NotificationAnalytics } from "./types";

export const notificationMetricsStore = {
  getMetrics: (): NotificationMetrics[] => {
    const stored = localStorage.getItem('notification_metrics');
    return stored ? JSON.parse(stored) : [];
  },
  addMetric: (metric: Omit<NotificationMetrics, 'id'>) => {
    const metrics = notificationMetricsStore.getMetrics();
    const newMetric = { ...metric, id: generateId() };
    metrics.push(newMetric);
    localStorage.setItem('notification_metrics', JSON.stringify(metrics));
    return newMetric;
  },
  getAnalytics: (startDate: string, endDate: string): NotificationAnalytics => {
    const metrics = notificationMetricsStore.getMetrics();
    const filtered = metrics.filter(m => {
      const date = new Date(m.sentAt);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });

    const channels = {
      email: { sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0, deliveryRate: 0, openRate: 0, clickRate: 0 },
      push: { sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0, deliveryRate: 0, openRate: 0, clickRate: 0 },
      whatsapp: { sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0, deliveryRate: 0, openRate: 0, clickRate: 0 },
      sms: { sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0, deliveryRate: 0, openRate: 0, clickRate: 0 },
    };

    const byBillType = {
      mensalidade: { sent: 0, delivered: 0, opened: 0, clicked: 0, deliveryRate: 0, openRate: 0, clickRate: 0 },
      mutua: { sent: 0, delivered: 0, opened: 0, clicked: 0, deliveryRate: 0, openRate: 0, clickRate: 0 },
      taxa: { sent: 0, delivered: 0, opened: 0, clicked: 0, deliveryRate: 0, openRate: 0, clickRate: 0 },
      outro: { sent: 0, delivered: 0, opened: 0, clicked: 0, deliveryRate: 0, openRate: 0, clickRate: 0 },
    };

    filtered.forEach(metric => {
      const channel = channels[metric.channel];
      const billType = byBillType[metric.billType];

      channel.sent += metric.sent;
      channel.delivered += metric.delivered;
      channel.opened += metric.opened;
      channel.clicked += metric.clicked;
      channel.failed += metric.failed;

      billType.sent += metric.sent;
      billType.delivered += metric.delivered;
      billType.opened += metric.opened;
      billType.clicked += metric.clicked;
    });

    // Calcular taxas
    Object.values(channels).forEach(ch => {
      ch.deliveryRate = ch.sent > 0 ? (ch.delivered / ch.sent) * 100 : 0;
      ch.openRate = ch.delivered > 0 ? (ch.opened / ch.delivered) * 100 : 0;
      ch.clickRate = ch.opened > 0 ? (ch.clicked / ch.opened) * 100 : 0;
    });

    Object.values(byBillType).forEach(bt => {
      bt.deliveryRate = bt.sent > 0 ? (bt.delivered / bt.sent) * 100 : 0;
      bt.openRate = bt.delivered > 0 ? (bt.opened / bt.delivered) * 100 : 0;
      bt.clickRate = bt.opened > 0 ? (bt.clicked / bt.opened) * 100 : 0;
    });

    return {
      period: { startDate, endDate },
      channels,
      byBillType,
      totalNotificationsSent: filtered.reduce((sum, m) => sum + m.sent, 0),
      totalDelivered: filtered.reduce((sum, m) => sum + m.delivered, 0),
      totalOpened: filtered.reduce((sum, m) => sum + m.opened, 0),
      totalClicked: filtered.reduce((sum, m) => sum + m.clicked, 0),
    };
  },
};

export const notificationTemplateStore = {
  getTemplates: (): NotificationTemplate[] => {
    const stored = localStorage.getItem('notification_templates');
    if (stored) {
      return JSON.parse(stored);
    }
    // Templates padrão
    return [
      {
        id: generateId(),
        name: 'Mensalidade - Email',
        type: 'email',
        billType: 'mensalidade',
        channel: 'email',
        subject: 'Aviso de Vencimento - Mensalidade',
        content: `Prezado(a) {nome},\n\nInformamos que sua mensalidade no valor de R$ {valor} vence em {vencimento}.\n\nPara efetuar o pagamento, utilize a chave PIX ou o boleto em anexo.\n\nAtenciosamente,\nLoja Maçônica`,
        primaryColor: '#1e3a8a',
        secondaryColor: '#d4af37',
        accentColor: '#ffffff',
        variables: ['{nome}', '{valor}', '{vencimento}'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: true,
      },
      {
        id: generateId(),
        name: 'Mútua - Email',
        type: 'email',
        billType: 'mutua',
        channel: 'email',
        subject: 'Aviso de Vencimento - Mútua',
        content: `Prezado(a) {nome},\n\nInformamos que sua mútua no valor de R$ {valor} vence em {vencimento}.\n\nPara efetuar o pagamento, utilize a chave PIX ou o boleto em anexo.\n\nAtenciosamente,\nLoja Maçônica`,
        primaryColor: '#1e3a8a',
        secondaryColor: '#d4af37',
        accentColor: '#ffffff',
        variables: ['{nome}', '{valor}', '{vencimento}'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: true,
      },
    ];
  },
  addTemplate: (template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const templates = notificationTemplateStore.getTemplates();
    const newTemplate = {
      ...template,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    templates.push(newTemplate);
    localStorage.setItem('notification_templates', JSON.stringify(templates));
    return newTemplate;
  },
  updateTemplate: (id: string, data: Partial<NotificationTemplate>) => {
    const templates = notificationTemplateStore.getTemplates();
    const index = templates.findIndex(t => t.id === id);
    if (index !== -1) {
      templates[index] = {
        ...templates[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('notification_templates', JSON.stringify(templates));
      return templates[index];
    }
    return null;
  },
  deleteTemplate: (id: string) => {
    const templates = notificationTemplateStore.getTemplates();
    const filtered = templates.filter(t => t.id !== id);
    localStorage.setItem('notification_templates', JSON.stringify(filtered));
  },
  getTemplatesByBillType: (billType: string): NotificationTemplate[] => {
    const templates = notificationTemplateStore.getTemplates();
    return templates.filter(t => t.billType === billType);
  },
  getTemplatesByType: (type: string): NotificationTemplate[] => {
    const templates = notificationTemplateStore.getTemplates();
    return templates.filter(t => t.type === type);
  },
  getTemplatesByTypeAndBillType: (type: string, billType: string): NotificationTemplate[] => {
    const templates = notificationTemplateStore.getTemplates();
    return templates.filter(t => t.type === type && t.billType === billType);
  },
};

import { NotificationCampaign, WebhookEvent, NotificationROI, ChannelROI } from "./types";

export const campaignStore = {
  getCampaigns: (): NotificationCampaign[] => {
    const stored = localStorage.getItem('notification_campaigns');
    return stored ? JSON.parse(stored) : [];
  },
  addCampaign: (campaign: Omit<NotificationCampaign, 'id' | 'createdAt'>) => {
    const campaigns = campaignStore.getCampaigns();
    const newCampaign = {
      ...campaign,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    campaigns.push(newCampaign);
    localStorage.setItem('notification_campaigns', JSON.stringify(campaigns));
    return newCampaign;
  },
  updateCampaign: (id: string, data: Partial<NotificationCampaign>) => {
    const campaigns = campaignStore.getCampaigns();
    const index = campaigns.findIndex(c => c.id === id);
    if (index !== -1) {
      campaigns[index] = { ...campaigns[index], ...data };
      localStorage.setItem('notification_campaigns', JSON.stringify(campaigns));
      return campaigns[index];
    }
    return null;
  },
  deleteCampaign: (id: string) => {
    const campaigns = campaignStore.getCampaigns();
    const filtered = campaigns.filter(c => c.id !== id);
    localStorage.setItem('notification_campaigns', JSON.stringify(filtered));
  },
  getCampaignById: (id: string) => {
    const campaigns = campaignStore.getCampaigns();
    return campaigns.find(c => c.id === id);
  },
};

export const webhookEventStore = {
  getEvents: (): WebhookEvent[] => {
    const stored = localStorage.getItem('webhook_events');
    return stored ? JSON.parse(stored) : [];
  },
  addEvent: (event: Omit<WebhookEvent, 'id'>) => {
    const events = webhookEventStore.getEvents();
    const newEvent = {
      ...event,
      id: generateId(),
    };
    events.push(newEvent);
    localStorage.setItem('webhook_events', JSON.stringify(events));
    return newEvent;
  },
  getEventsByCampaign: (campaignId: string): WebhookEvent[] => {
    const events = webhookEventStore.getEvents();
    return events.filter(e => e.campaignId === campaignId);
  },
  getEventsByType: (type: string): WebhookEvent[] => {
    const events = webhookEventStore.getEvents();
    return events.filter(e => e.type === type);
  },
};

export const roiStore = {
  calculateROI: (startDate: string, endDate: string): NotificationROI => {
    const campaigns = campaignStore.getCampaigns();
    const events = webhookEventStore.getEvents();

    const filtered = campaigns.filter(c => {
      const date = new Date(c.createdAt);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });

    const channels = {
      email: { campaigns: 0, sent: 0, converted: 0, revenue: 0, cost: 0, roi: 0, conversionRate: 0, revenuePerSent: 0, costPerConversion: 0 },
      push: { campaigns: 0, sent: 0, converted: 0, revenue: 0, cost: 0, roi: 0, conversionRate: 0, revenuePerSent: 0, costPerConversion: 0 },
      whatsapp: { campaigns: 0, sent: 0, converted: 0, revenue: 0, cost: 0, roi: 0, conversionRate: 0, revenuePerSent: 0, costPerConversion: 0 },
      sms: { campaigns: 0, sent: 0, converted: 0, revenue: 0, cost: 0, roi: 0, conversionRate: 0, revenuePerSent: 0, costPerConversion: 0 },
    };

    let totalSent = 0;
    let totalConverted = 0;
    let totalRevenue = 0;
    let totalCost = 0;

    filtered.forEach(campaign => {
      const channel = channels[campaign.channel];
      const campaignEvents = events.filter(e => e.campaignId === campaign.id);
      
      channel.campaigns += 1;
      channel.sent += campaign.recipientCount;
      totalSent += campaign.recipientCount;

      const conversions = campaignEvents.filter(e => e.type === 'converted');
      const revenue = conversions.reduce((sum, e) => sum + (e.metadata?.paymentAmount || 0), 0);

      channel.converted += conversions.length;
      channel.revenue += revenue;
      totalConverted += conversions.length;
      totalRevenue += revenue;

      // Custo estimado: R$ 0.10 por email, R$ 0.05 por push, R$ 0.15 por SMS, R$ 0.20 por WhatsApp
      const costPerMessage = {
        email: 0.10,
        push: 0.05,
        whatsapp: 0.20,
        sms: 0.15,
      };

      const cost = campaign.recipientCount * costPerMessage[campaign.channel];
      channel.cost += cost;
      totalCost += cost;
    });

    // Calcular métricas
    Object.values(channels).forEach(ch => {
      ch.conversionRate = ch.sent > 0 ? (ch.converted / ch.sent) * 100 : 0;
      ch.revenuePerSent = ch.sent > 0 ? ch.revenue / ch.sent : 0;
      ch.costPerConversion = ch.converted > 0 ? ch.cost / ch.converted : 0;
      ch.roi = ch.cost > 0 ? ((ch.revenue - ch.cost) / ch.cost) * 100 : 0;
    });

    const bestChannel = Object.entries(channels).reduce((best, [key, val]) => 
      val.roi > best[1].roi ? [key, val] : best
    );

    return {
      period: { startDate, endDate },
      channels,
      totalCampaigns: filtered.length,
      totalSent,
      totalConverted,
      totalRevenue,
      totalCost,
      overallROI: totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0,
      bestPerformingChannel: bestChannel[0],
      bestPerformingTemplate: '',
    };
  },
};


import { Lodge, SaaSPlan, LodgeSubscription, LodgeInvoice, FinancialContact, SuperAdminUser, LodgeUser } from "./types";

// ===== LODGE STORE =====
export const lodgeStore = {
  getAll: (): Lodge[] => {
    const stored = localStorage.getItem('lodges');
    if (!stored) {
      // Criar lojas de exemplo
      const defaultLodges = [
        {
          id: '1',
          name: 'Loja Maçônica Central',
          email: 'contato@loja-central.com',
          phone: '(11) 3000-0000',
          address: 'Rua das Flores, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01000-000',
          foundedYear: 1990,
          status: 'active' as const,
          planId: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          adminEmail: 'admin@loja-central.com',
          adminName: 'João Silva',
          maxMembers: 100,
          features: ['secretaria', 'chancelaria', 'tesouraria', 'notificacoes', 'analytics'],
        },
      ];
      localStorage.setItem('lodges', JSON.stringify(defaultLodges));
      return defaultLodges;
    }
    return JSON.parse(stored);
  },
  add: (lodge: Omit<Lodge, 'id' | 'createdAt' | 'updatedAt'>) => {
    const lodges = lodgeStore.getAll();
    const newLodge = {
      ...lodge,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    lodges.push(newLodge);
    localStorage.setItem('lodges', JSON.stringify(lodges));
    return newLodge;
  },
  update: (id: string, data: Partial<Lodge>) => {
    const lodges = lodgeStore.getAll();
    const index = lodges.findIndex(l => l.id === id);
    if (index !== -1) {
      lodges[index] = { ...lodges[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem('lodges', JSON.stringify(lodges));
      return lodges[index];
    }
    return null;
  },
  delete: (id: string) => {
    const lodges = lodgeStore.getAll();
    const filtered = lodges.filter(l => l.id !== id);
    localStorage.setItem('lodges', JSON.stringify(filtered));
  },
  getById: (id: string) => {
    const lodges = lodgeStore.getAll();
    return lodges.find(l => l.id === id);
  },
};

// ===== SAAS PLAN STORE =====
export const saaSPlanStore = {
  getAll: (): SaaSPlan[] => {
    const stored = localStorage.getItem('saas_plans');
    if (!stored) {
      const defaultPlans = [
        {
          id: '1',
          name: 'Plano Básico',
          description: 'Perfeito para lojas pequenas',
          monthlyPrice: 99,
          annualPrice: 990,
          maxMembers: 50,
          maxLojas: 1,
          features: ['secretaria', 'chancelaria', 'tesouraria'],
          status: 'active' as const,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Plano Profissional',
          description: 'Para lojas em crescimento',
          monthlyPrice: 199,
          annualPrice: 1990,
          maxMembers: 200,
          maxLojas: 3,
          features: ['secretaria', 'chancelaria', 'tesouraria', 'notificacoes', 'analytics', 'templates'],
          status: 'active' as const,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Plano Enterprise',
          description: 'Solução completa para grandes lojas',
          monthlyPrice: 499,
          annualPrice: 4990,
          maxMembers: 1000,
          maxLojas: 10,
          features: ['secretaria', 'chancelaria', 'tesouraria', 'notificacoes', 'analytics', 'templates', 'campanhas', 'roi', 'webhooks'],
          status: 'active' as const,
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('saas_plans', JSON.stringify(defaultPlans));
      return defaultPlans;
    }
    return JSON.parse(stored);
  },
  getById: (id: string) => {
    const plans = saaSPlanStore.getAll();
    return plans.find(p => p.id === id);
  },
};

// ===== LODGE SUBSCRIPTION STORE =====
export const lodgeSubscriptionStore = {
  getAll: (): LodgeSubscription[] => {
    const stored = localStorage.getItem('lodge_subscriptions');
    return stored ? JSON.parse(stored) : [];
  },
  add: (subscription: Omit<LodgeSubscription, 'id' | 'createdAt' | 'updatedAt'>) => {
    const subscriptions = lodgeSubscriptionStore.getAll();
    const newSubscription = {
      ...subscription,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    subscriptions.push(newSubscription);
    localStorage.setItem('lodge_subscriptions', JSON.stringify(subscriptions));
    return newSubscription;
  },
  getByLodge: (lodgeId: string) => {
    const subscriptions = lodgeSubscriptionStore.getAll();
    return subscriptions.find(s => s.lodgeId === lodgeId);
  },
  update: (id: string, data: Partial<LodgeSubscription>) => {
    const subscriptions = lodgeSubscriptionStore.getAll();
    const index = subscriptions.findIndex(s => s.id === id);
    if (index !== -1) {
      subscriptions[index] = { ...subscriptions[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem('lodge_subscriptions', JSON.stringify(subscriptions));
      return subscriptions[index];
    }
    return null;
  },
};

// ===== LODGE INVOICE STORE =====
export const lodgeInvoiceStore = {
  getAll: (): LodgeInvoice[] => {
    const stored = localStorage.getItem('lodge_invoices');
    return stored ? JSON.parse(stored) : [];
  },
  add: (invoice: Omit<LodgeInvoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    const invoices = lodgeInvoiceStore.getAll();
    const newInvoice = {
      ...invoice,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    invoices.push(newInvoice);
    localStorage.setItem('lodge_invoices', JSON.stringify(invoices));
    return newInvoice;
  },
  getByLodge: (lodgeId: string) => {
    const invoices = lodgeInvoiceStore.getAll();
    return invoices.filter(i => i.lodgeId === lodgeId);
  },
};

// ===== FINANCIAL CONTACT STORE =====
export const financialContactStore = {
  getAll: (): FinancialContact[] => {
    const stored = localStorage.getItem('financial_contacts');
    return stored ? JSON.parse(stored) : [];
  },
  add: (contact: Omit<FinancialContact, 'id' | 'createdAt' | 'updatedAt'>) => {
    const contacts = financialContactStore.getAll();
    const newContact = {
      ...contact,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    contacts.push(newContact);
    localStorage.setItem('financial_contacts', JSON.stringify(contacts));
    return newContact;
  },
  getByLodge: (lodgeId: string) => {
    const contacts = financialContactStore.getAll();
    return contacts.filter(c => c.lodgeId === lodgeId);
  },
  update: (id: string, data: Partial<FinancialContact>) => {
    const contacts = financialContactStore.getAll();
    const index = contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem('financial_contacts', JSON.stringify(contacts));
      return contacts[index];
    }
    return null;
  },
  delete: (id: string) => {
    const contacts = financialContactStore.getAll();
    const filtered = contacts.filter(c => c.id !== id);
    localStorage.setItem('financial_contacts', JSON.stringify(filtered));
  },
};

// ===== SUPER ADMIN USER STORE =====
export const superAdminUserStore = {
  getAll: (): SuperAdminUser[] => {
    const stored = localStorage.getItem('super_admin_users');
    if (!stored) {
      const defaultUsers = [
        {
          id: '1',
          email: 'admin@sistema.com',
          name: 'Administrador Sistema',
          role: 'super_admin' as const,
          status: 'active' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('super_admin_users', JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(stored);
  },
  add: (user: Omit<SuperAdminUser, 'id' | 'createdAt' | 'updatedAt'>) => {
    const users = superAdminUserStore.getAll();
    const newUser = {
      ...user,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('super_admin_users', JSON.stringify(users));
    return newUser;
  },
  update: (id: string, data: Partial<SuperAdminUser>) => {
    const users = superAdminUserStore.getAll();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem('super_admin_users', JSON.stringify(users));
      return users[index];
    }
    return null;
  },
};


// ===== REAL-TIME NOTIFICATIONS STORE =====
export interface RealtimeNotification {
  id: string;
  type: 'comunicado' | 'reuniao' | 'sistema';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon?: string;
  actionUrl?: string;
}

export const realtimeNotificationStore = {
  getAll: (): RealtimeNotification[] => {
    const stored = localStorage.getItem('realtime_notifications');
    if (!stored) {
      return [];
    }
    return JSON.parse(stored);
  },
  add: (notification: Omit<RealtimeNotification, 'id' | 'timestamp' | 'read'>) => {
    const notifications = realtimeNotificationStore.getAll();
    const newNotification: RealtimeNotification = {
      ...notification,
      id: generateId(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    notifications.unshift(newNotification);
    // Manter apenas as últimas 100 notificações
    if (notifications.length > 100) {
      notifications.pop();
    }
    localStorage.setItem('realtime_notifications', JSON.stringify(notifications));
    return newNotification;
  },
  markAsRead: (id: string) => {
    const notifications = realtimeNotificationStore.getAll();
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications[index].read = true;
      localStorage.setItem('realtime_notifications', JSON.stringify(notifications));
      return notifications[index];
    }
    return null;
  },
  markAllAsRead: () => {
    const notifications = realtimeNotificationStore.getAll();
    notifications.forEach(n => n.read = true);
    localStorage.setItem('realtime_notifications', JSON.stringify(notifications));
  },
  delete: (id: string) => {
    const notifications = realtimeNotificationStore.getAll();
    const filtered = notifications.filter(n => n.id !== id);
    localStorage.setItem('realtime_notifications', JSON.stringify(filtered));
  },
  deleteAll: () => {
    localStorage.setItem('realtime_notifications', JSON.stringify([]));
  },
  getUnreadCount: (): number => {
    const notifications = realtimeNotificationStore.getAll();
    return notifications.filter(n => !n.read).length;
  },
};

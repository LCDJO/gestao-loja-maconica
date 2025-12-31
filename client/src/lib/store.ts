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

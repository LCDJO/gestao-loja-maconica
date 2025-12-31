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

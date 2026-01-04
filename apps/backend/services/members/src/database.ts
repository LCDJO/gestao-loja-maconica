// Simulação de banco de dados em memória
// Em produção, isso seria substituído por consultas reais ao banco de dados

import crypto from 'crypto';
import { MemberProfile } from './types';

// Base de dados simulada
const membersDatabase: Map<string, MemberProfile & { password: string }> = new Map();

// Seed de dados para desenvolvimento
function seedDatabase() {
  const testMember: MemberProfile & { password: string } = {
    id: crypto.randomUUID(),
    name: 'João Pereira da Silva',
    email: 'joao@masonica.org',
    phone: '(21) 98765-4321',
    birthDate: '1985-06-15',
    cpf: '123.456.789-00',
    address: 'Rua das Flores, 123',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zipCode: '20000-000',
    cim: 'CIM-2020-001',
    degree: 'mestre',
    status: 'ativo',
    initiationDate: '2020-01-15',
    password: 'senha123456',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  membersDatabase.set(testMember.id, testMember);
  membersDatabase.set(testMember.email, testMember);
}

seedDatabase();

export function findMemberByEmail(email: string): MemberProfile & { password: string } | undefined {
  return membersDatabase.get(email);
}

export function findMemberById(id: string): MemberProfile & { password: string } | undefined {
  return membersDatabase.get(id);
}

export function createMember(
  data: Omit<MemberProfile & { password: string }, 'id' | 'createdAt' | 'updatedAt'>
): MemberProfile {
  const id = crypto.randomUUID();
  const member: MemberProfile & { password: string } = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  membersDatabase.set(id, member);
  membersDatabase.set(data.email, member);

  const { password, ...profileData } = member;
  return profileData;
}

export function updateMember(
  id: string,
  updates: Partial<MemberProfile>
): MemberProfile | undefined {
  const member = membersDatabase.get(id);
  if (!member) return undefined;

  const updated = {
    ...member,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  membersDatabase.set(id, updated);
  membersDatabase.set(updated.email, updated);

  const { password, ...profileData } = updated;
  return profileData;
}

export function updateMemberPassword(
  id: string,
  newPassword: string
): boolean {
  const member = membersDatabase.get(id);
  if (!member) return false;

  member.password = newPassword;
  member.updatedAt = new Date().toISOString();
  membersDatabase.set(id, member);

  return true;
}

export function getProfileWithoutPassword(
  member: MemberProfile & { password: string }
): MemberProfile {
  const { password, ...profile } = member;
  return profile;
}

export { membersDatabase };

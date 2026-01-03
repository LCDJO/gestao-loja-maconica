/**
 * Tipos TypeScript para a API
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  lodgeId?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  lodgeId: string;
  lodgeName: string;
  role: 'admin' | 'secretary' | 'treasurer' | 'member';
  member: Member;
}

export interface Member {
  id: string;
  cim: string;
  degree: 'aprendiz' | 'companheiro' | 'mestre';
  status: 'ativo' | 'inativo' | 'irregular';
  birth_date?: string;
  initiation_date: string;
  photo_url?: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  birth_date?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface BalanceResponse {
  balance: number;
  currency: string;
  lastUpdate: string;
  pendingAmount: number;
  status: 'ok' | 'warning' | 'error';
}

export interface Transaction {
  id: string;
  date: string;
  type: 'receita' | 'despesa';
  category: string;
  description: string;
  amount: number;
  status: 'pago' | 'pendente' | 'vencido' | 'cancelado';
  dueDate?: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: PaginatedResponse<Transaction>['pagination'];
}

export interface Invoice {
  id: string;
  month: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'paid';
  barcode?: string;
  pdfUrl?: string;
}

export interface InvoicesResponse {
  invoices: Invoice[];
}

export interface ListMember {
  id: string;
  cim: string;
  name: string;
  email: string;
  degree: 'aprendiz' | 'companheiro' | 'mestre';
  status: 'ativo' | 'inativo' | 'irregular';
  phone?: string;
  photo_url?: string;
}

export interface MembersResponse {
  members: ListMember[];
  pagination: PaginatedResponse<ListMember>['pagination'];
}

export interface MemberDetailsResponse {
  id: string;
  cim: string;
  name: string;
  email: string;
  degree: string;
  status: string;
  initiation_date: string;
  phone?: string;
  photo_url?: string;
  bio?: string;
  address?: string;
  city?: string;
}

export interface Document {
  id: string;
  type: string;
  name: string;
  description?: string;
  url: string;
  size: number;
  uploadedAt: string;
  expiresAt?: string;
}

export interface DocumentsResponse {
  documents: Document[];
}

export interface DocumentUploadResponse {
  documentId: string;
  url: string;
  uploadedAt: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  type: string;
  title: string;
  status: 'presente' | 'ausente' | 'justificado';
  justified: boolean;
  notes?: string;
}

export interface AttendanceResponse {
  attendance: AttendanceRecord[];
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  type: string;
  date: string;
  location?: string;
  isRequired: boolean;
}

export interface EventsResponse {
  events: Event[];
}

export interface HealthStatus {
  id?: string;
  memberId?: string;
  status: 'well' | 'sick' | 'hospitalized' | 'recovering';
  lastUpdate: string;
  notes?: string;
  relatedMembers?: Array<{
    memberId: string;
    name: string;
    relationship: string;
    healthStatus: string;
  }>;
}

export interface HealthStatusUpdateRequest {
  status: 'well' | 'sick' | 'hospitalized' | 'recovering';
  notes?: string;
  visibility: 'private' | 'members' | 'public';
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, any>;
}

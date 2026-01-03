import { useQuery, useQueryClient } from '@tanstack/react-query';
import { membersApi } from '@services/api';

/**
 * Hook para buscar perfil do membro
 */
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => membersApi.getProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  });
}

/**
 * Hook para buscar saldo financeiro
 */
export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: () => membersApi.getBalance(),
    staleTime: 1000 * 60, // 1 minuto
    refetchInterval: 1000 * 60 * 5, // Refetch a cada 5 minutos
  });
}

/**
 * Hook para buscar transações com paginação
 */
export function useTransactions(page = 1, limit = 20, filters?: any) {
  return useQuery({
    queryKey: ['transactions', page, limit, filters],
    queryFn: () => membersApi.getTransactions(page, limit, filters),
    staleTime: 1000 * 60, // 1 minuto
  });
}

/**
 * Hook para buscar boletos/faturas pendentes
 */
export function useInvoices(status = 'pending') {
  return useQuery({
    queryKey: ['invoices', status],
    queryFn: () => membersApi.getInvoices(status),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

/**
 * Hook para buscar lista de membros
 */
export function useMembers(page = 1, limit = 50, search?: string) {
  return useQuery({
    queryKey: ['members', page, limit, search],
    queryFn: () => membersApi.getMembers(page, limit, search),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para buscar detalhes de um membro
 */
export function useMemberDetails(memberId: string) {
  return useQuery({
    queryKey: ['member', memberId],
    queryFn: () => membersApi.getMemberDetails(memberId),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

/**
 * Hook para buscar documentos do membro
 */
export function useDocuments(type?: string) {
  return useQuery({
    queryKey: ['documents', type],
    queryFn: () => membersApi.getDocuments(type),
    staleTime: 1000 * 60 * 30, // 30 minutos
  });
}

/**
 * Hook para buscar histórico de presença
 */
export function useAttendance(month?: string) {
  return useQuery({
    queryKey: ['attendance', month],
    queryFn: () => membersApi.getAttendance(month),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

/**
 * Hook para buscar próximos eventos
 */
export function useUpcomingEvents(limit = 10) {
  return useQuery({
    queryKey: ['events', limit],
    queryFn: () => membersApi.getUpcomingEvents(limit),
    staleTime: 1000 * 60 * 30, // 30 minutos
    refetchInterval: 1000 * 60 * 60, // Refetch a cada 1 hora
  });
}

/**
 * Hook para buscar status de saúde
 */
export function useHealthStatus() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => membersApi.getHealthStatus(),
    staleTime: 1000 * 60 * 30, // 30 minutos
  });
}

/**
 * Hook para invalidar múltiplas queries após atualização
 */
export function useInvalidateData() {
  const queryClient = useQueryClient();

  return {
    invalidateProfile: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
    invalidateBalance: () => queryClient.invalidateQueries({ queryKey: ['balance'] }),
    invalidateTransactions: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }),
    invalidateAll: () => queryClient.invalidateQueries(),
  };
}

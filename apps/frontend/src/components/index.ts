/**
 * Re-exportações Centrais de Componentes
 * 
 * Este arquivo permite importar componentes de múltiplas formas:
 * 
 * @example
 * // Importação de domínio específico
 * import { ListaAniversariantes } from '@/components/domains/aniversariantes';
 * 
 * // Importação direta (se re-exportado aqui)
 * import { ListaAniversariantes } from '@/components';
 */

// Layout components
export { default as DashboardLayout } from './layout/DashboardLayout';
export { default as MemberPortalLayout } from './layout/MemberPortalLayout';

// Error Boundary
export { default as ErrorBoundary } from './ErrorBoundary';

// Protected Route
export { default as ProtectedRoute } from './ProtectedRoute';

// Notification Center
export { default as NotificationCenter } from './NotificationCenter';

// Domain exports
export * from './domains';

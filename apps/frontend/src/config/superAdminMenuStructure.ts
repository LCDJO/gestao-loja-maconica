/**
 * Estrutura de Menu SuperAdmin
 * Menu hierárquico profissional para SaaS corporativo
 */

import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Building2,
  CreditCard,
  Shield,
  Zap,
  Bell,
  Plug,
  MessageSquare,
  BarChart3,
  Settings,
  HardDrive,
  Rocket,
  BookOpen,
  AlertTriangle,
  Lock,
  ClipboardList,
  MoreHorizontal,
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: any;
  badge?: {
    texto: string;
    cor: 'red' | 'yellow' | 'green' | 'blue';
  };
  submenu?: MenuItem[];
  divider?: boolean;
  requiredPermission?: string;
}

export interface MenuSecção {
  título: string;
  itens: MenuItem[];
}

export const SUPER_ADMIN_MENU: MenuSecção[] = [
  // ========================================================================
  // 1. DASHBOARD GERAL - VISÃO EXECUTIVA
  // ========================================================================
  {
    título: '📊 EXECUTIVO',
    itens: [
      {
        id: 'dashboard',
        label: 'Dashboard Geral',
        path: '/super-admin/dashboard',
        icon: LayoutDashboard,
        badge: {
          texto: 'ATUAL',
          cor: 'blue',
        },
      },
      {
        id: 'resumo-kpis',
        label: 'KPIs & Métricas',
        path: '/super-admin/kpis',
        icon: TrendingUp,
      },
    ],
  },

  // ========================================================================
  // 2. TELEMETRIA & OBSERVABILIDADE
  // ========================================================================
  {
    título: '🔍 TELEMETRIA',
    itens: [
      {
        id: 'telemetria',
        label: 'Telemetria',
        path: '/super-admin/telemetria',
        icon: Zap,
        submenu: [
          {
            id: 'telemetria-aplicacao',
            label: 'Aplicação',
            path: '/super-admin/telemetria/aplicacao',
            icon: null,
          },
          {
            id: 'telemetria-microservices',
            label: 'Microserviços',
            path: '/super-admin/telemetria/microservices',
            icon: null,
          },
          {
            id: 'telemetria-infraestrutura',
            label: 'Infraestrutura',
            path: '/super-admin/telemetria/infraestrutura',
            icon: null,
          },
          {
            id: 'telemetria-database',
            label: 'Banco de Dados',
            path: '/super-admin/telemetria/database',
            icon: null,
          },
          {
            id: 'telemetria-filas',
            label: 'Filas & Jobs',
            path: '/super-admin/telemetria/filas',
            icon: null,
          },
        ],
      },
      {
        id: 'logs',
        label: 'Logs Centralizados',
        path: '/super-admin/logs',
        icon: BookOpen,
      },
    ],
  },

  // ========================================================================
  // 3. GESTÃO DE TENANTS (LOJAS MAÇÔNICAS)
  // ========================================================================
  {
    título: '🏛️ GESTÃO DE LOJAS',
    itens: [
      {
        id: 'tenants',
        label: 'Lojas',
        path: '/super-admin/tenants',
        icon: Building2,
        submenu: [
          {
            id: 'tenants-lista',
            label: 'Lista de Lojas',
            path: '/super-admin/tenants/lista',
            icon: null,
          },
          {
            id: 'tenants-novo',
            label: 'Onboard Nova Loja',
            path: '/super-admin/tenants/novo',
            icon: null,
          },
          {
            id: 'tenants-status',
            label: 'Status & Limites',
            path: '/super-admin/tenants/status',
            icon: null,
          },
          {
            id: 'tenants-impersonation',
            label: 'Acesso de Admin',
            path: '/super-admin/tenants/impersonation',
            icon: null,
          },
          {
            id: 'tenants-auditoria',
            label: 'Auditoria Tenant',
            path: '/super-admin/tenants/auditoria',
            icon: null,
          },
        ],
      },
    ],
  },

  // ========================================================================
  // 4. GESTÃO DE USUÁRIOS GLOBAIS
  // ========================================================================
  {
    título: '👥 USUÁRIOS & ACESSO',
    itens: [
      {
        id: 'usuarios',
        label: 'Usuários Globais',
        path: '/super-admin/usuarios',
        icon: Users,
        submenu: [
          {
            id: 'usuarios-superadmins',
            label: 'SuperAdmins',
            path: '/super-admin/usuarios/superadmins',
            icon: null,
          },
          {
            id: 'usuarios-admins',
            label: 'Admins Internos',
            path: '/super-admin/usuarios/admins',
            icon: null,
          },
          {
            id: 'usuarios-bloqueados',
            label: 'Usuários Bloqueados',
            path: '/super-admin/usuarios/bloqueados',
            icon: null,
          },
          {
            id: 'usuarios-sessoes',
            label: 'Sessões Ativas',
            path: '/super-admin/usuarios/sessoes',
            icon: null,
          },
          {
            id: 'usuarios-mfa',
            label: 'MFA / 2FA',
            path: '/super-admin/usuarios/mfa',
            icon: null,
          },
        ],
      },
    ],
  },

  // ========================================================================
  // 5. PLANOS, ASSINATURAS & BILLING
  // ========================================================================
  {
    título: '💳 FINANCEIRO',
    itens: [
      {
        id: 'billing',
        label: 'Billing & Assinaturas',
        path: '/super-admin/billing',
        icon: CreditCard,
        submenu: [
          {
            id: 'billing-planos',
            label: 'Planos SaaS',
            path: '/super-admin/billing/planos',
            icon: null,
          },
          {
            id: 'billing-assinaturas',
            label: 'Assinaturas Ativas',
            path: '/super-admin/billing/assinaturas',
            icon: null,
          },
          {
            id: 'billing-faturas',
            label: 'Faturas & Pagamentos',
            path: '/super-admin/billing/faturas',
            icon: null,
          },
          {
            id: 'billing-inadimplencia',
            label: 'Inadimplência',
            path: '/super-admin/billing/inadimplencia',
            icon: null,
            badge: {
              texto: 'ALERTA',
              cor: 'red',
            },
          },
          {
            id: 'billing-cupons',
            label: 'Cupons & Descontos',
            path: '/super-admin/billing/cupons',
            icon: null,
          },
          {
            id: 'billing-metricas',
            label: 'Métricas (MRR/ARR/LTV)',
            path: '/super-admin/billing/metricas',
            icon: null,
          },
        ],
      },
    ],
  },

  // ========================================================================
  // 6. MÓDULOS DO SISTEMA
  // ========================================================================
  {
    título: '🧩 MÓDULOS',
    itens: [
      {
        id: 'modulos',
        label: 'Configuração de Módulos',
        path: '/super-admin/modulos',
        icon: MoreHorizontal,
        submenu: [
          {
            id: 'modulos-secretaria',
            label: 'Secretaria',
            path: '/super-admin/modulos/secretaria',
            icon: null,
          },
          {
            id: 'modulos-chancelaria',
            label: 'Chancelaria',
            path: '/super-admin/modulos/chancelaria',
            icon: null,
          },
          {
            id: 'modulos-tesouraria',
            label: 'Tesouraria',
            path: '/super-admin/modulos/tesouraria',
            icon: null,
          },
          {
            id: 'modulos-hospitalaria',
            label: 'Hospitalaria',
            path: '/super-admin/modulos/hospitalaria',
            icon: null,
          },
          {
            id: 'modulos-feature-flags',
            label: 'Feature Flags',
            path: '/super-admin/modulos/feature-flags',
            icon: null,
          },
          {
            id: 'modulos-versionamento',
            label: 'Versionamento',
            path: '/super-admin/modulos/versionamento',
            icon: null,
          },
        ],
      },
    ],
  },

  // ========================================================================
  // 7. SEGURANÇA & COMPLIANCE
  // ========================================================================
  {
    título: '🔐 SEGURANÇA',
    itens: [
      {
        id: 'seguranca',
        label: 'Segurança & Compliance',
        path: '/super-admin/seguranca',
        icon: Shield,
        submenu: [
          {
            id: 'seguranca-auditoria',
            label: 'Trilha de Auditoria',
            path: '/super-admin/seguranca/auditoria',
            icon: null,
          },
          {
            id: 'seguranca-acessos',
            label: 'Acessos Suspeitos',
            path: '/super-admin/seguranca/acessos-suspeitos',
            icon: null,
            badge: {
              texto: 'NOVO',
              cor: 'yellow',
            },
          },
          {
            id: 'seguranca-permissoes',
            label: 'Permissões Globais',
            path: '/super-admin/seguranca/permissoes',
            icon: null,
          },
          {
            id: 'seguranca-lgpd',
            label: 'LGPD / GDPR',
            path: '/super-admin/seguranca/lgpd',
            icon: null,
          },
          {
            id: 'seguranca-ssl',
            label: 'Certificados SSL',
            path: '/super-admin/seguranca/ssl',
            icon: null,
          },
          {
            id: 'seguranca-api-keys',
            label: 'API Keys & Tokens',
            path: '/super-admin/seguranca/api-keys',
            icon: null,
          },
        ],
      },
    ],
  },

  // ========================================================================
  // 8. INTEGRAÇÕES
  // ========================================================================
  {
    título: '🔌 INTEGRAÇÕES',
    itens: [
      {
        id: 'integracoes',
        label: 'Integrações Externas',
        path: '/super-admin/integracoes',
        icon: Plug,
        submenu: [
          {
            id: 'integracoes-webhooks',
            label: 'Webhooks',
            path: '/super-admin/integracoes/webhooks',
            icon: null,
          },
          {
            id: 'integracoes-apis',
            label: 'APIs Externas',
            path: '/super-admin/integracoes/apis',
            icon: null,
          },
          {
            id: 'integracoes-comunicacao',
            label: 'Comunicação (Email/WhatsApp)',
            path: '/super-admin/integracoes/comunicacao',
            icon: null,
          },
          {
            id: 'integracoes-pagamento',
            label: 'Gateways de Pagamento',
            path: '/super-admin/integracoes/pagamento',
            icon: null,
          },
          {
            id: 'integracoes-logs',
            label: 'Logs de Integração',
            path: '/super-admin/integracoes/logs',
            icon: null,
          },
        ],
      },
    ],
  },

  // ========================================================================
  // 9. COMUNICAÇÃO & NOTIFICAÇÕES
  // ========================================================================
  {
    título: '📣 COMUNICAÇÃO',
    itens: [
      {
        id: 'comunicacao',
        label: 'Templates & Campanhas',
        path: '/super-admin/comunicacao',
        icon: MessageSquare,
        submenu: [
          {
            id: 'comunicacao-email',
            label: 'Templates Email',
            path: '/super-admin/comunicacao/email',
            icon: null,
          },
          {
            id: 'comunicacao-whatsapp',
            label: 'Templates WhatsApp',
            path: '/super-admin/comunicacao/whatsapp',
            icon: null,
          },
          {
            id: 'comunicacao-push',
            label: 'Push Notifications',
            path: '/super-admin/comunicacao/push',
            icon: null,
          },
          {
            id: 'comunicacao-campanhas',
            label: 'Campanhas Globais',
            path: '/super-admin/comunicacao/campanhas',
            icon: null,
          },
          {
            id: 'comunicacao-logs',
            label: 'Logs de Envio',
            path: '/super-admin/comunicacao/logs',
            icon: null,
          },
        ],
      },
    ],
  },

  // ========================================================================
  // 10. MONITORAMENTO & ALERTAS
  // ========================================================================
  {
    título: '🚨 ALERTAS',
    itens: [
      {
        id: 'alertas',
        label: 'Alertas & Monitoramento',
        path: '/super-admin/alertas',
        icon: AlertTriangle,
        submenu: [
          {
            id: 'alertas-regras',
            label: 'Regras de Alerta',
            path: '/super-admin/alertas/regras',
            icon: null,
          },
          {
            id: 'alertas-incidentes',
            label: 'Incidentes Ativos',
            path: '/super-admin/alertas/incidentes',
            icon: null,
            badge: {
              texto: '5',
              cor: 'red',
            },
          },
          {
            id: 'alertas-historico',
            label: 'Histórico de Incidentes',
            path: '/super-admin/alertas/historico',
            icon: null,
          },
          {
            id: 'alertas-escalacao',
            label: 'Escalação',
            path: '/super-admin/alertas/escalacao',
            icon: null,
          },
        ],
      },
    ],
  },

  // ========================================================================
  // 11. DEVOPS & DEPLOY
  // ========================================================================
  {
    título: '🚀 DEVOPS',
    itens: [
      {
        id: 'devops',
        label: 'DevOps & Deploy',
        path: '/super-admin/devops',
        icon: Rocket,
        submenu: [
          {
            id: 'devops-versoes',
            label: 'Versões em Produção',
            path: '/super-admin/devops/versoes',
            icon: null,
          },
          {
            id: 'devops-deploys',
            label: 'Histórico de Deploy',
            path: '/super-admin/devops/deploys',
            icon: null,
          },
          {
            id: 'devops-ambientes',
            label: 'Ambientes (Prod/Staging)',
            path: '/super-admin/devops/ambientes',
            icon: null,
          },
          {
            id: 'devops-variaveisambiente',
            label: 'Variáveis de Ambiente',
            path: '/super-admin/devops/variaveis',
            icon: null,
          },
          {
            id: 'devops-feature-toggles',
            label: 'Feature Toggles',
            path: '/super-admin/devops/feature-toggles',
            icon: null,
          },
          {
            id: 'devops-rollback',
            label: 'Rollback / Restore',
            path: '/super-admin/devops/rollback',
            icon: null,
          },
        ],
      },
    ],
  },

  // ========================================================================
  // 12. BACKUPS & DISASTER RECOVERY
  // ========================================================================
  {
    título: '🗄️ BACKUPS',
    itens: [
      {
        id: 'backups',
        label: 'Backups & DR',
        path: '/super-admin/backups',
        icon: HardDrive,
        submenu: [
          {
            id: 'backups-automaticos',
            label: 'Backups Automáticos',
            path: '/super-admin/backups/automaticos',
            icon: null,
          },
          {
            id: 'backups-manuais',
            label: 'Backups Manuais',
            path: '/super-admin/backups/manuais',
            icon: null,
          },
          {
            id: 'backups-restore',
            label: 'Restauração',
            path: '/super-admin/backups/restore',
            icon: null,
          },
          {
            id: 'backups-teste',
            label: 'Teste de Restore',
            path: '/super-admin/backups/teste',
            icon: null,
          },
          {
            id: 'backups-politicas',
            label: 'Políticas de Retenção',
            path: '/super-admin/backups/politicas',
            icon: null,
          },
        ],
      },
    ],
  },

  // ========================================================================
  // 13. RELATÓRIOS & BI
  // ========================================================================
  {
    título: '📈 RELATÓRIOS',
    itens: [
      {
        id: 'relatorios',
        label: 'Relatórios & BI',
        path: '/super-admin/relatorios',
        icon: BarChart3,
        submenu: [
          {
            id: 'relatorios-uso',
            label: 'Uso da Plataforma',
            path: '/super-admin/relatorios/uso',
            icon: null,
          },
          {
            id: 'relatorios-financeiro',
            label: 'Relatório Financeiro',
            path: '/super-admin/relatorios/financeiro',
            icon: null,
          },
          {
            id: 'relatorios-engajamento',
            label: 'Engajamento',
            path: '/super-admin/relatorios/engajamento',
            icon: null,
          },
          {
            id: 'relatorios-customizados',
            label: 'Relatórios Customizados',
            path: '/super-admin/relatorios/customizados',
            icon: null,
          },
          {
            id: 'relatorios-exportacao',
            label: 'Exportação (CSV/PDF)',
            path: '/super-admin/relatorios/exportacao',
            icon: null,
          },
        ],
      },
    ],
  },

  // ========================================================================
  // 14. CONFIGURAÇÕES GLOBAIS
  // ========================================================================
  {
    título: '⚙️ CONFIGURAÇÕES',
    itens: [
      {
        id: 'configuracoes',
        label: 'Configurações Globais',
        path: '/super-admin/configuracoes',
        icon: Settings,
        submenu: [
          {
            id: 'configuracoes-branding',
            label: 'Branding & White-Label',
            path: '/super-admin/configuracoes/branding',
            icon: null,
          },
          {
            id: 'configuracoes-dominios',
            label: 'Domínios & DNS',
            path: '/super-admin/configuracoes/dominios',
            icon: null,
          },
          {
            id: 'configuracoes-limites',
            label: 'Limites Globais',
            path: '/super-admin/configuracoes/limites',
            icon: null,
          },
          {
            id: 'configuracoes-termos',
            label: 'Termos & Políticas',
            path: '/super-admin/configuracoes/termos',
            icon: null,
          },
          {
            id: 'configuracoes-idiomas',
            label: 'Idiomas & I18n',
            path: '/super-admin/configuracoes/idiomas',
            icon: null,
          },
        ],
      },
    ],
  },

  // ========================================================================
  // 15. SUPORTE & OPERAÇÃO
  // ========================================================================
  {
    título: '🛠️ SUPORTE',
    itens: [
      {
        id: 'suporte',
        label: 'Suporte & Operação',
        path: '/super-admin/suporte',
        icon: BookOpen,
        submenu: [
          {
            id: 'suporte-tickets',
            label: 'Tickets de Suporte',
            path: '/super-admin/suporte/tickets',
            icon: null,
            badge: {
              texto: '3',
              cor: 'yellow',
            },
          },
          {
            id: 'suporte-sla',
            label: 'SLA & Métricas',
            path: '/super-admin/suporte/sla',
            icon: null,
          },
          {
            id: 'suporte-base-conhecimento',
            label: 'Base de Conhecimento',
            path: '/super-admin/suporte/base-conhecimento',
            icon: null,
          },
          {
            id: 'suporte-incidentes-loja',
            label: 'Incidentes por Loja',
            path: '/super-admin/suporte/incidentes-loja',
            icon: null,
          },
        ],
      },
    ],
  },

  // ========================================================================
  // 16. AUDITORIA & GOVERNANÇA
  // ========================================================================
  {
    título: '🏛️ GOVERNANÇA',
    itens: [
      {
        id: 'governanca',
        label: 'Auditoria & Governança',
        path: '/super-admin/governanca',
        icon: ClipboardList,
        submenu: [
          {
            id: 'governanca-trilhas',
            label: 'Trilhas de Auditoria',
            path: '/super-admin/governanca/trilhas',
            icon: null,
          },
          {
            id: 'governanca-alteracoes',
            label: 'Alterações Sensíveis',
            path: '/super-admin/governanca/alteracoes',
            icon: null,
          },
          {
            id: 'governanca-logs-imutaveis',
            label: 'Logs Imutáveis',
            path: '/super-admin/governanca/logs-imutaveis',
            icon: null,
          },
          {
            id: 'governanca-conformidade',
            label: 'Relatórios de Conformidade',
            path: '/super-admin/governanca/conformidade',
            icon: null,
          },
          {
            id: 'governanca-aprovacoes',
            label: 'Aprovações Administrativas',
            path: '/super-admin/governanca/aprovacoes',
            icon: null,
          },
        ],
      },
    ],
  },

  // ========================================================================
  // 17. ROADMAP & GESTÃO INTERNA
  // ========================================================================
  {
    título: '🗺️ ESTRATÉGIA',
    itens: [
      {
        id: 'roadmap',
        label: 'Roadmap & Estratégia',
        path: '/super-admin/roadmap',
        icon: TrendingUp,
        submenu: [
          {
            id: 'roadmap-features',
            label: 'Features Planejadas',
            path: '/super-admin/roadmap/features',
            icon: null,
          },
          {
            id: 'roadmap-feedback',
            label: 'Feedback de Clientes',
            path: '/super-admin/roadmap/feedback',
            icon: null,
          },
          {
            id: 'roadmap-votacoes',
            label: 'Votações Internas',
            path: '/super-admin/roadmap/votacoes',
            icon: null,
          },
          {
            id: 'roadmap-experimentais',
            label: 'Features Experimentais',
            path: '/super-admin/roadmap/experimentais',
            icon: null,
          },
        ],
      },
    ],
  },

  // ========================================================================
  // 18. ADMINISTRAÇÃO TÉCNICA
  // ========================================================================
  {
    título: '🧠 ADMINISTRAÇÃO',
    itens: [
      {
        id: 'admin-tecnica',
        label: 'Administração do Sistema',
        path: '/super-admin/admin-tecnica',
        icon: Lock,
        submenu: [
          {
            id: 'admin-jobs',
            label: 'Jobs Manuais',
            path: '/super-admin/admin-tecnica/jobs',
            icon: null,
          },
          {
            id: 'admin-limpeza',
            label: 'Limpeza de Dados',
            path: '/super-admin/admin-tecnica/limpeza',
            icon: null,
          },
          {
            id: 'admin-scripts',
            label: 'Scripts Administrativos',
            path: '/super-admin/admin-tecnica/scripts',
            icon: null,
          },
          {
            id: 'admin-manutencao',
            label: 'Manutenção Programada',
            path: '/super-admin/admin-tecnica/manutencao',
            icon: null,
          },
          {
            id: 'admin-contingencia',
            label: 'Modo de Contingência',
            path: '/super-admin/admin-tecnica/contingencia',
            icon: null,
          },
        ],
      },
    ],
  },
];

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

export function findMenuItemById(id: string): MenuItem | undefined {
  for (const secção of SUPER_ADMIN_MENU) {
    for (const item of secção.itens) {
      if (item.id === id) return item;
      if (item.submenu) {
        const found = item.submenu.find((sub) => sub.id === id);
        if (found) return found;
      }
    }
  }
  return undefined;
}

export function getMenuItemBreadcrumb(id: string): { titulo: string; path: string }[] {
  const breadcrumb: { titulo: string; path: string }[] = [];

  for (const secção of SUPER_ADMIN_MENU) {
    for (const item of secção.itens) {
      if (item.id === id) {
        breadcrumb.push({ titulo: item.label, path: item.path });
        return breadcrumb;
      }
      if (item.submenu) {
        const found = item.submenu.find((sub) => sub.id === id);
        if (found) {
          breadcrumb.push({ titulo: item.label, path: item.path });
          breadcrumb.push({ titulo: found.label, path: found.path });
          return breadcrumb;
        }
      }
    }
  }

  return breadcrumb;
}

export function getMenuSecção(titulo: string): MenuSecção | undefined {
  return SUPER_ADMIN_MENU.find((sec) => sec.título === titulo);
}
